$(function() {
	var Ajax = {
		execute: function(keyword) {
			var $_this = this;
			var $def = $.Deferred();
			var url = this.createUrl(keyword);

			$.ajax({
				type: 'GET',
				url: url,
				crossDomain: true,
			}).done(function(result) {
				console.log(result);

				$def.resolve($_this.callBack(result));
			}).error(function(msg){
				alert(msg);
				$def.reject();
			}).complete(function(){
				console.warn("complete!!");
			});

			return $def.promise();
		},

		defaults: {
			hits: 25,
			sort: 'score'
		},

		createUrl: function(keywords) {
			var params = $.extend(this.defaults, keywords);
			var url = '';

			var baseUrl = 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-';
			//return baseUrl + '&query=' + keyword;

			// 今回は必ず入力するようにする
			//if (params.query) {
				url = baseUrl + "&query=" + params.query;
			//}

			if (params.hits) {
				url += "&hits=" + params.hits;
			}

			return url;
		},
		callBack: function(result) {
			var html = $.parseHTML(result.results[0]);
			var $pElement = $(html[5]);

			return $.parseJSON($pElement.text());
		}
	}; // end Ajax

	$.when(Ajax.execute({ query: "isai" }))
		.done(function(result) {
			console.log("Success Ajax: " + result);
		});

});