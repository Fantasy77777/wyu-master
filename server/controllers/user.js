/**
 * users 控制器
 */
const Mock = require('mockjs');
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
  let userForm = req.body;
  let condition = {
    username: userForm.username
  };
  // console.log(JSON.stringify(req.body));
  UserModel.findOne(condition, function (err, user) {
    if (err) {
      return res.json({"errcode": 40003, "errmsg": "用户不存在"});
    }
    if (!user) {
      return res.json({"errcode": 40003, "errmsg": "用户不存在"});
    }
    if (user.password !== userForm.oldPsw) {
      return res.json({"errcode": 40004, "errmsg": "原密码错误"});
    } else {
      let options = {
        $set:
          {
            password: userForm.newPsw,
          }
      };
      UserModel.updateOne(condition, options, function (err, doc) {
        if (err) {
          res.json({"errcode": 40009, "errmsg": "处理失败"});
        } else {
          res.json({"errcode": 0, "errmsg": "修改成功"});
        }
      });
    }
  });
  /*let options = {
    $set:
      {
        password: user.newPsw,
      }
  };
  UserModel.updateOne(condition, options, function (err, doc) {
    if (err) {
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    } else {
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  });*/
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

userController.delOneUser = function (req, res) {
  let username = req.params.id;
  console.log('@' + username);
  UserModel.deleteOne({'username': username}, function (err) {
    if (err) {
      console.info(err);
    } else {
      console.info('删除成功');
      res.json({"errcode": 0, "errmsg": "成功"});
    }
  });
};


userController.add = function (req, res) {

  let user = ({
    id: Mock.Random.id(),
    username: req.body.username,
    name: req.body.name,
    password: req.body.pwd,
    phone: req.body.phone,
    email: req.body.email,
    nickname: req.body.nickname,
    sex: req.body.sex,
    addr: req.body.addr
  });

  UserModel.findOne({username: user.username}, function (err, u) {

    if (u) {
      res.json({"errcode": 40009, "errmsg": "账号已存在！"});
    } else {


      UserModel.findOneAndUpdate({_id: guid()}, user, {upsert: true}, function (err) {
          if (err) {
            console.info(err);
          } else {
            console.info('新增成功');
            res.json({"errcode": 0, "errmsg": "成功"});
          }
        }
      );


    }
  });

};

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = userController;
