//main.js

requirejs.config({
	paths:{
		jquery:'jquery-1.7.1.min'
	}
});
requirejs(['jquery','common'],function($,common){
	$("#focus001").common({
		speed:2000
	});

	$("#focus002").common({speed:3000});
});
