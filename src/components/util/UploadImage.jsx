import { Icon, Modal, Upload } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';

export default class UploadImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
        // {
        //   uid: '-1',
        //   name: 'image.png',
        //   status: 'done',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
      ],
    };

    // 防止无效数据
    if (props.fileList) {
      let newData = [];
      for (var fileListKey in props.fileList) {
        let singleValue = props.fileList[fileListKey];
        if (singleValue.url) {
          singleValue.key = fileListKey;
          singleValue.uid = fileListKey;
          newData.push(singleValue);
        }
      }

      this.state.fileList = newData;
      props.handleChange(newData);
    } else {
      this.state.fileList = [];
      props.handleChange([]);
    }
  }

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  // handleChange = ({ fileList }) => this.setState({ fileList });
  handleChange = ({ fileList }) => {
    // console.log(fileList)
    for (let fileListKey in fileList) {
      if (fileList[fileListKey].response && fileList[fileListKey].response.data) {
        fileList[fileListKey].url = fileList[fileListKey].response.data;
      }
    }
    // this.state.fileList = fileList;
    this.setState({ fileList });
    if (this.props.handleChange) {
      this.props.handleChange(fileList);
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          action="http://api.test.hongbeibang.com/backstage/file/uploadImage"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          withCredentials={true}
          name="data"
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
