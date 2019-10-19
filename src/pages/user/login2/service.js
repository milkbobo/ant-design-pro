import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('http://api.test.hongbeibang.com/backstage/login/checkin', {
    method: 'POST',
    data: params,
    // mode: "no-cors",
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
