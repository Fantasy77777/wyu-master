<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum" :loading="loading">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="profileForm">
        <el-form-item label="账号">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="form.nickname" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveProfile(form)">修改并保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_user';
  import {bus} from '../../bus.js'

  export default {
    data() {
      return {
        loading: false,
        form: {
          username: '',
          nickname: '',
          name: '',
          phone: '',
          email: ''
        },
        rules: {
          nickname: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入电话', trigger: 'blur'},
            {pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,message: '号码格式不正确' , trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
        },
      }
    },
    methods: {
      handleSaveProfile(form) {
        let that = this;
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.loading = true;
            API.changeProfile(form).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                // 修改成功
                let user = JSON.parse(window.localStorage.getItem('access-user'));
                user.nickname = that.form.nickname;
                user.name = that.form.name;
                user.email = that.form.email;
                user.phone = that.form.phone;
                localStorage.setItem('access-user', JSON.stringify(user));
                bus.$emit('setNickName', that.form.nickname);
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
              } else {
                that.$message.error({showClose: true, message: result.errmsg, duration: 2000});
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
      }
    },
    mounted() {
      let user = localStorage.getItem('access-user');
      if (user) {
        console.log(JSON.stringify(user));
        user = JSON.parse(user);
        this.form.username = user.username;
        this.form.nickname = user.nickname || '';
        this.form.email = user.email || '';
        this.form.name = user.name || '';
        this.form.phone = user.phone || '';
      }
    }
  }
</script>
<style>
  .profileForm input {
    width: 75%;
  }
</style>
