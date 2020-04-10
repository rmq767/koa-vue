<template>
  <div style="padding: 0 20px;">
    <el-table
      :data="tableData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()) || data.introduce.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column
        label="日期"
        prop="time">
      </el-table-column>
      <el-table-column
        label="标题"
        prop="title">
      </el-table-column>
      <el-table-column
        label="简介"
        prop="introduce">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="paginations.page_index"
      :page-sizes="paginations.page_sizes"
      :page-size="paginations.page_size"
      :layout="paginations.layout"
      :total="paginations.total">
    </el-pagination>

    <el-dialog title="修改文章" :visible.sync="dialogFormVisible">
      <el-form :model="articleForm" :rules="rules" ref="articleForm" label-width="80px">
        <el-form-item label="文章标题" prop='title'>
          <el-input v-model="articleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章简介" prop='introduce'>
          <el-input type="textarea" v-model="articleForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div class="edit_container">
            <mavon-editor
            v-model="articleForm.content"
            :ishljs="true"
            ref=md 
            @imgAdd="$imgAdd"
             />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('articleForm')">立即修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        search: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        index:'',
        articleForm: {
            title:'',
            introduce:'',
            content:''
        },
        rules:{
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 1, max: 30, message: '长度小于30个字符', trigger: 'blur' }
          ],
          introduce: [
            { required: true, message: '请输入文章简介', trigger: 'blur' },
            { min: 1, max: 200, message: '长度小于200个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
        },
        paginations:{
          page_index:1, //当前位于那页
          total:0, //总数
          page_size:8, //1页显示多少条
          page_sizes:[8,16,24], //每页显示多少条
          layout:"total, sizes, prev, pager, next, jumper" //翻页属性
        },
        allTableData:[],
      }
    },
    methods: {
      showArticles(){//获取所有文章，分页显示
        this.$http.get('/article/select').then(res => {
          this.tableData = res.data
          this.allTableData = res.data
          this.getPagination()
        }).catch(err => {
            this.$message({
              type: 'error',
              message: '获取文章失败'
            });
        })
      },
      showArticle(index){//获取对应文章
        this.$http.get(`/article/select/${this.tableData[index].id}`).then(res => {
          this.articleForm.title = res.data.title
          this.articleForm.introduce = res.data.introduce
          this.articleForm.content = res.data.content
        }).catch(err => {
            this.$message({
              type: 'error',
              message: '获取文章失败'
            });
        })
      },
      getPagination(){
        // 设置分页属性
        this.paginations.total = this.allTableData.length
        this.paginations.page_size = 8
        this.paginations.page_index = 1
        // 设置默认的分页数据
        this.tableData = this.allTableData.filter((item,index) => {
          return index < this.paginations.page_size 
        })
      },
      handleEdit(index, row) {//获取单个文章，进行修改
        this.dialogFormVisible = true;
        this.showArticle(index)
        this.index = index
      },
      handleDelete(index, row) {
        this.$confirm("确定删除？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete(`/article/delete/${this.tableData[index].id}`).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.showArticles()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
      },
      handleSizeChange(page_size){
        // 切换size
        this.paginations.page_index = 1
        this.paginations.page_size = page_size
        // 设置默认的分页数据
        this.tableData = this.allTableData.filter((item,index) => {
          return index < page_size
        })
      },
      handleCurrentChange(page){
        // 获取当前页，循环出从index开始一个页面显示几条数据
        let index = this.paginations.page_size * (page - 1)
        // 数据的总数
        let sum = this.paginations.page_size * page
        // 容器
        let tables = []
        // 循环页码对应出要显示的数据
        for(let i = index; i < sum; i++){
          if(this.allTableData[i]){
            tables.push(this.allTableData[i])
          }
          this.tableData = tables
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.put(`/article/edit/${this.tableData[this.index].id}`,this.articleForm).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.dialogFormVisible = false;//修改成功，关闭弹窗
              this.showArticles()
            })
          } else {
            this.$message({
              type: 'error',
              message: '修改失败！'
            });
            this.dialogFormVisible = false;//修改失败，关闭弹窗
            return false;
          }
        });
      },
      // 绑定@imgAdd event
      $imgAdd(pos, $file){
          // 第一步.将图片上传到服务器.
          var formdata = new FormData();
          formdata.append('image', $file);
          this.$http.post('/article/upload',formdata).then((url) => {
              // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
             this.$refs.md.$img2Url(pos, url.data.url);  
          })
      },
    },
    components:{

    },
    created() {
      this.showArticles()
    },
  }
</script>

<style scoped lang='less'>
.el-pagination{
  float: right;
}
</style>