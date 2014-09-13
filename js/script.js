$(function() {
	console.log("test");

	$.ajax({
		type: 'GET',
		url: 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-&query=讃岐うどん',
		crossDomain: true		
	}).done(function(result) {
		console.log(result);
	}).error(function(msg){
		alert(msg);
	}).complete(function(){
		console.warn("complete!!");
	});
});