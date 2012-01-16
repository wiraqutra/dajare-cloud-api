/* DajareCloud Main */
/* Creative Commons
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.1/jp/"><img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/2.1/jp/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">ダジャレクラウド</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="dajare1242.appspot.com" property="cc:attributionName" rel="cc:attributionURL">dajare1242.appspot.com</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.1/jp/">Creative Commons 表示 - 非営利 - 継承 2.1 日本 License</a>.<br />このライセンスで許諾される範囲を超えた利用の可能性については以下のアドレスもご覧下さい。 <a xmlns:cc="http://creativecommons.org/ns#" href="dajare1242.appspot.com/lisense.html" rel="cc:morePermissions">dajare1242.appspot.com/lisense.html</a> */

String.prototype.replaceDajare=function(){
		text = this.replace(/(http(s?):\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/i, '<a href="$1" class="twitterShortURL">$1</a>');
		text = text.replace(/(#[a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g,'');
		text = text.replace(/(#ダジャレ|#駄洒落)/g,'');
		return text.replace(/(@[-_a-zA-Z0-9;]+)/gi,'<a href="http://www.twitter.com/#!/$1">$1</a>');
}
var dajareInfo = {
	copyright : 'Copyright All Right Reserved '+new Date().getFullYear()+' app10.jp hack4jp ダジャレクラウド',
	support:{
		data:[
			{
				title:'【復興かき】東日本大震災から甦れ！三陸牡蠣再生を目指すプロジェクト',
				description:'世界有数の牡蠣産地である三陸。壊滅的被害をうけた牡蠣養殖をオーナー制度を通して支援するプロジェクトです。',
				url:'http://sanriku-oysters.com/'
			}
		]
	},
	header:{}
};
var m = new $.jQDajareCloud(),ct = m.ct;//Content Table
/* Create Dajare Grid Layout from jquery.dajare.cloud.js */
for(i in ct){m.createGrid(ct[i][0],ct[i][1],ct[i][2]);m.createContent(ct[i]);}
/* OnLoad */
$(
	function(){
		var a=m.s.get();
		$(a.jQDajareCloudLogoArea).append('<a href="http://dajare1242.appspot.com/" title="ダジャレクラウド"></a>');
		$(a.jQDajareCloudGrid).append('<br clear="all">');
		// $(a.jQDajareCloudUtility).append('<div class="find_dajare"><img src="http://dajare-mockup.appspot.com/lib/images/search.png" alt=""></div><div class="social"><ul><li><a href="http://twitter.com/#!/dajare1242" title="ダジャレクラウド公式ツィート"><img src="http://dajare-mockup.appspot.com/lib/images/social/tw.png" alt="ダジャレクラウド公式ツィート"></a></li></ul></div><br clear="all">');
		// $(a.jQDajareCloudButton).append('<ul><li><a href="javascript:void(0);"><img src="http://dajare-mockup.appspot.com/lib/images/button/spacy.png" alt="三次元モード" id="jQSpacy"></a></li><li><a href="javascript:void(0);" id="jQSubmits"><img src="http://dajare-mockup.appspot.com/lib/images/button/submit.png" alt="ボケてみる"></a></li></ul><br clear="all">');
		$("#jQSubmits").click(function(){
			var attr={inline:true,href:"#jQSubmitForm"};
			alert('ダジャレクラウドは現在改修中です。10月上旬にUpdateしますので少々お待ちください。');
			// $(this).colorbox(attr);
		});
		a.jQPageInners="#jQPageInners",a.jQSubmitForm="#jQSubmitForm",a.jQSubmitButton="#jQSubmitButton",a.jQFormTextCount="#jQFormTextCount",a.jQSubmitButtonA="#jQSubmitButton a";
		var textarea = a.jQSubmitForm+" .formText textarea",jQTweetCount=a.jQFormTextCount + " span";
		$(document.body).append('<div id="'+a.jQPageInners.replace("#","")+'"></div>');
		$(a.jQPageInners).hide();
		$(a.jQPageInners).append('<div id="'+a.jQSubmitForm.replace("#","")+'">'+
		'<form method="post" action="dajare" name="dajaretweet">'+
		'<div class="formTitle"></div>'+
		'<div class="formText"><textarea name="tweettext">ここにダジャレを入れてください。\nここではTwitterへ#darejaで投稿されます。</textarea></div>'+
		'<div id="'+a.jQSubmitButton.replace("#","")+'"><a href="javascript:void(0);"><img src="http://dajare-mockup.appspot.com/lib/images/colorbox/form/submit.png"></a></div>'+
		'<div id="'+a.jQFormTextCount.replace("#","")+'"><span>あと[num]文字書き込めます。</span></div>'+
		'<br clear="all">'+
		'</form>'+
		'</div>');
		$(a.jQSubmitButtonA).click(function(){
			//alert(1);
			var text=encodeURIComponent("#dareja " + document.dajaretweet.tweettext.value),param={
					url:"/post",
					data:{
						m:text,
						type:"update"
					},
					type:"POST",
					success:function(json){
						// console.log(json);
					}
			};
			// console.log(param);
			// $.ajax(param);
		});
		var counter = 133-($(textarea).val().split("").length);
		var textLength = $(textarea).val().split("").length;
		$(textarea).bind("focus",function(){
			$(this).text("");
			var textLength = $(this).val().split("").length;
			var num = 133;
			$(jQTweetCount).text('あと'+num+'文字書き込めます。');
		});
		$(textarea).keyup(
			function(){
				var textLength = $(this).val().split("").length;
				var num = counter - textLength;
				$(jQTweetCount).text('あと'+num+'文字書き込めます。');
				if(num < 0){
					$(jQTweetCount).text('文字数オーバーしています。('+Math.abs(num)+"文字)");
					$(jQTweetCount).css("color", "red");
					//$(jQTweetSubmit).hide();
				}
				else{
					//$(jQTweetCount).css("color", "#ccc");$(jQTweetSubmit).show();
				}
			}
		);
		
		$(jQTweetCount).text('あと'+counter+'文字書き込めます。');
		// console.log($(a.jQSubmitForm+" .formText textarea"), counter);
		$(a.jQSubmitButton).click(function(){
			$(a.jQSubmitForm).bind("submit",function(){return false;});
		});
		// $("#jQSpacy").click(function(){});
		/* Copyright */
		// $(a.jQDajareCloudFooter).append('<div class="copyright">'+dajareInfo.copyright+'</div>');
		/* Technical Banner */
		$(a.jQDajareCloudContentFooter).append('<div class="left"><ul></ul><br clear="all"></div><div class="right"><ul></ul><br clear="all"></div><br clear="all">');
		a.jQDajareCloudContentFooterLeftUL = a.jQDajareCloudContentFooter + " .left ul",a.jQDajareCloudContentFooterRightUL = a.jQDajareCloudContentFooter + " .right ul";
		$(a.jQDajareCloudContentFooterLeftUL).append('<li><a href="http://code.google.com/intl/ja/appengine/" target="_blank"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/gae.png"></a></li><li><a href="http://www.android.com/" target="_blank"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/android.png"></a></li>');
		$(a.jQDajareCloudContentFooterRightUL).append('<li><a href="http://www.java.com/ja/" target="_blank"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/java.png"></a></li><li><a href="http://www.python.jp/Zope" target="_blank"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/python.png"></a></li><li><a href="http://www.w3.org/html/logo/" target="_blank"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/html5.png"></a></li><li><a href="http://jquery.com/" target="_blank"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/jquery.png"></a></li>');
		/* Technical Banner */
		$(a.jQDajare1242License+" .columnContents").append('<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.1/jp/"><img alt="クリエイティブ・コモンズ・ライセンス" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/2.1/jp/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">ダジャレクラウド</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="dajare1242.appspot.com" property="cc:attributionName" rel="cc:attributionURL">dajare1242.appspot.com</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.1/jp/">Creative Commons 表示 - 非営利 - 継承 2.1 日本 License</a>.<!-- <br />このライセンスで許諾される範囲を超えた利用の可能性については以下のアドレスもご覧下さい。 <a xmlns:cc="http://creativecommons.org/ns#" href="dajare1242.appspot.com/lisense.html" rel="cc:morePermissions">dajare1242.appspot.com/lisense.html</a> -->');
		$(a.jQDajare1242find+" .columnContents").append('<ul></ul>');
		$(a.jQDajare1242Rank+" .columnContents").append('<ul></ul>');
		$(a.jQDajare1242Support+" .columnContents").append('<ul></ul>');
		$(a.jQDajare1242Support+" .columnContents ul").append('<li><h3><a href="http://sanriku-oysters.com/"><img alt="【復興かき】東日本大震災から甦れ！三陸牡蠣再生を目指すプロジェクト" src="http://dajare-mockup.appspot.com/lib/images/support/sanriku_oysters.gif"></a></h3><p>世界有数の牡蠣産地である三陸。壊滅的被害をうけた牡蠣養殖をオーナー制度を通して支援するプロジェクトです。</p></li>');
		$(a.jQDajare1242Backup+" .columnContents").append('<ul><li><a href="http://app10.jp/"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/app10.png"></a></li><li><a href="http://www.hack4.jp/"><img alt="" src="http://dajare-mockup.appspot.com/lib/images/offer/hack4jp.png"></a></li></ul>')
		/* Technical Banner */
	}
);
//　https://twitter.com/#!/sknn/status/13379100306
//　https://twitter.com/#!/sknn/status/[個別つぶやきID]
//　https://twitter.com/#!/[userid]/status/[個別つぶやきID]

$(window).ajaxStop(function(){
	// console.log(window.jQDajareCloudValue);
	if(typeof window.jQDajareCloudValue.async!="undefined") return;
	var a = m.s.get(),f=window.jQDajareCloudValue.find,r=window.jQDajareCloudValue.rank.withText;
	//　console.log(f.results[0]);
	//　http://translate.google.com/translate_tts?tl=ja&q=%E3%81%A0%E3%81%98%E3%82%83%E3%82%8C
	//　$(document.body).append('<audio preload="auto"><source src="http://translate.google.com/translate_tts?tl=ja&q='+encodeURIComponent(f.results[0].text)+'"></source></audio>');
	//　var audio = new Audio('http://translate.google.com/translate_tts?tl=ja&q='+encodeURIComponent(f.results[0].text));
	var anum = 0;
	
	if(f.results.length>0){
		var st = setInterval(function(){
			if (anum < 5) {
				var idText=f.results[anum].idText,sUrl = 'https://twitter.com/#!/'+idText+'/status/'+f.results[anum].srcId,text=f.results[anum].text,icon=f.results[anum].iconURL,dates=new Date(f.results[anum].createDate),yyyy=dates.getFullYear(),mm=dates.getMonth()+1,H=dates.getHours(),m=dates.getMinutes(),s=dates.getSeconds(),dd=dates.getDate(),dates=yyyy+"年"+mm+"月"+dd+"日"+H+"時"+m+"分"+s+"秒";
				text = text.replaceDajare();
				
				a.jQDajare1242findUL = a.jQDajare1242find + " .columnContents ul";
				a.jQDajare1242findLI = a.jQDajare1242find + " .columnContents ul li:eq("+anum+")";
				$(a.jQDajare1242findLI).hide();
				$(a.jQDajare1242findUL).append(
					'<li><div class="tweet_profile_image"><a href="'+sUrl+'"><img src="' + icon + '" alt=""></a></div>' +
					'<div class="tweet_text">' +
					text +
					'</div>' +
					'<br clear="all">' +
					'<div class="tweet_footer">'+
						'<div class="tweet_profile">'+
						'<a href="https://twitter.com/#!/'+idText.replace("tw_","")+'">@'+idText.replace("tw_","")+'</a>'+
						'</div>'+
						'<div class="tweet_buttons">'+
						'<div class="create_date">投稿日時:'+dates+'</div>'+
						'<br clear="all"></div><br clear="all">' +
					'</div>' +
					'</li>'
				);
				$(a.jQDajare1242findLI).fadeIn("20000");
			}
			if(anum == 5){
				clearInterval(st);
				$(a.jQDajareCloudGrid).vgrid();
			}
			$(a.jQDajareCloudGrid).vgrid();
			anum ++;
		},1000);	
	}
	
	// console.log(r.results[0]);
	
	$(a.jQDajareCloudGrid).vgrid();
	$(window).bind("resize",function(){
		if ($(window).width() < 1024) {
			$(a.jQDajareCloud).css({width: $(window).width()});
			$(a.jQDajareCloudGrid).css({width: $(window).width()});
		}
		else{
			$(a.jQDajareCloud).css({width: 1024});
			$(a.jQDajareCloudGrid).css({width: 1024});
			$(a.jQDajareCloudGrid).vgrid();
		}
	});
});
/* 2 Min Ago */
setInterval(function(){
	var g=m.get;
	g.find({success: function(json){
		// 二分毎 更新スクリプト
		// List更新
		// append li
		window.jQDajareCloudValue.async = true;
		var a = m.s.get();
		$(a.jQDajare1242find+" .columnContents ul").html("");
		var f = json,anum=0;
		var st = setInterval(function(){
			if (anum < 5) {
				var idText=f.results[anum].idText,sUrl = 'https://twitter.com/#!/'+idText+'/status/'+f.results[anum].srcId,text=f.results[anum].text,icon=f.results[anum].iconURL,dates=new Date(f.results[anum].createDate),yyyy=dates.getFullYear(),mm=dates.getMonth()+1,H=dates.getHours(),m=dates.getMinutes(),s=dates.getSeconds(),dd=dates.getDate(),dates=yyyy+"年"+mm+"月"+dd+"日"+H+"時"+m+"分"+s+"秒";
				text = text.replaceDajare();
				a.jQDajare1242findUL = a.jQDajare1242find + " .columnContents ul";
				a.jQDajare1242findLI = a.jQDajare1242find + " .columnContents ul li:eq("+anum+")";
				$(a.jQDajare1242findLI).hide();
				$(a.jQDajare1242findUL).append(
					'<li><div class="tweet_profile_image"><a href="'+sUrl+'"><img src="' + icon + '" alt=""></a></div>' +
					'<div class="tweet_text">' +
					text +
					'</div>' +
					'<br clear="all">' +
					'<div class="tweet_footer">'+
						'<div class="tweet_profile">'+
						'<a href="https://twitter.com/#!/'+idText.replace("tw_","")+'">@'+idText.replace("tw_","")+'</a>'+
						'</div>'+
						'<div class="tweet_buttons">'+
						'<div class="create_date">投稿日時:'+dates+'</div>'+
						'<br clear="all"></div><br clear="all">' +
					'</div>' +
					'</li>'
				);
				$(a.jQDajare1242findLI).fadeIn("20000");
			}
			if(anum == 5){
				clearInterval(st);
				$(a.jQDajareCloudGrid).vgrid();
			}
			$(a.jQDajareCloudGrid).vgrid();
			anum ++;
		},2000);
		
	}
	});
}, 120000);// 2分毎
