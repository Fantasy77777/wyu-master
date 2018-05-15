/* users相关路由
 * 采用 restful api 风格
 */

var express = require('express');
var router = express.Router();
var indexRouter = {};
var customerController = require('../../../controllers/customer');


//返回user的集合
router.get('/', customerController.find);


indexRouter.router = router;

module.exports = indexRouter;

