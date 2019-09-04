import React from 'react';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import Markdown from 'braft-extensions/dist/markdown';
import MaxLength from 'braft-extensions/dist/max-length';
import HeaderId from 'braft-extensions/dist/header-id';
import { Form, Card, Input, Select, Button, Upload, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { lazyInject } from '@/utils/ioc';
import { observer } from 'mobx-react';
import ArticleState from '@/states/article.state';

import 'braft-editor/dist/index.css';
import 'braft-editor/dist/output.css';
import 'braft-extensions/dist/table.css';
import style from './style.less';


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
BraftEditor.use(Markdown);
BraftEditor.use(MaxLength);
BraftEditor.use(HeaderId);
BraftEditor.use(Table);

@observer
class PostArticle extends React.Component<any, any>{

    @lazyInject('ArticleState')
    private store!: ArticleState;
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            previewVisible: false,
            previewImage: '',
            imageUrl: ''
        };
    }

    componentDidMount() {
        this.store.queryAllTags();
        this.store.queryAllCategories();
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState });
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    formOnSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { editorState, imageUrl } = this.state;
            const html = editorState.toHTML();
            const values = Object.assign(fieldsValue, {
                Content: html,
                ImageUrl: imageUrl
            });
            console.log(values);
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { editorState, imageUrl } = this.state;
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
                                getFieldDecorator('Category')(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="分类"
                                        showArrow
                                        tokenSeparators={[',']}
                                    >
                                        {
                                            this.store.categories.map(x => (
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
                                        this.store.tags.map(x => (
                                            <Option key={x.Id}>{x.TagName}</Option>
                                        ))
                                    }
                                </Select>
                            )
                            }
                        </FormItem>
                        <FormItem label="内容">
                            {getFieldDecorator('Content', {
                                validateTrigger: "onSubmit",
                                rules: [{
                                    required: true,
                                    validator: (_, value, callback) => {
                                        if (value.isEmpty()) {
                                            callback('请输入文章内容')
                                        } else {
                                            callback()
                                        }
                                    }
                                }]
                            })(
                                <BraftEditor
                                    // media={{ uploadFn: this.uploadFn }}
                                    className={style.brafteditor}
                                    onChange={this.handleEditorChange}
                                    placeholder="文章内容" />
                            )}
                        </FormItem>
                        <FormItem label="摘要">
                            {getFieldDecorator('Abstract', {
                                rules: [{ required: true, message: '请输入摘要' }],
                            })(<TextArea placeholder="摘要" maxLength={500} style={{ resize: 'none' }} autosize={{ minRows: 2, maxRows: 6 }} />)}
                        </FormItem>
                        <FormItem label="封面图片">
                            {
                                getFieldDecorator('ImageUrl')(
                                    <Upload
                                        name="ImageUrl"
                                        listType="picture-card"
                                        showUploadList={false}
                                        className="uploader"
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                    </Upload>
                                )
                            }

                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                style={{ width: 80 }}
                                htmlType="submit">
                                发表文章
                            </Button>
                            <Button style={{ marginLeft: 8, width: 80 }}
                                type="primary"
                                htmlType="submit">
                                存为草稿
                            </Button>
                            <Button style={{ marginLeft: 8, width: 80 }}
                                type="primary">
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