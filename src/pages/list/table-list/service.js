import request from '@/utils/request';
export async function queryRule(params) {
  return request(
    'http://api.test.hongbeibang.com/backstage/education/searchCourse?type=1&ownerType=2&state=2',
    {
      params,
    },
  );
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request(
    'http://api.test.hongbeibang.com/backstage/education/searchCourse?type=1&ownerType=2&state=2',
    {
      method: 'POST',
      data: { ...params, method: 'update' },
    },
  );
}
