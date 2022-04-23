$(function () {

    // 获取用户的个人基本信息
    getUserInfo()

    let layer = layui.layer

    // 点击退出事件
    $('#btnLogout').on('click', function () {

        //提示用户是否退出
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something  
            // 退出要做的事情
            // 1.清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = './login.html'
            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 获取用户的信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers : {
        //     Authorization : localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败~~')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
        // 无论成功还是失败，都会调用 complete 函数
        // complete : function(res) {
        //     // 在 complete 函数中，可以使用 res.responseJSON 拿到响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空 token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转登录页面
        //         location.href = './login.html'
        //     }
        //     // console.log('执行了该回调函数')
        // }
    })
}

function renderAvatar(user) {
    // 1. 获取用户的名称
    let name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 有用户图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没有用户图片头像，渲染文字头像
        let first = name[0].toUpperCase()
        $('.text-avatar').text(first).show()
        $('.layui-nav-img').hide()

    }
}