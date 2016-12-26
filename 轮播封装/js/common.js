
define(['jquery'],function($){
	function Common(el,opts){
		var _this=this;
		this.opts = $.extend({}, Common.DEFAULTS, opts);
		this.el = $(el);
		this.len = this.el.find("ul li").length; //获取焦点图个数
		var btn = "<div class='btn'>";
		this.index = 0;
		var picTimer;
		// console.log(_this.el.width()*_this.len)
		this.el.find("ul").css("width", _this.el.width()*_this.len);
		for (var i = 0; i < this.len; i++) {
			var ii = i + 1;
			btn += "<span>" + ii + "</span>";
		}
		btn += "</div><div class='preNext pre'></div><div class='preNext next'></div>";
		this.el.append(btn);
		//上一页、下一页按钮透明度处理
		console.log(el + " .preNext")
		this.el.find(".preNext").css("opacity", 0.2).hover(function() {
			$(this).stop(true, false).animate({
				"opacity": "0.5"
			}, 300);
		}, function() {
			$(this).stop(true, false).animate({
				"opacity": "0.2"
			}, 300);
		});
		this.el.find(".pre").on('click',$.proxy(this.move.pre,this));
		this.el.find(".next").on('click',$.proxy(this.move.next,this));

	}
	Common.DEFAULTS={
		"speed":500,
		"delay": 5000,
		"autoPlay": false
	};
	Common.prototype._pre=function(){
		console.log(this.l)
	}



	Common.prototype.move={
		pre:function(){
			console.log(this.index)
			this.index -= 1;
			if (this.index == -1) {
				this.index = this.len - 1;
			}
			showPics(this.index);
		},
		next:function(){
			index += 1;
			if (index == this.len) {
				index = 0;
			}
			showPics(index);
		}
	}


	Common.prototype.showPics = function(index) { //普通切换
		var nowLeft = -this.index * sWidth; //根据index值计算ul元素的left值
		$(slid + " ul").stop(true, false).animate({
			"left": nowLeft
		}, 300)
	}; //通过animate()调整ul元素滚动到计算出的position

	return {
		Common:Common
	}
})