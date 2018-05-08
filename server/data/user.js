var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({ // 表结构
  _id: {
    type: String
  },
  id: {
    type: Number
  },
  username: {
    type: String
  },
  name: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  nickname: {
    type: String
  },
  sex: {
    type: String
  },
  addr: {
    type: String
  }
});


const UserModel = mongoose.model("User_data", userSchema, 'User_data');

module.exports = UserModel;
