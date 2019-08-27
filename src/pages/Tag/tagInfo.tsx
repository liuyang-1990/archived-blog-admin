import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { observer } from 'mobx-react';
import { Form, Card, Button, Row, Col, Input, Divider, Popconfirm, } from 'antd';
import { lazyInject } from '@/utils/ioc';
import TagState from '@/states/tag.state';
import styles from '../SystemManagement/style.less';
import StandardTable from '@/components/StandardTable';
import { toLocaleTimeString } from '@/utils/utils';

const FormItem = Form.Item;
@observer
class TagInfo extends Component<any, any> {

    @lazyInject('TagState')
    private store!: TagState;

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
        }
    }
    componentDidMount() {
        this.store.queryByPage();
    }
    columns: any[] = [{
        title: '标签名称',
        align: 'center',
        dataIndex: 'TagName',
        width: '25%'
    }, {
        title: '描述',
        align: 'center',
        dataIndex: 'Description',
        width: '25%',
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
        render: (record) =>
            <React.Fragment>
                <a>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？">
                    <a>删除</a>
                </Popconfirm>
            </React.Fragment>
    },];
    
    handleSelectRows = () => {
        
    }

    handleTableChange = () => {

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
                            <Form layout="inline">
                                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                    <Col md={8} sm={24}>
                                        <FormItem label={"标签名"}>
                                            {getFieldDecorator('TagName')(<Input placeholder="标签名" />)}
                                        </FormItem >
                                    </Col>
                                </Row>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ float: 'right', marginBottom: 24 }}>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                        <Button style={{ marginLeft: 8 }}>
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