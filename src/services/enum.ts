import request from '@/utils/request';

export async function queryEducationOwnerType(): Promise<any> {
  return request('http://api.test.hongbeibang.com/backstage/education/getEducationBrandEnum');
}

export async function queryIsShowFreeNumEnum(): Promise<any> {
  return request('http://api.test.hongbeibang.com/backstage/education/getIsShowFreeNumEnum');
}
