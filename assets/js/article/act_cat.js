$(function() {

    let layer = layui.layer
    let form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            type : 'GET',
            url : '/my/article/cates',
            success : function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('文章列表获取失败')
                }
                layui.layer.msg('文章列表获取成功')
                let htmlStr = template('tpl-table', res)
                $('.layui-table tbody').html(htmlStr)
            }
        })
    }
    
    let indexAdd = null
    // 为添加类别绑定点击事件
    $('#btnAddCat').on('click', function() {
        indexAdd = layer.open({
            type : 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        })
    })

    // 发起添加分类的请求，通过代理的形式绑定
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            type : 'POST',
            url : '/my/article/addcates',
            data : $(this).serialize(),
            success : function(res) {
                if (res.status !== 0 ) {
                    return layer.msg('添加失败')
                }
                layer.msg('添加成功')
                initArtCateList()
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null
    // 通过代理，给编辑按钮添加点击事件
    $('tbody').on('click', '#btnEdit', function() {
        // 弹出修改文章分类的信息层
        indexEdit = layer.open({
            type : 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            type : 'GET',
            url : '/my/article/cates/' + id,
            success : function(res){
                form.val('form-edit', res.data)
            }

        })
    })

    // 通过代理的方式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', 'form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method : 'POST',
            url : '/my/article/updatecate',
            data : $(this).serialize(),
            success : function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的方式，为删除分类的表单绑定 click 事件
    $('tbody').on('click', '.btnRemove', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method :'GET',
                url : '/my/article/deletecate/' + id,
                success : function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除列表失败')
                    }
                    layer.msg('删除列表成功')
                    initArtCateList()
                }
            })
            
            layer.close(index);
          });
    })
})