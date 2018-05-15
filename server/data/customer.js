// const Mock = require('mockjs');
//
// const Books = [];
// for (let i = 0; i < 100; i++) {
//   Books.push(Mock.mock({
//     id: Mock.Random.guid(),
//     name: Mock.Random.ctitle(2, 12),
//     author: Mock.Random.cname(),
//     description: Mock.Random.csentence(180, 500),
//     publishAt: Mock.Random.date()
//   }))
// }
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


//表结构你先定义好
var customerSchema = new Schema({ // 表结构
  _id: {
    type: String
  },
  name: {
    type: String
  },
  food_type: {
    type: String
  },
  price: {
    type: String
  },
  publishAt: {
    type: String
  },
  food_img: {
    type: String
  }
});

//表名字要修改
const customerModel = mongoose.model("book_data", customerSchema, 'book_data');


module.exports = customerModel;
