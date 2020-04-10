<template>
  <div style="padding: 0 20px;">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :default-sort = "{prop: 'time', order: 'descending'}"
      @selection-change="handleSelectionChange">
      <el-table-column
        label="日期"
        sortable
        prop="time"
        width="120">
        <template slot-scope="scope">{{ scope.row.time }}</template>
      </el-table-column>
      <el-table-column
        prop="message"
        label="留言"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="float:right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="paginations.page_index"
        :page-sizes="paginations.page_sizes"
        :page-size="paginations.page_size"
        :layout="paginations.layout"
        :total="paginations.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  export default {
    props:[''],
    data () {
      return {
        tableData: [],
        multipleSelection: [],
        paginations:{
          page_index:1, //当前位于那页
          total:0, //总数
          page_size:8, //1页显示多少条
          page_sizes:[8,16,24], //每页显示多少条
          layout:"total, sizes, prev, pager, next, jumper" //翻页属性
        },
        allTableData:[],
      };
    },

    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleDelete(index, row) {
        this.$confirm("确定删除？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete(`/messages/delete/${row.id}`).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.showMessages()
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
      showMessages(){
        this.$http.get('/messages/select').then(res => {
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
    },

    components: {},

    computed: {},

    created() {
      this.showMessages()
    },
  }

</script>
<style scoped>

</style>