import { Button, Card, Form, Input, Select } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UploadImage from '@/components/util/UploadImage';
import EditableTable from '@/components/util/EditableTable';
import { connect } from 'dva';
// import styles from './style.less';
// import './style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => {
  return {
    educationCourseId:0,
    formBasicForm: state.formBasicForm.data,
    enumData: state.enum,
    submitting: state.loading.global,
    params:null,
  };
})
class BasicForm extends Component {
  state = {};

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      // values.qrCode = this.state.qrCode;
      console.log(err);
      console.log(values);
      if (!err) {
        dispatch({
          type: 'formBasicForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  componentDidMount() {
    this.state.educationCourseId = this.props.location.query.educationCourseId;
    this.state.params = this.props.location.query;
    const { dispatch } = this.props;
    dispatch({
      type: 'enum/fetchEducationOwnerType',
    });
    dispatch({
      type: 'enum/fetchIsShowFreeNum',
    });
    // console.log(this.state.params)
    // console.log(Object.keys(this.state.params).length)
    if (Object.keys(this.state.params).length > 0){
      dispatch({
        type: 'formBasicForm/fetch',
        payload: this.state.params,
      });
    }
  }

  render() {
    const { submitting, formBasicForm, enumData } = this.props;
    // let data = formBasicForm.data || {};
    // console.log(data)
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
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
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    let ownerTypeOption = [];

    for (var educationOwnerTypeKey in enumData.educationOwnerType) {
      ownerTypeOption.push(
        <Option key={educationOwnerTypeKey} value={parseInt(educationOwnerTypeKey)}>
          {enumData.educationOwnerType[educationOwnerTypeKey]}
        </Option>,
      );
    }

    console.log(this.state.params)
    // console.log(Object.keys(this.state.params).length)
    console.log(!!formBasicForm.data)
    console.log(!this.state.params)
    console.log(this.state.params)
    // if (!!!formBasicForm.data) {
    //   return '';
    // }
    //   if (!!formBasicForm.data || !this.state.params  ) {
    //     return '';
    //   }
    //

    let data = {};

    if (this.state.params && Object.keys(this.state.params).length > 0  && !!formBasicForm.data){
      data = formBasicForm.data
    }else{
      if (this.state.params && Object.keys(this.state.params).length == 0 ){
        data = {};
      }else{
        return '';
      }
    }




    // let data = formBasicForm.data || {};
    return (
      <PageHeaderWrapper content={<FormattedMessage id="form-basic-form.basic.description" />}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem label={'课程ID'} {...formItemLayout}>
              {getFieldDecorator('educationCourseId', {
                initialValue: data.educationCourseId,
              })(<Input disabled={true} />)}
            </FormItem>

            <FormItem label={'标题'} {...formItemLayout}>
              {getFieldDecorator('title', {
                initialValue: data.title,
              })(<Input />)}
            </FormItem>

            <FormItem label={'教师ID'} {...formItemLayout}>
              {getFieldDecorator('clientId', {
                initialValue: data.clientId,
              })(<Input />)}
            </FormItem>

            <FormItem label={'收费价格'} {...formItemLayout}>
              {getFieldDecorator('originPrice', {
                initialValue: data.originPrice,
              })(<Input />)}
            </FormItem>

            <FormItem label={'状态'} {...formItemLayout}>
              {getFieldDecorator('state', {
                initialValue: data.state,
              })(<Select>{ownerTypeOption}</Select>)}
            </FormItem>

            <FormItem label={'品牌方'} {...formItemLayout}>
              {getFieldDecorator('ownerType', {
                initialValue: data.ownerType,
              })(
                <Select>
                  <Option key={2} value={2}>
                    上架
                  </Option>
                  <Option key={3} value={3}>
                    下架
                  </Option>
                </Select>,
              )}
            </FormItem>

            <FormItem label={'跳转小程序二维码'} {...formItemLayout}>
              {this.props.form.getFieldDecorator('qrCode', {
                normalize: () => {
                  return this.state.qrCode;
                },
              })(
                <UploadImage
                  fileList={[
                    {
                      url: this.state.qrCode != undefined ? this.state.qrCode : data.qrCode,
                    },
                  ]}
                  handleChange={fileList => {
                    if (fileList.length > 0 && fileList[0].url) {
                      this.state.qrCode = fileList[0].url;
                    }
                    if (fileList.length == 0) {
                      // console.log(fileList)
                      this.state.qrCode = '';
                      this.forceUpdate();
                    }
                  }}
                />,
              )}
            </FormItem>

            <FormItem label={'开机广告图'} {...formItemLayout}>
              {this.props.form.getFieldDecorator('startAdvertisingImage', {
                normalize: () => {
                  return this.state.startAdvertisingImage;
                },
              })(
                <UploadImage
                  fileList={[
                    {
                      url:
                        this.state.startAdvertisingImage != undefined
                          ? this.state.startAdvertisingImage
                          : data.startAdvertisingImage,
                    },
                  ]}
                  handleChange={fileList => {
                    if (fileList.length > 0 && fileList[0].url) {
                      this.state.startAdvertisingImage = fileList[0].url;
                    }
                    if (fileList.length == 0) {
                      this.state.startAdvertisingImage = '';
                    }
                  }}
                />,
              )}
            </FormItem>

            <FormItem label={'课程介绍内容'} {...formItemLayout}>
              {this.props.form.getFieldDecorator('introduces', {
                normalize: () => {
                  return this.state.introduces;
                },
              })(
                <EditableTable
                  data={data.introduces}
                  keyName={'educationCourseSummaryExtendId'}
                  onChange={introduces => {
                    this.state.introduces = introduces;
                  }}
                  columns={[
                    {
                      title: '标题',
                      dataIndex: 'title',
                    },
                    {
                      title: '内容',
                      dataIndex: 'introduce',
                    },
                  ]}
                />,
              )}
            </FormItem>

            <FormItem label={'介绍轮播图'} {...formItemLayout}>
              {this.props.form.getFieldDecorator('imagess', {
                normalize: () => {
                  return this.state.imagess;
                },
              })(
                <EditableTable
                  data={this.state.imagess != undefined ? this.state.imagess : data.imagess}
                  keyName={'educationCourseImageId'}
                  onChange={imagess => {
                    // console.log(imagess);
                    this.state.imagess = imagess;
                  }}
                  columns={[
                    {
                      title: '封面',
                      dataIndex: 'image',
                      dataType: 'image',
                      width: '20%',
                      render: text => <img src={text} width="100%" />,
                    },
                  ]}
                />,
              )}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
              >
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }

}

export default Form.create()(BasicForm);
