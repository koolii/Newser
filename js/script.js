$(function() {
	SpeechRecognition = webkitSpeechRecognition
	 || mozSpeechRecognition 
	 || SpeechRecognition;

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
			// share
			datatype: 'json',
			// search
			type: '',
			hits: 25,
			sort: 'score',
			// furigana
			sentence: '栗山'
		},

		createUrl: function(keywords) {
			var params = $.extend(this.defaults, keywords);
			var url = '';
			var type = params.type;

			var baseUrl = params.url;
			//return baseUrl + '&query=' + keyword;
			if (!type)return;

			if (type == 'search') {
				// 今回は必ず入力するようにする
				//if (params.query) {
					url = baseUrl + "&query=" + params.query;
				//}

				if (params.hits) {
					url += "&hits=" + params.hits;
				}
			} else if (type == 'furigana') {
				url +=  baseUrl + '&sentence=' + params.sentence;
			}

			return url;
		},

		callBack: function(result) {
			var html = $.parseHTML(result.results[0]);
			var $pElement = $(html[5]);

			return $.parseJSON($pElement.text());
		}
	}; // end Ajax


	var searchItemByShop = function(keyword) {
		var keywords = {
			type: 'search',
			url: 'http://shopping.yahooapis.jp/ShoppingWebService/V1/json/itemSearch?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-',
			query: keyword	
		};

		$.when(Ajax.execute(keywords))
			.done(function(json) {
				console.log("Success Ajax: " + json);	
				return json.ResultSet[0].Result;
		});
	};

	var getHiragana = function(str) {
		var keywords = {
			datatype: 'xml',
			type: 'furigana',
			url: 'http://jlp.yahooapis.jp/FuriganaService/V1/furigana?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-',
			sentence: str
		};

		$.when(Ajax.execute(keywords))
			.then(function(xml) {
				console.debug('===== getHiragana ===== ' + 'keyword: ' + xml);
				var json = $.xml2json(xml);
				return json;
			});
	};


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
	        $('#speech-text-test').val(finalText);
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
	$('#search').on('click', function(e) {
		e.preventDefault();

		// 商品を取得する
		var result = searchItemByShop($('#search-content').val());
	});

	$('#generate-hiragana').on('click', function(e) {
		e.preventDefault();

		var result = getHiragana("栗山隆仁");
	});

	var recognition = new Recognition();
	recognition.start();
});