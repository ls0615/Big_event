$(function () {

    let form = layui.form
    let layer = layui.layer

    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                let cateHtml = template('tmp-cate', res)
                $('[name=cate_id]').html(cateHtml)
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择图片
    $('#select_img').on('click', function () {
        $('#file_hidden').click()
    })

    // 监听 file 选择框的 change 事件, 获取文件的选择文件列表
    $('#file_hidden').on('change', function (e) {
        // 获取文件的列表数组
        let files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态，默认为已发布状态
    let art_state = '已发布'

    // 为存为草稿按钮绑定事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        // 基于 form 表单，创建一个 FormData 对象
        let fd = new FormData($(this)[0])

        // 将文章的发布状态追加到 fd 中
        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 将文件对象存储到 fd 中
            fd.append('cover_img', blob)

            // 发起 请求
            publishArt(fd)
            })
    })
    function publishArt(fd) {
        $.ajax({
            method : 'POST',
            url : '/my/article/add',
            data : fd,
            // 注意：如果向服务器提交的是 formdata 格式的数据
            // 必须添加以下两个配置项
            contentType : false,
            processData : false,
            success : function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败')
                }
                layer.msg('发表文章成功')
                // location.href = '/art_list.html'
            }
        })
    }
})