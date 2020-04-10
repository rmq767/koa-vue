const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const multer = require('koa-multer')//解析上传文件
const path = require('path')
const getFileName = require('../../config/getFileName')
const fs = require('fs')

const validateStudy = require('../../validator/study')

let storage = multer.diskStorage({
	//定义文件保存路径
    destination: path.resolve('upload'),//路径根据具体而定。如果不存在的话会自动创建一个路径
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

// post /api/study/add
// private
// 添加学习资源
router.post('/add',passport.authenticate('jwt', { session: false }),upload.single('file'), async ctx => {
    const {errors, isValid} = validateStudy(ctx.req.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let name = ctx.req.body.name
    let type = ctx.req.body.type
    let link = ctx.req.body.link
    let info = ctx.req.body.info
    let url = "http://localhost:3000/"+ctx.req.file.filename
    try {
        await ctx.db.query(`insert into study (name,type,link,info,url) values('${name}','${type}','${link}','${info}','${url}')`)
        let data = await ctx.db.query('select * from study')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/study/select
// private
// 获取学习资源
router.get('/select',passport.authenticate('jwt', { session: false }),upload.single('file'), async ctx => {
    try {
        let data = await ctx.db.query('select id,type,name,info,url,link from study')
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/study/select/:id
// private
// 获取学习资源
router.get('/select/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    try {
        let data = await ctx.db.query(`select * from study where id='${id}'`)
        ctx.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// delete /api/study/delete/:id
// private
// 删除study
router.delete('/delete/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    let url = await ctx.db.query(`select url from study where id='${id}'`)
    fs.unlink(`C:\\Users\\lenovo\\Desktop\\Node.js\\node_study\\koa_1\\server\\upload/${getFileName(url[0].url)}`, err => {
        console.log("删除成功")
    });
    try {
        await ctx.db.query(`delete from study where id='${id}'`)
        ctx.response.body = {msg:"删除成功"}
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// put /api/study/edit/:id
// private
// 更新study
router.put('/edit/:id',passport.authenticate('jwt', { session: false }),upload.single('file'), async ctx => {
    const {errors, isValid} = validateStudy(ctx.req.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let id = ctx.params.id
    let name = ctx.req.body.name
    let type = ctx.req.body.type
    let link = ctx.req.body.link
    let info = ctx.req.body.info
    let url
    if (ctx.req.file == undefined) {
        url = ctx.req.body.file
    }else{
        url = "http://localhost:3000/" + ctx.req.file.filename
    }
    try {
        await ctx.db.query(`UPDATE study SET name='${name}',type='${type}',link='${link}',info='${info}',url='${url}' where id='${id}'`)
        let data = await ctx.db.query(`select * from study where id='${id}'`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

module.exports = router.routes()//一定注意routes