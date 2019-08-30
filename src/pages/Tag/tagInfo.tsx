import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { observer } from 'mobx-react';
import { Form, Card, Button, Row, Col, Input } from 'antd';
import { lazyInject } from '@/utils/ioc';
import TagState from '@/states/tag.state';
import styles from '../SystemManagement/style.less';
import { FormComponentProps } from 'antd/lib/form';
import { ITableListPagination } from '@/models/TableList';
import { SorterResult } from 'antd/lib/table';
import { ITagTableListItem, ITagTableListParams } from '@/models/TagTableList';

import TableForm from '@/components/EditableCell/TableForm';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

interface ITagInfoProps extends FormComponentProps {

}

@observer
class TagInfo extends Component<ITagInfoProps, any> {

    @lazyInject('TagState')
    private store!: TagState;

    constructor(props: ITagInfoProps) {
        super(props);
        this.state = {
            data: [],
            editingKey: ''
        }
    }
    componentDidMount() {
        this.store.queryByPage();
    }
    //搜索
    handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = { ...fieldsValue };
            this.store.queryByPage(values);
        });
    }
    //重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.setState({
            formValues: {},
        });
        this.store.queryByPage();
    }
    handleTableChange = (
        pagination: Partial<ITableListPagination>,
        filtersArg: Record<keyof ITagTableListItem, string[]>,
        sorter: SorterResult<ITagTableListItem>, ) => {

        const { formValues } = this.state;
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params: Partial<ITagTableListParams> = {
            PageNum: pagination.current,
            PageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.SortField = sorter.field;
            switch (sorter.order) {
                case 'ascend':
                    params.SortOrder = 'asc';
                    break;
                case 'descend':
                    params.SortOrder = 'desc';
                    break;
            }
        }
        this.store.queryByPage(params);
    }

    handleOk = (value) => {
        this.store.handleOk(value);
    }
    handleRemove = (key) => {
        this.store.deleteTag(key);
    }
    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            <Form onSubmit={this.handleSearch} layout="inline">
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <FormItem label={"标签名"}>
                                            {getFieldDecorator('tagName')(<Input placeholder="标签名" />)}
                                        </FormItem >
                                    </Col>
                                </Row>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ float: 'right', marginBottom: 24 }}>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                            清空
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        {
                            this.store.data && <TableForm
                                value={this.store.data.list}
                                handleOk={this.handleOk}
                                remove={this.handleRemove}
                                onChange={this.handleTableChange} />
                        }
                    </div>
                </Card>
            </PageHeaderWrapper>
        )
    }


}

export default Form.create<any>()(TagInfo);
