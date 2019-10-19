import { Form, Input, Modal } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import UploadImage from '@/components/util/UploadImage';
const FormItem = Form.Item;

class ModalTable extends Component {
  state = {};

  handleOk = e => {
    let formData = this.props.form.getFieldsValue();
    formData.key = this.props.data.key;
    for (var i = 0; i < this.props.columns.length; i++) {
      this.props.form.resetFields([this.props.columns[i].dataIndex]);
    }

    console.log(formData);
    console.log(this.state);

    Object.assign(formData, this.state);
    this.state = {};
    this.props.handleOk(formData, e);
  };

  handleCancel = () => {
    for (var i = 0; i < this.props.columns.length; i++) {
      this.props.form.resetFields([this.props.columns[i].dataIndex]);
    }
    this.state = {};
    this.props.handleCancel();
  };

  onSubmit = e => {
    this.props.onSubmit();
  };

  render() {
    const { data, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    let formItemData = [];
    // console.log(this.props.data)

    if (this.props.columns) {
      for (var columnsKey in this.props.columns) {
        let singleData = this.props.columns[columnsKey];
        if (singleData.dataIndex == 'operation') {
          continue;
        }

        let initialValue = '';
        if (data[singleData.dataIndex]) {
          initialValue = data[singleData.dataIndex];
        }
        let pushFormItemData = '';
        if (singleData.dataType == 'image') {
          pushFormItemData = (
            <FormItem label={singleData.title} {...formItemLayout} key={columnsKey}>
              {this.props.form.getFieldDecorator(singleData.dataIndex, {
                normalize: () => {
                  return this.state[singleData.dataIndex];
                },
              })(
                <UploadImage
                  fileList={[
                    {
                      url:
                        this.state[singleData.dataIndex] != undefined
                          ? this.state[singleData.dataIndex]
                          : initialValue,
                    },
                  ]}
                  handleChange={fileList => {
                    console.log(fileList);
                    if (fileList.length > 0 && fileList[0].url) {
                      this.state[singleData.dataIndex] = fileList[0].url;
                    }
                    if (fileList.length == 0) {
                      // console.log(fileList)
                      this.state[singleData.dataIndex] = '';
                      this.forceUpdate();
                    }
                  }}
                />,
              )}
            </FormItem>
          );
        } else {
          pushFormItemData = (
            <FormItem {...formItemLayout} label={singleData.title} key={columnsKey}>
              {getFieldDecorator(singleData.dataIndex, {
                initialValue: initialValue,
              })(<Input />)}
            </FormItem>
          );
        }

        formItemData.push(pushFormItemData);
      }
    }

    // console.log(formItemData)

    return (
      <Modal
        title="添加内容"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        onSubmit={this.onSubmit}
      >
        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
        >
          {formItemData}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ModalTable);
