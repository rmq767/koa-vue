const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateLink(data){
    let errors = {}
    data.link = !isEmpty(data.link) ? data.link : ''
    data.name = !isEmpty(data.name) ? data.name : ''
    
    if(validator.isEmpty(data.link)){
        errors.link = '链接不能为空'
    }
    if(!validator.isLength(data.link,{min:1 , max:200})){
        errors.link = '链接的长度不能小于1位且不超过200位'
    }
    if(validator.isEmpty(data.name)){
        errors.name = '名称不能为空'
    }
    if(!validator.isLength(data.name,{min:1 , max:20})){
        errors.name = '名称的长度不能小于1位且不超过20位'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}