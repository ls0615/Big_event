// 每次调用 get post ajax 都会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization : localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 函数
    options.complete = function(res) {
         // 在 complete 函数中，可以使用 res.responseJSON 拿到响应回来的数据
         if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空 token
            localStorage.removeItem('token')
            // 2.强制跳转登录页面
            location.href = './login.html'
        }
        // console.log('执行了该回调函数')
    }
})