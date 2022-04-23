// 每次调用 get post ajax 都会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007' + options.url
})