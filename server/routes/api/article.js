const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const multer = require('koa-multer')//解析上传文件
const path = require('path')

let storage = multer.diskStorage({
	//定义文件保存路径
    destination: path.resolve('upload/articles'),//路径根据具体而定。如果不存在的话会自动创建一个路径
    filename: (ctx, file, cb)=>{
        cb(null, file.originalname);
    },
	//修改文件名
	filename:function(req,file,cb){
            var fileFormat = (file.originalname).split(".");
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
});

let upload = multer({ storage: storage});

const validateArticle = require('../../validator/article')//验证请求体

// post /api/article/upload
// private
// 添加图片
// upload.single('image')，这里的image一定要与formdata的名字一样
router.post('/upload',passport.authenticate('jwt', { session: false }),upload.single('image'), async ctx => {
    let image = ctx.req.file.filename
    ctx.body = {url:`http://localhost:3000/articles/${image}`}
})

// post /api/article/add
// private
// 添加文章
router.post('/add',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateArticle(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let title = ctx.request.body.title
    let introduce = ctx.request.body.introduce
    let content = new Buffer.from(ctx.request.body.content).toString('base64')
    let year = new Date().getFullYear()
    let month = new Date().getMonth()+1
    let day = new Date().getDate()
    let date = year+'-'+month+'-'+day
    try {
        await ctx.db.query(`insert into articles (title,introduce,content,time) values('${title}','${introduce}','${content}','${date}')`)
        ctx.body = '添加成功'
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/article/select
// private
// 搜索全部文章
router.get('/select',passport.authenticate('jwt', { session: false }), async ctx => {
    try {
        let data = await ctx.db.query(`SELECT * FROM articles`)
        data.forEach(item => {
            item.content = new Buffer.from(item.content, 'base64').toString();
        })
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/article/select/:id
// private
// 搜索单个文章
router.get('/select/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        let data = await ctx.db.query(`select * from articles where id='${id}'`)
        data.forEach(item => {
            item.content = new Buffer.from(item.content, 'base64').toString();
        })
        ctx.response.body = data[0] 
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// put /api/article/edit/:id
// private
// 修改文章
router.put('/edit/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    const {errors, isValid} = validateArticle(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let id = ctx.params.id
    let title = ctx.request.body.title
    let introduce = ctx.request.body.introduce
    let content = new Buffer.from(ctx.request.body.content).toString('base64')
    try {
        await ctx.db.query(`UPDATE articles SET title='${title}',introduce='${introduce}',content='${content}' where id='${id}'`)
        let data = await ctx.db.query(`select * from articles where id='${id}'`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// delete /api/article/delete/:id
// private
// 删除文章
router.delete('/delete/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        await ctx.db.query(`delete from articles where id='${id}'`)
        ctx.response.body = {msg:"删除成功"}
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/article/msg/:id
// private
// 获取浏览量和点赞数
router.get('/msg/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    let counts = ctx.request.query
    try {
        await ctx.db.query(`UPDATE articles SET see='${counts.see}',likes='${counts.like}' where id='${id}'`)
        ctx.body = {msg:'获取成功'}
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/article/search
// private
// 搜索
router.get('/search',passport.authenticate('jwt', { session: false }), async ctx => {
    let search_data = ctx.request.query
    try {
        let data = await ctx.db.query(`SELECT * FROM articles WHERE Title LIKE '%${search_data.search}%' or introduce LIKE '%${search_data.search}%'`)
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

module.exports = router.routes()//一定注意routes