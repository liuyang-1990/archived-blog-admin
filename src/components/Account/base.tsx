import { Button, Form, Input, Select, Upload } from 'antd';
import React, { Component, Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import GeographicView from './GeographicView';
import styles from './BaseView.less';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
    <Fragment>
        <div className={styles.avatar_title}>
            头像
    </div>
        <div className={styles.avatar}>
            <img src={avatar} alt="avatar" />
        </div>
        <Upload fileList={[]}>
            <div className={styles.button_view}>
                <Button icon="upload">
                    更换头像
        </Button>
            </div>
        </Upload>
    </Fragment>
);
interface SelectItem {
    label: string;
    key: string;
}

const validatorGeographic = (
    _: any,
    value: {
        province: SelectItem;
        city: SelectItem;
    },
    callback: (message?: string) => void,
) => {
    const { province, city } = value;
    if (!province.key) {
        callback('Please input your province!');
    }
    if (!city.key) {
        callback('Please input your city!');
    }
    callback();
};

interface BaseViewProps extends FormComponentProps {
    currentUser?: any;
}

class BaseView extends Component<BaseViewProps, any> {
    view: HTMLDivElement | undefined = undefined;

    componentDidMount() {
        this.setBaseInfo();
    }

    setBaseInfo = () => {
        const { currentUser, form } = this.props;
        if (currentUser) {
            Object.keys(form.getFieldsValue()).forEach(key => {
                const obj = {};
                obj[key] = currentUser[key] || null;
                form.setFieldsValue(obj);
            });
        }
    };

    getAvatarURL() {
        const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
        return url;
    }

    getViewDom = (ref: HTMLDivElement) => {
        this.view = ref;
    };

    handlerSubmit = (event: React.MouseEvent) => {
        event.preventDefault();
        const { form } = this.props;
        form.validateFields(err => {
            if (!err) {

            }
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <div className={styles.baseView} ref={this.getViewDom}>
                <div className={styles.left}>
                    <Form layout="vertical" hideRequiredMark>
                        <FormItem label={"邮箱"}>
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入邮箱",
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <FormItem label={"昵称"}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入昵称",
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <FormItem label={"个人简介"}>
                            {getFieldDecorator('profile', {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入个人简介",
                                    },
                                ],
                            })(
                                <Input.TextArea
                                    placeholder={"个人简介"}
                                    rows={4}
                                />,
                            )}
                        </FormItem>
                        <FormItem label={"国家/地区"}>
                            {getFieldDecorator('country')(
                                <Select style={{ maxWidth: 220 }}>
                                    <Option value="China">中国</Option>
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem label={"所在省市"}>
                            {getFieldDecorator('geographic', {
                                rules: [
                                    {
                                        required: true,
                                        message: "",
                                    },
                                    {
                                        validator: validatorGeographic,
                                    },
                                ],
                            })(<GeographicView />)}
                        </FormItem>
                        <FormItem label={"街道地址"}>
                            {getFieldDecorator('address', {
                                rules: [
                                    {
                                        required: true,
                                        message: ""
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <Button type="primary" onClick={this.handlerSubmit}>
                            更新基本信息
                        </Button>
                    </Form>
                </div>
                <div className={styles.right}>
                    <AvatarView avatar={this.getAvatarURL()} />
                </div>
            </div>
        );
    }
}

export default Form.create<BaseViewProps>()(BaseView);