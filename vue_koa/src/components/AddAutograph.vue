<template>
  <div class="autograph" style="padding: 20px;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="签名" prop="autograph">
            <el-col :span="12">
                <el-input v-model="ruleForm.autograph" type="textarea" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入内容"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          autograph: '',
        },
        rules: {
          autograph: [
            { required: true, message: '请输入签名内容', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/autograph/add',this.ruleForm).then(res => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.ruleForm.autograph = ''
            })
          } else {
            this.$message({
              type: 'error',
              message: '添加失败！'
            });
            this.ruleForm.autograph = ''
          }
        });
      }
    }
  }
</script>
<style scoped>

</style>