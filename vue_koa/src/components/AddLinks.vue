<template>
  <div class="links" style="padding: 20px;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="链接名称" prop="name">
            <el-col :span="12">
                <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="链接" required>
          <el-form-item prop="link">
            <el-col :span="12">
              <el-input placeholder="请输入链接" v-model="ruleForm.link"></el-input>
            </el-col>
          </el-form-item>
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
          name: '',
          link: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入链接名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请输入链接', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/links/add',this.ruleForm).then(res => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.ruleForm.name = ''
              this.ruleForm.link = ''
            })
          } else {
            this.$message({
              type: 'error',
              message: '添加失败！'
            });
            this.ruleForm.name = ''
            this.ruleForm.link = ''
          }
        });
      }
    }
  }
</script>
<style scoped>

</style>