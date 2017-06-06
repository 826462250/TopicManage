/**
 * 加载js库
 * yxw
 */
require.config({
    paths: {
        jquery: '../common/jquery-1.7.2.min',
    	init: 'initial',
    	index: 'index',
    	tools: 'tools'
    },
    //添加依赖js之间的依赖关系
    shim:{
        'init':['jquery'],
        'index':['init'],
        'tools':['init'],
    }
});

var pageType = document.getElementById("pageType");
if(pageType){
switch(pageType.value)
{
case "index":
	require(['jquery','init','tools','index'], function ($){
		$.init.start();
		$.index.init();
	});
	break;
case "detail":
	require(['jquery','init','tools','_extends','detail'], function ($){
		$.init.start();
		$.detail.init();
	});
	break;
case "folder":
	require(['jquery','init','tools','_extends','folder'], function ($){
		$.init.start();
		$.folder.init();
	});
	break;
case "mail":
	require(['jquery','paginator','init','tools','_extends','mail'], function ($){
		$.init.start();
		$.mail.init();
	});
	break;
case "mail1":
	require(['jquery','paginator','init','tools','_extends','mail1'], function ($){
		$.init.start();
		$.mail.init();
	});
	break;
case "onlineusers":
	require(['jquery','jqGrid','jqGridLanguage_cn','init','tools','_extends','onlineusers'], function ($){
		$.init.start();
		$.onlineusers.init();
	});
	break;
case "onlineusers1":
	require(['jquery','init','tools','_extends','onlineusers1'], function ($){
		$.init.start();
		$.onlineusers.init();
	});
	break;
case "news":
	require(['jquery','init','tools','_extends','newsList'], function ($){
		$.init.start();
		$.news.init();
	});
	break;
case "notice":
	require(['jquery','init','tools','_extends','noticeList'], function ($){
		$.init.start();
		$.notice.init();
	});
	break;
default:
	console.log("未知页面模块");
}}