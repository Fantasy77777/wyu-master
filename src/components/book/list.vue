<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜式列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="菜名/分类" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog()">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="books" height="400" highlight-current-row stripe border @selection-change="selsChange"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="80" align="center"></el-table-column>-->
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column prop="name" label="菜名" header-align="center" align="center" sortable
                         width="200"></el-table-column>
        <el-table-column prop="food_type" label="分类" header-align="center" align="center" width="100"
                         sortable></el-table-column>
        <el-table-column prop="food_img" label="参考图" header-align="center" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.food_img" :title="this.name" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" header-align="center" align="center" width="120"
                         sortable></el-table-column>
        <el-table-column prop="publishAt" label="添加日期" header-align="center" align="center" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.row.id)" size="small">删除</el-button>
            <!--<el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <!--<el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>-->
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="菜名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="food_type">
            <!--<el-input v-model="editForm.food_type" auto-complete="off"></el-input>-->
            <el-select v-model="editForm.food_type" placeholder="请选择">
              <el-option
                v-for="item in typeChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <!--<el-input v-model="editForm.price" auto-complete="off"></el-input>-->
            <el-input-number v-model="editForm.price" controls-position="right" :min="1" :max="100"
                             auto-complete="off"></el-input-number>
          </el-form-item>
          <el-form-item label="参考图" prop="food_img">
            <!--<el-input v-model="editForm.food_img" auto-complete="off"></el-input>-->
            <template slot-scope="scope">
              <img :src="editForm.food_img" alt="" style="width: 50px;height: 50px">
            </template>
          </el-form-item>
          <el-form-item label="添加日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.publishAt"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增菜式" style="user-select: none" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="菜名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="food_type">
            <!--<el-input v-model="addForm.food_type" auto-complete="off"></el-input>-->
            <el-select v-model="addForm.food_type" placeholder="请选择">
              <el-option
                v-for="item in typeChoice"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <!--<el-input v-model="addForm.price" auto-complete="off"></el-input>-->
            <el-input-number v-model.number="addForm.price" controls-position="right" :min="1" :max="100"
                             auto-complete="off"></el-input-number>
          </el-form-item>
          <el-form-item label="参考图" prop="food_img">
            <!--<el-input v-model="editForm.food_img" auto-complete="off"></el-input>-->
            <el-upload
              ref="uploadImg"
              class="upload-demo"
              :action="upurl"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :show-file-list="true"
              :on-change="getFile"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="添加日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.publishAt"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import API from '../../api/api_book';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        typeChoice: [
          {
            value: '主菜',
            label: '主菜'
          },
          {
            value: '饮品',
            label: '饮品'
          },
          {
            value: '推荐',
            label: '推荐'
          }],
        books: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列
        upurl: '/api/v1/books',
        fileList: [],
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          name: [
            {required: true, message: '请输入菜名', trigger: 'blur'}
          ],
          food_type: [
            {required: true, message: '请输入分类', trigger: 'blur'}
          ]
        },
        editForm: {
          id: 0,
          name: '',
          food_type: '',
          publishAt: '',
          price:0
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入菜名', trigger: 'blur'}
          ],
          food_type: [
            {required: true, message: '请输入分类', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'},
            {type: 'number'}
          ]
        },
        addForm: {
          name: '',
          food_type: '',
          price: '',
          food_img: null,
          publishAt: ''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch() {
        this.total = 0;
        this.page = 1;
        this.search();
      },
      search() {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.books) {
            that.total = result.total;
            that.books = result.books;
            console.log("total=" + that.total);
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //删除
      delBook: function (uid) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          API.remove(uid).then(function (result) {
            that.loading = false;
            if (result && parseInt(result.errcode) === 0) {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        Object.assign(this.editForm, row);
      },
      //编辑
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let para = Object.assign({}, this.editForm);
            para.publishAt = (!para.publishAt || para.publishAt == '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
            API.update(para._id, para).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                that.$refs['editForm'].resetFields();
                that.editFormVisible = false;
                that.search();
              } else {
                that.$message.error({showClose: true, message: '修改失败', duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      },
      showAddDialog: function () {
        this.fileList = [];
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          food_type: '',
          price: '',
          food_img: null,
          publishAt: ''
        };
      },
      handlePreview(file) {
      },
      handleRemove() {
      },
      //新增
      getFile(file, fileList) {
        /* var reader = new FileReader();
         reader.readAsDataURL(file.raw);
         reader.onload = function (e) {
           let base64Code=this.result;
           //把得到的base64赋值到img标签显示
           this.TestImg=base64Code;
         }*/
        let that = this;
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function (e) {
          that.addForm.food_img = this.result;
        };
      },
      addSubmit: function () {
        let that = this;

        let para = Object.assign({}, this.addForm);
        para.publishAt = (!para.publishAt || para.publishAt === '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
        API.add(para).then(function (result) {
          that.loading = false;
          if (result && parseInt(result.errcode) === 0) {
            that.$message.success({showClose: true, message: '新增成功', duration: 2000});
            that.$refs['addForm'].resetFields();
            that.addFormVisible = false;
            that.search();

          } else {
            that.$message.error({showClose: true, message: '修改失败', duration: 2000});
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      //批量删除
      batchDeleteBook: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          API.removeBatch(ids).then(function (result) {
            that.loading = false;
            if (result && parseInt(result.errcode) === 0) {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }

  .warp-main {
    margin-left: 5px;
  }
</style>
