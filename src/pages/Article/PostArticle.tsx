import React from 'react';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import Markdown from 'braft-extensions/dist/markdown';
import MaxLength from 'braft-extensions/dist/max-length';
import HeaderId from 'braft-extensions/dist/header-id';
import ColorPicker from 'braft-extensions/dist/color-picker';
import { Form, Card, Input, Select, Button, Upload, Icon, message } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { lazyInject } from '@/utils/ioc';
import { observer } from 'mobx-react';
import ArticleState from '@/states/article.state';
import ImageState from '@/states/image.state';
import router from 'umi/router';
import style from './style.less';
import 'braft-editor/dist/index.css';
import 'braft-editor/dist/output.css';
import 'braft-extensions/dist/table.css';
import 'braft-extensions/dist/color-picker.css';


const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
BraftEditor.use(Markdown());//使用markdown语法快捷输入内容
BraftEditor.use(MaxLength());
BraftEditor.use(HeaderId());//为标题区块(h1-h6)增加随机的id，便于在展示页支持锚点跳转功能
BraftEditor.use(ColorPicker({
    theme: 'light' // 指定取色器样式主题，支持dark和light两种样式
}));
BraftEditor.use(Table({
    defaultColumns: 3, // 默认列数
    defaultRows: 3, // 默认行数
    withDropdown: false, // 插入表格前是否弹出下拉菜单
    exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
}));

@observer
class PostArticle extends React.Component<any, any>{

    @lazyInject('ArticleState')
    private store!: ArticleState;
    @lazyInject('ImageState')
    private imageStore!: ImageState;

    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            previewVisible: false,
            previewImage: '',
            imageUrl: '',
            status: 0,
        };
    }

    componentDidMount() {
        this.store.queryAllTags();
        this.store.queryAllCategories();
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState });
    }

    //上传图片前，检验是否符合规则
    beforeUpload = (file: RcFile, fileList: RcFile[]) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error('请上传图片!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片超过2M了!');
            return false;
        }
        return true;
    }

    //自定义上传
    customRequest = (params) => {
        this.imageStore.uploadIamge(params.file, params.onProgress, params.onSuccess, params.onError);
    }

    //BraftEditor  自定义上传
    uploadFn = (params) => {
        this.imageStore.uploadIamge(params.file, params.progress, params.success, params.error);
    }

    handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                imageUrl: info.file.response.url,
                loading: false,
            });
        }
    };

    formOnSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { imageUrl, status } = this.state;
            const values = Object.assign(fieldsValue, {
                Content: fieldsValue.Content.toHTML(),
                ImageUrl: imageUrl,
                Status: status
            });
            this.store.postArticle(values);
        });
    }

    handleCancel = () => {
        router.push('/article/list');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { imageUrl } = this.state;
        const selectBefore = getFieldDecorator('IsOriginal', { initialValue: "1" })(
            <Select style={{ width: 70 }}>
                <Option value="1">原创</Option>
                <Option value="0">转载</Option>
            </Select>
        );
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <Form onSubmit={this.formOnSubmit}>
                        <FormItem label="标题">
                            {getFieldDecorator('Title', {
                                rules: [{ required: true, message: '请输入标题' }],
                            })(
                                <Input
                                    size="large"
                                    addonBefore={selectBefore}
                                    placeholder="标题"
                                    maxLength={200}
                                />
                            )}
                        </FormItem>
                        <FormItem label="分类">
                            {
                                getFieldDecorator('Categories')(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="分类"
                                        showArrow
                                        tokenSeparators={[',']}
                                    >
                                        {
                                            this.store.categories && this.store.categories.map(x => (
                                                <Option key={x.Id}>{x.CategoryName}</Option>
                                            ))
                                        }
                                    </Select>)
                            }
                        </FormItem>
                        <FormItem label="标签">
                            {getFieldDecorator('Tags')(
                                <Select
                                    mode="tags"
                                    showArrow
                                    style={{ width: '100%' }}
                                    placeholder="标签"
                                >
                                    {
                                        this.store.tags && this.store.tags.map(x => (
                                            <Option key={x.Id}>{x.TagName}</Option>
                                        ))
                                    }
                                </Select>
                            )
                            }
                        </FormItem>
                        <FormItem label="内容">
                            {getFieldDecorator('Content', {
                                validateTrigger: "onBlur",
                                rules: [{
                                    required: true,
                                    validator: (_, value, callback) => {
                                        if (value.isEmpty()) {
                                            callback('请输入文章内容');
                                        } else {
                                            callback();
                                        }
                                    }
                                }]
                            })(
                                <BraftEditor
                                    media={{ uploadFn: this.uploadFn }}
                                    className={style.editor}
                                    onChange={this.handleEditorChange}
                                    placeholder="文章内容"
                                />
                            )}
                        </FormItem>
                        <FormItem label="摘要">
                            {getFieldDecorator('Abstract', {
                                rules: [{ required: true, message: '请输入摘要' }],
                            })(<TextArea placeholder="摘要" maxLength={500} style={{ resize: 'none' }} autosize={{ minRows: 2, maxRows: 6 }} />)}
                        </FormItem>
                        <FormItem label="封面图片">
                            <Upload
                                listType="picture-card"
                                showUploadList={false}
                                className={style.coverUploader}
                                beforeUpload={this.beforeUpload}
                                customRequest={this.customRequest}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                        </FormItem>
                        <FormItem>
                            <Button
                                onClick={() => this.setState({ status: 1 })}
                                type="primary"
                                style={{ width: 80 }}
                                htmlType="submit"
                            >
                                发表文章
                            </Button>
                            <Button
                                style={{ marginLeft: 8, width: 80 }}
                                onClick={() => this.setState({ status: 0 })}
                                type="primary"
                                htmlType="submit"
                            >
                                存为草稿
                            </Button>
                            <Button
                                style={{ marginLeft: 8, width: 80 }}
                                type="primary"
                                onClick={this.handleCancel}
                            >
                                取消
                            </Button>
                        </FormItem>
                    </Form>

                </Card>
            </PageHeaderWrapper >
        );
    }


}

export default Form.create<any>()(PostArticle);
