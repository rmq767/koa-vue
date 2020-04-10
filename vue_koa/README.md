## 今日遇到的问题
### 2019.10.17
+ 关于vue-cli2和vue-cli3
```powershell
# vue-cli2
vue init webpack/simple-webpack xxx
# vue-cli3
vue create xxx
```
[这是配置信息](https://img2018.cnblogs.com/blog/1059788/201810/1059788-20181003162624015-1456708862.png)
+ 使用bootstrap-vue
```javascript
// npm install vue bootstrap-vue bootstrap
// 在主文件中引入配置信息
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
```


## 今日遇到的问题
### 2019.10.17
+ 关于媒体查询
> 这个登录、注册项目是用bootstap-vue写的，所以想用响应式来写，加上之前才学了，所以想用一下
```css
/* @media screen and (min-width:992px)[ and (max-width: 1199px)]{} */
 /*中等PC屏幕下的专用样式*/
 @media screen and (min-width:992px) and (max-width: 1199px) {
    #app .login_container .login_form{
        width: 40%;
    }
 }
```
** 这里我想要登录窗口宽度响应式变化，但是我在查询之前就设置了宽度40%，这样会没有效果。在html文件中link css文件，同样会没有效果，需要在main.js中导入css **


## 今日遇到的问题
### 2019.10.20
### vue的axios请求，获取到的服务端session为空
+ 验证码保存在session中,但是存在跨域请求，session不一致问题（这个问题困扰了一天）
    - 起因：http是无状态的，因此我们通常需要用到cookie以及session来保存状态，session是在服务器端存储的，会和cookie一起使用，设置了session之后，会发送给浏览器一个cookie,这个cookie是session_id，当再次请求的时候浏览器会将它发送给服务器，以此来找到对应的session. 
    但是，我们实际使用的时候通常会用到跨域，就是向不同的域发起请求，但是默认情况下此时cookie是不会发送给服务器的，此时就导致了丢失session_id,从而导致了session的值为undefined。
    - 最终解决方案
    ```javascript
    // 在客户端axios请求中设置
    axios.defaults.withCredentials = true
    // 通过设置 withCredentials: true ，发送Ajax时，Request header中便会带上 Cookie 信息。

    // 然后在服务器端的cors()中同样要配置
    // 实现跨域
    app.use(cors({
        credentials: true
    }))
    ````
+ 踩的坑
    - 只在前端设置了**axios.defaults.withCredentials = true**，会一直报错
    **has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.**
    - 然后，在设置**Access-Control-Allow-Credentials**的时候，是在**ctx.header(),ctx.set()**都设置了但都是不管用，需要在cors中配置**credentials: true**
    - 还有在请求拦截中，或者响应拦截中设置也没用。
    - 
## 贴代码
```js
//客户端的axios请求拦截https.js
import axios from 'axios'
import router from './router/index'

axios.defaults.baseURL = 'http://localhost:3000/api'//默认请求地址

axios.defaults.withCredentials = true

//请求拦截设置统一header
axios.interceptors.request.use(
    config => {
        if (localStorage.eleToken) {
            config.headers.Authorization = localStorage.eleToken
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
    )
    
//响应拦截 401 token过期处理
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        // 获取错误状态码
        const {status} = error.response

        if (status == 401) {
            // 清除token
            localStorage.removeItem('eleToken')
            // 跳转登录页面
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

export default axios
```

```js
//服务端的入口文件app.js
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const session = require('koa-session')
const cors = require('koa-cors')

// 实例化koa
const app = new Koa()
const router = new Router()
app.use(bodyParser())

// 实现跨域
app.use(cors({
    credentials: true
}))

// 设置session用来保存验证码
app.keys = ['some secret hurr']; // 签名 默认
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    // rolling: true, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    renew: true, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));

// 连接数据库
app.context.db = require('./dbconfig')

app.use(passport.initialize())
app.use(passport.session())
// 回调config文件中的passport.js
require('./config/passport')(passport)

// 配置路由地址localhost:3000/api/user
const user = require('./routes/api/user')
router.use('/api/user',user)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000,() =>{
    console.log('端口3000')
})
```

## 今日遇到的问题
### 2019.10.26
+ 关于vue向下滚动动画
```js
// 1.在mounted中添加滚动事件
mounted() {
    window.addEventListener('scroll', this.toScoll)
}
//2.在方法中写处理事件
methods: {
    toScoll(){//向下滑动动画
    let new_message = this.$refs.new_message    //通过ref获取元素
    let about_me = this.$refs.about_me      //通过ref获取元素
    let long = document.documentElement.scrollTop   //获取页面滚动距离
    let length = window.pageYOffset;        //获取滚动离顶部距离
    if (long > 100) {
        new_message.style.transform = `translateY(${length - 40}px)`
        about_me.style.transform = `translateY(${length - 40}px)`
    }else if (long < 100) {
        new_message.style.transform = `translateY(0px)`
        about_me.style.transform = `translateY(0px)`
    }
    }
}
//3.记住在css给进行动画的元素，添加上transition
// transition: all 0.5s ease-in-out;
```

## 今日遇到的问题
### 2019.10.27
#### vue的transition动画
+ 关于vue中animation动画问题
    - 1.找到要用动画的元素。我是想要实现切换页面动画效果，所以找到app.vue中的router-view，用transition将它包裹起来。
    - 2.用动画库animate.css，需要==npm install animate.css --save==
    - 3.在main.js中引入动画
    ```js
    import animated from 'animate.css'//引入动画
    Vue.use(animated)
    ```
    - 4.开始写transition动画了
    ```js
    <template>
        <div id="app">
            <Navbar></Navbar>
            <!-- 设置进入、离开动画 -->
            <transition
            enter-active-class="animated zoomIn faster"
            leave-active-class="animated zoomOut faster"
            class="tran"
            mode="out-in"
            >
            <router-view class="show_animate"/>
            </transition>
        </div>
    </template>
    ```
    **注意：需要给transition加一个class类,设置==position: relative==，然后给将要动画的元素设置==position: absolute==，否则动画位置会很乱。还需要设置给transition设置==mode="out-in"==，是上个动画结束在执行下一个。**

+ transition-group也同理
    - [这里就给个链接](https://blog.csdn.net/weixin_42218847/article/details/81474923)


## 今日遇到的问题
### 2019.11.6
+ 渐变字体
```css
h2{
    background-image: -webkit-linear-gradient(bottom, rgb(201, 115, 255), rgb(20, 11, 255));/* //background-image：为元素设置背景图像 */
    -webkit-background-clip: text;/* //background-clip：规定背景的绘制区域 */
    -webkit-text-fill-color: transparent;/* //text-fill-color：指定文字的填充颜色 */
    padding: 20vh 10vw 0;
    z-index: 100;
    cursor: pointer;
}
```

+ z-index无效问题
- **class="bg"覆盖了div中的元素**
```bash
<Background class="bg"></Background>
<div class="introduction">
```
- 解决办法
给2个元素加上position定位，然后给div中子元素，设置z-index就行了