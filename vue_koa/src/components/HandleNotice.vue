<template>
  <div style="padding: 0 20px;">
  <el-table
    :data="tableData.filter(data => !search || data.content.toLowerCase().includes(search.toLowerCase()) || data.time.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="日期"
      prop="time">
    </el-table-column>
    <el-table-column
      label="内容"
      prop="content">
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
    style="float:right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="paginations.page_index"
      :page-sizes="paginations.page_sizes"
      :page-size="paginations.page_size"
      :layout="paginations.layout"
      :total="paginations.total">
    </el-pagination>

    <el-dialog title="修改文章" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="100px">
        <el-form-item label="公告时间" required>
        <el-col :span="12">
            <el-form-item prop="date">
            <el-date-picker 
            type="date" placeholder="选择日期" 
            v-model="ruleForm2.date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            ></el-date-picker>
            </el-form-item>
        </el-col>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="ruleForm2.content" type="textarea" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">立即修改</el-button>
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
        paginations:{
          page_index:1, //当前位于那页
          total:0, //总数
          page_size:8, //1页显示多少条
          page_sizes:[8,16,24], //每页显示多少条
          layout:"total, sizes, prev, pager, next, jumper" //翻页属性
        },
        allTableData:[],
        rules: {
          content: [
            { required: true, message: '请输入公告内容', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ]
        },
        dialogFormVisible: false,
        ruleForm2: {
          content: '',
          date: '',//必须要用date，不然会显示填日期
        },
        index:''
      }
    },
    methods: {
      handleEdit(index, row) {
        this.dialogFormVisible = true;
        this.showNotice(index)
        this.index = index
      },
      handleDelete(index, row) {
        this.$confirm("确定删除？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete(`/notice/delete/${this.tableData[index].id}`).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.showNotices()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
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
      showNotices(){
        this.$http.get('/notice/select').then(res => {
          this.tableData = res.data
          this.allTableData = res.data
          this.getPagination()
        }).catch(err => {
            this.$message({
              type: 'error',
              message: '获取失败'
            });
        })
      },
      showNotice(index){//获取对应文章
        this.$http.get(`/notice/select/${this.tableData[index].id}`).then(res => {
          this.ruleForm2.date = res.data.time
          this.ruleForm2.content = res.data.content
        }).catch(err => {
            this.$message({
              type: 'error',
              message: '获取失败'
            });
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.put(`/notice/edit/${this.tableData[this.index].id}`,this.ruleForm2).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.dialogFormVisible = false;//修改成功，关闭弹窗
              this.showNotices()
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
    },
    created() {
      this.showNotices()
    },
  }
</script>
<style scoped>

</style>