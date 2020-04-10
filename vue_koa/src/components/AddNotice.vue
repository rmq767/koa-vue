<template>
  <div class="notice" style="padding: 20px;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="公告时间" required>
        <el-col :span="12">
            <el-form-item prop="date">
            <el-date-picker 
            type="date" 
            placeholder="选择日期" 
            v-model="ruleForm.time"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            ></el-date-picker>
            </el-form-item>
        </el-col>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
            <el-col :span="12">
              <el-input v-model="ruleForm.content" type="textarea" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入内容"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          content: '',
          time: '',
        },
        rules: {
          content: [
            { required: true, message: '请输入公告内容', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/notice/add',this.ruleForm).then(res => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.ruleForm.time = ''
              this.ruleForm.content = ''
            })
          } else {
            this.$message({
              type: 'error',
              message: '添加失败！'
            });
            this.ruleForm.time = ''
            this.ruleForm.content = ''
          }
        });
      }
    }
  }
</script>
<style scoped>

</style>