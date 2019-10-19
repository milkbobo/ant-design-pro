import { Table, Input, Button, Popconfirm, Form, message } from 'antd';
import React, { Fragment } from 'react';
import ModalTable from '@/components/util/ModalTable';
import StandardTable from '@/pages/list/table-list/components/StandardTable';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;

    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      ...props.columns,
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Fragment>
              <a onClick={() => this.moveData('up', text, record)}>上移</a>|
              <a onClick={() => this.moveData('down', text, record)}>下移</a>|
              <a onClick={() => this.modData(text, record)}>修改</a>|
              <Popconfirm title="确定要删除?" onConfirm={() => this.handleDelete(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [],
      // count: 0,
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      singleCellData: {},
    };

    // 防止循环没有唯一值key而报错
    if (props.data && props.keyName) {
      for (let dataKey in props.data) {
        let newData = props.data[dataKey];
        newData.key = newData[props.keyName];
        this.state.dataSource.push(newData);
      }
      if (props.onChange) {
        props.onChange(this.state.dataSource);
      }
      // this.state.dataSource = props.data;
      // this.state.count = props.data.length;
    }
  }

  moveData = (direction, text, record) => {
    console.log(direction, text, record);
    let index = this.state.dataSource.findIndex(item => record.key === item.key);
    if (index == 0 && direction == 'up') {
      message.error('已经最顶');
      return;
    }
    if (index == this.state.dataSource.length - 1 && direction == 'down') {
      message.error('已经最顶');
      return;
    }

    let data1 = this.state.dataSource[index];

    if (direction == 'up') {
      this.state.dataSource[index] = this.state.dataSource[index - 1];
      this.state.dataSource[index - 1] = data1;
    } else {
      this.state.dataSource[index] = this.state.dataSource[index + 1];
      this.state.dataSource[index + 1] = data1;
    }

    if (this.props.onChange) {
      this.props.onChange(this.state.dataSource);
    }

    this.forceUpdate();

    // this.setState({
    //   singleCellData:record,
    //   visible:true,
    // })
  };
  modData = (text, record) => {
    this.setState({
      singleCellData: record,
      visible: true,
    });
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    this.state.singleCellData = {};
    this.setState({
      singleCellData: {},
      visible: true,
    });
    this.forceUpdate();
    // const { count, dataSource } = this.state;
    // const newData = {
    //   key: count,
    //   name: `Edward King ${count}`,
    //   age: 32,
    //   address: `London, Park Lane no. ${count}`,
    // };
    // this.setState({
    //   dataSource: [...dataSource, newData],
    //   count: count + 1,
    // });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);

    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  handleOk = (formData, e) => {
    // const { count, dataSource } = this.state;
    const { dataSource } = this.state;
    if (formData.key == undefined) {
      formData.key = Date.now().toString(36);
      this.setState(
        {
          dataSource: [...dataSource, formData],
          // count: count + 1,
        },
        () => {
          if (this.props.onChange) {
            this.props.onChange(this.state.dataSource);
          }
        },
      );
    } else {
      for (let dataSourceKey in dataSource) {
        if (dataSource[dataSourceKey].key == formData.key) {
          dataSource[dataSourceKey] = formData;
        }
      }
      this.setState(
        {
          dataSource: dataSource,
        },
        () => {
          if (this.props.onChange) {
            this.props.onChange(this.state.dataSource);
          }
        },
      );
    }

    this.state.singleCellData = {};
    this.setState({
      singleCellData: {},
      visible: false,
    });

    // this.forceUpdate();
  };

  handleCancel = () => {
    this.state.singleCellData = {};
    this.setState({
      singleCellData: {},
      visible: false,
    });
  };

  onSubmit = e => {
    console.log(e);
  };

  render() {
    const { dataSource } = this.state;
    const { visible, confirmLoading, ModalText } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          dataType: col.dataType,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    let modalTable = '';
    if (this.state.visible) {
      modalTable = (
        <ModalTable
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          onSubmit={this.onSubmit}
          visible={this.state.visible}
          columns={this.columns}
          data={this.state.singleCellData}
        />
      );
    }

    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          添加内容
        </Button>
        {modalTable}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default EditableTable;
