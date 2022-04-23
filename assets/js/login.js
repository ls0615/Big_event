$(function() {
    // 点击去注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').css('display', 'none')
        $('.reg-box').css('display', 'block')
    })
    // 点击去登录
    $('#link_login').on('click', function() {
        $('.reg-box').css('display', 'none')
        $('.login-box').css('display', 'block')
    })

    // 从 layui 获取 form 对象
    let form = layui.form
    let layer = layui.layer
    // 通过 form.verify()函数自定义校验规则
    form.verify({
        // 定义了一个 pwd 的校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(value) {
            // 通过 vlaue 拿到的是 确认密码框中的内容
            // 还需要拿到密码框中的内容，然后进行一次判断
            let pwd = $('.reg-box [name=password]').val()
            // 如果判断失败，则人return一个提示消息即可
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单提交的默认行文
        e.preventDefault()
        let data= {
            username: $('#form_reg [name=username]').val(), 
            password: $('#form_reg [name=password]').val()
        }
        // 发起 post 请求
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        $.post('/api/login', $(this).serialize(), function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('登录成功！')
            // 将登录成功之后得到的 token 保存在 localStorage 中
            localStorage.setItem('token', res.token)
            // 跳转后台主页
            location.href = './index.html'
        })
    })
})