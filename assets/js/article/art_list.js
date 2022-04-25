$(function () {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;

    // 定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        let time = new Date(date)

        let year = time.getFullYear()
        let month = padZero(time.getMonth() + 1)
        let day = padZero(time.getDate())

        let h = padZero(time.getHours())
        let m = padZero(time.getMinutes())
        let s = padZero(time.getSeconds())

        return `${year}-${month}-${day} ${h}:${m}:${s}`
    }

    // 补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，我们需要将请求参数对象发送给服务器
    let q = {
        pagenum: 1,   //页码值，默认请求第一页的数据
        pagesize: 2,  // 每页显示几条数据
        cate_id: '',   // 文章分类的id
        state: ''   // 文章的状态。可选值有：已发布、草稿
    }

    initTable()
    initCat()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tmp-table', res)
                $('.layui-table tbody').html(htmlStr)
                // 调用分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCat() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                let catHtml = template('tmp-cat', res)
                $('[name=cate_id]').html(catHtml)
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('click', function (e) {
        e.preventDefault()
        // 获取下拉框中的数据，并复制给 q
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=cate_id]').val()
        // 根据最新的筛选，渲染数据
        initTable()
    })

    // 定义分页的方法
    function renderPage(total) {
        // 调用 laypage.render 渲染分页的解构
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                // 吧最新的条目数，赋值到 q 中的pageseiz上
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 删除绑定事件处理函数
    $('tbody').on('click', '.btnDelete', function(e) {
        // 获取删除按钮的个数
        let len = $('.btnDelete').length
        console.log(len)
        // 获取删除文章的 id
        let id = $(this).attr('data-id')
        layer.confirm('确认要删除嘛?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method : 'GET',
                url : '/my/article/delete/' + id,
                success : function(res) {
                    if (res.status !== 0) {
                        return layer.msg('文章删除失败，请重新尝试~~')
                    }
                    layer.msg('文章删除成功~~')
                    if (len === 1) {
                        // 如果 len 的值等于 1 ，则证明删除完毕之后，页面上就没有任何的数据
                        // 页码值 最小必须是 1
                        q.pagenum = q.pagenum  === 1 ? 1 : q.pagenum - 1
                    }
                    // 当数据删除完成后，需要判断当前这一页中是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值 -1 之后，再重新调用 initTable()
                    initTable()
                }
            })
            layer.close(index);
          });
    }) 
})