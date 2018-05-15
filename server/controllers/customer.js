/**
 * customer 控制器
 */
const Mock = require('mockjs');
const CustomerModel = require('../data/book');
let customerController = {};


/**
 * 通过查询，获取对应列表
 * @param req
 * @param res
 */
customerController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let foodType = req.query.food_type || '';
  let total = 0;
  let rltBooks = [];

  let queryOption = {
    food_type: foodType
  };

  CustomerModel.count(queryOption, (err, count) => {
    if (count) {
      this.total = count;
    }
  });

  CustomerModel.find(queryOption, (err, data) => {
    if (data) {
      // total = data.length;
      rltBooks = rltBooks.concat(data);
      res.json({
        total: total,
        limit: limit,
        books: rltBooks
      });
    }
  });
  // }).limit(limit).skip((page - 1) * limit);

};


module.exports = customerController;
