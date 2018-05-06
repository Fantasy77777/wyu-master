/**
 * users 控制器
 */
const UserModel = require('../data/user');
let userController = {};
let _Users = UserModel;

/**
 * 检查用户的登录状态
 * @param req
 * @param res
 * @param next
 */
userController.checkLogin = function (req, res, next) {
  //用户已经登录
  if (req.session.userId) {
    next();
  }
  else {
    res.json({"errcode": 40001, "errmsg": "您还没有登录"});
  }
};

/**
 * 登录
 * @param req
 * @param res
 */
userController.login = function (req, res) {
  let username = _.trim(req.query.username || req.body.username || '');
  let pwd = req.body.pwd;
  if (!username || !pwd) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }

  // 通过用户名获取到用户信息
  _Users.findOne({username: username}, function (err, user) {
    if (err) {
      return res.json({"errcode": 40003, "errmsg": "用户不存在"});
    }


    if (!user) {
      return res.json({"errcode": 40003, "errmsg": "用户不存在"});
    }
    if (user.password === pwd) {
      //设置session
      req.session.userId = user.id;

      return res.json({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        name: user.name,
        phone: user.phone,
        email: user.email
      });
    } else {
      return res.json({"errcode": 40004, "errmsg": "密码错误"});
    }


  });
};

/**
 * 退出登录
 * @param req
 * @param res
 */
userController.logout = function (req, res) {
  req.session.destroy();
  res.json({"errcode": 0, "errmsg": "退出完成"});
};

/**
 * 修改个人部分信息
 * @param req
 * @param res
 */
userController.profile = function (req, res) {
  let userProfile = req.body;
  let condition = {
    username: userProfile.username
  };
  let options = {
    $set:
      {
        name: userProfile.name,
        phone: userProfile.phone,
        email: userProfile.email,
        // sex: userProfile.sex
      }
  };

  UserModel.updateOne(condition, options, function (err, doc) {
    if (err) {
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    } else {
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  });
};

/**
 * 修改密码
 * @param req
 * @param res
 */
userController.changepwd = function (req, res) {
  //TODO 未开发
};

/**
 * 通过查询，获取对应列表
 * @param req
 * @param res
 */
userController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let name = req.query.name || '';
  let total = 0;
  let rltUsers = [];
  UserModel.count(null, (err, count) => {
    if (count) {
      this.total = count;
    }
  })

  let queryOption = null;
  if (name.length > 0) {
    queryOption = [
      {username: {$regex: name}},
      {nickname: {$regex: name}},
      {name: {$regex: name}},
      {phone: {$regex: name}},
      {email: {$regex: name}},
      {sex: {$regex: name}}];
  }

  _Users.find(queryOption ? {$or: queryOption} : queryOption, (err, data) => {
    if (data) {
      // total = data.length;
      rltUsers = rltUsers.concat(data);
    }

    res.json({
      total: total,
      limit: limit,
      users: rltUsers
    })

  }).limit(limit).skip((page - 1) * limit);

};

module.exports = userController;
