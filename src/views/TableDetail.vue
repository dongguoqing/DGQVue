<template>
  <div class="animated fadeIn"  style="margin-top:50px;">

    
    <Row>
      <Col span="18">
      <div style="text-align:center">
          
  <!-- <video  controls height="300" v-if="is_video" id='video' preload="auto" src="http://otl6ypoog.bkt.clouddn.com/Objectstoarge/videos/2017-08-14/65055_WeChatSight38.mp4">
     
    
  </video> -->

      </div>


      </Col>
       <!-- <Col span="6">
            <Card>
                <div v-if="is_video">
                       <p slot="title" >视频名称:{{video_name}}</p>
                    <p >上传时间:{{video_create_timestamp}}</p>
                    <p>视频长度:{{video_duration}}</p>
                    <p >文件大小: {{video_size}}</p>
                    <p>识别结果</p>
                   
                   
                    <i-circle
                          :size="100"
                          :trail-width="4"
                          :stroke-width="5"
                          :percent="sex_percent"
                          stroke-linecap="square"
                          stroke-color="#ff9900">
                          <div class="demo-i-circle-custom">
                              <h1>{{sex_count}}</h1>
                              <p>性感镜头数</p>
                              <span>
                                  总占比
                                  <i>{{sex_percent+"%"}}</i>
                              </span>
                          </div>
                      </i-circle>
                      <i-circle
                          :size="100"
                          :trail-width="4"
                          :stroke-width="5"
                          :percent="porn_percent"
                          stroke-linecap="square"
                          stroke-color="#ed3f14">
                          <div class="demo-i-circle-custom">
                              <h1>{{porn_count}}</h1>
                              <p>涉黄镜头数</p>
                              <span>
                                  总占比
                                  <i>{{porn_percent+"%"}}</i>
                              </span>
                          </div>
                  </i-circle>
                </div>



                <div v-else-if="is_img">
                  
                  <p slot="title" >图片名称:{{video_name}}</p>
                    <p >上传时间:{{video_create_timestamp}}</p>
                    <p >文件大小: {{video_size}}</p>
                    <p >识别结果</p>
                <h3 style="margin-top:30px;text-align:center">  <strong >{{img_result}}</strong></h3>  
                </div>
               


            </Card>
       </Col> -->
    </Row>
  
   <Button type="info" @click="addUser">新增</Button>
   <br/>
    <Row v-if="is_video">   
        <Col span="24">
 <Table border :columns="columns6" :data="video_result"  ></Table>
 <Page :total="this.totalCount" :pagegroup="10"  @on-change="setInitPage($event)" style="text-align:right;margin-top:50px"></Page>
        </Col> 
    </Row>
  

    <Modal
        v-model="modal1"
        title="普通的Modal对话框标题"
       
        @on-cancel="cancel">
           <div style="" class="doc-header">
                      <Form  ref="formItem" :model="formItem" :label-width="80" :rules="ruleInline">
        <Form-item label="邮箱" prop="email">
            <Input v-model="formItem.email" placeholder="请输入"></Input>
        </Form-item>
         <Form-item label="用户名" prop="username">
            <Input v-model="formItem.username" placeholder="请输入"></Input>
        </Form-item>
         <Form-item label="真实姓名" prop="name">
            <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>
         <Form-item label="角色">
            <Radio-group v-model="formItem.role">
                <Radio  :key="role.Id" :label="role.Id" v-for="role in roles">{{role.RoleName}}</Radio>
                <!-- <Radio label="female">普通用户</Radio> -->
            </Radio-group>
        </Form-item>
        <!-- <Form-item label="选择器">
            <Select v-model="formItem.select" placeholder="请选择">
                <Option value="beijing">北京市</Option>
                <Option value="shanghai">上海市</Option>
                <Option value="shenzhen">深圳市</Option>
            </Select>
        </Form-item>
        <Form-item label="日期控件">
                    <Date-picker type="date" placeholder="选择日期" v-model="formItem.date"></Date-picker>
                    <Time-picker type="time" placeholder="选择时间" v-model="formItem.time"></Time-picker>
        </Form-item> -->
        <Form-item label="单选框">
            <Radio-group v-model="formItem.sex">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
            </Radio-group>
        </Form-item>
        <!-- <Form-item label="多选框">
            <Checkbox-group v-model="formItem.checkbox">
                <Checkbox label="吃饭"></Checkbox>
                <Checkbox label="睡觉"></Checkbox>
                <Checkbox label="跑步"></Checkbox>
                <Checkbox label="看电影"></Checkbox>
            </Checkbox-group>
        </Form-item> -->
        <Form-item label="禁用">
            <iSwitch v-model="formItem.switch" size="large">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </iSwitch>
        </Form-item>
        <!-- <Form-item label="滑块">
            <Slider v-model="formItem.slider" range></Slider>
        </Form-item>
        <Form-item label="文本域">
            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item> -->
        <Form-item>
            <Button type="primary" @click="saveUser('formItem')">提交</Button>
            <Button type="ghost" style="margin-left: 8px">取消</Button>
        </Form-item>
    </Form>

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
import {getUserList,getRoleList,getUserById,addUser,delUserById} from 'api/user';
import {getOrganizeList} from 'api/organize';
import Cookies from 'js-cookie';

    export default {
        data () {
            var this_i = this;
            var checkEmail = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error('手机号不能为空'));
                }else {
                    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                    console.log(reg.test(value));
                    if (reg.test(value)) {
                       callback();
                    } else {
                       return callback(new Error('请输入正确的手机号'));
                    }
              }
            }
            return {
                 deptlist:[],//部门集合
                 dutylist:[],//岗位集合
                 companylist:[],//公司集合
                 spinShow:true,//设置是够显示spin加载中
                 totalCount:0,
                 currentPage:1,//当前页码
                 isEditOrAdd:0,//新增还是编辑
                 roles:['管理员','普通用户'],
                 formItem: {
                    id:0,
                    email:'',
                    username: '',
                    name:'',
                    select: '',
                    role:'',
                    sex: '1',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                },
                 formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
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
                 formLeft: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
                formRight: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
                formTop: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
                formValidate: {
                    name: '111',
                    mail: '',
                    city: '',
                    gender: '',
                    interest: [],
                    date: '',
                    time: '',
                    desc: ''
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
                            return h('div',[h('strong',params.row.sex)])
                        },
                    },
                     {
                        title: '部门',
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong', params.row.name)
                               ]);
                        },
                       
                    }, 
                     {
                        title: '岗位',
                         render: (h, params) => {
                             console.log(params.row.name)
                             console.log(this_i.dutylist)
                             return h('div', [
                                 h('strong', this_i.dutylist[params.row.F_RoleId].F_FullName)
                               ]);
                        },
                       
                    }, 
                     {
                        title: '创建时间',
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong', params.row.name)
                               ]);
                        },
                       
                    }, 
                     {
                        title: '允许登录',
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong', params.row.name)
                               ]);
                        },
                       
                    }, 
                    {
                        title: '备注',
                         render: (h, params) => {
                             
                             return h('div', [
                                 h('strong', params.row.name)
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
                                              //根据Id获取对应的人员详细信息
                                              this_i.readPersonInformation(params.row.id);
                                        }
                                    }
                                }, '查看'),
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
            //获取用户列表
            getUserList(1,10).then(response=>{
                this.spinShow = false;
                var jsonData = response.data.Items;
                this.setPersonInformation(jsonData,response.data.Count)
                //获取部门集合
               
                //获取岗位集合
                getOrganizeList().then(response=>{
                    this.dutylist= response.data;
                })
               // alert(this.video_result)
            });
        },
        mounted(){
            const vue=this;
            var id=this.$route.params.id;
            let video_list=null;
        },
        methods:{
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
              this.isEditOrAdd = 0;
              this.modal1 = true;
               getRoleList().then(response=>{
                  var jsonData = response.data;
                  if(jsonData!=null&&jsonData!=undefined){
                      this.roles = jsonData;
                  }
              })
              getUserById(id).then(response=>{
                    var jsonData = response.data;
                    if(jsonData!=null&&jsonData!=""){
                       this.formItem.name = jsonData.Name;
                       this.formItem.username = jsonData.UserName;
                       this.formItem.email = jsonData.Email; 
                       this.formItem.switch=jsonData.Enable==0?false:true;
                       this.formItem.sex = String(jsonData.Sex);
                    }
                })
          },
          //新增用户
          addUser(){
              this.isEditOrAdd = 1;
              this.modal1 = true
              getRoleList().then(response=>{
                  var jsonData = response.data;
                  if(jsonData!=null&&jsonData!=undefined){
                      this.roles = jsonData;
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
          //保存用户
          saveUser(name){
              this.$refs[name].validate((valid) => {
                if (valid) {
                    var Email = this.formItem.email;
                    var Enable = this.formItem.switch==true?1:0
                    var Sex = this.formItem.sex;
                    var UserName = this.formItem.username;
                    var RoleId = this.formItem.role;
                    var Name = this.formItem.name;
                    if(this.isEditOrAdd==1)//新增
                      addUser(Email,Enable,Sex,UserName,RoleId,Name).then(response=>{
                        var result = response.data;
                        if(result=="ok"){
                           this.$Message.success("保存成功！");
                           this.modal1 = false;
                           //重新获取数据
                           this.setInitPage(this.currentPage)
                        }else
                           this.$Message.error("保存失败！");
                       })
                    else {//编辑

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