<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator=" / ">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>员工列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="账号/姓名/昵称/性别/电话" style="min-width: 240px;"
                      @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog()">新增</el-button>
          </el-form-item>
        </el-form>

        <!--新增界面-->
        <el-dialog title="新增员工" style="user-select: none" :visible.sync="addFormVisible" :close-on-click-modal="false">
          <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
            <el-form-item label="员工账号" prop="username">
              <el-input v-model="addForm.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="员工密码" prop="pwd">
              <el-input v-model="addForm.pwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              <el-input v-model="addForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <!--<el-input v-model="addForm.nickname" auto-complete="off"></el-input>-->
              <el-select v-model="addForm.nickname" placeholder="请选择">
                <el-option
                  v-for="item in nicknameChoice"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <!--<el-input v-model="addForm.sex" auto-complete="off"></el-input>-->
              <el-select v-model="addForm.sex" placeholder="请选择">
                <el-option
                  v-for="item in sexChoice"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="addForm.phone" auto-complete="off" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="addr">
              <el-input v-model="addForm.addr" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
          </div>
        </el-dialog>

      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row stripe border v-loading="loading" style="width: 100%;">
        <el-table-column type="index" width="60" fixed header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="username" header-align="center" align="center" label="账号" width="150" sortable>
        </el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="姓名" width="150" sortable>
        </el-table-column>
        <el-table-column prop="nickname" header-align="center" align="center" label="昵称" width="160" sortable>
        </el-table-column>
        <el-table-column prop="sex" header-align="center" align="center" label="性别" width="100" sortable>
        </el-table-column>
        <el-table-column prop="phone" header-align="center" align="center" label="电话" width="150" sortable>
        </el-table-column>
        <el-table-column prop="email" header-align="center" align="center" label="邮箱" min-width="200" sortable>
        </el-table-column>
        <el-table-column prop="addr" header-align="center" align="center" label="地址" min-width="200" sortable>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="120">
          <template slot-scope="scope">
            <!--<el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>-->
            <el-button type="danger" @click="delUser(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_user';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        sexChoice: [
          {
            value: '男',
            label: '男'
          },
          {
            value: '女',
            label: '女'
          }],
        nicknameChoice: [
          {
            value: '超级管理员',
            label: '超级管理员'
          },
          {
            value: '普通管理员',
            label: '普通管理员'
          }
        ],
        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          username: [
            {required: true, message: '请输入员工账号', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入员工密码', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请选择昵称', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {type: 'number'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
          addr: [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ]
        },
        addForm: {
          name: '',
          nickname: '',
          sex: '',
          phone: '',
          email: '',
          addr: ''
        },
        loading: false,
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch() {
        this.total = 0;
        this.page = 1;
        this.search();
      },
      //获取用户列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name,
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.users) {
            that.total = result.total;
            that.users = result.users;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          food_type: '',
          publishAt: '',
          description: ''
        };
      },
      //新增
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let para = Object.assign({}, this.addForm);
            para.publishAt = (!para.publishAt || para.publishAt === '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
            API.add(para).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                that.$message.success({showClose: true, message: '新增成功', duration: 2000});
                that.$refs['addForm'].resetFields();
                that.addFormVisible = false;
                that.search();
              } else {
                that.$message.error({showClose: true, message: '修改失败', duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });

          }
        });
      },
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style scoped>
  .warp {
    padding-left: 5px;
  }

  .warp-breadcrum {
    padding-left: 10px;
  }
</style>
