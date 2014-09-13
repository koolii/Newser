$(function() {
	console.log("test");

	var Ajax = {
		execute: function(keyword) {
			var $def = $.Deferred();
			var url = this.createUrl(keyword);

			$.ajax({
				type: 'GET',
				url: url,
				crossDomain: true,
			}).done(function(result) {
				console.log(result);

				$def.resolve(this.callBack(result));
			}).error(function(msg){
				alert(msg);
				$def.reject();
			}).complete(function(){
				console.warn("complete!!");
			});

			return $def.promise();
		},

		createUrl: function(keyword) {
			var baseUrl = 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-';
			return baseUrl + '&query=' + keyword;

		},
		callBack: function(result) {
			var html = $.parseHTML(result.results[0]);
			var $pElement = $(html[5]);

			return $.parseJSON($pElement.text());
		}
	};

	$.when(Ajax.execute("isai"))
		.done(function(result) {
			console.log("Success Ajax: " + result);
		});

});