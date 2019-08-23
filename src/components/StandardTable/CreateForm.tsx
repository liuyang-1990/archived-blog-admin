import { Form, Input, Modal, Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
    modalVisible: boolean;
    handleAdd: (fieldsValue: { desc: string }) => void;
    handleModalVisible: () => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
    const { modalVisible, form, handleAdd, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            destroyOnClose={true}
            maskClosable={false}
            title="新增用户"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
                {form.getFieldDecorator('UserName', {
                    rules: [{ required: true, message: '请输入用户名' }],
                })(<Input placeholder="用户名" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
                {form.getFieldDecorator('Status', {
                    initialValue: "1"
                })(<Select style={{ width: '100%' }}>
                    <Option value="1">启用</Option>
                    <Option value="0">禁用</Option>
                </Select>)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
                {form.getFieldDecorator('Role', {
                    initialValue: "0"
                })(<Select style={{ width: '100%' }}>
                    <Option value="1">管理员</Option>
                    <Option value="0">游客</Option>
                </Select>)}
            </FormItem>
        </Modal>
    );
};

export default Form.create<CreateFormProps>()(CreateForm);