<template>
  <div>
    <!-- 收银台 -->
    <div class="pos">
      <el-row>
        <el-col :span="8" class="pos-order" height="600">
          <el-tabs v-model="activeName">
            <el-tab-pane label="您的菜单记录" name="orderIng" height="600px">
              <el-table :data="tableData" border>
                <el-table-column prop="goodsName" header-align="center" align="center" label="商品名称"></el-table-column>
                <el-table-column prop="count" header-align="center" align="center" label="数量" width="70"></el-table-column>
                <el-table-column prop="price" header-align="center" align="center" label="金额" width="70"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="foot-statistical">
            <span><small>数量：</small></span>
            <span><small>金额：</small>元</span>
          </div>
          <div class="foot-btn">
            <el-button type="danger" @click="delAllGoods">删除</el-button>
            <el-button type="success" @click="checkout">结账</el-button>
          </div>
        </el-col>
        <el-col :span="14" style="margin-left: 30px;">
          <div class="often-goods">
            <div class="title">日常推荐</div>
            <div class="often-goods-list">
              <ul>
                <li v-for="goods in oftenGoods" @click="addOrderList(goods)">
                  <span>{{goods.goodsName}}</span>
                  <span class="o-price">￥{{goods.price}}元</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-type">
            <el-tabs>
              <el-tab-pane label="菜单">
                <ul class='cookList'>
                  <li v-for="goods in type0Goods" @click="addOrderList(goods)">
                    <span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
                    <div class="food-content">
                      <span class="foodName">{{goods.goodsName}}</span>
                      <span class="foodPrice">￥{{goods.price}}元</span>
                    </div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="饮料">
                <ul class='cookList'>
                  <li v-for="goods in type1Goods" @click="addOrderList(goods)">
                    <span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
                    <div class="food-content">
                      <span class="foodName">{{goods.goodsName}}</span>
                      <span class="foodPrice">￥{{goods.price}}元</span>
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
  export default ({
//    el: '#app',
    data: function () {
      return {
        activeName: 'orderIng',
        tableData: [],
        oftenGoods: [],
        type0Goods: [],
        type1Goods: [],
        totalCount: 0,
        totalMoney: 0
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
          if (this.tableData[i].goodsId == goods.goodsId) {
            isHave = true;
          }
        }
        // 根据判断的值写业务逻辑
        if (isHave) {
          // 改变列表中的商品数量
          // 通过filter过滤tableData
          let arr = this.tableData.filter(o => o.goodsId == goods.goodsId);
          arr[0].count++;
        } else {
          // 构造一个newGoods
          let newGoods = {goodsId: goods.goodsId, goodsName: goods.goodsName, price: goods.price, count: 1}
          this.tableData.push(newGoods);
        }
        this.getAllMoney();
      },
      // 删除单个商品
      delSingleGoods(goods) {
        // console.log(goods);
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
        }
      },
      // 结账
      checkout() {
        if (this.totalCount != 0) {
          this.tableData = [];
          this.totalCount = 0;
          this.totalMoney = 0;
          this.$alert('<div class="qr-code"><img src="images/code.png"><p>你也可以扫码结账!@^_^@</p></div>', '结账成功,觉得OK就打赏一下', {
            dangerouslyUseHTMLString: true
          });
        } else {
          this.$message.error('请点菜噢！');
        }
      }
    },
//    created() {
//      // 抓取常用商品
//      axios.get('json/hotGoods.json')
//        .then(response => {
//          console.log(response);
//          this.oftenGoods = response.data;
//
//        })
//        .catch(error => {
//          console.log(error);
//          alert('请在服务器环境下运行或本地使用火狐浏览器打开');
//        })
//
//      // 抓取商品分类
//      axios.get('json/inGoods.json')
//        .then(response => {
//          console.log(response);
//          // this.oftenGoods=response.data;
//          this.type0Goods = response.data[0];
//          this.type1Goods = response.data[1];
//          this.type2Goods = response.data[2];
//          this.type3Goods = response.data[3];
//        })
//        .catch(error => {
//          console.log(error);
//          alert('请在服务器环境下运行或本地使用火狐浏览器打开');
//        })
//    }
  })
</script>

<style>
  .content-container {
    padding: 0px !important;
  }
</style>
