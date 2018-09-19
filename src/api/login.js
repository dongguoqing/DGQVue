import fetch from 'utils/fetch';

//根据用户邮箱或者用户名和密码进行登录
export function loginByEmail(email, password) {
  const data = {
    email,
    password
  };
  return fetch({
    url: '/LoginService/Login/RequestToken',
    //url: '/login/loginbyemail',
    method: 'post',
    data
  });
}

//登出
export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  });
}

//根据当前登录的用户信息
export function getInfo(uid) {
  return fetch({
    url: '/LoginService/Login/GetInfo',
   // url: '/user/info',
    method: 'get',
   // headers:{access_token:token}
    params: { uid }
  });
}

