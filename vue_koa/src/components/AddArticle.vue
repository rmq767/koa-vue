<template>
<div style="padding: 20px;">
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
    <el-button type="primary" @click="submitForm('articleForm')">立即创建</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
  export default {
    props:[''],
    data () {
      return {
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
        }
      };
    },

    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/article/add',this.articleForm).then(res => {
              this.$message({
                type: 'success',
                message: '创建成功!'
              });
              this.articleForm.title = ''
              this.articleForm.introduce = ''
              this.articleForm.content = ''
            })
          } else {
            this.$message({
              type: 'error',
              message: '创建失败！'
            });
            this.articleForm.title = ''
            this.articleForm.introduce = ''
            this.articleForm.content = ''
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
      // $imgDel(pos) {
      //     delete this.imgFile[pos]
      // },
    },
  }

</script>
<style scoped lang='less'>

</style>