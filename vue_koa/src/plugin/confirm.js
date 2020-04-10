export default {
    Confirm : (msg) => {
        confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            message({
              type: 'info',
              message: '已取消删除'
            });          
          });
    }
}