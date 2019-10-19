import { Alert, Checkbox, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ userLogin2, loading }) => ({
  userLogin2,
  submitting: loading.effects['userLogin2/login'],
}))
class Login2 extends Component {
  loginForm = undefined;
  state = {
    type: 'account',
    autoLogin: true,
  };
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userLogin2/login',
        payload: { ...values },
      });
    }
  };
  onTabChange = type => {
    this.setState({
      type,
    });
  };
  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin2, submitting } = this.props;
    const { status, type: loginType } = userLogin2;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={'账户密码登录'}>
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误（admin/ant.design）')}
            <UserName
              name="name"
              placeholder={`用户名: admin or user`}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`密码: ant.design`}
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login2.login.remember-me" />
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login2;
