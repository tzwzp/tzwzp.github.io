// 调用分页方法
function getPage(id, skin, count, callback) {
    // 调用分页
    laypage({
        cont: id || 'Pages'
        ,skin: skin || 'molv'
        ,pages: Math.ceil(count) // 得到总页数
        ,jump: function(obj, first){
            // 首次不执行
            if (!first) {
                (typeof callback === 'function') && callback.call(this, obj.curr);
            }
        }
    });
    return false;
}

// 刷新验证码
function reloadImage(obj) { 
    var src = $(obj).attr('src');
    if (src.indexOf('?') != -1) {
        url = src.split('?');
        src = url[0];
    }
    src += '?temp=' + Math.floor(Math.random() * 100);
    $(obj).attr('src', src).fadeIn();
} 

// 提交异步表单
function Validform(obj, load, callback, beforeCall) { 
    var index = 0
    ,vform = $(obj).Validform({
        tiptype: function(msg, o, cssctl) {
            if (o.type == 3) {
                layer.msg(msg, {icon:5});
            }
        },
        ajaxPost: true, // 使用ajax方式提交
        postonce: true, // 防止二次提交
        beforeCheck: function(){
            //在表单提交执行验证之前执行的函数，curform参数是当前表单对象。
            //这里明确return false的话将不会继续执行验证操作;
            if (typeof beforeCall === 'function') {
                return beforeCall.call(this, vform);
            }
        },
        beforeSubmit: function(){
            //在验证成功后，表单提交前执行的函数，curform参数是当前表单对象。
            //这里明确return false的话表单将不会提交;
            if (load) {
                index = layer.load(2, {time: 0, shade: [0.2, '#000']});
            }
        },
        callback: function(result) {
            //返回数据data是json对象，{"info":"demo info","status":"y"}
            
            if (load) layer.close(index);
            
            if (typeof callback === 'function') {
                callback.call(this, result, vform);
            } else {
                if (result.status == 1) {
                    layer.msg(result.message, {icon:6}, function(){ 
                        if (result.url) {
                            window.location.href = result.url;
                        } else {
                            window.location.reload();
                        }
                    });
                } else {
                    layer.msg(result.message, {icon:5});
                    vform.resetStatus();
                }
            }
        }
    });
}

// 获取高德地图信息
function getAmap(container, lat, lng, callback, lang, scale, overview, maptype) {
    scale = scale || '';
    overview = overview || '';
    maptype = scale || '';
    var map = new AMap.Map(container, {
        resizeEnable: true,
        zoom: 15,
        center: [lat,lng],
        lang: lang || 'zh'
    });
    //地图比例尺
    scale && map.plugin(["AMap.Scale"],function(){
        var scale = new AMap.Scale();
        map.addControl(scale);  
    });
    //加载鹰眼
    overview && map.plugin(["AMap.OverView"],function(){
        var view = new AMap.OverView();
        view.open();
        map.addControl(view);
    });
    //地图类型切换
    maptype && map.plugin(["AMap.MapType"],function(){
        //地图类型切换
        var type= new AMap.MapType({
            defaultType:0 //使用2D地图
        });
        map.addControl(type);
    });
    //地图操作工具条
    map.plugin(["AMap.ToolBar"],function(){
        //加载工具条
        var tool = new AMap.ToolBar();
        map.addControl(tool);   
    });
    var placeSearch = new AMap.PlaceSearch();  //构造地点查询类
    placeSearch.getDetails("B000A83U0P", function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            var poiArr = result.poiList.pois;
            //添加marker
            var marker = new AMap.Marker({
                map: map,
                position: [lat,lng],
            });
            map.setCenter(marker.getPosition()); 
            if (typeof callback === 'function') {
                infoWindow.setContent(callback.call(this, poiArr[0]));
                infoWindow.open(map, marker.getPosition());
            }
        }
    });
    var infoWindow = new AMap.InfoWindow({
        autoMove: true,
        offset: {x: 0, y: -30}
    });
}

function getAjaxUrl(url,data,type,funok,dataType) {
    $.ajax({
        type: type || "GET",
        url: url,
        data: data || {},
        dataType: dataType || 'json',
        //async: false, // 阻断浏览器执行
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert('服务出错~');
        },
        success: function(res){
            //console.log(res);
            if (res.status == 1) {
                funok && funok.call(this, res);
            } else {
                alert(res.message);
            }
        }
    });
}

/*
示例
<style type="text/css">
.container li{height:100px;margin-bottom:10px;background:#eee}
</style>
<div id="container" class="container" data-total="5" style="width:500px;margin:auto;">
    <ul>
    	<li></li>
    	<li></li>
    	<li></li>
    	<li></li>
    	<li></li>
    	<li></li>
    </ul>
</div>
<script type="text/javascript">
$(function(){
    $("#container").Waterfall({
        ajax_url: "{:categoryUrl($Catid)}",
        success: function(res, t) {
            //console.log(res);
            if (1 != res.status) {
                alert(res.message);
                return false;
            }
            if (res.data.List) {
                var data = res.data.List;
                var html = '';
                for(i in data){
                    html += "<li>"+data[i].infoname+"</li>";
                }
                t.find("ul").append(html);
            }
            else {
                loading.data("on", true).text('已加载全部数据！');
                return false;
            }
        }
    });
});
</script>
*/
$.fn.extend({
    Waterfall: function (opts) {
        var othis = $(this);
        opts = $.extend({
            page: 1, // 分页数
            ajax_url: "", // 异步网址路径
            type: "GET", // 类型
            data: {}, // 数据
            success: "", // 返回成功方法
            load_tpl: "", // 加载模板
            load_msg: "加载中，请稍后...",
            load_over: "别滚动了，已经到底了。。。",
            footer: $(".footer").height()/2,
        }, opts || {});
        
        if (opts.load_tpl) {
            othis.after(opts.load_tpl);
            var loading = othis.next();
        } else {
            othis.after('<div id="loading" class="loading-wrap"><div class="load_msg"><span class="loading ">'+opts.load_msg+'</span></div></div>');
            
            // 用户拖动滚动条，达到底部时ajax加载一次数据
            var loading = $("#loading");
        }
        loading.data("on", false);
        
        // 通过给loading这个div增加属性on，来判断执行一次ajax请求
        $(window).scroll(function(){
            if (loading.data("on")) return;
            if ($(document).scrollTop() > $(document).height()-$(window).height()-Math.floor(opts.footer)) {
                // 在这里将on设为true来阻止继续的ajax请求
                loading.data("on", true).fadeIn();
                
                // 增加分页数
                opts.page++;
                
                // 当前页数 大于 总页数，防止超过总页数继续滚动
                if (opts.page > othis.data('total')) {
                    loading.find('.load_msg').html(opts.load_over);
                    return false;
                }
                
                loading.find('.load_msg').html('<span class="loading">'+opts.load_msg+'</span>');
                
                opts.data.ajax = 1;
                opts.data.p = opts.page;
                $.ajax({
                    type: opts.type,
                    url: opts.ajax_url,
                    data: opts.data,
                    dataType: 'json',
                    //async: false, // 阻断浏览器执行
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        alert('Server error~');
                    },
                    success: function(res){
                        if (typeof opts.success == 'function' && opts.success(res, othis) === false) {
                            return false;
                        }
                        
                        // 一次请求完成，将on设为false，可以进行下一次的请求
                        loading.data("on", false).fadeOut();
                    }
                });
            }
        });
    }
});