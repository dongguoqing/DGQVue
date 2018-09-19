import fetch from 'utils/fetch';

//获取用户列表
export function getUserList(pageIndex, pageSize) {
    return fetch({
        url: "/LoginService/User/GetUserList",
        method: "get",
        params: { pageIndex, pageSize }
    });
}

//获取用户角色列表
export function getRoleList() {
    return fetch({
        url: "/LoginService/Login/GetRoleList",
        method: "get"
    })
}


//新增用户
export function addUser(F_Email,F_EnabledMark,F_Gender,F_NickName,F_RoleId,F_RealName,F_UserPassword,F_OrganizeId,F_DepartmentId,F_Account,F_MobilePhone) {
    var data = {
        F_Email,F_EnabledMark,F_Gender,F_NickName,F_RoleId,F_RealName,F_UserPassword,F_OrganizeId,F_DepartmentId,F_Account,F_MobilePhone
    }
    return fetch({
        url: "/LoginService/User/AddUser",
        method: "post",
        data
    })
}

//保存新增用户的密码
export function addUserPassWord(F_Id,F_UserId,F_UserPassword){
    var data = {
        F_Id,F_UserId,F_UserPassword
    }
    return fetch({
        url:"/LoginService/User/AddUserPassWord",
        method:'post',
        data
    })
}

//编辑用户
export function editUser(F_Email, F_EnabledMark, F_Gender, F_NickName, F_RoleId, F_RealName, F_UserPassword, F_OrganizeId, F_DepartmentId, F_Account, F_UserId, F_MobilePhone) {
    var F_Id = F_UserId
    var data = {
        F_Email, F_EnabledMark, F_Gender, F_NickName, F_RoleId, F_RealName, F_UserPassword, F_OrganizeId, F_DepartmentId, F_Account, F_Id, F_MobilePhone
    }
    return fetch({
        url: "/LoginService/User/EditUser",
        method: "post",
        data
    })
}

//根据用户id获取用户信息
export function getUserById(id) {
    return fetch({
        url: "/LoginService/User/GetUserById",
        method: "get",
        params: { id }
    })
}

//根据用户id删除用户
export function delUserById(id) {
    return fetch({
        url: "/LoginService/User/DelUser",
        params: { id }
    })
}

//修改用户密码(针对超级管理员)
export function updatePassWord(F_UserId,F_UserPassword){
     var F_Id = F_UserId
     var data = {
        F_Id,F_UserId,F_UserPassword
     }
     return fetch({
         url:"/LoginService/User/UpdatePassWord",
         method:"post",
         data
     })
}

//修改用户密码(针对当前用户修改自己的密码)
export function updateSelfPassWord(id,password,newPassWord){
     return fetch({
         url:"/LoginService/User/UpdateSelfPassWord",
         method:"get",
         params:{
            id,password,newPassWord
         }
     })
}