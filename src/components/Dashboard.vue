<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><h2 style="font-size: 18px;margin-top: 10px;margin-left: 5px;">首页---广告推荐</h2></el-breadcrumb-item>
        <span id="time"></span>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <section class="chart-container">
        <el-row>
          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="/static/img/图书馆.jpg" class="image">
              <div style="padding: 14px;">
                <span>五邑大学图书馆</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="/static/img/游泳池.jpg" class="image">
              <div style="padding: 14px;">
                <span>五邑大学游泳池</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img src="/static/img/东湖公园.jpg" class="image">
              <div style="padding: 14px;">
                <span>邑大旁东湖公园</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="22">
            <div id="chartLine" style="width:100%; height:400px;"></div>
          </el-col>
        </el-row>
      </section>

    </el-col>
  </el-row>
</template>
<style>
  #time {
    float: right;
    margin-right: 100px;
    margin-top: 10px;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .image {
    width: 100%;
    height: 260px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .chart-container {
    width: 100%;
  }

  .chart-container .el-col {
    padding: 30px 20px;
  }

  .warp-breadcrum {
    background: #f9fafc;
    margin-top: 0;
    height: 50px;
    border-bottom: 1px solid #e8e8e8;
  }
</style>

<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        currentDate: new Date(),
        chartLine: null,
      };
    },
    methods: {
      getTime() {
        var date = new Date();
        var year = date.getFullYear();//年
        var month = date.getMonth() + 1;//月0-11故+1
        var days = date.getDate();//日
        var day = date.getDay();  //星期
        var weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var week = weeks[day]; // 获取星期
        var hours = date.getHours();//时
        var minutes = date.getMinutes();//分
        var seconds = date.getSeconds(); //秒

        if (month < 10) {
          month = '0' + month;
        }
        if (days < 10) {
          days = '0' + days;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        document.getElementById("time").innerHTML = '时间：' + year + '年' + month + '月' + days + '日' + '&nbsp' + week ;
//        setTimeout(getTime, 1000);//每秒刷新一次
      }
    },
    mounted: function () {
       this.getTime()
      var _this = this;
      //基于准备好的dom，初始化echarts实例
      this.chartLine = echarts.init(document.getElementById('chartLine'));


      this.chartLine.setOption({
        title: {
          text: 'Line Chart'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['主菜', '饮料', '收入']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '主菜',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '饮料',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '收入',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });
    }
  }
</script>
