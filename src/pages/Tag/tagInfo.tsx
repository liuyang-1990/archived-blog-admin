import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { observer } from 'mobx-react';
import { Form, Card, Button, Row, Col, Input, Divider, Popconfirm, } from 'antd';
import { lazyInject } from '@/utils/ioc';
import TagState from '@/states/tag.state';
import styles from '../SystemManagement/style.less';
import StandardTable, { StandardTableColumnProps } from '@/components/StandardTable';
import { toLocaleTimeString } from '@/utils/utils';
import { FormComponentProps } from 'antd/lib/form';
import { ITableListPagination } from '@/models/TableList';
import { SorterResult } from 'antd/lib/table';
import { ITagTableListItem, ITagTableListParams } from '@/models/TagTableList';

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
            selectedRows: [],
            editingKey: '',
        }
    }
    componentDidMount() {
        this.store.queryByPage();
    }

   // const EditableContext = React.createContext({});

    columns: any = [{
        title: '标签名称',
        align: 'center',
        dataIndex: 'TagName',
        width: '25%',
        editable: true,
    }, {
        title: '描述',
        align: 'center',
        dataIndex: 'Description',
        width: '25%',
        editable: true,
    }, {
        title: '创建时间',
        align: 'center',
        dataIndex: 'CreateTime',
        render: createTime => toLocaleTimeString(createTime)
    }, {
        title: '操作',
        align: 'center',
        dataIndex: '',
        key: 'x',
        render: (text, record) => {
            const { editingKey } = this.state;
            const editable = this.isEditing(record);
            <React.Fragment>
                <a>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？">
                    <a>删除</a>
                </Popconfirm>
            </React.Fragment>
        }
    }];

    isEditing = record => record.key === this.state.editingKey;

    handleSelectRows = (rows: ITagTableListItem[]) => {
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
            // this.setState({
            //     formValues: values,
            // });
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

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            // if (editing) {
            //     this.input.focus();
            // }
        });
    }
    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { selectedRows } = this.state;
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
                        <div className={styles.tableListOperator}>
                            <Button type="primary">
                                新建
                            </Button>
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
            </PageHeaderWrapper>
        )
    }


}

export default Form.create<any>()(TagInfo);
