import { Form, Input, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { IUserTableListItem } from '@/models/UserTableList';

const FormItem = Form.Item;
const Option = Select.Option;

interface ICreateFormProps extends FormComponentProps {
    modalVisible: boolean;
    handleOk: (fieldsValue: Partial<IUserTableListItem>) => void;
    handleModalVisible: (flag?: boolean, formVals?: Partial<IUserTableListItem>) => void;
    values: Partial<IUserTableListItem>;
}

class CreateForm extends React.Component<ICreateFormProps, any>{
    constructor(props: ICreateFormProps) {
        super(props);
        this.state = {
            formVals: {
                Id: props.values.Id,
                UserName: props.values.UserName,
                Status: props.values.Status,
                Role: props.values.Role,
            }
        }
    }
    render() {

        const { modalVisible, form, handleOk, handleModalVisible, values } = this.props;
        const { formVals: oldValue } = this.state;
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                const formVals = { ...oldValue, ...fieldsValue };
                handleOk(formVals);
            });
        };
        return (
            <Modal
                destroyOnClose={true}
                maskClosable={false}
                title={values.Id ? "更新用户" : "新增用户"}
                visible={modalVisible}
                onOk={okHandle}
                onCancel={() => handleModalVisible(false, values)}
                afterClose={() => handleModalVisible()}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
                    {form.getFieldDecorator('UserName', {
                        initialValue: oldValue.UserName,
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(<Input placeholder="用户名" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
                    {form.getFieldDecorator('Status', {
                        initialValue: oldValue.Status,
                    })(<Select style={{ width: '100%' }}>
                        <Option value={1}>启用</Option>
                        <Option value={0}>禁用</Option>
                    </Select>)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
                    {form.getFieldDecorator('Role', {
                        initialValue: oldValue.Role,
                    })(<Select style={{ width: '100%' }}>
                        <Option value={1}>管理员</Option>
                        <Option value={0}>游客</Option>
                    </Select>)}
                </FormItem>
            </Modal>
        );
    }

};

export default Form.create<ICreateFormProps>()(CreateForm);