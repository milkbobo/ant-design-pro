import { message } from 'antd';
import { fakeSubmitForm, getCourseByMiniProgram } from './service';
const Model = {
  namespace: 'formBasicForm',
  state: {
    data: {
      title: '',
      ownerType: 0,
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getCourseByMiniProgram, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
  },
};
export default Model;
