import * as API from './'

export default {
  //登录
  login: params => {
    return API.POST('/api/v1/users/login', params)
  },
  //登出
  logout: params => {
    return API.GET('/api/v1/users/logout', params)
  },
  //修改个人信息
  changeProfile: params => {
    return API.PATCH('/api/v1/users/profile', params)
  },
  // 修改密码
  changePsw: params => {
    return API.PATCH('/api/v1/users/changepwd', params)
  },

  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/users', params)
  },
  //删除一条管理员记录
  delOneUser: id => {
    return API.DELETE(`/api/v1/users/${id}`)
  },
  //新增一条数据
  add: params => {
    return API.POST('/api/v1/users', params)
  }

}
