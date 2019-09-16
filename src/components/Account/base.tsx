import { Button, Form, Input, Select, Upload, message } from 'antd';
import React, { Component, Fragment } from 'react';
import GeographicView from './GeographicView';
import styles from './BaseView.less';
import { observer } from 'mobx-react';
import { lazyInject } from '@/utils/ioc';
import UserState from '@/states/user.state';
import { userStorage } from '@/utils/user.storage';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import ImageState from '@/states/image.state';

const FormItem = Form.Item;
const { Option } = Select;


@observer
class BaseView extends Component<any, any> {
    view: HTMLDivElement | undefined = undefined;

    constructor(props) {
        super(props);
        this.state = {
            avatar: ''
        }
    }

    @lazyInject('UserState')
    store!: UserState;
    @lazyInject('ImageState')
    imageStore!: ImageState;
    async componentDidMount() {
        const url = this.getAvatarURL();
        this.setState({ avatar: url });
        const currentUser = await this.store.getCurrentUser();

        if (currentUser) {
            if (currentUser.Province && currentUser.City) {
                currentUser.Geographic = {
                    province: JSON.parse(currentUser.Province),
                    city: JSON.parse(currentUser.City),
                };
            }
            this.setBaseInfo(currentUser);
        }

    }

    setBaseInfo = currentUser => {
        const { form } = this.props;
        if (currentUser) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = currentUser[key] || null;
                form.setFieldsValue(obj);
            });
        }
    };

    getAvatarURL() {
        if (userStorage.CurrentUser) {
            if (userStorage.CurrentUser.Avatar) {
                return userStorage.CurrentUser.Avatar;
            }
            const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
            return url;
        }
        return '';
    }

    getViewDom = (ref: HTMLDivElement) => {
        this.view = ref;
    };

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

    handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'done') {
            this.setState({
                avatar: info.file.response.url,
            });
        }
    };

    handleSubmit = (event: React.MouseEvent) => {
        event.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue,
                    Province: JSON.stringify(fieldsValue.Geographic.province),
                    City: JSON.stringify(fieldsValue.Geographic.city),
                    Id: userStorage.CurrentUser && userStorage.CurrentUser.Uid
                };
                this.store.handleOk(values);
            }
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { avatar } = this.state;
        return (
            <div className={styles.baseView} ref={this.getViewDom}>
                <div className={styles.left}>
                    <Form layout="vertical" hideRequiredMark={true}>
                        <FormItem label={"邮箱"}>
                            {getFieldDecorator('Email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: "邮箱格式不正确",
                                    },
                                    {
                                        required: true,
                                        message: "请输入邮箱",
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <FormItem label={"用户名"}>
                            {getFieldDecorator('UserName', {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入用户名",
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <FormItem label={"个人简介"}>
                            {getFieldDecorator('Profile')(
                                <Input.TextArea
                                    placeholder={"个人简介"}
                                    rows={4}
                                />
                            )}
                        </FormItem>
                        <FormItem label={"国家/地区"}>
                            {getFieldDecorator('Country', { initialValue: 'China' })(
                                <Select style={{ maxWidth: 220 }}>
                                    <Option value="China">中国</Option>
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem label={"所在省市"}>
                            {getFieldDecorator('Geographic')(<GeographicView />)}
                        </FormItem>
                        <FormItem label={"街道地址"}>
                            {getFieldDecorator('Address')(<Input />)}
                        </FormItem>
                        <Button type="primary" onClick={this.handleSubmit}>
                            更新基本信息
                        </Button>
                    </Form>
                </div>
                <div className={styles.right}>
                    <div className={styles.avatar_title}>
                        头像
                    </div>
                    <div className={styles.avatar}>
                        <img src={avatar} alt="avatar" />
                    </div>
                    <Upload
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        customRequest={this.customRequest}
                        onChange={this.handleChange}
                    >
                        <div className={styles.button_view}>
                            <Button icon="upload">
                                更换头像
                            </Button>
                        </div>
                    </Upload>
                </div>
            </div>
        );
    }
}

export default Form.create<any>()(BaseView);