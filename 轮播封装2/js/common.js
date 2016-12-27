(function(){

	function Common(el, opts) {
		var _this = this;
		this.opts = $.extend({}, Common.DEFAULTS, opts);
		this.el = $(el);
		this.len = this.el.find("ul li").length;
		this.el_ul = this.el.width() * this.len;
		this.len_w = this.el.find("ul li").width();
		var btn = "<div class='btn'>";
		this.el.find("ul").css("width", this.el_ul);
		this.el.find("ul li").css("width", this.el.width());
		for (var i = 0; i < this.len; i++) {
			var ii = i + 1;
			btn += "<span>" + ii + "</span>";
		}
		btn += "</div><div class='preNext pre'></div><div class='preNext next'></div>";
		this.el.append(btn);

		this.el.find(".preNext").css("opacity", 0.2).hover(function() {
			$(this).stop(true, false).animate({
				"opacity": "0.5"
			}, 300);
		}, function() {
			$(this).stop(true, false).animate({
				"opacity": "0.2"
			}, 300);
		});
		this.el.find("div.btn span").css("opacity", 0.4).mouseenter(function() {
			_this.index = $(this).index();
			_this._showPics(_this.index);
		}).eq(0).trigger("mouseenter");


		this.el.hover(function() {
			clearInterval(_this.picTimer);
		}, function() {
			_this.picTimer = setInterval(function() {
				_this._showPics(_this.index);
				_this.index++;
				if (_this.index == _this.len) {
					_this.index = 0;
				}
			}, _this.opts.speed);
		}).trigger("mouseleave");

		this.index = 0;
		this.picTimer;
		this.el.find(".pre").on('click', $.proxy(this._pre, this));
		this.el.find(".next").on('click', $.proxy(this._next, this));

	}
	Common.DEFAULTS = {
		"speed": 2500,
	};
	Common.prototype._pre = function() {
		this.index -= 1;
		if (this.index == -1) {
			this.index = this.len - 1
		}
		this._showPics(this.index);
	}
	Common.prototype._next = function() {
		this.index += 1;
		if (this.index == this.len) {
			this.index = 0;
		}
		this._showPics(this.index);
	}
	Common.prototype._showPics = function(num) {
		var nowLeft = -num * this.len_w;
		this.el.find("ul").stop(true, false).animate({
			"left": nowLeft
		}, 300);
		this.el.find("div.btn span").removeClass("on").eq(num).addClass("on");
		this.el.find("div.btn span").stop(true, false).animate({
			"opacity": "0.4"
		}, 300).eq(num).stop(true, false).animate({
			"opacity": "1"
		}, 300);
	}

	$.fn.extend({
		common: function(opts) {
			return this.each(function() {
				new Common(this, opts)
			});
		}
	});
})()