(function ($) {
	$.index = function () {
//		var _moduleTextPath = $.root + 'templets/module-text.html';
		return {
			init: function(){
				
			},
			/**
			 * 初始化门户选项点击事件(各门户之间的切换)
			 * @returns
			 */
			initPortalsClick: function(){
				$(".portalSelect ul").on("click","a",function(){
					$(this).parent().addClass("selected").siblings().removeClass("selected");
					$.common.getModules($(this).data("value"));
				});
				$(".portalSelect ul").on("click","label",function(){
					$.common.setDefaultPortal($(this).data("value"), this);
				});
			}
		}
	}();
})(jQuery);