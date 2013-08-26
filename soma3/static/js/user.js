$(document).ready(function()
{
	$("#container").addClass("container-js");
	if(supportsSVG()) $("#container").addClass("svg");
	if(navigator.userAgent.match(/applewebkit/i))
	{
		if(!navigator.geolocation)
		{
			$("#container").addClass("decelerate");
		}
		else
		{
			if (navigator.platform.match(/ipad/i) ||
				navigator.platform.match(/iphone/i) ||
				navigator.platform.match(/ipod/i) ) $("#container").addClass("ios");
		}
		if (navigator.userAgent.match(/chrome/i) &&
			navigator.userAgent.match(/windows/i) ) $("#container").addClass("noinset");
	}

	var profileCount = 0;
	var timer = null;
	profileShow = function(obj) {
		if(profileCount == 0)
		{
			clearTimeout(timer);
			$("#profile-menu").stop(true, true);
			$("#profile-menu").css({"display": "block", "opacity": 1.0});
			$("#header > .navbar-profile > .profile > img").css("opacity", 0.16);
		}
		profileCount ++;
	};
	profileHide = function() {
		profileCount --;
		if(profileCount == 0)
		{
			$("#profile-menu").stop(true, true);
			$("#profile-menu").css("opacity", 0.0);
			$("#header > .navbar-profile > .profile > img").css("opacity", 1.0);
			timer = setTimeout("$(\"#profile-menu\").css(\"display\", \"none\");", 100);
		}
	};
	$("#header > .navbar-profile > .profile > img").hover(profileShow, profileHide);
	$("#profile-menu").hover(profileShow, profileHide);
});

// Stylesheet is load-complate
$("head").styleReady(function(){
	$("body").css("display", "block");
	
	// Graph rendering
	if($("body").hasClass("insight") )
	{
		$("#dailyES").ready(function(){
			Raphael.custom.areaGraph(server_url + project_id + "/userdashboard/dailyes", "#dailyES", {"lineWidth": 1, "horizonLine": false, "verticalLine": false, "leftgutter": 0, "topgutter": 5,
				"color": "#dca763", "lineColor": "#3a3f42", "textColor": "#303335", "autoResize": true });
		});
		$("#typeES").ready(function(){
			Raphael.custom.pieGraph(server_url + project_id + "/userdashboard/typees", "#typeES", {"lineWidth": 1, "horizonLine": false, "verticalLine": false, "leftgutter": 0, "topgutter": 5,
				"lineColor": "#ffffff", "textColor": "#303335", "labelPos": "east", "colorTable": [ "#de6363", "#5a9ccc", "#72c380", "#cccdc7", "#9d61dd", "#6371dc", "#dca763", "#a96f6e", "#6fa79a", "#737270" ], "autoResize": true });
		});
	}

	/** Component Start **/
	// Dropdown(multiple select) component
	$(".dropdown.multiple").ready(function(){
		$(".dropdown.multiple").each(function(){
			var me = $(this);
			var chd = me.children("a");
			var name = chd.html();
			var codename = me.children("input").attr("name");

			chd.html("<div></div>");
			chd = chd.children("div");
			chd.addClass("checkbox").addClass("half");
			chd.html("<span></span><label>" + name + "</label>");

			chd = me.children("span");

			me.children("div").children("ul").children("li").each(function(){
				var chd2;
				var name2 = $(this).children("a").html();

				$(this).html("<div></div>");
				chd2 = $(this).children("div");
				chd2.addClass("checkbox");
				chd2.html("<span></span><label>" + name2 + "</label><input type=\"hidden\" name=\"" + codename + "[]\" data-group=\"" + name + "\" data-value=\"" + name2 + "\" />");
			});
			me.children("input").remove();
		});
	});

	// Radiobox component
	$(".radiobox").ready(function()
	{
		// Initialize
		var radiobox_objects = $(".radiobox");
		for(var i = 0; i < radiobox_objects.length; i ++)
		{
			var me = radiobox_objects.eq(i);
			me.attr("data-name", me.children("input").attr("name") );
			me.attr("data-value", me.children("input").attr("value") );

			var group_info = $(".radiobox[data-name=" + me.attr("data-name") + "]");
			if(group_info.length > 1) me.children("input").remove();

			if($(this).children("span").attr("data-value") == "checked")
				group_info.eq(0).children("input").attr("value", me.attr("data-value") );
		}

		// Click event
		$(".radiobox").click(function(){
			var group_info = $(".radiobox[data-name=" + $(this).attr("data-name") + "]");
			group_info.children("span[data-value=checked]").attr("data-value", "");
			group_info.eq(0).children("input").attr("value", $(this).attr("data-value") );
			$(this).children("span").attr("data-value", "checked");
		});
	});

	// Checkbox component
	$(".checkbox").ready(function()
	{
		// Initialize
		$(".checkbox").each(function(index){
			if($(this).children("input").attr("value") )
				$(this).attr("data-value", "checked");
		});

		// Click event
		$(".checkbox").click(function() {
			if($(this).attr("data-value") == "checked" || $(this).attr("data-value") == "halfed")
			{
				$(this).attr("data-value", "");
				$(this).children("input").removeAttr("value");
			}
			else
			{
				$(this).attr("data-value", "checked");
				$(this).children("input").attr("value", $(this).children("input").attr("data-value"));
			}
			if($(this).parent().parent().hasClass("dropdown") )
			{
				if($(this).attr("data-value") == "checked")
				{
					$(this).parent().parent().children("div").children("ul").children("li").children(".checkbox[data-value!=checked]").click();
				}
				else
				{
					$(this).parent().parent().children("div").children("ul").children("li").children(".checkbox[data-value=checked]").click();
				}
			}
			else if($(this).parent().parent().parent().parent().hasClass("dropdown") )
			{
				var cnt1 = $(this).parent().parent().children("li").children(".checkbox[data-value=checked]").length;
				var cnt2 = $(this).parent().parent().children("li").length;

				if(cnt1 == 0)				
					$(this).parent().parent().parent().parent().children("a").children(".checkbox").attr("data-value", "");
				else if(cnt1 == cnt2)
					$(this).parent().parent().parent().parent().children("a").children(".checkbox").attr("data-value", "checked");
				else
					$(this).parent().parent().parent().parent().children("a").children(".checkbox").attr("data-value", "halfed");
			}
		});
	});

	// Dropdown component
	$(".dropdown").ready(function()
	{
		itemClickEvent = function(obj) {
			$(this).parent().children("li[data-value=\"true\"]").attr("data-value", "false");
			if($(this).attr("data-value") == "true")
				$(this).attr("data-value", "false");
			else
				$(this).attr("data-value", "true");
			$(this).parent().parent().parent().children("a").html($(this).children("a").html());
			$(this).parent().parent().parent().children("input").attr("value", $(this).index() + 1);

			$(this).parent().parent().hide();
		}

		// Dialog showing
		showDialog = function(th)
		{
			var h = $(th).position().top + 40;
			for(var i = 0; i < $(th).children("div").children("ul").children().length; i ++)
			{
				if($(th).children("div").children("ul").children().eq(i).css("display") == "none") continue;
				if(h + 36 > $(document).height() ) break;
				h += 36;
			}
			$(th).children("div").width("");
			$(th).children("div").show();
			$(th).children("div").width($(th).children("div").width() );
			$(th).children("div").height(h - $(th).position().top - 40);
		}

		// Initialize
		$(".dropdown").each(function(index){
			$(this).children("div").children("ul").children("li").attr("data-value", "false");
			$(this).children("div").children("ul").children("li").eq($(this).children("input").attr("value") - 1).attr("data-value", "true");
			$(this).children("a").html($(this).children("div").children("ul").children("li").eq($(this).children("input").attr("value") - 1).children("a").html());

			$(this).children("div").css("min-width", $(this).width() + 42);
		});

		// Mouse over/out event
		$(".dropdown").hover(function() {
			$(this).attr("data-type", "over");
			if($(this).hasClass("simple") )
				showDialog(this);
		}, function() {
			$(this).attr("data-type", "");
			$(this).children("div").hide();
		});

		// Click event
		$(".dropdown").click(function() {
			if(!$(this).hasClass("simple") )
			{
				if($(this).attr("data-type") != "clicked"){
					$(this).attr("data-type", "clicked");
					showDialog(this);
				}
				else
				{
					$(this).attr("data-type", "");
					$(this).children("div").hide();
				}
			}
		});
		// Click to Dropdown component's item event
		$(".dropdown:not(.multiple)").each(function(){
			$(this).children("div").children("ul").children("li").click(itemClickEvent);
		});

		// Tags-list component
		$(".tags-list").ready(function()
		{
			// Add to hidden input
			addHiddenInput = function(obj, name) {
				if(obj.children("input") != null)
					obj.append("<input type=\"hidden\" name=\"" + name + "[]\" value=\"" + obj.html() + "\" />");
			}

			// Add event
			addEvent = function(obj) {
				if($(this).css("display") != "none")
				{
					var newME = $(this).parent().parent().parent().parent().children("li:nth-last-child(1)").before("</li><li>").parent().children("li:nth-last-child(2)");
					newME.click(restoreEvent);
					newME.html($(this).parent().parent().parent().children("a").html());

					$(this).parent().parent().parent().children("a").html("Add More")
					$(this).css("display", "none");
				}
			}
			// Restore event
			restoreEvent = function(obj) {
				var dropdown = $(this).parent().children("li:nth-last-child(1)").children("div").children("ul");
				dropdown.append("<li data-value=\"false\"><a>" + $(this).html() + "</a></li>");
				dropdown.children("li:nth-last-child(1)").click(itemClickEvent).click(addEvent);
				$(this).remove();
			}

			// Initialize
			$(".tags-list").each(function(index){
				var child = $(this).children("ul").children("li");
				$(this).attr("data-name", $(this).children("input").attr("name") );
				$(this).children("input").remove();

				for(var i = 0; i < child.length; i ++)
				{
					if(!child.eq(i).hasClass("dropdown") )
					{
						addHiddenInput(child.eq(i), $(this).attr("data-name") );
						child.eq(i).click(restoreEvent);
					}
				}
				$(".tags-list .dropdown > div").css("min-width", parseInt($(".tags-list .dropdown > div").css("min-width") ) - 26);
				$(".tags-list .dropdown > div li").click(addEvent);
			});
		});
	});

	// Scrollbar component
	$(".scrollbar").ready(function()
	{
		// Initialize
		$(".scrollbar").each(function(index){
			var index = $(this).children("input").attr("value");
			var persent = 100.0 / ($(this).children("ul").children("li").length - 1);
			$(this).children("ul").children("li").each(function(){
				if($(this).children("a")[0].innerText == index)
					$(this).attr("data-value", "true");
				$(this).css("width", persent+"%");
			});
		});

		// Mouse over/out event
		$(".scrollbar > ul > li").hover(function() {
			if($(this).attr("data-value") )
				$(this).attr("data-temp", $(this).attr("data-value"));
			else
				$(this).attr("data-temp", "false");
			$(this).attr("data-value", "true");
		}, function() {
			$(this).attr("data-value", $(this).attr("data-temp"));
			$(this).removeAttr("data-temp");
		});
		$(".scrollbar > ul > li").click(function(){
			$(this).parent().children("li[data-value=true]").attr("data-value", "false");
			$(this).attr({"data-value":"true", "data-temp":"true"});
			$(this).parent().parent().children("input").attr("value", $(this).children("a")[0].innerText);
		});
	});
	/** Component End **/

	$(".checkbox.red").click(function() {
		if($(this).attr("data-value") == "checked"){
			$(".checkbox:not(.red)[data-value=checked] > input[name=\""+$(this).children("input").attr("name")+"\"]").each(function() { $(this).parent().click(); });
		}
	});
	$(".checkbox:not(.red)").click(function() {
		if($(this).attr("data-value") == "checked"){
			$(".checkbox.red[data-value=checked] > input[name=\""+$(this).children("input").attr("name")+"\"]").each(function() { $(this).parent().click(); });
		}
	});

	// Auto-resize table
	addWindowResize(function(){
		$("table > tbody > tr.empty").each(function(){
			$(this).css("display", "table-row");
			$(this).children().each(function(child){
				if($(this).attr("data-match") != "true")
					return;

				var w = $(this).width();
				var chd = $(this).parent().parent().children().eq(0).children().eq($(this).index()).children(":not(p)");
				for(var i = 0; i < chd.length; i ++)
					w -= chd.eq(i).width() + 12;

				$(this).parent().parent().children().each(function(){
					if($(this).parent().hasClass("empty") == true)
						return;

					$(this).children().eq(child).children("p").width(w);
				});
			});
			$(this).css("display", "none");
		});
	})();
});