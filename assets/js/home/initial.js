(function ($) {
	$.root = "/TopicManage/";
	$.init = function () {
		return {
			start: function(){
//				$.tools.initLogoClick();
				$.tools.initDropDownClick();
				$.tools.repartition();
//				$.tools.getOnlineNum();
//				$.tools.setAdminMenu();
//				$.tools.initHref();
//				$.tools.trackEvent('.mould', 'a.trackEvent');
//				setInterval(function () { $.post($.root + "account/portletKeepAlive"); }, 19 * 60 * 1000);
			}
		}
	}();
})(jQuery);