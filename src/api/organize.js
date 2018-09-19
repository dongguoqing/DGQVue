import fetch from 'utils/fetch';

//获取部门列表
export function getOrganizeList(){
    return fetch({
        url:"/LoginService/Organize/GetOrganizeList",
        method:"get",
        params:{}
    });
}

//获取岗位列表
export function getDutyList(){
    return fetch({
        url:"/LoginService/Organize/GetDutyList",
        method:"get",
        params:{}
    })
}

//获取公司集合
export function getCompanyList(){
    return fetch({
        url:"/LoginService/Organize/GetCompanyList",
        method:"get",
        params:{}
    })
}