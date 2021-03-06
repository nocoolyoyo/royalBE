<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="zh_cn">
  <head>
    <meta charset="utf-8">
    <title>上传图片</title>
    <script src="<%=basePath%>js/upload_img/plupload.full.min.js"></script>
	<script src="<%=basePath%>js/upload_img/qiniu.js"></script>
	<script src="<%=basePath%>js/jquery.min.js"></script>
</head>
  <body>
    <div id="container">
	    <a id="pickfiles" href="javascript:void 0;">Upload File</a>
	    <div id="img_content"></div>
	</div>
  </body>

<script>
var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',      // 上传模式，依次退化
    browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
    uptoken_url: basePath+'/qiniu/simple_uptoken.shtml?bucket=bangyang',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
    get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
    unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
    domain: 'ooflcgfeq.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
    container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
    max_file_size: '100mb',             // 最大文件体积限制
    max_retries: 3,                     // 上传失败最大重试次数
    dragdrop: true,                     // 开启可拖曳上传
    drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb',                  // 分块上传时，每块的体积
    auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
                // 文件添加进队列后，处理相关的事情
            });
        },
        'BeforeUpload': function(up, file) {
               // 每个文件上传前，处理相关的事情
        },
        'UploadProgress': function(up, file) {
               // 每个文件上传时，处理相关的事情
        },
        'FileUploaded': function(up, file, info) {
               // 每个文件上传成功后，处理相关的事情
               var pathUrl = 'http://ooflcgfeq.bkt.clouddn.com/'+file.target_name
               $('#img_content').html('<img src="" />');
        },
        'Error': function(up, err, errTip) {
               //上传出错时，处理相关的事情
        },
        'UploadComplete': function() {
               //队列文件处理完毕后，处理相关的事情
               
        },
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在unique_names: false，save_key: false时才生效

            var key = "";
            // do something with key here
            return key
        }
    }
});
</script>
</html>
