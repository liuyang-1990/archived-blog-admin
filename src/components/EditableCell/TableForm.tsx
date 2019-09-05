import { Button, Divider, Input, Popconfirm, Table, message } from 'antd';
import React, { Fragment, PureComponent } from 'react';

import isEqual from 'lodash.isequal';
import styles from './style.less';
import { toLocaleTimeString } from '@/utils/utils';
import { TableProps } from 'antd/lib/table';

interface TableFormDateType {
  key: string;
  TagName?: string;
  Description?: string;
  CreateTime?: string;
  isNew?: boolean;
  editable?: boolean;
}
interface TableFormProps extends TableProps<any> {
  loading?: boolean;
  value?: TableFormDateType[];
  remove?: (key: string) => void;
  handleOk?: (value?: TableFormDateType) => void;
}

interface TableFormState {
  loading?: boolean;
  value?: TableFormDateType[];
  data?: TableFormDateType[];
  editingKey: string;
}
class TableForm extends PureComponent<TableFormProps, TableFormState> {
  static getDerivedStateFromProps(nextProps: TableFormProps, preState: TableFormState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
      loading: nextProps.loading,
    };
  }

  clickedCancel: boolean = false;

  index = 0;

  cacheOriginData = {};

  columns: any = [
    {
      title: '标签名称',
      align: 'center',
      dataIndex: 'TagName',
      key: 'TagName',
      width: '25%',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'TagName', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="标签名称"
            />
          );
        }
        return text;
      },
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'Description',
      key: 'Description',
      width: '25%',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'Description', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="描述"
            />
          );
        }
        return text;
      },
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'CreateTime',
      render: createTime => toLocaleTimeString(createTime)
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TableFormDateType) => {
        const { loading, editingKey } = this.state;
        if (!!record.editable && loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a disabled={editingKey != ''} onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  constructor(props: TableFormProps) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
      editingKey: '',
    };
  }

  getRowByKey(key: string, newData?: TableFormDateType[]) {
    const { data = [] } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    this.setState({ editingKey: key });
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newTag = () => {
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      TagName: '',
      Description: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key: string) {
    const { data = [] } = this.state;
    const { remove } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    if (key.startsWith("NEW_TEMP_ID")) {
      return;
    }
    if (remove) {
      remove(key);
    }
  }

  handleKeyPress(e: React.KeyboardEvent, key: string) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e: React.ChangeEvent<HTMLInputElement>, fieldName: string, key: string) {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e: React.MouseEvent | React.KeyboardEvent, key: string) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.TagName) {
        message.error('请输入标签名称');
        (e.target as HTMLInputElement).focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data = [] } = this.state;
      const { handleOk } = this.props;
      if (handleOk) {
        const row = data.find(x => { return x.key == key });
        handleOk(row);
      }
      this.setState({
        loading: false,
        editingKey: ''
      });
    }, 500);
  }

  cancel(e: React.MouseEvent, key: string) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = [...data];
    // 编辑前的原始数据
    let cacheOriginData = newData.map(item => {
      if (item.key === key) {
        if (this.cacheOriginData[key]) {
          const originItem = {
            ...item,
            ...this.cacheOriginData[key],
            editable: false,
          };
          delete this.cacheOriginData[key];
          return originItem;
        }
      }
      return item;
    });
    this.setState({ data: cacheOriginData, editingKey: '' });
    this.clickedCancel = false;
  }

  handleTableChange: TableProps<TableFormDateType>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  }

  render() {
    const { loading, data } = this.state;

    return (
      <Fragment>
        <Button
          style={{ marginBottom: 16 }}
          type="primary"
          onClick={this.newTag}
        >
          新建
        </Button>
        <Table<TableFormDateType>
          loading={loading}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
          onChange={this.handleTableChange}
          dataSource={data}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Fragment>
    );
  }
}

export default TableForm;
