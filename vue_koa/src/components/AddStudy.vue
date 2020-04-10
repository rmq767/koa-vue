<template>
  <div style="padding: 20px;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" enctype='multipart/form-data'>
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model="ruleForm.link"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="info">
        <el-input type="textarea" v-model="ruleForm.info" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="upload"
          action=""
          :auto-upload="false"
          :limit="1"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    props:[''],
    data () {
      return {
        ruleForm: {
          type: '轻量级框架',
          name: '',
          link: '',
          info: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请输入链接', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          info: [
            { required: true, message: '请填写简介', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
          ]
        },
        dialogImageUrl: '',
        dialogVisible: false,
      };
    },

    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const formData = new FormData();
            const file = this.$refs.upload.uploadFiles[0]
            formData.append('file', file.raw);
            formData.append('name', this.ruleForm.name);
            formData.append('type', this.ruleForm.type);
            formData.append('info', this.ruleForm.info);
            formData.append('link', this.ruleForm.link);
            this.$http.post('/study/add',formData).then(res => {
              this.ruleForm = {}
              this.dialogFormVisible = false
              this.$refs.upload.clearFiles()
              this.$message({
              type: 'success',
              message: '添加成功！'
            });
            })
            // this.$refs.upload.submit();//上传图片
          } else {
            this.$message({
              type: 'error',
              message: '添加失败！'
            });
            this.dialogFormVisible = false;//添加失败，关闭弹窗
            return false;
          }
        });
      },
    },
  }

</script>
<style scoped>

</style>