$(function() {
	console.log("test");

	$.ajax({
		type: 'GET',
		url: 'https://api.apigw.smt.docomo.ne.jp/webCuration/v2/contents?genreId=1&num=100&APIKEY=4f75466b4a71694a5634446b733058734a6668764e6d63782f465532385677704a79306e554d3168715430&lang=ja&format=json',
		crossDomain: true		
	}).done(function(result) {
		console.log(result);
	}).error(function(msg){
		alert(msg);
	}).complete(function(){
		console.warn("complete!!");
	});
});