(function ($) {
	$.tools = function () {
		var _moduleTextPath = $.root + 'templets/module-text.html',
			_onLineNumPath = $.root + 'account/getOnlineNum',
			_checkUserIsAdminPath = $.root + 'user/checkUserIsAdmin';
		return {
			/**
			 * 初始化下拉按钮
			 */
			initDropDownClick: function(){
				$(document).on("click", ".drop-down", function(){
					var options = $(this).find("ul");
					var time = $(this).data("time") || 100;
					var h = options.children().length * 30 + 10 + "px";
					var $cover;
					if($(this).find(".drop-down-cover").length > 0){
						$cover = $(this).find(".drop-down-cover");
					}else{
						$cover = $('<div class="drop-down-cover"></div>');
					}
					if(options.is(":hidden")){
						options.show()
						options.css({"height":"0"});
						options.animate({height:h}, time);
						$(this).find("i").addClass("active");
						$(this).append($cover);
					}else{
						options.css({"height":h});
						options.animate({height:"0"}, time);
						setTimeout(function(){options.hide()}, time);
						$(this).find("i").removeClass("active");
						$cover.remove();
					}
				});
				//添加了.select样式的为选择下拉框，  选择下拉选项的时候改变当前显示位置的值
				$(".drop-down.select ul").on("click","li a",function(){
					$(this).parent().parent().parent().children("span").html($(this).html());
					$(this).parent().parent().parent().children("span").data("value",$(this).data("value"));
				});
			},
			/**
			 * 重新分配单元格比例
			 */
			repartition: function(){
				//首先获取所有需要被分配的模块，以allot标记区分
				var allotElems = $(".allot");
				for (var i = 0; i < allotElems.length; i++) {
					var allotElem = allotElems.eq(i);
					var orientation = allotElem.data("orientation") == "portrait" ? "height" : "width";
					var cells = allotElem.find("> .cell");
					var totalRatio = 0;
					for (var j = 0; j < cells.length; j++) {
						var cell = cells.eq(j);
						var ratio = cell.data("ratio") || 1;
						totalRatio += ratio;
					}
					for (var j = 0; j < cells.length; j++) {
						var cell = cells.eq(j);
						var percent = cell.data("ratio")/totalRatio * 100 + "%";
						cell.css(orientation, percent);
					}
				}
			},
			/**
			 * 设置导航菜单加载更多按钮功能
			 */
			setMenuClick: function(){
				$(".show-menu").click(function(){
					var main = $(this).parent().parent().find(".main");
					if($(this).data("show")){
						main.css({"height":"260px"});
						main.find(".ellipsis").show();
						$(this).find("i").removeClass("active");
						$(this).find("span").html("加载全部");
						$(this).data("show",false);
					}else{
						main.css({"height":"auto"});
						main.find(".ellipsis").hide();
						$(this).find("i").addClass("active");
						$(this).find("span").html("收起加载");
						$(this).data("show",true);
					}
				});
			},
			trackEvent: function(id, element){
				$(id).on("click", element, function(){
					var category = $(this).data("category");
					var action = $(this).data("action") || "访问";
					var _userName = $("#_userName").val();
					var _position = $("#_position").val();
					_hmt.push(['_trackEvent', category, action, _userName,_position]);
				});
			},
			initHref: function(){
				$(document.body).on("click",".href",function(){
					var href = encodeURI($(this).attr("url"));
					window.open(href, $(this).attr("target"));
				});
			},
			/**
			 * 初始化logo点击事件
			 */
			initLogoClick: function(){
				$(".logo").click(function(){
					window.location.href = $.root;
				});
			},
			/**
			 * 判断用户是否为管理员
			 */
			isAdmin: function(){
				var result;
				$.ajax({
					type: "post",
					async:false,
					url: _checkUserIsAdminPath,
					data: {},
					dataType:"json",  
					success: function(json){
						if(json.isAdmin){
							result = true;
						}else{
							result = false;
						}
	               },
	               error: function(){
	            	   result =  false;
	               }
	            });
				return result;
			},
			/**
			 * 添加后台管理员通道
			 * @returns
			 */
			setAdminMenu: function(){
				if($.tools.isAdmin()){
					$(".userInfo ul").prepend('<li><a target="admin" href="'+$.root+'admin">后台登录</a></li>')
				}
			},
			/**
			 * 加载图表
			 */
			loadChart: function(json, id){
				var echarts = require('echarts');
				var myChart = echarts.init(document.getElementById(id));
				myChart.setOption(json);
			},
			/**
			 * 获取按钮模块，未读数量
			 * arr: 参数数组
			 * {
			 *	id: 1,
			 *	href: 'javascript:alert(\'暂未上线，敬请期待...\');',  --按钮点击跳转链接
			 *	url: '/portal/official/getDocumentWaitCheckNum',  --数据请求地址
			 *	icon: 'icon_doc.png',  --显示图标(需要在module.css中添加对应的样式)
			 *	font: '公文任务',  --按钮名称
			 *	param:{}  -- 请求接口所需参数
			 */
			getUnRead: function(arr){
				if(arr){
					for (var i = 0; i < arr.length; i++) {
						(function () {
							var obj = arguments[0];
							$.ajax({  
								type: "post",
								url: obj.url,
								data: obj.param,
								dataType:"json",  
								success: function(json){
									if(json.result){
										if(json.data.totalCount > 0){
											$("."+obj.id).find('.icon').find('span').html(json.data.totalCount);
											$("."+obj.id).find('.icon').find('span').show();
										}
									}else{
										console.log(obj.url + ":" +json.msg);
									}
				               }  
				            });
						})(arr[i]);
					}
				}
			},
			/**
			 * 初始化轮播插件
			 * mouldId: 模块ID
			 * time: 自动切换时间，不填则不切换
			 * slidesPerView: 滚动个数
			 * loop: 是否循环
			 */
			initSwip: function(mouldId, time, slidesPerView, loop){
				var mySwiper = $('#swiper_'+mouldId).swiper({
					pagination: '.pagination_'+mouldId,
				    loop: loop || false,
				    grabCursor: true,
				    paginationClickable: true,
				    autoplayDisableOnInteraction: false,
				    autoplay: time,
				    slidesPerView: slidesPerView || 1
				});
				$('#swiper_'+mouldId).on('click', '.arrow-left', function(e){
					e.preventDefault()
					var swiper = $(this).parent().data('swiper');
					swiper.swipePrev();
				});
				$('#swiper_'+mouldId).on('click', '.arrow-right', function(e){
					e.preventDefault()
					var swiper = $(this).parent().data('swiper');
					swiper.swipeNext();
				});
				return mySwiper;
			},
			/**
			 * 时间格式化
			 */
			dateFormat: function (dateString,format) {
	            if(!dateString)return "";
	            var time = new Date($.trim(dateString.replace(/-/g,'/').replace(/T|Z/g,' ')));
	            var o = {
	                "M+": time.getMonth() + 1, //月份
	                "d+": time.getDate(), //日
	                "h+": time.getHours(), //小时
	                "m+": time.getMinutes(), //分
	                "s+": time.getSeconds(), //秒
	                "q+": Math.floor((time.getMonth() + 3) / 3), //季度
	                "S": time.getMilliseconds() //毫秒
	            };
	            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
	            for (var k in o)
	                if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	            return format;
	        },
	        /**
	         * 获取在线人数
	         */
	        getOnlineNum: function(){
	        	$.ajax({  
					type: "post",
					url: _onLineNumPath,
					data: {},
					dataType:"json",  
					success: function(json){
						if(json.result && $(".onLine").length > 0){
							$(".onLine i.count").html(json.data.count);
						}else{
							$(".onLine").hide();
						}
	               }  
	            });
	        },
	        /**
	         * 显示提示框
	         * @param str 提示文字
	         * @param type 提示类型{error: 报错(红色),waring: 警告(黄色),success: 成功(绿色),information: 通用信息(蓝色),default: alert}
	         * @param time 消失时间,如果不填则不消失，点击按钮后消失
	         * @returns
	         * 
	         */
	        showTips: function(str, type, time){
	        	type = type || "";
	        	var $li = $('<li>');
	        	var $tips_outer = $('<div class="tips-outer" />');
	        	var $tips_inner = $('<div class="tips-inner" />');
	        	var $tips_text = $('<span class="tips-text" />');
	        	var $alertTips = $("#alertTips");
	        	$li.append($tips_outer.addClass(type));
	        	$li.addClass("animated bounceInLeft");
	        	$li.click(function(){
	        		if($.tools.isSupport()){
	        			if($(this).siblings().length <= 0){
		        			$(this).addClass("bounceOutLeft").one('animationend', function(){$(this).parent().remove();});
	        			}else{
	        				$(this).addClass("bounceOutLeft").one('animationend', function(){$(this).remove();});
	        			}
	        		}else{
	        			if($(this).siblings().length <= 0){
		        			$(this).parent().remove();
	        			}else{
		        			$(this).remove();
	        			}
	        		}
	        	});
	        	if(time){
	        		setTimeout(function(){$li.click();},time);
	        	}
	        	$tips_outer.append($tips_inner);
	        	$tips_inner.append($tips_text);
	        	$tips_text.append(str);
	        	if($alertTips.length <= 0){
	        		$alertTips = $('<ul>').attr("id","alertTips");
		        	$alertTips.append($li);
		        	$(document.body).append($alertTips);
	        	}else{
		        	$alertTips.append($li);
	        	}
	        },
			/**
			 * 判断IE浏览器版本
			 * @returns
			 */
			isLowVersion: function (){
		    	var browser=navigator.appName
		    	var b_version=navigator.appVersion
		    	var version=b_version.split(";");
		    	var trim_Version=version[1].replace(/[ ]/g,"");
		    	if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0"
		    	|| browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"
			    || browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"
		    	|| browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){return true;}
		    	return false;
			},
			/**
			 * 判断是否IE浏览器
			 * @returns
			 */
			isSupport: function (){
		    	if(navigator.userAgent.indexOf("Edge") > -1
		    	|| navigator.userAgent.indexOf("MSIE") > -1
			    || navigator.userAgent.indexOf("rv:11") > -1){return false;}
		    	return true;
			},
	        /**
	         * 判断字符串是否为空
	         */
	        isNullOrEmpty: function(str){
	        	if(str == null || str == "" || str == undefined || str == "null"){
	        		return true;
	        	}else{
	        		return false;
	        	}
	        },
	        /**
	         * 文件大小转换对应单位
	         */
	        bytesToSize: function(bytes) {
	            if (bytes === 0) return '0 B';
	            var k = 1024, // or 1024
	                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	                i = Math.floor(Math.log(bytes) / Math.log(k));
	           return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	        },
	        /**
	         * 文件下载
	         * url: 文件下载地址
	         * id: 文件对应ID
	         * url中对应文件ID参数为dmFileId
	         */
	        downLoadFiles: function(url,id){
	        	$.ajax({
					type: "post",
					url: $.root + "portlet/downloadCheckDmFile?dmFileId=" + id,
					data: {},
					dataType:"json",  
					success: function(json){
						if(json.result){
							window.location.href = url+"?dmFileId=" + id;
						}else{
							$.showTips(json.msg, 'error', 3000);
						}
	               }
	            });
	        },
	        /**
	         * e: 需要加载动画的jquery对象
	         * size: 加载动画大小(默认 100 * 100)
	         * 值	large  (200 * 200)
	         * 		small  (50 * 50)
	         * 		可以传具体像素大小,例: 150
	         * color: 动画背景色
	         */
	        wating: function(e, size, color){
	        	var $outer = $("<div>");
	        	var $inner = $("<div>");
	        	var $img = $("<img>");
	        	$outer.addClass("wating-outer");
	        	$inner.addClass("wating-inner");
	        	if(color == "gray"){
		        	$img.attr("src",$.root + "assets/images/common/wating_gray.gif");
	        	}else{
		        	$img.attr("src",$.root + "assets/images/common/wating_white.gif");
	        	}
	        	$outer.append($inner);
	        	$inner.append($img);
	        	if(size && !isNaN(size)){
	        		$inner.css({width: size+"px",height: size+"px",marginLeft: -size/2 +"px",marginTop: -size/2 +"px"});
	        	}else if(size){
	        		$inner.addClass(size);
	        	}
	        	if(e.find(".wating-outer").length == 0){
	        		e.addClass("wating");
	        		e.append($outer);
	        	}
	        },
	        /**
	         * 清除加载动画
	         */
	        clearWating: function(e){
	        	e.removeClass("wating");
	        	e.find(".wating-outer").remove();
	        },
	        /**
	         * 数据加载失败提醒
	         * type: text(文字提示), img(图片提示)
	         * value: 显示的字符串
	         * action: 刷新调用的事件
	         */
	        loadFaild: function(e, type, value, action){
	        	var $tableOuter = $("<div>");
	        	var $table = $("<table>");
	        	var $tr = $("<tr>");
	        	var $td = $("<td>");
	        	var $div = $("<div>");
	        	$tableOuter.append($table);
	        	$table.append($tr);
	        	$tr.append($td);
	        	$td.append($div);
	        	$tableOuter.addClass("table-outer");
	        	
	        	$div.html(value);
	        	$div.addClass(type);
        		if(e.find("."+type).length == 0){
        			e.addClass("faild");
        			e.append($tableOuter);
        		}
	        },
	        getDefaultAvatarPath: function(){
	        	if(this.isLowVersion()){
	        		return $.root + 'assets/images/common/icon_avatar.png';
	        	}else{
	        		return $.root + 'assets/images/common/icon_avatar.svg';
	        	}
	        },
	        getCurrentWeek: function(){
	        	//起止日期数组    
	            var startStop = {};  
	            //获取当前时间    
	            var currentDate = new Date();  
	            //返回date是一周中的某一天    
	            var week = currentDate.getDay();  
	            //返回date是一个月中的某一天    
	            var month = currentDate.getDate();  
	      
	            //一天的毫秒数    
	            var millisecond = 1000 * 60 * 60 * 24;  
	            //减去的天数    
	            var minusDay = week != 0 ? week - 1 : 6;  
	            //alert(minusDay);    
	            //本周 周一    
	            var monday = new Date(currentDate.getTime() - (minusDay * millisecond));
	            //本周 周日    
	            var sunday = new Date(monday.getTime() + (6 * millisecond));
	            //添加本周时间    
	            startStop.start = monday.getFullYear() + "-" + (monday.getMonth() + 1) + "-" + monday.getDate(); //本周起始时间    
	            //添加本周最后一天时间    
	            startStop.stop = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate(); //本周终止时间    
	            //返回    
	            return startStop;
	        }
		}
	}();
	$.showTips = $.tools.showTips;
	$.isNullOrEmpty = $.tools.isNullOrEmpty;
	$.wating = $.tools.wating;
	$.clearWating = $.tools.clearWating;
	$.loadFaild = $.tools.loadFaild;
})(jQuery);