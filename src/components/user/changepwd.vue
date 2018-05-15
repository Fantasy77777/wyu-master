<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="18" class="warp-main">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="原密码">
          <el-input v-model="form.oldPsw"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.newPsw"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="form.confirmPsw"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleChangePsw(form)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import API from '../../api/api_user';
  import {bus} from '../../bus.js';

  export default {
    data() {
      return {
        form: {
          username: '',
          oldPsw: '',
          newPsw: '',
          confirmPsw: ''
        }
      }
    },
    methods: {
      handleChangePsw(form) {
        let that = this;
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.loading = true;
//            console.info(form);
            if(form.newPsw!==form.confirmPsw){
              that.$message.error({showClose: true, message: '两次密码不同', duration: 2000});
              return;
            }
            API.changePsw(form).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                //修改成功
                let user = JSON.parse(window.localStorage.getItem('access-user'));
                user.password = that.form.newPsw;
//                localStorage.setItem('access-user', JSON.stringify(user));
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
        user = JSON.parse(user);
        this.form.username = user.username;
      }
      /*let user = localStorage.getItem('access-user');
      if (user) {
        console.log(JSON.stringify(user));
        user = JSON.parse(user);
        this.psw = user.password;
      }*/
    }
  }
</script>
