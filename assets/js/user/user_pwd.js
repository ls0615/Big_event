$(function () {
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
        repwd: function (value) {
            // 通过 vlaue 拿到的是 确认密码框中的内容
            // 还需要拿到密码框中的内容，然后进行一次判断
            let pwd = $('[name=newPwd]').val()
            // 如果判断失败，则人return一个提示消息即可
            if (pwd !== value) {
                return '两次密码不一致'
            }
        },
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '不能和原密码相同'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('[name=oldPwd]').val(),
                newPwd: $('[name=newPwd]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('密码修改失败')
                }
                layer.msg('密码修改成功')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    
    })
        
})