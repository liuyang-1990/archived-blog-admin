import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Card, Button, Row, Col, Input, Divider, Popconfirm } from 'antd';
import styles from '../SystemManagement/style.less';
import { observer } from 'mobx-react';
import { lazyInject } from '@/utils/ioc';
import CategoryState from '@/states/category.state';
import StandardTable, { StandardTableColumnProps } from '@/components/StandardTable';
import { toLocaleTimeString } from '@/utils/utils';
import { ICategoryTableListItem, ICategoryTableListParams } from '@/models/CategoryTableList';
import { ITableListPagination } from '@/models/TableList';
import { SorterResult } from 'antd/lib/table';
import CategoryModalForm from './categoryModal';

const FormItem = Form.Item;

@observer
class CategoryInfo extends Component<any, any>{

    @lazyInject('CategoryState')
    private store!: CategoryState;

    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            modalVisible: false,
            modalFormValues: {}
        };
    }

    componentDidMount() {
        this.store.queryByPage();
    }
    columns: StandardTableColumnProps<ICategoryTableListItem>[] = [
        {
            title: '分类名称',
            align: 'center',
            dataIndex: 'CategoryName',
            width: '25%',
        }, {
            title: '描述',
            align: 'center',
            dataIndex: 'Description',
            width: '25%',
        }, {
            title: '创建时间',
            align: 'center',
            dataIndex: 'CreateTime',
            sorter: true,
            render: createTime => toLocaleTimeString(createTime)
        }, {
            title: '操作',
            align: 'center',
            dataIndex: '',
            key: 'x',
            render: (record: ICategoryTableListItem) =>
                <React.Fragment>
                    <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.Id)}>
                        <a >删除</a>
                    </Popconfirm>
                </React.Fragment>
        }
    ];

    remove = (key: number) => {
        this.store.deleteCategory(key);
    }

    //搜索
    handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = { ...fieldsValue };
            this.setState({
                formValues: values,
            });
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
        filtersArg: Record<keyof ICategoryTableListItem, string[]>,
        sorter: SorterResult<ICategoryTableListItem>,
    ) => {
        const { formValues } = this.state;
        // const filters = Object.keys(filtersArg).reduce((obj, key) => {
        //     const newObj = { ...obj };
        //     newObj[key] = getValue(filtersArg[key]);
        //     return newObj;
        // }, {});

        const params: Partial<ICategoryTableListParams> = {
            PageNum: pagination.current,
            PageSize: pagination.pageSize,
            ...formValues,
            //...filters,
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

    handleModalVisible = (flag?: boolean, record?: Partial<ICategoryTableListItem>) => {
        const values = record ? {
            Id: record.Id,
            CategoryName: record.CategoryName,
            Description: record.Description,
        } : { CategoryName: '', Description: '' };
        this.setState({
            modalFormValues: values,
            modalVisible: !!flag
        });
    };

    handleOk = async (params: Partial<ICategoryTableListItem>, callback?: () => void) => {
         await this.store.handleOk(params,callback);
    }

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { modalVisible, modalFormValues } = this.state;
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            <Form onSubmit={this.handleSearch} layout="inline">
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <FormItem label={"分类名"}>
                                            {getFieldDecorator('categoryName')(<Input placeholder="分类名" />)}
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
                        <div className={styles.tableListOperator}>
                            <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
                        </div>
                        <StandardTable
                            //selectedRows={selectedRows}
                            loading={this.store.loading}
                            data={this.store.data}
                            columns={this.columns}
                            // onSelectRow={this.handleSelectRows}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>
                <CategoryModalForm
                    key={modalFormValues.Id}
                    handleOk={this.handleOk}
                    handleModalVisible={this.handleModalVisible}
                    modalVisible={modalVisible}
                    values={modalFormValues}
                />
            </PageHeaderWrapper>
        )
    }
}

export default Form.create<any>()(CategoryInfo);

