(function ($) {
	// 对Date的扩展，将 Date 转化为指定格式的String 
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	// 例子： 
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	Date.prototype.Format = function(fmt) 
	{ //author: meizz 
	  var o = { 
	    "M+" : this.getMonth()+1,                 //月份 
	    "d+" : this.getDate(),                    //日 
	    "h+" : this.getHours(),                   //小时 
	    "m+" : this.getMinutes(),                 //分 
	    "s+" : this.getSeconds(),                 //秒 
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
	    "S"  : this.getMilliseconds()             //毫秒 
	  }; 
	  if(/(y+)/.test(fmt)) 
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	  for(var k in o) 
	    if(new RegExp("("+ k +")").test(fmt)) 
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
	  return fmt; 
	}
    $.fn.extend({
    	//序列化表单输入元素为字符串
        serializeJson : function () {
            var serializeObj = {};
            var array = this.serializeArray();
            var str = this.serialize();
            $(array).each(function () {
                if (serializeObj[this.name]) {
                    if ($.isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [serializeObj[this.name], this.value];
                    }
                } else {
                    serializeObj[this.name] = this.value;
                }
            });
            return serializeObj;
        },
        insertContent : function(myValue, t) {
            var $t = $(this)[0];
            if (document.selection) {//ie
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
                sel.moveStart('character', -l);
                var wee = sel.text.length;
                if (arguments.length == 2) {
                    var l = $t.value.length;
                    sel.moveEnd("character", wee + t);
                    t <= 0 ? sel.moveStart("character", wee - 2 * t
                            - myValue.length) : sel.moveStart(
                            "character", wee - t - myValue.length);
                    sel.select();
                }
            } else if ($t.selectionStart
                    || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos)
                        + myValue
                        + $t.value.substring(endPos,
                                $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
                if (arguments.length == 2) {
                    $t.setSelectionRange(startPos - t,
                            $t.selectionEnd + t);
                    this.focus();
                }
            } else {
                this.value += myValue;
                this.focus();
            }
        }
    })
    $.extend({
        //格式化字符串
        format: function (source, params) {
            if (arguments.length == 1)
                return function () {
                    var args = $.makeArray(arguments);
                    args.unshift(source);
                    return $.format.apply(this, args);
                };
            if (arguments.length > 2 && params.constructor != Array) {
                params = $.makeArray(arguments).slice(1);
            }
            if (params.constructor != Array) {
                params = [params];
            }
            $.each(params, function (i, n) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
            });
            return source;
        },
        //用json格式post表单
        postFormJson: function (formid, sucCallback, errCallback) {
            var form = $("#" + formid),
                args = {
                    type: "POST",
                    url: form.attr("action"),
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(form.serializeJson()),
                    dataType: "json"
                };
            if (sucCallback) {
                args.success = sucCallback;
            }
            if (errCallback) {
                args.error = errCallback;
            }
            $.ajax(args);
        },
        //计算时间差
        dateTimespan: function (dateString) {
            var targetDate = new Date(Date.parse(dateString.replace(/-/g, "/"))),
        		now = new Date(),
                timespan = now - targetDate;
            //计算出相差天数
            var days = Math.floor(timespan / (24 * 3600 * 1000));
            //计算出小时数
            //计算天数后剩余的毫秒数
            var leave1 = timespan % (24 * 3600 * 1000);
            var hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000);
            //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000);
            //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            return {
                date: targetDate,
                days: days,
                minutes: minutes,
                seconds: seconds
            };
        },
        //格式化时间,格式为：yyyy-mm-dd HH:mm:ss
        dateFormat: function (dateString) {
            var d;
            if (typeof (dateString) == "string") {
                d = new Date(Date.parse(dateString.replace(/-/g, "/")));
            } else if (typeof (dateString) == "object") {
                d = dateString;
            } else { return; }
            return {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                day: d.getDate(),
                hour: d.getHours(),
                min: d.getMinutes(),
                seconds: d.getSeconds()
            };
        },
        dateFormatFromTime: function (time) {
            var d;
            if (typeof (time) == "number") {
                d =new Date(time);
            } else if (typeof (time) == "string") {
                d = new Date(parseInt(time));
            } else if (typeof (time) == "object") {
                d = time;
            } else { return; }
            return {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                day: d.getDate(),
                hour: d.getHours(),
                min: d.getMinutes(),
                seconds: d.getSeconds()
            };
        },
        //计算时间差描述
        timeDesc: function (dateString) {
            var d = $.dateFormatFromTime(dateString),
                now = $.dateFormatFromTime(new Date()),
                result;

            if (now.year == d.year) {
                if (now.month == d.month) {
                    switch (now.day - d.day) {
                        case 0: {
                            switch (now.hour - d.hour) {
                                case 0: {
                                    if ((now.min - d.min) < 2) {
                                        result = "刚刚";
                                    } else {
                                        result = (now.min - d.min) + "分钟前";
                                    }
                                }; break;
                                case 1:
                                case 2: result = (now.hour - d.hour) + "个小时前"; break;
                                default: result = "今天 " + d.hour + ":" +  (d.min<10?"0"+d.min:d.min); break;
                            }
                        }; break;
                        case 1: result = "昨天 " + d.hour + ":" + (d.min<10?"0"+d.min:d.min); break;
                        case 2: result = "前天 " + d.hour + ":" + (d.min<10?"0"+d.min:d.min); break;
                        default: result = d.month + "月" + d.day + "日 " + d.hour + ":" + (d.min<10?"0"+d.min:d.min); break;
                    }
                } else {
                    result = d.month + "月" + d.day + "日 " + d.hour + ":" + (d.min<10?"0"+d.min:d.min);
                }
            } else {
                result = d.year + "年" + d.month + "月" + d.day + "日 " + d.hour + ":" + (d.min<10?"0"+d.min:d.min);
            }
            return result;
        }
    })
})(jQuery);