import fetch from 'utils/fetch';

//获取用户列表
export function getUserList(pageIndex,pageSize){
    return fetch({
        url:"/LoginService/User/GetUserList",
        method:"get",
        params:{pageIndex,pageSize}
    });
}

export function getRoleList(){
    return fetch({
        url:"/LoginService/Login/GetRoleList",
        method:"get"
    })
}

export function addUser(Email,Enable,Sex,UserName,RoleId,Name){
    var data = {
        Email,
        Enable,
        Sex,
        UserName,
        RoleId,
        Name
    }
    return fetch({
        url:"/LoginService/User/AddUser",
        method:"post",
        data
    })
}

export function getUserById(id){
    return fetch({
        url:"/LoginService/User/GetUserById",
        method:"get",
        params:{id}
    })
}

export function delUserById(id){
    return fetch({
        url:"/LoginService/User/DelUser",
        params:{id}
    })
}