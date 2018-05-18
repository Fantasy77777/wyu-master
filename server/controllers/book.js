const Mock = require('mockjs');
const bookModel = require('../data/book');
let bookController = {};
let _Books = bookModel;

/**
 * 通过菜名/分类查询，获取列表
 * @param req
 * @param res
 */
bookController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let name = req.query.name || '';
  let total = 0;
  let rltBooks = [];
  bookModel.count({}, (err, count) => {
    if (count) {
      this.total = count;
    }
  });
  let queryOption = null;
  if (name.length > 0) {
    queryOption = [
      {name: {$regex: name}},
      {food_type: {$regex: name}}
    ];
  }
  _Books.find(queryOption ? {$or: queryOption} : queryOption, (err, data) => {
    if (data) {
      // total = data.length;
      rltBooks = rltBooks.concat(data);
    }
    res.json({
      total: this.total,
      limit: limit,
      books: rltBooks
    })

  }).limit(limit).skip((page - 1) * limit);

};
// bookController.find = function (req, res) {
//   let page = parseInt(req.query.page || 1); //页码（默认第1页）
//   let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
//   let name = req.query.name || ''; //
//   let total = 0;
//   let rltBooks = [];
//   if (name.length > 0) {
//     let mockBooks = _Books.filter(book => {
//       return book.name.indexOf(name) > -1;
//     });
//     total = mockBooks.length; //总条数
//     rltBooks = mockBooks.filter((u, index) => index < limit * page && index >= limit * (page - 1))
//   } else {
//     total = _Books.length; //总条数
//     rltBooks = _Books.filter((u, index) => index < limit * page && index >= limit * (page - 1))
//   }
//   res.json({
//     total: total,
//     limit: limit,
//     books: rltBooks
//   })
// };

/**
 * 通过id获取
 * @param req
 * @param res
 */
bookController.findById = function (req, res) {
  let id = _.trim(req.params.id || '');
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  let book = _.find(_Books, function (b) {
    return b.id === id;
  });
  res.json(book || null)
};

/**
 * 添加一条信息
 * @param req
 * @param res
 */
bookController.create = function (req, res) {
  /*let name = req.body.name;
  let food_type = req.body.food_type;
  let price = req.body.price;
  let publishAt = req.body.publishAt;*/
  /*let conditions = ({
    name: req.body.name,
    food_type: req.body.food_type,
    price: req.body.price,
    publishAt: req.body.publishAt,
    food_img: req.body.img,
  });*/
  let conditions = req.body;
  //console.log(conditions);
  bookModel.findOneAndUpdate({_id: Mock.Random.guid()}, conditions, {upsert: true}, function (err) {
    if (err) {
      console.info(err);
    } else {
      console.info('新增成功');
      res.json({"errcode": 0, "errmsg": "成功"});
    }
  });
  //_Books.push(req.body);
  /*_Books.push({
    id: Mock.Random.guid(),
    name: name,
    author: author,
    description: description,
    publishAt: publishAt
  });*/
  // res.json({"errcode": 0, "errmsg": "新增成功"})
};

/***
 * 更新一条记录
 * @param req
 * @param res
 */
bookController.update = function (req, res) {
  /* let id = _.trim(req.params.id || '');
   if (!id) {
     return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
   }
   let name = req.body.name;
   let author = req.body.author;
   let description = req.body.description;
   let publishAt = req.body.publishAt;

   let i = _.findIndex(_Books, function (u) {
     return u.id === id
   })
   if (i > -1) {
     _Books[i].name = name;
     _Books[i].author = author;
     _Books[i].description = description;
     _Books[i].publishAt = publishAt;
     res.json({"errcode": 0, "errmsg": "修改成功"});
   } else {
     res.json({"errcode": 40009, "errmsg": "处理失败"});
   }*/

  let _id = req.params.id;
  let book = req.body;

  let conditions = {
    _id: _id
  };

  console.log("_id" + _id + "&book=" + JSON.stringify(book));

  bookModel.findOneAndUpdate(conditions, book, function (err) {
    if (err) {

    } else {
      res.json({"errcode": 0, "errmsg": "成功"});
    }
  })

};

/**
 * 更新一条记录的部分信息
 * @param req
 * @param res
 */
bookController.patch = function (req, res) {

};

/**
 * 批量删除
 * @param req
 * @param res
 */
bookController.deleteBatch = function (req, res) {
  let ids = req.params.ids;
  ids = ids.split(',');
  _Books = _Books.filter(b => !ids.includes(b.id))
  res.json({"errcode": 0, "errmsg": "删除成功"});
};

/**
 * 单条删除
 * @param req
 * @param res
 */
bookController.delete = function (req, res) {
  // let id = _.trim(req.params.id || '');
  let _id = req.params.id;

  // console.log("id=" + _id);

  bookModel.deleteOne({'_id': _id}, function (err) {
    if (err) {
      console.info(err);
    } else {
      console.info('删除成功');
      res.json({"errcode": 0, "errmsg": "成功"});
    }
  });

};

module.exports = bookController;
