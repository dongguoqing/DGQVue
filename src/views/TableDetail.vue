<template>
  <div class="animated fadeIn"  style="margin-top:50px;">

    
    <Row>
      <Col span="18">
      <div style="text-align:center">
          
  <!-- <video  controls height="300" v-if="is_video" id='video' preload="auto" src="http://otl6ypoog.bkt.clouddn.com/Objectstoarge/videos/2017-08-14/65055_WeChatSight38.mp4">
     
    
  </video> -->

      </div>


      </Col>
      
    </Row>
  
   <Button type="info" @click="addUser">新增</Button>
   <br/>
    <Row style="margin-top:10px">   
        <Col span="24">
 <Table border :columns="columns6" :data="video_result"  ></Table>
 <Page :total="this.totalCount" :pagegroup="10"  @on-change="setInitPage($event)" style="text-align:right;margin-top:50px"></Page>
        </Col> 
    </Row>
  

    <Modal
        v-model="modal1"
        title="用户" 
        @on-cancel="cancel" @on-ok="saveUser('formItem')">
      
                 <div style="" class="doc-header">
                      <Form  ref="formItem" :model="formItem" :label-width="80" :rules="ruleInline">
          
        <Form-item label="账户" prop="account">
            <Input v-model="formItem.account" placeholder="请输入"></Input>
        </Form-item>

        <Form-item label="密码" prop="password">
            <Input v-model="formItem.password" :disabled="currentRole!='超级管理员'"  type="password" placeholder="请输入"></Input>
        </Form-item>

         <Form-item label="手机号" prop="phone">
            <Input v-model="formItem.phone" placeholder="请输入"></Input>
        </Form-item>

        <Form-item label="邮箱" prop="email">
            <Input v-model="formItem.email" placeholder="请输入"></Input>
        </Form-item>

         <Form-item label="用户名" prop="username">
            <Input v-model="formItem.username" placeholder="请输入"></Input>
        </Form-item>

         <Form-item label="真实姓名" prop="name">
            <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>

        <!-- <Select style="diwth:200px">
            <Option>
            </Option>
        </Select> -->

         <FormItem label="角色">
            <Dropdown trigger="click" @on-click="chooseRole">
                <Button style="background-color:white;width:200px">
                    {{rolename}}
                    <Icon type="arrow-down-b">
                    </Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem :name="drop.F_Id" v-for="drop in rolelist" :value="drop.F_Id" :key="drop.F_Id">
                        {{drop.F_FullName}}
                    </DropdownItem>
                    
                </DropdownMenu>
                
            </Dropdown>
        </FormItem>

         <FormItem label="公司">
            <Dropdown trigger="click" @on-click="chooseCompany">
                <Button  style="background-color:white;width:200px">
                   {{companyname}}
                    <Icon type="arrow-down-b">
                    </Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem :name="company.F_Id" v-for="company in companylist" :value="company.F_Id" :key="company.F_Id">
                        {{company.F_FullName}}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </FormItem>

        <FormItem label="部门">
            <Dropdown trigger="click"  @on-click="chooseDept">
                <Button  style="background-color:white;width:200px">
                    {{deptname}}
                    <Icon type="arrow-down-b">
                    </Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem :name="dept.F_Id" v-for="dept in deptlist" :value="dept.F_Id" :key="dept.F_Id">
                        {{dept.F_FullName}}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </FormItem>
      
        <Form-item label="性别">
            <Radio-group v-model="formItem.sex">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
            </Radio-group>
        </Form-item>
        
        <Form-item label="禁用">
            <iSwitch v-model="formItem.switch" size="large">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </iSwitch>
        </Form-item>
       
       
    </Form>

            </div>
          
          
          <div slot="footer">
                 <Button type="primary" @click="saveUser('formItem')">提交</Button>
                 <Button type="ghost" @click="closeModel" style="margin-left: 8px">取消</Button>
          </div>
    </Modal>
     <Spin size="large"  v-if="spinShow"></Spin>
  </div>
  



</template>


<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>

   
<script>
import {getUserList,getRoleList,getUserById,addUser,delUserById,editUser,updateSelfPassWord,updatePassWord,addUserPassWord} from 'api/user';
import {getOrganizeList,getDutyList,getCompanyList} from 'api/organize';
import store from 'store';
import Cookies from 'js-cookie';

    export default {
        data () {
            var this_i = this;
            var checkEmail = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('邮箱不能为空'));
                }else {
                    rule.message = ""
                    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                    console.log(reg.test(value));
                    if (reg.test(value)) {
                       callback();
                    } else {
                       return callback(new Error('请输入正确的邮箱'));
                    }
              }
            }
            var checkPassWord = (rule,value,callback)=>{
                if(!value)
                   return callback(new Error('密码不能为空'));
                else {
                   rule.message = ""; 
                   const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/
                   if(reg.test(value))
                     callback();
                   else
                     return callback(new Error('密码必须由数字和字母组成，并且长度在6-16位之间'))
                }
            }
            return {
                 deptname:'请选择部门',
                 companyname:'请选择公司',
                 rolename:'请选择角色',
                 title:'新增用户',
                 deptlist:[],//部门集合
                 dutylist:[],//岗位集合
                 companylist:[],//公司集合
                 spinShow:true,//设置是够显示spin加载中
                 totalCount:0,
                 currentPage:1,//当前页码
                 isEditOrAdd:0,//新增还是编辑
                 rolelist:['管理员','普通用户'],
                 currentRole:'',//当前用户的角色名称
                 formItem: {
                    id:0,
                    account:'',
                    password:'',
                    email:'',
                    username: '',
                    name:'',
                    roleid: '',
                    phone:'',
                    role:'',
                    sex: '1',
                    checkbox: [],
                    switch: true,
                    companyid: '',
                    deptid: '',
                    slider: [20, 50],
                    textarea: ''
                },
                 formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    account:[{
                        required:true,message:'请填写账户',trigger:'blur'
                    }],
                    password:[
                        { validator:checkPassWord,required: true, message: '请填写密码', trigger: 'blur' },
                        { type:'string',min:6,message:'密码长度不能小于6位',trigger:'blur'}
                    ],
                    username:[{
                        required:true,message:'请填写用户名',trigger:'blur'
                    }],
                    name: [
                        { required: true, message: '请填写真实姓名', trigger: 'blur' }
                    ],
                    email: [
                        { validator:checkEmail,required: true, message: '请填写邮箱', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change' },
                        { type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
                    ],
                    time: [
                        { required: true, type: 'date', message: '请选择时间', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur' }
                    ]
                },
                formDynamic: {
                    items: [
                        {
                            value: ''
                        }
                    ]
                },
                modal1: false,
                json_list:[],
                video_size:'1M',
                video_duration:'11s',
                video_create_timestamp:'2017-08-10 17:03:54',
                video_name:'p.video',
                porn_count:100,
                sex_count:200,
                porn_percent:10,
                sex_count:500,
                sex_percent:70,
                is_video:true,
                is_img:false,
                video_src:'',
                img_result:'',
                page_result_list:[],
                video_result: [],
                columns6: [
                    {
                        title: '账户',
                        key: 'level',
                        render: (h, params) => {
                          let level='';
                            
                             return h('div', [
                                 h('strong', params.row.F_Account)
                               ]);
                        },
                        filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 1) {
                                return row.level===0;
                            } else if (value === 2) {
                                return row.level ===1;
                            }
                        }
                    },
                    {
                        title: '姓名',
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong',{
                                    style:{
                                      color:"#2d8cf0",
                                        cursor:"pointer",
                                    },

                                  }, params.row.F_RealName)
                               ]);
                        },
                       
                    },
                     {
                        title: '性别',
                        render: (h, params) => {
                             let sex='';
                             if(params.row.F_Gender)
                                sex="男";
                              else
                                sex="女";

                             return h('div', [
                                 h('strong', sex)
                               ]);
                        },
                        
                    }, 
                    {
                        title:"手机",
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong', params.row.F_MobilePhone)
                               ]);
                        },
                        // filters: [
                        //     {
                        //         label: '大于0.90',
                        //         value: 1
                        //     },
                        //     {
                        //         label: '小于0.90',
                        //         value: 2
                        //     }
                        // ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 1) {
                                return row.confidence>=0.90;
                            } else if (value === 2) {
                                return row.confidence <0.90;
                            }
                        }
                    },
                    {
                        title:'公司',
                        render:(h,params)=>{
                            return h('div',[h('strong',this_i.companylist[params.row.F_OrganizeId].F_FullName)])
                        },
                    },
                     {
                        title: '部门',
                         render: (h, params) => {
                             return h('div', [
                                 h('strong', this_i.deptlist[params.row.F_DepartmentId].F_FullName)
                               ]);
                        },
                       
                    }, 
                     {
                        title: '岗位',
                         render: (h, params) => {
                             return h('div', [
                                 h('strong', this_i.dutylist[params.row.F_RoleId].F_FullName)
                               ]);
                        },
                       
                    }, 
                     {
                        title: '创建时间',
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong', params.row.F_CreatorTime)
                               ]);
                        },
                       
                    }, 
                     {
                        title: '允许登录',
                         render: (h, params) => {
                             if(params.row.F_EnabledMark)
                                return h('div',{
                                     domProps: {
                                        innerHTML: '<span data-v-55c71c4a="" tabindex="0" class="ivu-switch ivu-switch-checked ivu-switch-large"><input type="hidden" value="true"> <span class="ivu-switch-inner"><span data-v-55c71c4a="">开启</span> <!----></span></span>'
                                     },
                                });
                            else
                               return h('div',{
                                   domProps:{
                                       innerHTML:'<span data-v-55c71c4a="" tabindex="0" class="ivu-switch ivu-switch-large"><input type="hidden" value="false"> <span class="ivu-switch-inner"><!----> <span data-v-55c71c4a="">关闭</span></span></span>'
                                   }
                               })
                        },
                       
                    }, 
                    {
                        title: '备注',
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong', params.row.F_Description)
                               ]);
                        },
                       
                    }, 
                    {
                        title:"操作",
                        render:(h,params)=>{

                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                              this_i.isEditOrAdd = 0;
                                              //根据Id获取对应的人员详细信息
                                              this_i.readPersonInformation(params.row.F_Id);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            //根据Id获取对应的人员详细信息
                                            if(confirm("确定删除此条数据吗？")){
                                              this_i.delUser(params.row.id);
                                            }
                                        }
                                    }
                                }, '删除')
                            ]);

                            
                        }
                    }
                ],
            }
        },
        created(){
           this.currentRole = store.getters.roles
             //获取部门集合
            getOrganizeList().then(response=>{
                this.deptlist = response.data
                 //获取岗位集合
                getDutyList().then(response=>{
                    this.dutylist= response.data;
                  //获取公司集合
                  getCompanyList().then(response=>{
                     this.companylist = response.data;
                      //获取用户列表
                    getUserList(1,10).then(response=>{
                      this.spinShow = false;
                      var jsonData = response.data.Items;
                      this.setPersonInformation(jsonData,response.data.Count)
               
                       // alert(this.video_result)
                    });
                  })
                })
            })
        },
        mounted(){
            const vue=this;
            var id=this.$route.params.id;
            let video_list=null;
        },
        methods:{
          //选择角色
          chooseRole(name){
             this.formItem.select = name
             this.formItem.roleid = name                                                                                                                                                                                               
             //循环角色列表
             for(var i=0;i<this.rolelist.length;i++){
                 if(this.rolelist[i].F_Id==name)
                  this.rolename = this.rolelist[i].F_FullName
             }
          },
          //选择公司
          chooseCompany(name){
             this.formItem.companyid = name
             this.companyname = this.companylist[name].F_FullName
          },
          //选择部门
          chooseDept(name){
             this.formItem.deptid = name
             this.deptname = this.deptlist[name].F_FullName
          },
          ok () {
            	this.modal1 = false,
                this.$Message.info('点击了确定');
          },
          cancel () {
                this.$Message.info('点击了取消');
          },
          //写入人员数据信息
          setPersonInformation(jsonData,totalCount){
                this.totalCount = totalCount;
                this.video_result = []
                this.video_result = jsonData;
          },
          //读取用户信息
          readPersonInformation(id){
              //每次读取的时候 先初始化下下拉框
              this.companyname='请选择公司'
              this.rolename='请选择角色'
              this.deptname ='请选择部门'
              this.isEditOrAdd = 0;
              this.modal1 = true;
              getRoleList().then(response=>{
                  var jsonData = response.data;
                  if(jsonData!=null&&jsonData!=undefined){
                      this.rolelist = jsonData;
                  }
              })
              getUserById(id).then(response=>{
                    var jsonData = response.data;
                    if(jsonData!=null&&jsonData!=""){
                       this.formItem.id = jsonData.Id
                       this.formItem.name = jsonData.F_RealName;
                       this.formItem.username = jsonData.F_NickName;
                       this.formItem.email = jsonData.F_Email; 
                       this.formItem.phone = jsonData.F_MobilePhone
                       this.formItem.switch=jsonData.F_EnabledMark==true?false:true;
                       this.formItem.sex = jsonData.F_Gender==true?'0':'1';
                       this.formItem.account = jsonData.F_Account;
                       this.formItem.password = jsonData.F_UserPassword;
                       this.chooseCompany(jsonData.F_OrganizeId)
                       this.chooseDept(jsonData.F_DepartmentId)
                       this.chooseRole(jsonData.F_RoleId)
                    }
                })
          },
          //新增用户
          addUser(){
              this.isEditOrAdd = 1;
              this.modal1 = true
              //清空
              this.formItem = {
                    id:0,
                    account:'',
                    password:'',
                    email:'',
                    username: '',
                    name:'',
                    roleid: '',
                    phone:'',
                    role:'',
                    sex: '1',
                    checkbox: [],
                    switch: true,
                    companyid: '',
                    deptid: '',
                    slider: [20, 50],
                    textarea: ''
              },
              getRoleList().then(response=>{
                  var jsonData = response.data;
                  if(jsonData!=null&&jsonData!=undefined){
                       this.rolelist = jsonData;
                  }
              })
          },
          //删除用户
          delUser(id){
              delUserById(id).then(response=>{
                  if(response.data=="ok"){
                      this.$Message.success("删除成功！");
                      this.setInitPage(this.currentPage)
                  }else
                      this.$Message.error("删除失败！");
              })
          },
          closeModel(){
              this.modal1 = false
          },
          //保存用户
          saveUser(name){
              this.$refs[name].validate((valid) => {
                if (valid) {
                    var F_Email = this.formItem.email;
                    var F_EnabledMark = this.formItem.switch==true?0:1
                    var F_MobilePhone = this.formItem.phone
                    var F_Gender = this.formItem.sex=="0"?true:false;
                    var F_NickName = this.formItem.username;
                    var F_RoleId = this.formItem.roleid;
                    var F_RealName = this.formItem.name;
                    var F_OrganizeId = this.formItem.companyid
                    var F_DepartmentId = this.formItem.deptid
                    var F_Account = this.formItem.account
                    var F_UserPassword = this.formItem.password
                    if(this.isEditOrAdd==1)//新增
                      addUser(F_Email,F_EnabledMark,F_Gender,F_NickName,F_RoleId,F_RealName,F_UserPassword,F_OrganizeId,F_DepartmentId,F_Account,F_MobilePhone).then(response=>{
                        if(response.status==200){
                            //保存密码
                           var responseUser = response.data
                           debugger
                           addUserPassWord(responseUser.F_Id,responseUser.F_Id,F_UserPassword).then(response=>{
                               if(response.status==200){
                                  this.$Message.success("保存成功！");
                               }else{
                                  this.$Message.error("保存失败！");
                               }
                           })
                           this.modal1 = false;
                           //重新获取数据
                           this.setInitPage(this.currentPage)
                        }else
                           this.$Message.error("保存失败！");
                       })
                    else {//编辑
                       var F_UserId = this.formItem.id
                       editUser(F_Email,F_EnabledMark,F_Gender,F_NickName,F_RoleId,F_RealName,F_UserPassword,F_OrganizeId,F_DepartmentId,F_Account,F_UserId,F_MobilePhone).then(response=>{
                          if(response.data=="ok"){
                              //如果是超级管理员 可以对密码进行修改
                              if(this.currentRole=="超级管理员"){
                                  updatePassWord(F_UserId,F_UserPassword).then(response=>{
                                      if(response.data=="ok"){
                                          this.$Message.success("保存成功！");
                                      }else
                                          this.$Message.fail("保存失败！");
                                  })
                              }else
                                  this.$Message.success("保存成功！");
                              this.modal1 = false;
                              //重新获取数据
                              this.setInitPage(this.currentPage)
                          }else
                              this.$Message.error("保存失败！");
                       })
                    }
                       
                } else {
                        return;
                    }

                    //提交数据
                    // addUser().then(response=>{

                    // })
                })
          },
          //分页
          setInitPage(current){
              this.spinShow = true;
              this.currentPage = current;
              getUserList(current,10).then(response=>{
                this.spinShow = false
                var jsonData = response.data.Items;
                this.setPersonInformation(jsonData,response.data.Count)
              })
          }
        },
       
    }
</script>

<style type="text/css">
        .demo-i-circle-custom h1{
            color: #3f414d;
            font-size: 10px;
            font-weight: normal;
        }
        .demo-i-circle-custom p{
            color: #657180;
            font-size: 8px;
            margin: 5px 0 2px;
        }
        .demo-i-circle-custom span{
            display: block;
            padding-top: 15px;
            color: #657180;
            font-size: 10px;}
           .demo-i-circle-custom span :before{
                content: '';
                display: block;
                width: 50px;
                height: 1px;
                margin: 0 auto;
                background: #e0e3e6;
                position: relative;
                top: -20px;
            };
        .demo-i-circle-custom span i{
            font-style: normal;
            color: #3f414d;
        }
</style>