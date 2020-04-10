const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateArticle(data){
    let errors = {}
    data.title = !isEmpty(data.title) ? data.title : ''
    data.introduce = !isEmpty(data.introduce) ? data.introduce : ''
    data.content = !isEmpty(data.content) ? data.content : ''
    
    if(validator.isEmpty(data.title)){
        errors.title = '标题不能为空'
    }
    if(!validator.isLength(data.title,{min:1 , max:30})){
        errors.title = '标题的长度不能小于1位且不超过30位'
    }
    if(validator.isEmpty(data.introduce)){
        errors.introduce = '简介不能为空'
    }
    if(!validator.isLength(data.introduce,{min:1 , max:200})){
        errors.introduce = '简介的长度不能小于1位且不超过200位'
    }
    if(validator.isEmpty(data.content)){
        errors.content = '内容不能为空'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}