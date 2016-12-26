//main.js

requirejs.config({   //requirejs.config方法用了定義別名
	paths:{
		jquery:'jquery-1.7.1.min'
	}
});
requirejs(['jquery','common'],function($,common){
	// $("#backTop").backTop({
	// 	mode:'move',
	// 	speed:800
	// });
	//alert(1)
	console.log(common)
	new common.Common($("#focus001"), {
		"speed": 1500,
		"delay": 15000,
		"autoPlay": false
	});
});
