const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const multer = require('koa-multer')//解析上传文件
const path = require('path')

let storage = multer.diskStorage({
	//定义文件保存路径
    destination: path.resolve('upload/avatar'),//路径根据具体而定。如果不存在的话会自动创建一个路径
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

const validateInfo = require('../../validator/myinfo')

// put /api/userinfo/:id
// private
// 修改user信息
router.put('/:id',passport.authenticate('jwt', { session: false }),upload.single('userinfo'), async ctx => {
    const {errors, isValid} = validateInfo(ctx.req.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.throw(40103,`${errors}`)
    }
    let id = ctx.params.id
    let name = ctx.req.body.name
    let email = ctx.req.body.email
    let sex = ctx.req.body.sex
    let signature = ctx.req.body.signature
    let avatar
    if (ctx.req.file == undefined) {
        avatar = ctx.req.body.file
    }else{
        avatar = "http://localhost:3000/avatar" + ctx.req.file.filename
    }
    try {
        await ctx.db.query(`UPDATE userinfo SET name='${name}',email='${email}',sex='${sex}',signature='${signature}',avatar='${avatar}' where id='${id}'`)
        let data = await ctx.db.query(`SELECT * FROM userinfo where id='${id}'`)
        ctx.response.body = data
    } catch (error) {
        ctx.throw(500,"数据库查询错误")
    }
})

// get /api/userinfo/:id
// private
// 获取单个user信息
router.get('/:id',passport.authenticate('jwt', { session: false }), async ctx => {
    let id = ctx.params.id
    let data = await ctx.db.query(`SELECT * FROM userinfo where id='${id}'`)
    ctx.response.body = data
})

module.exports = router.routes()//一定注意routes