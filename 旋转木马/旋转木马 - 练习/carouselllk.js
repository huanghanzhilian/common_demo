// JavaScript Document


//attr是jq获取元素节点属性值对象




(function(w) { //封装闭包防止污染
	var Carousel = function(en) { //函数表达式  en参数
		var hjk = this;     //hjk等于this
		//保持单个木马节点对象
		this.poster = en;   //this.poster等于传进来的参数元素
		this.posterItemMain = en.find("ul.posetr_list");  //找到ui父容器
		this.nextBtn = en.find("div.posetr_btn_l");    //找到左
		this.prevBtn = en.find("div.posetr_btn_r");    //找到右
		this.posterItems = en.find("li.posetr_item");   //找到数组元素

		if (this.posterItems.size() % 2 == 0) {    //每个项目上的li个数整除2如果是0运行方括号方法
			this.posterItemMain.append(this.posterItems.eq(0).clone());//父容器ul拷贝插入第一张li
			this.posterItems = this.posterItemMain.children();   //获得匹配元素集合中每个元素的子元素
		};

		this.posterFirstItem = this.posterItems.first();//获取匹配元素集合中第一个元素。
		this.posterLastItem = this.posterItems.last();//获取匹配元素集合中最后一个元素。
		this.rotateFlag = true;

		//建立默认配置
		this.setting = {
			"width": 1000, //幻灯片的宽度
			"height": 270, //幻灯片的高度
			"posterWidth": 640, //幻灯片第一帧的宽度
			"posterHeight": 270, //幻灯片第一帧的高度
			"scale": 0.9, //记录显示比例关系
			"speed": 500, //切换速度
			"autoPlay": false, //是否开启自动播放
			"delay": 5000, //自动播放间隔时间
			"verticalAlign": "middle" //top bottom
		}
		$.extend(this.setting, this.getSetting()); //也就是说后面的参数如果和前面的参数存在相同的名称，那么后面的会覆盖前面的参数值。
		//console.log(this.setting);
		this.setSettingValue();
		this.setPosterPos();
		this.nextBtn.click(function() {
			if (hjk.rotateFlag) {
				hjk.rotateFlag = false;
				hjk.ll("left");
			};
			//hjk.ll('left')
		});
		this.prevBtn.click(function() {
			//hjk.ll('reght')
			if (hjk.rotateFlag) {
				hjk.rotateFlag = false;
				hjk.ll("reght");
			};
		});
		//是否开启自动播放
		if (this.setting.autoPlay) {
			this.autoPlay();
			this.poster.hover(function() {
				window.clearInterval(hjk.timer);
			}, function() {
				hjk.autoPlay();
			});

		};


	}



	Carousel.prototype = {
		//是否打开自动播放
		autoPlay: function() {
			var self = this;
			this.timer = window.setInterval(function() {
				self.nextBtn.click();
			}, this.setting.delay);

		},


		//旋转
		ll: function(de) {
			var _this_ = this;
			var zIndexArr = [];
			if (de === 'left') {
				this.posterItems.each(function() {
						var self = $(this),
							prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
							width = prev.width(),
							height = prev.height(),
							zIndex = prev.css('zIndex'),
							opacity = prev.css('opacity'),
							left = prev.css('left'),
							top = prev.css('top');
						zIndexArr.push(zIndex);
						self.animate({
							width: width,
							height: height,
							//zIndex:zIndex,
							opacity: opacity,
							left: left,
							top: top

						}, _this_.setting.speed, function() {
							_this_.rotateFlag = true;
						});
					})
					//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i) {
					$(this).css("zIndex", zIndexArr[i]);
				});
			} else if (de === 'reght') {
				this.posterItems.each(function() {
						var self = $(this),
							next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
							width = next.width(),
							height = next.height(),
							zIndex = next.css('zIndex'),
							opacity = next.css('opacity'),
							left = next.css('left'),
							top = next.css('top');
						zIndexArr.push(zIndex);
						self.animate({
							width: width,
							height: height,
							//zIndex:zIndex,
							opacity: opacity,
							left: left,
							top: top

						}, _this_.setting.speed, function() {
							_this_.rotateFlag = true;
						});
					})
					//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i) {
					$(this).css("zIndex", zIndexArr[i]);
				});
			}



		},

		//设置剩余帧的位置
		setPosterPos: function() {
			var self = this;
			var sliceItems = this.posterItems.slice(1), //获取除去第一个li之外的li
				sliceSize = sliceItems.size() / 2, //获取之外li的一半
				rigthSlice = sliceItems.slice(0, sliceSize), //选中所有段落，然后将所选内容缩减为只包含第一和第二个段落：  这里取一半的li
				level = Math.floor(this.posterItems.size() / 2), //设置里zindex
				leftSlice = sliceItems.slice(sliceSize);
			console.log(leftSlice);
			var rw = this.setting.posterWidth,
				rh = this.setting.posterHeight,
				gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;

			//初始left值
			var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
			var fixOffsetLeft = firstLeft + rw;

			//设置右边帧的位置关系和宽度高度top
			rigthSlice.each(function(i) {
				level--;
				rw = rw * self.setting.scale;
				rh = rh * self.setting.scale;
				var j = i;
				$(this).css({
					zIndex: level,
					width: rw,
					height: rh,
					opacity: 1 / (++j),
					left: fixOffsetLeft + (++i) * gap - rw,
					top: self.setVerticalAlign(rh)
				});
			});

			//设置左边的位置关系
			var lw = rigthSlice.last().width(), //获取右边li最后一个的宽度
				lh = rigthSlice.last().height(),
				oloop = Math.floor(this.posterItems.size() / 2);
			leftSlice.each(function(i) {
				$(this).css({
					zIndex: i,
					width: lw,
					height: lh,
					opacity: 1 / oloop,
					left: i * gap,
					top: self.setVerticalAlign(lh)
				});
				lw = lw / self.setting.scale;
				lh = lh / self.setting.scale;
				oloop--;
			});


		},

		//设置垂直排列对齐
		setVerticalAlign: function(height) {
			var verticalType = this.setting.verticalAlign,
				top = 0;
			if (verticalType === "middle") {
				top = (this.setting.height - height) / 2;
			} else if (verticalType === "top") {
				top = 0;
			} else if (verticalType === "bottom") {
				top = this.setting.height - height;
			} else {
				top = (this.setting.height - height) / 2;
			};
			return top;
		},

		//设置配置参数值去控制基本的高度和宽度
		setSettingValue: function() {
			//框的配置
			this.poster.css({
				width: this.setting.width,
				height: this.setting.height,
			})

			//ul的配置
			this.posterItemMain.css({
				width: this.setting.posterWidth,
				height: this.setting.posterHeight,
			});
			//计算左右按钮的宽度
			var wy = (this.setting.width - this.setting.posterWidth) / 2;
			this.nextBtn.css({
				width: wy,
				height: this.setting.height,
				zIndex: Math.ceil(this.posterItems.size() / 2) //size获取元素长度   //Math.ceil向上取整
			});
			this.prevBtn.css({
				width: wy,
				height: this.setting.height,
				zIndex: Math.ceil(this.posterItems.size() / 2) //size获取元素长度   //Math.ceil向上取整
			});
			//设置li第一层居中
			this.posterFirstItem.css({
				width: this.setting.posterWidth,
				height: this.setting.posterHeight,
				left: wy,
				zIndex: Math.floor(this.posterItems.size() / 2) //size获取元素长度   //Math.ceil向下取整
			})
		},


		//获取人工配置参数
		getSetting: function() {
			var setting = this.poster.attr('data-setting');
			if (setting && setting != '') { //如果setting;存在
				return $.parseJSON(setting) //解析一个 JSON 字符串。
			} else {
				return {}; //否则返回空对象
			}
		}
	}


	Carousel.init = function(ens) { //初始化对象
		var _this_ = this; //这里的this等于Carousel函数表达式
		ens.each(function(ins, sd) { //ins索引  sd等于this==dom节点
			new _this_($(this)) //$(this)是jq包装对象   new了新的传参进来的循环出来的函数表达式和不同值
		})

	}


	window['Carousel'] = Carousel; //全局变量
})(jQuery)