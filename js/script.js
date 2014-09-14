$(function() {
	SpeechRecognition = webkitSpeechRecognition
	 || mozSpeechRecognition 
	 || SpeechRecognition;

	var Ajax = {
		execute: function(params) {
			var $_this = this;
			var $def = $.Deferred();
			var url = this.createUrl(params);

			$.ajax({
				type: 'GET',
				url: url,
				crossDomain: true,
				datatype: params.datatype
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

				if (params.count) {
					url += "&count=" + params.count;
				}
			} else if (type == 'furigana') {
				url +=  baseUrl + '&sentence=' + params.sentence;
			}

			return url;
		},

		callBack: function(result) {
			var html = $.parseHTML(result.results[0]);
			var $pElement = $(html[5]);

			return $pElement.text();
		}
	}; // end Ajax


	var getNews = function() {
		var keywords = {
			type: 'search',
			url: 'http://webservice.recruit.co.jp/r25/article/v1?type=full&tag=%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9&key=9108db1fd6db519e&format=json',
			count: 10
		};

		$.when(Ajax.execute(keywords))
			.done(function(result) {
				var json = $.parseJSON(result);
				var $ul = $('#news-list');

				console.log("Success Ajax: " + json);	
				var objs = json.results.article;

				$.each(objs, function() {
					if (this) {
						var headline = this.headline;
						var thumb = this.thumb;

						var $img = $('<img>').attr('src', this.urls.pc);
						var $a = $('<a>').addClass('fancy').attr('href', this.urls.pc);
						var $li = $('<li>').addClass('l-grid-item pointer');
						var $div = $('<div>');


						$div.append('<div><img class="popup" height="250px" width="300px" src="' + thumb + '" /><span class="is-none">' + headline + '</span></div>');
						$div.appendTo($li);

						$li.appendTo($a);

						// $li.wrap('<a class="fancybox" href="' + this.urls.pc  +'">');

						$a.appendTo($ul);
					}
				});
		});
	};

	var getHiragana = function(str) {
		var keywords = {
			datatype: 'xml',
			type: 'furigana',
			url: 'http://jlp.yahooapis.jp/FuriganaService/V1/furigana?appid=dj0zaiZpPXEwME0wemIxUDVYMCZzPWNvbnN1bWVyc2VjcmV0Jng9Yzc-',
			sentence: str
		};

		// jsonに
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
	$(document).on('click', '.l-grid-item', function() {
		// alert($(this).next().text());
		window.open($(this).closest("a").attr("href"),'_self');
		return false;
	});

	$("a.fancy").on("click", function() {
		$(this).fancybox({
 			'width'				: '9',
 			'height'			: '85%',
 			'autoScale'			: false,
 			'transitionIn'		: 'none',
 			'transitionOut'		: 'none',
 			'type'				: 'iframe'
 		});
	});


	getNews();

	$('#generate-hiragana').on('click', function(e) {
		e.preventDefault();

		var result = getHiragana("栗山隆仁");
	});

	var recognition = new Recognition();
	recognition.start();
});