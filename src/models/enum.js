import { queryEducationOwnerType, queryIsShowFreeNumEnum } from '@/services/enum';

const EnumModel = {
  namespace: 'enum',

  state: {
    educationOwnerType: {},
    isShowFreeNum: {},
  },

  effects: {
    *fetchEducationOwnerType(_, { call, put }) {
      const response = yield call(queryEducationOwnerType);
      yield put({
        type: 'saveEducationOwnerTypeEnum',
        payload: response,
      });
    },
    *fetchIsShowFreeNum(_, { call, put }) {
      const response = yield call(queryIsShowFreeNumEnum);
      yield put({
        type: 'saveIsShowFreeNum',
        payload: response,
      });
    },
  },

  reducers: {
    saveEducationOwnerTypeEnum(state, action) {
      return {
        ...state,
        educationOwnerType: action.payload.data || {},
      };
    },
    saveIsShowFreeNum(state, action) {
      return {
        ...state,
        isShowFreeNum: action.payload.data || {},
      };
    },
  },
};

export default EnumModel;
