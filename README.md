# vue+koa的一个小项目
### 服务端
+ 到server文件夹下
```powershell
# 运行服务端
nodemon app.js/node app.js
```
### 客户端
+ 到vue_koa文件夹下
```powershell
# 运行客户端
npm run serve
```

## 项目简介
### 该项目是基于vue+koa+mySql的一个个人博客项目
### 实现的功能有：
+ 响应式布局(前台用的是BootstrapVue，后台用的是ElementUI)
+ 注册实现了邮箱验证
+ 登录实现了验证码验证和token验证
+ 采用了md5密码加密
+ 实现了文章的增删改查以及其他功能的增删改查
+ 实现了文件的上传和删除
+ 文章增加和修改用的是==mavon-editor==，前台展示用的是==highlight.js==和==marked==
+ 实现了个人资料的修改保存
+ 实现了留言板功能
+ 实现了页面切换动画过渡效果
+ 实现了MySQL数据库的操作
+ 后台实现了对前台发送的数据的验证

