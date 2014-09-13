$(function() {
	console.log("test");

	$.ajax({
		type: 'GET',
		url: 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-&query=isai',
		// crossDomain: true,
		dataType : "jsonp",
		jsonpCallback: "callback"
	}).done(function(result) {
		console.log(result);

	}).fail(function(msg){
		alert(msg);
	}).complete(function(){
		console.warn("complete!!");
	});
});