//初始化页面对象
var page = {};

require(['base', 'jquery', 'helper', 'sweetalert', 'layer', 'datetimepicker', 'table'], function (bs, $, helper, swal, layer) {
    //页面所用到配置
    page.CONFIG = {
        GET_LIST_API: helper.url.getUrlByMapping("admin/userManager/find_newuserinfolist.shtml"),        //查询新增用户列表接口
    };

    page.type = helper.url.queryString("type");

    //存储页面table对象
    page.$tool = $('#tableTools');
    page.$table = $('#tableList');
    page.$pageSubTitle = $("#pageSubTitle");

    /**
     * 提供给引用页面刷新用，如果未声明该方法，则引用页面调用将使用浏览器重载重新刷新本页面
     */
    page.refresh = function () {
        $("#btnSearch").click();
    };

    //页面级的帮助对象集合
    page.derive = {
        //获取表单参数用于搜索
        getParams: function (params) {
            params.islength = $("#textType").val();
//            params.start_create_time = helper.convert.formatTimestamp($("#startTime").val());
//            params.end_create_time = helper.convert.formatTimestamp($("#endTime").val(), {day: 1});
            params.start_create_time = $("#startTime").val();
            params.end_create_time = $("#endTime").val();
            params.search_type = page.type;
            params.x = params.offset;   //服务端分页，过滤掉前xxx条记录
            params.y = params.limit;    //服务端分页，每页记录数

            return params;
        },

        //获取提供给表格位置的自适应浏览器的高度，最小高度500
        getAdaptTableHeight: function () {
            var height = $(window).height() - page.$tool.offset().top - page.$tool.outerHeight() - 30;
            return height >= 500 ? height : 500;
        }
    };

    //页面事件
    page.eventHandler = {
        
    };


    $(document).ready(function () {
        //初始化页面状态
        page.type == 1 ? page.$pageSubTitle.html('昨日新增用户列表') : page.$pageSubTitle.html('本月新增用户列表');

        //初始化日期控件
        $('.form_date').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            todayBtn: true,
            autoclose: true,
            todayHighlight: true,
            startView: 2,
            minView: 2,
            forceParse: true
        }).on("click", function (e) {
            //设置日期控件前后日期的依赖
            var $this = $(e.target);
            if($this.attr("data-start")){
                $this.datetimepicker("setStartDate", $($this.attr("data-start")).val());
            }
            if($this.attr("data-end")){
                $this.datetimepicker("setEndDate", $($this.attr("data-end")).val());
            }
        });

        //表格初始化
        page.$table.bootstrapTable({
            //请求相关
            url: page.CONFIG.GET_LIST_API,  //AJAX读取列表数据的URL
            method: "get",                  //请求方式
            contentType: "application/x-www-form-urlencoded",//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
            dataType: "json",               //服务器返回数据类型
            cache: false,                   //不缓存数据
            queryParamsType: "limit",       //查询参数组织方式
            queryParams: function (params) {
                return page.derive.getParams(params);
            },

            //分页相关
            pagination: true,            //是否分页
            pageNumber:1,                //初始化加载第一页，默认第一页
            pageSize: 20,                //每页的记录行数（*）
            pageList: [10, 20, 50, 100],     //允许选择的每页的数量切换
            sidePagination: "server",    //分页方式：client客户端分页，server服务端分页（*）

            //表格总体外观相关
            height: page.derive.getAdaptTableHeight(),            //整个表格的高度
            detailView: false,      //是否显示父子表
            cardView: false,        //是否显示详细图
            undefinedText: "—",     //当数据为空的填充字符
            showColumns: true,      //是否显示筛选列按钮
            showRefresh: true,      //是否显示刷新按钮
            clickToSelect: true,    //是否开启点击选中行,自动选择rediobox 和 checkbox
            toolbar:'#tableTools',  //工具按钮的容器
            //classes: 'table table-hover table-no-bordered',
            //buttonsClass: 'default btn-outline',

            //表格内容相关设置
            idField:"id",       //当前行主键的id值
            uniqueId:'id',      //获取当前行唯一的id 标示，作用于后面的  var rowData = $table.bootstrapTable('getRowByUniqueId', id);
            dataField: "data",  //服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            columns: [{
                field: 'realname',
                title: '姓名',
                width: "120px",
                align: 'left',
            },{
                field: 'company',
                title: '单位',
                align: 'center'
            },{
                field: 'companywork',
                title: '职务',
                width: "100px",
                align: 'center'
            },{
                field: 'logintype',
                title: '注册方式',
                width: "80px",
                formatter: function(value){
                	switch(value){
                	    case 0: return '后台新增';
                	    case 1: return '在线注册';
                	    case 2: return '商会导入';
                	}
                },
                align: 'center'
            },{
                field: 'createdate',
                title: '注册时间',
                width: "130px",
                formatter: function(value){
                	return helper.Convert.formatDate(value.time);
                },
                align: 'center'
            },{
                field: 'isAuth',
                title: '是否认证',
                width: "150px",
                formatter: function(value){
                	var type = parseInt(value);
                	switch(type){
                	    case 1: return '是';
                	    default: return '否';
                	}
                },
                align: 'center'
            },{
                field: 'auth_type',
                title: '认证方式',
                width: "100px",
                align: 'center'
            },{
                field: 'weight',
                title: '用户权重',
                align: 'center',
                width: "200px"
            }]
        });

        //回车搜索事件
        $("#keyword").keyup(function (event) {
            if(event.keyCode == 13)
                $("#btnSearch").click();
        });

        //搜索
        $("#btnSearch").click(function(){
            var params = page.$table.bootstrapTable('getOptions');
            params = page.derive.getParams(params);

            page.$table.bootstrapTable('refresh',params);
        });

        $(window).resize(function () {
            page.$table.bootstrapTable("resetView", {height: page.derive.getAdaptTableHeight() + 10});
        })
    });
});