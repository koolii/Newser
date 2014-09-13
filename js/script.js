$(function() {
	console.log("test");

	$.ajax({
		type: 'GET',
		url: 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-&query=%E8%AE%83%E5%B2%90%E3%81%86%E3%81%A9%E3%82%93',
		crossDomain: true		
	}).done(function(result) {
		console.log(result);
	}).error(function(msg){
		alert(msg);
	}).complete(function(){
		console.warn("complete!!");
	});
});