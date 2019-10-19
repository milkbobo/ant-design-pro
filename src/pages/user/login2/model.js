import { routerRedux } from 'dva/router';
import { fakeAccountLogin, getFakeCaptcha } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import { notification } from 'antd';
const Model = {
  namespace: 'userLogin2',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      console.log(response);

      if (response.code !== 0) {
        return;
      }

      console.log(response.code);

      // const urlParams = new URL(window.location.href);
      // const params = getPageQuery();
      // let { redirect } = params;
      //
      // if (redirect) {
      //   const redirectUrlParams = new URL(redirect);
      //
      //   if (redirectUrlParams.origin === urlParams.origin) {
      //     redirect = redirect.substr(urlParams.origin.length);
      //
      //     if (redirect.match(/^\/.*#/)) {
      //       redirect = redirect.substr(redirect.indexOf('#') + 1);
      //     }
      //   } else {
      //     window.location.href = redirect;
      //     return;
      //   }
      // }

      // yield put(routerRedux.replace(redirect || '/'));

      window.location.href = '/welcome';
      yield routerRedux.replace('/welcome');
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
