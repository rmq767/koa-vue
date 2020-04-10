const validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateNotice(data){
    let errors = {}
    data.time = !isEmpty(data.time) ? data.time : ''
    data.content = !isEmpty(data.content) ? data.content : ''
    
    if(validator.isEmpty(data.time)){
        errors.time = '日期不能为空'
    }
    if(validator.isEmpty(data.content)){
        errors.content = '内容不能为空'
    }
    if(!validator.isLength(data.content,{min:1 , max:200})){
        errors.content = '内容的长度不能小于1位且不超过200位'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}