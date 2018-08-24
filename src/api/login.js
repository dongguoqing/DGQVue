import fetch from 'utils/fetch';


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

export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/LoginService/Login/GetInfo',
   // url: '/user/info',
    method: 'get',
   // headers:{access_token:token}
    params: { token }
  });
}

