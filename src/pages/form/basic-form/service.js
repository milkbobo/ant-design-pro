import request from '@/utils/request';
export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
export async function getCourseByMiniProgram(params) {
  return request(
    'http://api.test.hongbeibang.com/backstage/education/getCourseByMiniProgram?educationCourseId=10321',
    {
      params,
    },
  );
}
