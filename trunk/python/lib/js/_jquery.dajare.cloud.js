/*
 * dajare-cloud.org
 */
(function($, window){
	String.prototype.replaceAll = function(a, b){return this.split(a).join(b);}
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
	jQDajareCloudValue.api={find:"http://dajare1242-alpha.appspot.com/api/dajare/find?callback=?",pc:"http://dajare1242-alpha.appspot.com/api/user/dajare/ranking/app10/weekly/json/pc?callback=?",ti:"http://dajare1242-alpha.appspot.com/api/user/dajare/ranking/app10/weekly/json/ti?callback=?"}
	if(typeof window.jQDajareCloudValue == "undefined") window.jQDajareCloudValue = $.jQDajareCloudValue = jQDajareCloudValue;
	/* Global Variable End */
	/*******************/
	/* Request Start  */
	/******************/
	/* Find Objects */
	var param = {url:jQDajareCloudValue.api.find,data:{"pageSize":5},dataType:"jsonp",success:function(d){
			// keyword 抽出
			var param = {
					url:'http://jlp.yahooapis.jp/KeyphraseService/V1/extract?callback=?',
					data:{
						"appid":"tjkfirqxg64obsBEFMradO2kOIGwRVk7K7kAuyQJREzvDhvgQkSS8EdIgH9EcAe4OaI-",
						"sentence":d.results[0].text,
						"output":"json"
					},
					type:"GET",
					dataType:"jsonp",
					success:function(o){
						console.log(o,d.results[0].text);
					}
				}
			// console.log(param);
			// $.ajax(param);
			window.jQDajareCloudValue.find=d;
			
			console.log(d);
			/* ネクスト */
			// http://dajare1242-alpha.appspot.com/api/dajare/find/page/previous?cursor=&filters=&sorts=
			// var d=window.jQDajareCloudValue.find;
			var NextParam = {
					url:"http://dajare1242-alpha.appspot.com/api/dajare/find/page/next?callback=?",
					data:{"cursor":d.cursor,"filters":d.filters,"sorts":d.sorts,"pageSize":5},
					type:"GET",
					dataType:"jsonp",
					success:function(j){
						console.log(j);
					}
			};
			// console.log(NextParam.url+"?cursor="+NextParam.data.cursor+"&filters="+NextParam.data.filters+"&sorts="+NextParam.data.sorts);
			$.ajax(NextParam);
		}};
	$.ajax(param);
	/* Ranking Objects - Normal */
	var param = {url:jQDajareCloudValue.api.pc,data:{"withText":"true","endDate":"2011/06/14"},dataType:"jsonp",success:function(d){window.jQDajareCloudValue.rank.normal=d}};
	//$.ajax(param);
	/* Ranking Objects - withText */
	var param = {url:jQDajareCloudValue.api.pc,data:{"withText":"true","endDate":"2011/06/14"},dataType:"jsonp",success:function(d){window.jQDajareCloudValue.rank.withText=d}};
	//$.ajax(param);
	/* Ti Objects - Ti */
	var param = {url:jQDajareCloudValue.api.ti, dataType:"jsonp",success:function(d){window.jQDajareCloudValue.ti=d}};
	//$.ajax(param);
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
		ct:{//Content Tables
			// support:[2,"jQDajare1242Support",{title:"ダジャレ サポータ"}],
			find:[1,"jQDajare1242find",{title:"ダジャレクローラ"}],
			// api:[2,"jQDajare1242API",{title:"ダジャレクラウドAPI"}],
			// rank:[2,"jQDajare1242Rank",{title:"ダジャレランキング"}],
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
	// var url = "http://dajare1242.appspot.com/api/user/dajare/find?callback=?";// find系 100件
})(jQuery, window);

