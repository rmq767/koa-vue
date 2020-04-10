const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateStudy(data){
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : ''
    data.type = !isEmpty(data.type) ? data.type : ''
    data.info = !isEmpty(data.info) ? data.info : ''
    data.link = !isEmpty(data.link) ? data.link : ''
    
    if(validator.isEmpty(data.name)){
        errors.name = '名称不能为空'
    }
    if(!validator.isLength(data.name,{min:1 , max:20})){
        errors.name = '名称的长度不能小于1位且不超过20位'
    }
    if(validator.isEmpty(data.type)){
        errors.type = '分类不能为空'
    }
    if(!validator.isLength(data.type,{min:1 , max:10})){
        errors.type = '分类的长度不能小于1位且不超过10位'
    }
    if(validator.isEmpty(data.info)){
        errors.info = '简介不能为空'
    }
    if(!validator.isLength(data.info,{min:1 , max:255})){
        errors.link = '简介的长度不能小于1位且不超过255位'
    }
    if(validator.isEmpty(data.link)){
        errors.link = '链接不能为空'
    }
    if(!validator.isLength(data.link,{min:1 , max:40})){
        errors.link = '链接的长度不能小于1位且不超过40位'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}