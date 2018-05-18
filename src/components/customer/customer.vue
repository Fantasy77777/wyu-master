<template>
  <div>
    <div class="pos">
      <el-row>
        <el-col :span="9" class="pos-order">
          <el-tabs v-model="activeName">
            <el-tab-pane label="您的菜单记录" name="orderIng" height="600px">
              <el-table :data="tableData" border height="400px">
                <el-table-column prop="goodsName" header-align="center" align="center" label="商品名称"></el-table-column>
                <el-table-column prop="count" header-align="center" align="center" label="数量"
                                 width="70"></el-table-column>
                <el-table-column prop="price" header-align="center" align="center" label="金额"
                                 width="100"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center" width="150" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                    <el-button type="text" size="small" @click="reduceGoodsCount(scope.row)">减少</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="foot-statistical">
            <span style="margin-left: 20px;margin-right: 50px;"><small>总数量：{{totalCount}}</small></span>
            <span><small>总金额：{{totalMoney}}</small>元</span>
          </div>
          <div class="foot-btn" style="margin-left: 100px;">
            <el-button type="danger" @click="delAllGoods">删除</el-button>
            <el-button type="success" @click="checkout">结账</el-button>
          </div>
        </el-col>
        <el-col :span="14" style="margin-left: 30px;">
          <div class="often-goods">
            <div class="title">日常推荐</div>
            <div class="often-goods-list">
              <ul>
                <!--<li v-for="goods in oftenGoods" @click="addOrderList(goods)">-->
                <li v-for="goods in oftenGoods">
                  <span>{{goods.name}}</span>
                  <span class="o-price">￥{{goods.price}}元</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-type">
            <el-tabs @tab-click="handleClick">
              <el-tab-pane label="主菜">
                <ul class='cookList'>
                  <li v-for="food in foodsWithType" @click="addOrderList(food)">
                    <span class="foodImg"><img :src="food.food_img" width="80"></span>
                    <div class="food-content">
                      <span class="foodName">{{food.name}}</span>
                      <span class="foodPrice">￥{{food.price}}元</span>
                    </div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="饮料">
                <ul class='cookList'>
                  <li v-for="food in foodsWithType" @click="addOrderList(food)">
                    <span class="foodImg"><img :src="food.food_img" width="80"></span>
                    <div class="food-content">
                      <span class="foodName">{{food.name}}</span>
                      <span class="foodPrice">￥{{food.price}}元</span>
                    </div>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import API from '../../api/api_customer';

  export default ({
//    el: '#app',
    data: function () {
      return {
        activeName: 'orderIng',
        tableData: [],
        oftenGoods: [],
        type0Goods: [],
        type1Goods: [],
        foodsWithType: [],
        totalCount: 0,
        totalMoney: 0,
      }
    },
    methods: {
      // 点击右边商品，添加到左边
      addOrderList(goods) {
        // 每次添加都清零，防止重复添加
        this.totalCount = 0;
        this.totalMoney = 0;
        // 定义isHave判断这个商品是否已经存在于订单列表
        let isHave = false;
        // tableData循环
        for (let i = 0; i < this.tableData.length; i++) {
          // console.log(this.tableData[i].goodsId);
          if (this.tableData[i].goodsId == goods._id || this.tableData[i].goodsId == goods.goodsId) {
            isHave = true;
          }
        }
        // 根据判断的值写业务逻辑
        if (isHave) {
          // 改变列表中的商品数量
          // 通过filter过滤tableData
//          let arr = this.tableData.filter(o => o._id == goods._id);
//          arr[0].count++;
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].goodsId == goods.goodsId || this.tableData[i].goodsId == goods._id) {
              this.tableData[i].count++;
            }
          }


        } else {
          // 构造一个newGoods
          let newGoods = {goodsId: goods._id, goodsName: goods.name, price: goods.price, count: 1};
          this.tableData.push(newGoods);
        }
        this.getAllMoney();
      },
      reduceGoodsCount(good) {
        this.tableData.forEach(o => {
          if (o.goodsId == good.goodsId && o.count > 1) {
            o.count--;
            this.getAllMoney();
          }
        });
      },
      // 删除单个商品
      delSingleGoods(goods) {
//         console.log(goods);
        this.tableData = this.tableData.filter(o => o.goodsId != goods.goodsId);
        this.getAllMoney();
      },
      // 删除所有商品
      delAllGoods() {
        this.tableData = [];
        this.totalCount = 0;
        this.totalMoney = 0;
      },
      // 因为删除，增加后都要重新汇总，所以汇总方法要复用
      getAllMoney() {
        this.totalCount = 0;
        this.totalMoney = 0;
        // 订单列表有数据的时候才进行汇总
        if (this.tableData) {
          // 进行数量和价格的汇总计算
          // element表示tableData中的单个元素
          this.tableData.forEach((element) => {
            this.totalCount += element.count;
            this.totalMoney = this.totalMoney + (element.price * element.count);
          });

          this.totalCount = this.tableData.length;
        }
      },
      // 结账
      checkout() {
        if (this.totalCount != 0) {
          this.tableData = [];
          this.totalCount = 0;
          this.totalMoney = 0;
          this.$alert('<div class="qr-code"><img src="/static/img/二维码.png "></div>', '扫描二维码结账', {
            dangerouslyUseHTMLString: true
          });
        } else {
          this.$message.error('亲，请点菜噢！');
        }
      },

      getFoodByType(type) {
        let that = this;
        let params = {
          food_type: type
        };

        API.getFoodByType(params).then(function (result) {

          if (result && result.books) {
            that.foodsWithType = result.books;
          } else {

          }
        }, function (err) {
        }).catch(function (error) {
          console.log(error);
        });
      },

      handleClick(tab, event) {
//        console.log(tab.index);
        let index = tab.index;
        if (index == 0) {
          //获取主菜

          this.getFoodByType('主菜');

        } else if (index == 1) {
          //获取饮品
          this.getFoodByType('饮品');
        }

      },

      getOftenGoods() {
        let that = this;
        let params = {
          food_type: '推荐'
        };

        API.getFoodByType(params).then(function (result) {

          if (result && result.books) {
            that.oftenGoods = result.books;
          } else {

          }
        }, function (err) {
        }).catch(function (error) {
          console.log(error);
        });
      }

    },
    mounted() {
      this.getFoodByType('主菜');
      this.getOftenGoods();
    }
  })
</script>

<style>
  .content-container {
    padding: 0px !important;
  }

  body {
    font-family: "微软雅黑", arial;
    margin: 0;
    padding: 0;
    background: #FFF;
    font-size: 12px;
    color: #000;
  }

  div, form, img, ul, ol, li, dl, dt, dd {
    margin: 0;
    padding: 0;
    border: 0;
  }

  li {
    list-style-type: none;
  }

  img {
    vertical-align: top;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-size: 12px;
    font-weight: normal;
  }

  a:link {
    color: #1f3a87;
    text-decoration: none;
  }

  a:visited {
    color: #83006f;
    text-decoration: none;
  }

  a:hover {
    color: #bc2931;
    text-decoration: underline;
  }

  a:active {
    color: #bc2931;
  }

  /*body,html,#app{*/
  /*width: 100%;*/
  /*height: 100%;*/
  /*}*/
  .left-nav {
    color: #FFF;
    font-size: 12px;
    height: 100%;
    background: #1d8ce0;
    float: left;
    width: 60px;
  }

  .left-nav li {
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid #e7e7e7;
    transition: all .5s;
  }

  .left-nav li:hover {
    background: #F90
  }

  .left-nav li.active {
    background: #F90
  }

  .icon {
    font-size: 36px;
    display: block
  }

  .pos {
    position: absolute;
    top: 0;
    right: 0;
    left: 60px;
    bottom: 0;
    margin-left: 140px;
  }

  .pos .el-row,
  .pos .el-col {
    height: 100%;
  }

  .pos-order {
    padding: 10px;
    background: #fbfcff;
    border-right: 1px solid #e7e7e7
  }

  .goods-type {
    padding: 10px
  }

  .foot-statistical {
    padding: 10px;
    text-align: center;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-top: none;
  }

  .foot-statistical span {
    margin: 0 10px;
    font-size: 16px
  }

  .foot-statistical span small {
    font-size: 18px
  }

  .foot-btn {
    padding: 10px;
    text-align: center
  }

  .foot-btn button {
    margin-right: 20px;
  }

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    border-bottom: 1px solid #D3DCE6;
    background-color: #F9FAFC;
    padding: 10px;
  }

  .often-goods-list {
    padding: 10px;
    overflow: hidden
  }

  .often-goods-list ul li {
    list-style: none;
    float: left;
    border: 1px solid #E5E9F2;
    padding: 10px;
    margin: 5px;
    background-color: #fff;
    cursor: pointer
  }

  .o-price {
    color: #58B7FF;
  }

  .cookList li {
    list-style: none;
    width: 100%;
    border: 1px solid #E5E9F2;
    height: auto;
    overflow: hidden;
    background-color: #fff;
    padding: 2px;
    float: left;
    margin: 2px;
    cursor: pointer;
  }

  .cookList li span {
    display: block;
    float: left;
  }

  .foodImg {
    width: 40%;
  }

  .food-content {
    float: left;
  }

  .food-content span {
    display: block;
    width: 100%;
  }

  .foodName {
    font-size: 16px;
    padding-left: 10px;
    color: brown;
  }

  .foodPrice {
    font-size: 16px;
    padding-left: 10px;
    padding-top: 10px;
  }

  .qr-code {
    text-align: center
  }
</style>
