import React from 'react';
import { Form, Card, Button, Row, Col, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '../SystemManagement/style.less';


const FormItem = Form.Item;
class ArticleList extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
        };
    }

    disabledStartDate = startValue => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = endValue => {
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

    onStartChange = (value, dateString) => {
        this.onChange('startValue', value);
    };

    onEndChange = (value, dateString) => {
        this.onChange('endValue', value);
    };

    handleStartOpenChange = open => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = open => {
        this.setState({ endOpen: open });
    };

    handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const { form } = this.props;
        // const { startValue, endValue } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            // const values = { ...fieldsValue };
        });
    }
    //重置
    handleFormReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { endOpen } = this.state;
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
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    onChange={this.onStartChange}
                                                    disabledDate={this.disabledStartDate}
                                                    style={{ width: '100%' }}
                                                    onOpenChange={this.handleStartOpenChange}
                                                />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col md={8} sm={24}>
                                        <FormItem label="结束时间">
                                            {getFieldDecorator('EndTime')
                                                (<DatePicker
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    disabledDate={this.disabledEndDate}
                                                    onChange={this.onEndChange}
                                                    open={endOpen}
                                                    onOpenChange={this.handleEndOpenChange}
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
                    </div>

                </Card>
            </PageHeaderWrapper>

        )
    }

}

export default Form.create()(ArticleList);