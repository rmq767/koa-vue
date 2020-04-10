<template>
    <div style="padding: 0 20px;">
    <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase())||data.info.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
        <el-table-column
        label="分类"
        prop="type">
        </el-table-column>
        <el-table-column
        label="名称"
        prop="name">
        </el-table-column>
        <el-table-column
        label="简介"
        prop="info">
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
<!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="paginations.page_index"
      :page-sizes="paginations.page_sizes"
      :page-size="paginations.page_size"
      :layout="paginations.layout"
      :total="paginations.total">
    </el-pagination>
<!-- 弹窗修改 -->
    <el-dialog title="学习修改" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类" prop="study_type">
            <el-radio-group v-model="ruleForm.type">
            <el-radio-button label="轻量级框架"></el-radio-button>
            <el-radio-button label="主流前端框架"></el-radio-button>
            <el-radio-button label="工具"></el-radio-button>
            <el-radio-button label="CSS生态"></el-radio-button>
            <el-radio-button label="JS生态"></el-radio-button>
            <el-radio-button label="VUE生态"></el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="study_name">
            <el-input v-model="ruleForm.study_name"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="study_link">
            <el-input v-model="ruleForm.study_link"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="study_info">
            <el-input type="textarea" v-model="ruleForm.study_info" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
        </el-form-item>
        <el-form-item>
            <el-upload
            ref="upload"
            action=""
            :auto-upload="false"
            list-type="picture-card"
            :limit="1"
            :file-list="showList"
            :on-preview="handlePictureCardPreview">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
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
        index:'',
        paginations:{
          page_index:1, //当前位于那页
          total:0, //总数
          page_size:8, //1页显示多少条
          page_sizes:[8,16,24], //每页显示多少条
          layout:"total, sizes, prev, pager, next, jumper" //翻页属性
        },
        allTableData:[],
        dialogFormVisible: false,
        ruleForm: {
          type: '轻量级框架',
          study_name: '',
          study_link: '',
          study_info: ''
        },
        rules: {
          study_name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
          study_link: [
            { required: true, message: '请输入链接', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          study_info: [
            { required: true, message: '请填写简介', trigger: 'blur' }
          ]
        },
        dialogImageUrl: '',
        dialogVisible: false,
        showList:[]
      }
    },
    methods: {
      handleEdit(index, row) {//修改按钮
        this.dialogFormVisible = true;
        this.showStudy(index)
        this.index = index
      },
      handleDelete(index, row) {//删除按钮
        this.$confirm("确定删除？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete(`/study/delete/${this.tableData[index].id}`).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.showStudies()
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
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const formData = new FormData();
            const file = this.$refs.upload.uploadFiles[0]
            if (file.raw == undefined) {
              formData.append('file', file.url);
            }else{
              formData.append('file', file.raw);
            }
            formData.append('name', this.ruleForm.study_name);
            formData.append('type', this.ruleForm.type);
            formData.append('info', this.ruleForm.study_info);
            formData.append('link', this.ruleForm.study_link);
            this.$http.put(`/study/edit/${this.tableData[this.index].id}`,formData).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.dialogFormVisible = false;//修改成功，关闭弹窗
              this.showStudies()
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
      showStudies(){
        this.$http.get('/study/select').then(res => {
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
      showStudy(index){//获取对应文章
        this.$http.get(`/study/select/${this.tableData[index].id}`).then(res => {
          this.showList = res.data
          this.ruleForm.type = res.data[0].type
          this.ruleForm.study_name = res.data[0].name
          this.ruleForm.study_info = res.data[0].info
          this.ruleForm.study_link = res.data[0].link
        }).catch(err => {
            this.$message({
              type: 'error',
              message: '获取文章失败'
            });
        })
      },
    },
    created() {
      this.showStudies()
    },
  }
</script>

<style lang="less" scoped>
.el-pagination{
  float: right;
}
</style>