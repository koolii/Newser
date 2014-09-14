$(function() {
	SpeechRecognition = webkitSpeechRecognition || mozSpeechRecognition || SpeechRecognition;

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

			return $.parseJSON($pElement.text()).ResultSet[0].Result;
		}
	}; // end Ajax


	var Recognition = function() {
		console.log("========== Create Recognition ==========");

		var finalText = '', interimText = '';

		this.recognition = new SpeechRecognition();
		this.recognition.continuous = true;
    	this.recognition.interimResults = true;

		this.nowRecogniting = false;

		this.recognition.onresult = function (e) {
            console.debug('[onresult]', e.results.length);
            var finalText = '';
            var interimText = '';
            for (var i = 0; i < e.results.length; i++) {
                if (e.results[i].isFinal) {
                    finalText += e.results[i][0].transcript;
                } else {
                    interimText += e.results[i][0].transcript;
                }
            }
            //$interimSpan.textContent = interimText;
            //$finalSpan.textContent = finalText;
 
	        // Insert Value in DOM
	        $('#speech-text').val(finalText);
	    };
	};

	Recognition.prototype.start = function() {
		console.log("========== Recognition Start ==========");
		this.recognition.lang = "ja-JP";

		if (this.nowRecogniting)return false;

		this.nowRecogniting = true;

		this.recognition.start();
	};

	Recognition.prototype.stop = function() {
		console.log("========== Recognition End ==========");
		this.recognition.stop();
		this.nowRecogniting = false;
	};
	// End Recognition


	// Click Event
	$('#search').on(function(e) {
		e.preventDefault();

		$.when(Ajax.execute($('#search-content').val()))
			.done(function(result) {
				console.log("Success Ajax: " + result);	
			});
	});



	$.when(Ajax.execute({ query: "isai" }))
		.done(function(result) {
			console.log("Success Ajax: " + result);
	});

	var recognition = new Recognition();
	recognition.start();
});