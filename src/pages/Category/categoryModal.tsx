import { Form, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { ICategoryTableListItem } from '@/models/categoryTableList';

const FormItem = Form.Item;
interface ICategoryModalFormProps extends FormComponentProps {
    modalVisible: boolean;
    handleOk: (fieldsValue: Partial<ICategoryTableListItem>, callback?: () => void) => void;
    handleModalVisible: (flag?: boolean, formVals?: Partial<ICategoryTableListItem>) => void;
    values: Partial<ICategoryTableListItem>;
}

class CategoryModalForm extends React.Component<ICategoryModalFormProps, any> {
    constructor(props: ICategoryModalFormProps) {
        super(props);
        this.state = {
            formVals: {
                Id: props.values.Id,
                CategoryName: props.values.CategoryName,
                Description: props.values.Description,
            }
        };
    }

    render() {
        const { modalVisible, form, handleOk, handleModalVisible, values } = this.props;
        const { formVals: oldValue } = this.state;
        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                const formVals = { ...oldValue, ...fieldsValue };
                handleOk(formVals, () => {
                    form.resetFields();
                    handleModalVisible();
                });
            });
        };
        return (
            <Modal
                destroyOnClose={true}
                maskClosable={false}
                title={values.Id ? "更新分类" : "新增分类"}
                visible={modalVisible}
                onOk={okHandle}
                onCancel={() => handleModalVisible(false, values)}
                afterClose={() => handleModalVisible()}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称">
                    {form.getFieldDecorator('CategoryName', {
                        initialValue: oldValue.CategoryName,
                        rules: [{ required: true, message: '请输入分类名称' }],
                    })(<Input placeholder="分类名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                    {form.getFieldDecorator('Description', {
                        initialValue: oldValue.Description,
                    })(<Input placeholder="描述" />)}
                </FormItem>
            </Modal>
        )
    }
}

export default Form.create<ICategoryModalFormProps>()(CategoryModalForm);