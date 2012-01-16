/*
 * dajare-cloud
 */
(function($, window){
	String.prototype.replaceAll = function(a, b){return this.split(a).join(b);}
	String.prototype.replaceDajare=function(){
		text = this.replace(/(http(s?):\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/i, '<a href="$1" class="twitterShortURL" target="_blank">$1</a>');
		text = text.replace(/(#[a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g,'');
		text = text.replace(/(#ダジャレ|#駄洒落)/g,'');
		return text.replace(/(@([-_a-zA-Z0-9;]+))/gi,'<a href="http://www.twitter.com/#!/$2" target="_blank">$1</a>');
	}
	/* DajareCloud API TEST
	 * http://dajare1242.appspot.com/test/
	 */
	/* Global Variable Start */
	var jQDajareCloudValue = {find:{},rank:{normal:{},withText:{}},ti:{},api:{}},
	jQDajareCloudSelector = {
		"jQDajareCloud":"#jQDajareCloud",
		"jQDajareCloudHeader":"#jQDajareCloudHeader",
		"jQDajareCloudLogoArea":"#jQDajareCloudLogoArea",
		"jQDajareCloudUtility":"#jQDajareCloudUtility",
		"jQDajareCloudButton":"#jQDajareCloudButton",
		"jQDajareCloudGrid":"#jQDajareCloudGrid",
		"jQDajareCloudFooter":"#jQDajareCloudFooter",
		"jQDajareCloudContentFooter":"#jQDajareCloudContentFooter"
	};
	/* Dajare Cloud API */
	jQDajareCloudValue.api={
			find:"http://dajare1242-alpha.appspot.com/api/dajare/find?callback=?",
			pc:"http://dajare1242-alpha.appspot.com/api/user/dajare/ranking/app10/weekly/json/pc?callback=?",
			ti:"http://dajare1242-alpha.appspot.com/api/user/dajare/ranking/app10/weekly/json/ti?callback=?"
	}
	/* new server */
	jQDajareCloudValue.api={find:"http://dajare-api.appspot.com/find/?callback=?"}
	if(typeof window.jQDajareCloudValue == "undefined") window.jQDajareCloudValue = $.jQDajareCloudValue = jQDajareCloudValue;
	/* Global Variable End */
	/*******************/
	/* Request Start  */
	/******************/
	/* Find Objects */
	// http://http://dajare-api.appspot.com/?page=1&size=20
	// http://http://dajare-api.appspot.com/?keyword=検索文字列&page=ページ&size=1ページの件数
	/* GAE DataStore API
	 * GAE/Pへ移行する際の注意点
	 * PaaSの限界に挑戦。
	 */
	/* jQDajareCloudValue.api.find "page":1, "size":1 */
	
	function dajareWrite(d){
		var dt=[],BreakPoint="<br>\n";
		// console.log(d.results[0]);
		
		for (i in d.results){
			// つぶやき結果
			dt.push([]);
			var line = d.results[i];
			for (k in line){
				if(k=="createDate"){
					var dates = new Date(line.createDate),dateStr=dates.getFullYear()+"年"+(dates.getMonth()+1)+"月"+dates.getDate()+'日&nbsp;'+dates.getHours()+'時'+dates.getMinutes()+'分';
					line[k]=dateStr;
				}
				if(k=="text"){
					line[k]=line[k].replaceDajare();
				}
				if(k=="createDate" || k=="text" || k=="iconURL" || k=="idText"){
					dt[dt.length-1].push(line[k]);
				}
			}
		}
		for (i in dt){
			var str = '<div class="csvDajare">'+
					  '<span class="text">'+dt[i][2]+'</span>'+BreakPoint+
					  '<span class="date">'+dt[i][0]+'</span>'+
					  '<span class="profile_image"><a href="http://twitter.com/#!/'+dt[i][3]+'" target="_blank"><img src="'+dt[i][1]+'" alt="" width="24" height="24"></a></span>'+
					  '</div>';
			$("#daj").append(str);
		}
		// $(".csvDajare").hide();
		// $(".csvDajare").fadeIn(3000);
	}
	$(
			function(){
				var b = document.body;
				// $(b).append('<div id="loader"><img src="http://dajare-mockup.appspot.com/lib/images/loader.gif" alt="読み込み中..."></div>');
				$("#loader").css({
					"position":"absolute",
					"left":($(document).width()-30)/2,
					"top":300
				});
				document.title=document.title.replaceDajare()
				var id='#daj ',name=id+'.csvDajare .text',size=$(name).size();
				for(var i=0;i<size;i++){
					var name=id+".csvDajare:eq("+i+") .text",text=$(name).text().replaceDajare();
					$(name).html(text)
				}
				var id='#daj_rank ',name=id+'.csvDajare .text',size=$(name).size();
				for(var i=0;i<size;i++){
					var name=id+".csvDajare:eq("+i+") .text",text=$(name).text().replaceDajare();
					$(name).html(text)
				}
				/*
				 * header : logo, tweet btn,follow btn,tweet all counts
				 * body : search panel, search result, 
				 * <!-- html5:header -->
				 * <div id="header">
				 * 		<div id="logo"></div>
				 * 		<div class="utility">
				 * 			<div id="totalDajare">クロール済み(ダジャレクローラ)ダジャレ総数<span id="DajareNum"></span>件</div>
				 * 		</div>
				 * </div>
				 * <!-- / html5:header -->
				 */
				$("#custom-tw_share a,a.bokeBtn").click(function(){
					var w=480,h=320,x=(window.screen.width-w)/2,y=(window.screen.height-h)/2,
					shareUrl = 'https://twitter.com/share?url=https%3A%2F%2Fdajare1242.appspot.com%2F&text=%23dajare';
					window.open(shareUrl,"BokeruWindow","width="+w+",height="+h+",screenX="+x+",screenY="+y);
				});
				$("#custom-tw_follow a").click(function(){
					var w=480,h=620,x=(window.screen.width-w)/2,y=(window.screen.height-h)/2,
					followUrl = 'https://twitter.com/intent/user?original_referer='+location.href+'&region=following&screen_name=dajare1242&source=followbutton&variant=1.1';
					window.open(followUrl,"FollowWindow","width="+w+",height="+h+",screenX="+x+",screenY="+y);
				});
				/* Tweet Btn & Follow Click End */
				// http://www.ohfuji.name/dajare/apicall.html
				$(".dajareAPI").click(function(){
					// $(this).colorbox({href:'http://www.ohfuji.name/dajare/apicall.html',width:800,height:600,iframe:true});
					// $(this).colorbox({href:'/manual',width:800,height:600,iframe:true});
				});
				$(".dajareInfo,.dajareAPI").hide();//
				$(".dajareFeedBack").click(function(){
					var ua =navigator.userAgent;
					var m = 'http://dajare1242.appspot.com/mail';//http://dajare-mockup.appspot.com
					if(ua.indexOf("iPhone")==-1 && ua.indexOf("iPad")==-1 && ua.indexOf("Android")==-1){
						// pc向け
						// $(this).colorbox({href:m, width:"80%", height:"80%", iframe:true});
					}
				});
			}
	);
	// $.ajax(param);
	/* すべての非同期処理が終わった後に処理。 */
	/* Ranking Objects - Normal */
	/* Request End */
	/* jQuery Sub Class @ Dajare Cloud */
	var jQDajareCloud = window.jQDajareCloud = $.jQDajareCloud = function(vars){
		return jQDajareCloud.prototype.init(vars);
	}
	jQDajareCloud.prototype = {
		s:{// Selector Name : Get & Add
			get:function(){return jQDajareCloudSelector;},
			add:function(k){
				if(typeof k=="undefined") return jQDajareCloudSelector;
				var cs=".",ci="#",v=k.replace(cs, ""),v=k.replace(ci, "");
				return jQDajareCloudSelector[v] = k;
			}
		},
		v:function(){// Global Value
			return window.jQDajareCloudValue;
		},
		ct:{// Content Tables
			find:[1,"jQDajare1242find",{title:"ダジャレクローラ"}],
			license:[2,"jQDajare1242License",{title:"ライセンスについて"}],
			backup:[2,"jQDajare1242Backup",{title:"応援"}]
		},
		init : function(){
			var a = this.s.get();
			$(function(){
				var b = document.body;
				$(b).append('<div id="'+a.jQDajareCloud.replace("#", "")+'">'+
				'<div id="'+a.jQDajareCloudHeader.replace("#", "")+'">'+
					'<div id="'+a.jQDajareCloudLogoArea.replace("#", "")+'"></div>'+
					'<div id="'+a.jQDajareCloudUtility.replace("#", "")+'"></div>'+
					'<div id="'+a.jQDajareCloudButton.replace("#", "")+'"></div>'+
				'</div>'+
				'<div id="'+a.jQDajareCloudGrid.replace("#", "")+'"></div>'+
				// '<div id="'+a.jQDajareCloudFooter.replace("#", "")+'"></div>'+
				'<div id="'+a.jQDajareCloudContentFooter.replace("#", "")+'"></div>'+
				'</div>');
			});
			return this;
		},
		createGrid:function(num, id, obj){
			if(typeof id=="undefined" || id=="") return 0;
			if(typeof num=="undefined" || num=="") num=2;
			var columnName = 'jQDCG'+num+'Column';
			var a=this.s.get(),b=arguments[1],s='<div class="'+columnName+'" id="'+id+'"><div class="columnTitle"><div class="columnTitleIcon"></div><div class="columnTitleText"><h3></h3></div><br clear="all"></div><div class="columnDescription"><div class="columnContents"></div></div></div>';
			this.s.add("#"+id);
			$(function(){$(a.jQDajareCloudGrid).append(s);});
		},
		createContent:function(ct){
			var a=this.s,b=a.get(),c=ct,s=b[ct[1]],st=s.replace("#","");
			a[st+"ColumnTitleText"] = s+" .columnTitle .columnTitleText",a[st+"ColumnTitleTextH3"] = a[st+"ColumnTitleText"]+" h3",a[st+"ColumnDescription"] = s+" .columnDescription",a[st+"ColumnContents"] = a[st+"ColumnDescription"]+" .columnContents";
			$(function(){
				$(a[st+"ColumnTitleTextH3"]).html(c[2].title);
			});
		},
		get:{$this:this,find:function(param){var v=window.jQDajareCloudValue,d={url:v.api.find, dataType:"jsonp", success:param.success, error:this.errorCallback};$.ajax(d);},errorCallback:function(){alert('Json Error!!');}},
		post:{}
	}
})(jQuery, window);
function createDate(str){
	var dates=new Date(str),dateStr=dates.getFullYear()+"年"+(dates.getMonth()+1)+"月"+dates.getDate()+'日&nbsp;'+dates.getHours()+'時'+dates.getMinutes()+'分';
	document.write(dateStr);
}

$(function(){
	$(".dajareLogout,.dajareLogin").mouseover(function(){
		// $.cookie("dajare1242_id","");
		// location.href="/";
		$("#usermode").fadeIn("10000")
	});
	$(".dajareLogout,.dajareLogin").mouseout(function(){
		setTimeout(function(){
			$("#usermode").fadeOut("10000")
		},3000);
	});
	$("#usermode .signout").click(function(){
		// $.cookie("dajare1242_id","");
		$.cookie("dajare1242_id","",{path:"/"});
		$.cookie("dajare1242_redirect_uri","",{path:"/"});
		// alert($.cookie("dajare1242_id"));
		location.href=location.href;
	});
});