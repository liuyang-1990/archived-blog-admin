import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import {
    Button,
    Card,
    Col,
    Divider,
    Dropdown,
    Form,
    Icon,
    Input,
    Menu,
    Row,
    Select,
    message,
} from 'antd';
import styles from './style.less';
import StandardTable, { StandardTableColumnProps } from '@/components/StandardTable';
import moment from 'moment';
import { TableListItem, TableListPagination, TableListParams } from '@/models/TableList';
import { observer } from 'mobx-react';
import { lazyInject } from '@/utils/ioc';
import UserState from '@/states/user.state';
import CreateForm from '@/components/StandardTable/CreateForm';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = (obj: { [x: string]: string[] }) =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');


interface IUserManagementState {
    selectedRows: TableListItem[];
    formValues: { [key: string]: string };
    modalVisible: boolean;
}


@observer
class UserManagement extends Component<any, IUserManagementState> {

    @lazyInject('UserState')
    private store!: UserState;

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            formValues: {},
            modalVisible: false,
        }
    }
    columns: StandardTableColumnProps[] = [
        {
            title: '用户名',
            align: 'center',
            dataIndex: 'UserName',
            width: '20%',
        }, {
            title: '角色',
            align: 'center',
            dataIndex: 'Role',
            render: role => role === 1 ? "管理员" : "游客",
            width: '20%',
        }, {
            title: '状态',
            align: 'center',
            render: status => status === 1 ? "启用" : "禁用",
            dataIndex: 'Status',
            width: '20%',
        }, {
            title: '创建时间',
            align: 'center',
            sorter: true,
            dataIndex: 'CreateTime',
            render: (createTime: string) => <span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            align: 'center',
            key: 'x',
            render: (record) => record.UserName !== "admin" &&
                <React.Fragment>
                    <a>编辑</a>
                    <Divider type="vertical" />
                    <a>删除</a>
                </React.Fragment>
        },
    ];

    componentDidMount() {
        this.store.queryByPage();
    }

    handleSelectRows = (rows: TableListItem[]) => {
        this.setState({
            selectedRows: rows,
        });
    };
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

    }
    handleMenuClick = (e: { key: string }) => {
        const { selectedRows } = this.state;
        if (!selectedRows) return;
        switch (e.key) {
            case 'remove':
                break;
        }
    }

    handleTableChange = (
        pagination: Partial<TableListPagination>,
        filtersArg: Record<keyof TableListItem, string[]>,
        sorter: SorterResult<TableListItem>,
    ) => {
        const { formValues } = this.state;
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params: Partial<TableListParams> = {
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



    renderSearchForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label={"用户名"}>
                            {getFieldDecorator('UserName')(<Input placeholder="用户名" />)}
                        </FormItem >
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label={"状态"}>
                            {getFieldDecorator('Status', {
                                initialValue: "1"
                            })(
                                <Select style={{ width: '100%' }}>
                                    <Option value="1">启用</Option>
                                    <Option value="0">禁用</Option>
                                </Select>)}
                        </FormItem>
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
        );
    }

    handleAdd = () => {

        message.success('添加成功');
        this.handleModalVisible();
    }

    handleModalVisible = (flag?: boolean) => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    render() {
        const { selectedRows, modalVisible } = this.state;
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">批量删除</Menu.Item>
                <Menu.Item key="update">批量启用</Menu.Item>
            </Menu>
        );

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderSearchForm()}
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
                            {selectedRows.length > 0 && (
                                <span>
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            更多操作 <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </span>
                            )}
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={this.store.loading}
                            data={this.store.data}
                            columns={this.columns}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>
                <CreateForm {...parentMethods} modalVisible={modalVisible} />
            </PageHeaderWrapper>
        );
    }
}
export default Form.create<any>()(UserManagement);
