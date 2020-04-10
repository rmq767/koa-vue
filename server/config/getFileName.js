function getFileName(str){
    var reg = /[^\\\/]*[\\\/]+/g;
   
    //xxx\或者是xxx/
    str = str.replace(reg,'');
    return str;
   
   }

   module.exports = getFileName