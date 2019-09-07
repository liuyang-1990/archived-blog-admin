import React from 'react';
import { Form, Card, Button, Row, Col, DatePicker, Divider, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '../SystemManagement/style.less';
import moment from 'moment';
import StandardTable, { StandardTableColumnProps } from '@/components/StandardTable';
import { IArticleTableListItem, IArticleTableListParams } from '@/models/ArticleTableList';
import { toLocaleTimeString } from '@/utils/utils';
import { observer } from 'mobx-react';
import { lazyInject } from '@/utils/ioc';
import ArticleState from '@/states/article.state';
import { ITableListPagination } from '@/models/TableList';
import { SorterResult } from 'antd/lib/table';
import router from 'umi/router';

const FormItem = Form.Item;
@observer
class ArticleList extends React.Component<any, any>{

    @lazyInject('ArticleState')
    private store!: ArticleState;

    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            startTime: '',
            endTime: '',
        };
    }

    componentDidMount() {
        this.store.queryByPage();
    }

    disabledStartDate = (startValue: moment.Moment | undefined) => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue: moment.Moment | undefined) => {
        const { startValue } = this.state;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = (value: moment.Moment | null, dateString: string) => {
        this.onChange('startValue', value);
        this.onChange('startTime', dateString);
    };

    onEndChange = (value: moment.Moment | null, dateString: string) => {
        this.onChange('endValue', value);
        this.onChange('endTime', dateString);
    };

    handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const { form } = this.props;
        const { startTime, endTime } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                StartTime: startTime,
                EndTime: endTime,
            };
            this.store.queryByPage(values);
        });
    }
    //重置
    handleFormReset = () => {
        this.props.form.resetFields();
        this.onChange('startValue', null);
        this.onChange('endValue', null);
        this.onChange('startTime', '');
        this.onChange('endTime', '');
        this.store.queryByPage();
    }
    remove = (id: number) => {
        this.store.deleteArticle(id);
    }

    handleEdit = (id: number) => {
        router.push(`/article/post?postid=${id}`);
    }
    handleTableChange = (
        pagination: Partial<ITableListPagination>,
        filtersArg: Record<keyof IArticleTableListItem, string[]>,
        sorter: SorterResult<IArticleTableListItem>,
    ) => {
        const { startTime, endTime } = this.state;
        const params: Partial<IArticleTableListParams> = {
            PageNum: pagination.current,
            PageSize: pagination.pageSize,
            StartTime: startTime,
            EndTime: endTime,
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

    columns: StandardTableColumnProps<IArticleTableListItem>[] = [
        {
            title: '标题',
            align: 'center',
            dataIndex: 'Title',
            width: '40%',
        }, {
            title: '状态',
            align: 'center',
            render: status => status === 1 ? "发布" : "草稿",
            dataIndex: 'Status',
            width: '10%',
        }, {
            title: '是否原创',
            align: 'center',
            render: IsOriginal => IsOriginal === 1 ? "原创" : "转载",
            dataIndex: 'IsOriginal',
            width: '10%',
        }, {
            title: '创建时间',
            align: 'center',
            dataIndex: 'CreateTime',
            sorter: true,
            render: createTime => toLocaleTimeString(createTime)
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: '',
            key: 'x',
            render: (record) =>
                <React.Fragment>
                    <a onClick={() => this.handleEdit(record.Id)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.Id)}>
                        <a>删除</a>
                    </Popconfirm>
                </React.Fragment>
        }
    ];
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            <Form onSubmit={this.handleSearch} layout='inline'>
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <FormItem label="开始时间">
                                            {getFieldDecorator('StartTime')
                                                (<DatePicker
                                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    onChange={this.onStartChange}
                                                    disabledDate={this.disabledStartDate}
                                                    style={{ width: '100%' }}
                                                />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <FormItem label="结束时间">
                                            {getFieldDecorator('EndTime')
                                                (<DatePicker
                                                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    disabledDate={this.disabledEndDate}
                                                    onChange={this.onEndChange}
                                                    style={{ width: '100%' }}
                                                />)
                                            }
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
                        </div>
                        <div className={styles.tableListOperator}>
                            <Button type="primary" onClick={() => router.push('/article/post')}>
                                新建
                            </Button>
                        </div>
                        <StandardTable
                            loading={this.store.loading}
                            data={this.store.data}
                            columns={this.columns}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>

        )
    }

}

export default Form.create()(ArticleList);