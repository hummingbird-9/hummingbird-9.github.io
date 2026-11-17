var Define = function () {};
var Enum = function () {};

Define.txtVer = 'ver.1.0.31'; // 버젼

Enum.DEVICE_STATE = {
	PC : 0,
	IOS : 1,
	ANDROID : 2
};

Enum.LANGUAGE = {
	KR : 0,
	EN : 1
}

// GAME_CODE 리스트 : https://docs.google.com/spreadsheets/d/1pJdmtd-2PlSe_HcSiyGNbNrpJTWdUqkIyLOILsPpbo4/edit#gid=1989709800
Define.GAME_CODE = 176;	// 핫쉐어에서 사용함
Define.GameName = 'dalgonagame';
Define.SAVE_KEY = 'com.movisoft.dalgona';

Define.SAVE_VER = 1;    // 세이브버젼
Define.IMG_VER = 1;     // 이미지 버젼
Define.SND_VER = 1;     // 사운드 버젼
Define.SPINE_VER = 1;	// 스파인 버젼
Define.DEVICE = Enum.DEVICE_STATE.PC;
Define.bLocalHost = (document.location.href.indexOf("localhost") !== -1 );

Define.tbLang = [Enum.LANGUAGE.KR, Enum.LANGUAGE.EN];
Define.LANG = MSSDK.getParameterByName('lang') == "en" ? Define.tbLang[1] :Define.tbLang[0];
Define.PID = MSSDK.getParameterByName('id');

Define.iADCnt = 0;
Define.RANKING_GAME = false;
Define.focus_first = 0; //0,1,2,3
var isstart;
var mg = {};
//mg.isdev = true;

var keytimedelaymax = 1.5;
var keytimedelay = keytimedelaymax;
//var tickNow;
//var tickLast = Date.now();

var deltaTime = 0;
var accumADTime = 0;
function updateTick()
{
	deltaTime = MG.game.time.elapsed * 0.001;
	/*tickNow = Date.now();
	deltaTime = (tickNow - tickLast) * 0.001;
	tickLast = tickNow;*/
	accumADTime += deltaTime;
	//console.log('accumTime:',accumADTime);
}
//==================================================================================================
// 게임 비활성화시 일시정지 제어
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}

//윈도우창을 닫을때 이벤트.
window.addEventListener('blur', function() {
	// 게임이 블러먹게 되면..
	isblur = true;
	if(MG.gOption && MG.Game && MG.Game.state == STATE_GAME)
		MG.gOption.visible = true;

	// if(MSSDK) {
	// 	MSSDK.audioIsEnabled(function (onoff) { //GameSnacks
	// 		kData.isSfx = false;
	// 		kData.isBGM = false;
	// 		console.log('blur kData.isSfx:', kData.isSfx, 'kData.isBGM:', kData.isBGM);
	// 	});
	// }

}, false);

function handleVisibilityChange() {
	if (!document[hidden]) {
		//isblur = true;
		if(MG.gOption && MG.Game && MG.Game.state == STATE_GAME)
			MG.gOption.visible = true;
	}else{
		isblur = false;
	}
	// if(MSSDK) {
	// 	MSSDK.audioIsEnabled(function (onoff) { //GameSnacks
	// 		kData.isSfx = onoff;
	// 		kData.isBGM = onoff;
	// 		window.focus(); //GameSnacks//포커스추가
	// 		console.log('3window.focus');
	// 	});
	// }
}
window.addEventListener('focus', function() {
	// 게임이 블러먹게 되면..
	isblur = false;
	// if(MSSDK) {
	// 	MSSDK.audioIsEnabled(function (onoff) { //GameSnacks
	// 		kData.isSfx = onoff;
	// 		kData.isBGM = onoff;
	// 		console.log('cb foucus kData.isSfx:', kData.isSfx, 'kData.isBGM:', kData.isBGM);
	// 		window.focus(); //GameSnacks//포커스추가
	// 		console.log('2window.focus');
	// 	});
	// }
}, false);

document.addEventListener(visibilityChange, handleVisibilityChange, false);//success~~~~!!!!!

// // todo : PopconGame이 없을경우 임시로 조치해 준다. 로컬에서 돌리기위해서 처리..
// var PopconGame = PopconGame || {"Sdk": {
// 		log: function () {
// 		},
// 		adBannerEnable: function () {
// 		},
// 		adBannerDisable: function () {
// 		},
// 		RankingInfo: function () {
// 		},
// 		getJsonPID: function () {
// 		},
// 		getGooleID: function () {
// 			return '';
// 		},
// 		checkRecommendations: function (a,cb) {
// 			if(cb) cb();
// 		},
// 		createRecommendationIcon: function (a,b,cb) {
// 			if(cb) cb();
// 		},
// 		setRecommendationVisible: function (){
//
// 		}
// 	}};
// var ShowAD = ShowAD || function(a, b, cb){if(cb)cb()};

// document.addEventListener('touchstart', (e) => {
// 	const touch = e.touches[0];
// 	console.log('.touchstart', touch.clientX, touch.clientY);
// });
function Data(){
	this.iVer = Define.SAVE_VER;
    this.isBGM = true;
    this.isSfx = true;
    this.bTuto = false;
	this.iBestScore = 0;
    this.cur_lv = 1;
    this.shadow_lv = 1;
    this.sv_star = [-9];
    this.sv_perfect = [-9];
    this.sv_record = [-9];
}
var kData = new Data();
var tb_stars = {"1":{"gold":8,"silver":16,"bronze":40} ,"2":{"gold":8,"silver":16,"bronze":40} ,"3":{"gold":8,"silver":16,"bronze":40} ,"4":{"gold":8,"silver":16,"bronze":40} ,"5":{"gold":8,"silver":16,"bronze":40} ,"6":{"gold":8,"silver":16,"bronze":40} ,"7":{"gold":8,"silver":16,"bronze":40} ,"8":{"gold":8,"silver":16,"bronze":40} ,"9":{"gold":8,"silver":16,"bronze":40} ,"10":{"gold":8,"silver":16,"bronze":40} ,"11":{"gold":10,"silver":22,"bronze":50} ,"12":{"gold":10,"silver":22,"bronze":50} ,"13":{"gold":10,"silver":22,"bronze":50} ,"14":{"gold":10,"silver":22,"bronze":50} ,"15":{"gold":10,"silver":22,"bronze":50} ,"16":{"gold":10,"silver":22,"bronze":50} ,"17":{"gold":10,"silver":22,"bronze":50} ,"18":{"gold":10,"silver":22,"bronze":50} ,"19":{"gold":10,"silver":22,"bronze":50} ,"20":{"gold":10,"silver":22,"bronze":50} ,"21":{"gold":13,"silver":30,"bronze":60} ,"22":{"gold":13,"silver":30,"bronze":60} ,"23":{"gold":13,"silver":30,"bronze":60} ,"24":{"gold":13,"silver":30,"bronze":60} ,"25":{"gold":13,"silver":30,"bronze":60} ,"26":{"gold":13,"silver":30,"bronze":60} ,"27":{"gold":13,"silver":30,"bronze":60} ,"28":{"gold":13,"silver":30,"bronze":60} ,"29":{"gold":13,"silver":30,"bronze":60} ,"30":{"gold":13,"silver":30,"bronze":60} };

//달고나 qa
//https://docs.google.com/spreadsheets/d/1NoeEfz2OMQyiHv9orqrLcjklQ7omPECqhsuUpnvvtOY/edit#gid=437262531
//달고나 시간테이블
//https://docs.google.com/spreadsheets/d/1NoeEfz2OMQyiHv9orqrLcjklQ7omPECqhsuUpnvvtOY/edit#gid=2061905480

//===============================================================================
// Phaser Text 기능 확장.
//===============================================================================
Phaser.Text.prototype.ReSize = function(txt, limit_width, limit_height){
	if(txt != undefined)	this.text = txt;
	this.scale.set(1);
	if(this.width > limit_width) {
		if(limit_height === undefined)
			this.scale.set(limit_width/this.width);
		else if(limit_width/this.width <= limit_height/this.height)
			this.scale.set(limit_width/this.width);
	}
	if(limit_height != undefined && this.height > limit_height) {
		if(limit_width/this.width > limit_height/this.height)
			this.scale.set(limit_height/this.height);
	}
}

Phaser.Text.prototype.ChangeTextColor = function(){
	for(var i=0;i<this.text.length;++i){
		if(this.text[i] == "["){
			if(this.text[i+7] == "]"){	// 컬러색일경우
				var ec = this.text.slice(0, i+8).split(/(?:\r\n|\r|\n)/).length - 1;
				var color = "#"+this.text.slice(i+1, i+7);
				this.text = this.text.replace(this.text.slice(i, i+8), "");
				this.addColor(color, i-ec);
			}else if(this._text[i+1] == "-"){
				var ec = this.text.slice(0, i+3).split(/(?:\r\n|\r|\n)/).length - 1;
				this.text = this.text.replace(this.text.slice(i, i+3), "");
				this.addColor("#"+this.tint.toString(16), i-ec);
			}
		}
	}
}

Array.prototype.Mix = function(n){
	var t, r1, r2;
	var len = this.length;
	for(var i=0;i<n;++i){
		r1 = Random.Range(0, len);
		r2 = Random.Range(0, len);

		t = this[r1];
		this[r1] = this[r2];
		this[r2] = t;
	}
}

Number.prototype.ToString = function(v){
	if(v != undefined)
		v = v.toLowerCase();

	switch(v){
		case "n0":	// 숫자에 콤마를 찍는다.
			return this.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
			break;
		case "d2":	// 자릿수를 2자리로 한다. 빈자리는 0으로 채워서..
			var zero = '';
			var n = Math.floor(this).toString();

			if (n.length < 2){
				for (var i = 0; i < 2 - n.length; i++)
					zero += '0';
			}
			return zero + n;
			break;
		case "f1":
			return this.toFixed(1);
		case "f2":
			return this.toFixed(2);
			break;
		default:
			return this.toString();
			break;
	}
};

String.prototype.ToString = function(v){
	if(v != undefined)
		v = v.toLowerCase();
	switch(v){
		case "n0":	// 숫자에 콤마를 찍는다.
			return this.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
			break;
		case "d2":	// 자릿수를 2자리로 한다. 빈자리는 0으로 채워서..
			var zero = '';
			var n = this;

			if (n.length < 2){
				for (var i = 0; i < 2 - n.length; i++)
					zero += '0';
			}
			return zero + n;
			break;
		default:
			return this;
			break;
	}
};
//=============================================================================
// c#용 string.format부분 대체용.
//=============================================================================
var	string = function(){};
if (!string.Format) {
	string.Format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined'
				? args[number]
				: match
				;
		});
	};
}

var	Random = function(){};
if (!Random.Range) {
	Random.Range = function(min, max) {
		return MG.game.rnd.integerInRange(min, max-1);
	};

	Random.RangeFloat = function(min, max) {
		return MG.game.rnd.realInRange(min, max-0.00001);
	};
}
Define.LANDSCAPE = false;
var MGGAME = undefined;
document.addEventListener('deviceready', function() {

});
window.onload = function () {
    //'use strict';

    
    var game, mg = window[''];

    if(Define.LANDSCAPE === true)
        //game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', undefined, undefined, false);
        game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game', undefined, undefined, false);
    else
        //game = new Phaser.Game(720, 1280, Phaser.AUTO, 'game', undefined, undefined, true);
        game = new Phaser.Game(720, 1280, Phaser.CANVAS, 'game', undefined, undefined, true);

    game.state.add('boot', mg.Boot);
    game.state.add('preloader', mg.Preloader);
    game.state.add('game', mg.Game);
    game.state.start('boot');
};
'use strict';
//한글정규식
//[가-힣]+


//스프라이트.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
//스프라이트.texture.baseTexture.scaleMode = PIXI.scaleModes.LINEAR;
function ChangeSpineSkin( spineobj, slotname, skinname) {//스파인오브젝트,슬롯이름,스킨이름 //스파인스킨교체한다
    spineobj.Get_Spine().skeleton.setAttachment(slotname, skinname);// 인자1: 스롯명   인자2: 스킨명
    spineobj.Get_Spine().skeleton.setSlotsToSetupPose();//초기화
}

//스파인에서 노드이름으로 노드찾기
function FindSpineNode( SpineObj, NodeName ) { //(스파인, '본이름')
    return SpineObj.children[SpineObj.skeleton.findSlotIndex(NodeName)];
}

//스파인--하트 터질때 코드샘플<<
// this.cashwork_heart = this.game.add.spine(360, 640, "cashwork_heart");//스파인생성
// var SpineNode = FindSpineNode(this.cashwork_heart, "heart"); //타겟노드
// var SpriteTemp = this.game.add.sprite(0, 0, "heart@1x.png");  //붙여질 그림
// SpriteTemp.anchor.setTo(0.5,0.5);
// SpriteTemp.position.setTo(0,0);
// SpineNode.addChild(SpriteTemp);//타겟노드에 그림 붙이기
// this.cashwork_heart.setAnimationByName(0, "heart_out", false); //애니호출

//스파인오브젝트의 노드이름으로, 노드를 찾아서 child오브젝트를 붙이기//스파인링크
function AttachToSpineNode(SpineObj, NodeName, ChildObj) { //(스파인, '본이름', 자식OBJ)
    var SpineNode = FindSpineNode( SpineObj, NodeName );
    SpineNode.addChild(ChildObj);
    //ChildObj.anchor.setTo(0.5,0.5);
    ChildObj.position.setTo(0,0);
    return SpineNode;
}
//스파인--하트 터질때 코드샘플<<
// this.cashwork_heart = this.game.add.spine(360, 640, "cashwork_heart");//스파인생성
// var SpriteTemp = this.game.add.sprite(0, 0, "heart@1x.png");  //붙여질 그림
// SpriteTemp.anchor.setTo(0.5,0.5);
// SpriteTemp.position.setTo(0,0);
// var BoneNode = AttachToSpineNode(this.cashwork_heart, "heart", SpriteTemp);
// this.cashwork_heart.setAnimationByName(0, "heart_out", false); //애니호출

//스파인애니이벤트//스파인이벤
//spineboy.onEvent.add(function (i,e) {  console.log(', name:' + e.data.name + ', int:' + e.intValue + ', float:' + e.floatValue + ', string:' + e.stringValue + ', time:' +e.time); }
//spineboy.onEvent.add(function (i,e) {
//     switch ( e.data.name ) {
//        case 'pig_1':
//            break
//     }
//}

function GetSprAnimName(spr) {//애니이름가져오기,스프라이트
    return spr.animations.currentAnim.name;
}
function GetSprPngName(spr) {//텍스쳐이름가져오기,스프라이트
    return spr.animations.currentFrame.name;
}

function RandBetween(bottom, top) { return Math.random() * (top - bottom )+ bottom; } //부동소수랜덤부동소수
//정수일때는 bottom,top이 범위에 포함됨
function RandBetweenInt(bottom, top) { return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom; }//정수랜덤정수

//폰트찾기
//var div = document.getElementById( 'gameContainer' );
//alert( getCSS( div, 'font-size' ) );
//alert( getCSS( div, 'font-family' ) );
function getCSS( element, property ) {
    return window.getComputedStyle( element, null ).getPropertyValue( property );
}
//폰트찾기

// function isNull(o) {
//     return(typeof o!="undefined" && o!=null)?false:true;
// }

// function isNull(o) {
//     if(typeof o=== "undefined") return true;
//     else if(o===null) return true;
//     else if(o==='null') return true;
//     else return false;
// }
function isUndef(t){
    if(typeof t === 'undefined') return true;
    else false;
}
function isUndef_Null(t){
    if(t == null || typeof t === 'undefined' ) return true;
    else false;
}

//타임로그찍기
function getCurTimeLog() {
    var _currentdate = new Date();
    var _datetime = "" + _currentdate.getFullYear()
        + "-" + (_currentdate.getMonth() + 1)
        + "-" + _currentdate.getDate()
        + "," + _currentdate.getHours()
        + ":" + _currentdate.getMinutes()
        + ":" + _currentdate.getSeconds()
        + ":" + _currentdate.getMilliseconds();
    return _datetime;
}
//타임로그찍기

// var ColorSet = {
//     white: 0xffffff,
//     red: 0xff0000,
//     red_kukugo: 0xFF2020,
//     green: 0x00ff00,
//     blue: 0x0000ff,
//     black: 0x000000,
//     yellow: 0xffff00,
//     sky: 0xcceeff,
//     cyan: 0x00ffff,
//     magenta: 0xff00ff,
//     grey: 0x808080,
//     gray: 0x808080,
//     orange: 0xffa500,
//     pink: 0xff8080,
//     fontlevel: 0xfff57d,
//     lightgrey: (0x808080 * 1.5),
//     darkgrey: (0x808080 * 0.5),
//     brown: 0xa52a2a,
//     darkblue: 0x000080,
//
//     uioliv: 0xFFF799,
//     uisky: 0xBFFFFF,
//     uired: 0xFF7F7E,
//     uiblue: 0x7EA7F9,
//     uigreen: 0x7FE591,
//     uipurple: 0xC983C1,
//     uigray: 0x979797,
//     uigreenbtn: 0x19BD9B
// };

function convert_Idx2XY(idx_th, xsz, ysz) {
    var  y = Math.floor(idx_th / xsz);
    var x = idx_th % xsz;
    return [x,y];
}
function convert_XY2idx(xidx, yidx, xsz, ysz) {
    return xidx+(yidx*xsz);
}

function CompareForCard(a, b) { //소~대//오름차순
    if(a%100 < b%100) {
        return -1;
    }
    else if(a%100> b%100) {
        return 1;
    }
    else{//숫자가 같으면
        if(Math.floor(a/100) < Math.floor(b/100) ){
            return -1;
        }else if(Math.floor(a/100) > Math.floor(b/100) ) {
            return 1;
        }else {
            return 0;
        }
    }
    //http://dudmy.net/javascript/2015/11/16/javascript-sort/
    //return a%100 < b%100 ? -1 : a%100> b%100 ? 1 : 0;
}


function getMoneyFormatFromNum(n) {
    //소수점이 들어와서 예외처리함
    //n = float2int(n);

    var c = 0; //표시자리
    var d = ".";
    var t = ",";
    var j =0;
    var s = n < 0 ? "-" : "";
    var i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function getMoneyFormatFromNum2(n) { //세탑에서 쉼표 안나옴
    return n.toLocaleString();
}

function getNumFromMoney(moneystr){
    //var str = moneystr.replace(',', '');
    var str = moneystr.replace(/,/gi, "");
    //g : 발생할 모든 pattern에 대한 전역 검색
    //i : 대/소문자 구분 안함
    //m: 여러 줄 검색 (참고)
    return Number(str);
}

var getTimeFormatFromSec = function (num) { //두개 다 거의 비슷
    var hrs = Math.floor(num / 3600);
    var mins = Math.floor((num % 3600) / 60);
    var secs = num % 60;
    return (hrs > 0 ? hrs + ":" : "") + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
};

function secondsToTime(secs) { //두개 다 거의 비슷
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    //var ret_obj = {"h": hours, "m": minutes, "s": seconds };
    return (
        (hours > 0 ? hours + ":" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
}

//game.rnd.integerInRange(0, 10);//페이저랜덤모드는 min,max를 포함

//min~max까지 랜덤 float 값 리턴
function generateRandomNumber(min, max) {
    return (Math.random() * (max - min) + min);
}
//1~~9까지 랜덤값 리턴 //Math.floor(generateRandomNumber(1, 10)); //max값 포함안됨

//-----------------------배열함수모음--시작-------------------------
// //배열랜덤섞기함수
// function shuffleByArray(ar) {
//     var j, x, i;
//     for (i = ar.length; i; i--) {
//         j = Math.floor(Math.random() * i);
//         x = ar[i - 1];
//         ar[i - 1] = ar[j];
//         ar[j] = x;
//     }
// }

//배열함수최대값 //예 getMax_Arr([1, 10, 5, 11, 2, 5, 5]);
function getMax_Arr(compArr) {
    return compArr.reduce(
        function (accumulator, current, idx, arr) {
            return accumulator > current ? accumulator : current;
        }
    );
}

//배열함수_최소값 //예 getMax_Arr([1, 10, 5, 11, 2, 5, 5]);
function getMin_Arr(compArr) {
    return compArr.reduce(
        function (accumulator, current, idx, arr) {
            return accumulator > current ? current : accumulator;
        }
    );
}

//배열함수_평균값 //예 var ret  = getMean_Arr([1, 2, 3, 4, 5, 6, 1]); // 3.142857142857143
function reducerMean (accumulator, value, index, array) {
    var sumOfAccAndVal = accumulator + value; //accumulator가 정수임
    if (index === array.length - 1) {
        return (sumOfAccAndVal) / array.length;
    }
    return sumOfAccAndVal;
}
function getMean_Arr(ar) {
    return ar.reduce(reducerMean);
}

//배열함수_인자카운트체크 //예 var ret = getCheckCount_Arr(["kim", "hong", "lee", "hong", "lee", "lee", "hong"]); //{kim: 1, hong: 3, lee: 3}
function reducerCount(accumulator, value, index, array) {
    if (accumulator.hasOwnProperty(value)) { //accumulator가 오브젝트임
        accumulator[value] = accumulator[value] + 1;
    } else {
        accumulator[value] = 1;
    }
    return accumulator;
}
function getCheckCount_Arr(ar) {
    var result = ar.reduce(reducerCount, {});
    return result;
}

//홀수일때 *2를 하고 수집한다.
//배열함수_커스텀리듀스 //예 var ret = getReduceCustom_Arr([1, 2, 3, 4, 5, 6]); //[2, 6, 10]
function reducerCustom(accumulator, value) {
    if (value % 2 != 0) { //[i]값이 홀수이면
        accumulator.push(value * 2);//*2계산후 수집 //accumulator가 배열임
    }
    return accumulator;
}
function getReduceCustom_Arr(ar) {
    return ar.reduce(reducerCustom, []);
}

//[]안의 다차원을 1차원으로 수집
//배열함수_flatten, //예 var ret = getFlatten_Arr([{name:'aa'},{name:'bb'},[1, 2],[3,4],[5]]); //[1, 2, 3, 4, 5]
function reducerFlatten(accumulator, value, index, array) {
    return accumulator.concat(value);
}
function getFlatten_Arr(ar) {
    return ar.reduce(reducerFlatten, []);
}

//{name:''}만 골라서 '이름'을 수집한다.
//배열함수_flattenMap, 오브젝트key지정 //예 var ret = getFlattenMap_Arr([{name:'a'},{name:['b','c']},[1, 2],[3,4],[5]]); //["a", "b", "c"]
function reducerFlattenMap(accumulator, value, index, array) {
    var key = "name";
    if (value.hasOwnProperty(key)){    //.name 이면, 수집시도
        if(Array.isArray(value[key])){ //.name 배열이면,
            value[key].forEach(function (v) {
                if (accumulator.indexOf(v) === -1) { //중복방지
                    accumulator.push(v);
                }
            });
        }
        else{                         //.name == '' 이면,
            if (accumulator.indexOf(value[key]) === -1) { //중복방지
                accumulator.push(value[key]);
            }
        }
    }
    return accumulator;
}
function getFlattenMap_Arr(ar) {
    return ar.reduce(reducerFlattenMap, []);
}

//[1,2,3].slice(); //배열딥카피//배열복사

//배열함수_중복제거
var array = [0,1,2,3,3,3,4,5,5,6,6];
function reducerRemoveOverlap(accumulator, value, index, array) {
    return accumulator;
}
function arrayRemoveOverlap(array){
    var returnArray = array.reduce(function(previousValue, currentValue){
        if(previousValue.indexOf(currentValue)<0) previousValue.push(currentValue);
        return previousValue;
    }, []);
}

//배열함수_서로 교체
function swapArrayElements(arr, indexA, indexB) {
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
}

//배열함수_합치기 //예union_Arr(['A', 'B'], ['B', 'C'])); //["A", "B", "C"]
function union_Arr(a, b) { //전체 a+b  //전체값과 중복포함
    var tmp = {},
        res = [];
    for (var i = 0; i < a.length; i++) tmp[a[i]] = 1;
    for (var j = 0; j < b.length; j++) tmp[b[j]] = 1;
    for (var k in tmp) res.push(k);
    return res;
}
//배열함수_교집합 //예intersect_Arr(['A', 'B'], ['B', 'C'])); //["B"]
function intersect_Arr(a, b) { //교집합 a&&b
    var tmp = {},
        res = [];
    for (var i = 0; i < a.length; i++) tmp[a[i]] = 1;
    for (var j = 0; j < b.length; j++)
        if (tmp[b[j]]) res.push(b[j]);
    return res;
}
//배열함수_차집합 //예diff_Arr(['A', 'B'], ['B', 'C'])); //["A"]
function diff_Arr(a, b) { //차집합 a-b
    var tmp = {},
        res = [];
    for (var i = 0; i < a.length; i++) tmp[a[i]] = 1;
    for (var j = 0; j < b.length; j++) {
        if (tmp[b[j]]) delete tmp[b[j]];
    }
    for (var k in tmp) res.push(k);
    return res;
}
//배열함수_대칭자 //예sym_diff_Arr(['A', 'B'], ['B', 'C'])); //["A","C"]
function sym_diff_Arr(a, b) { //대칭차 a+b-(a&&b) //중복값부분 제거된 합집합
    var tmp = {},
        res = [];
    for (var i = 0; i < a.length; i++) tmp[a[i]] = 1;
    for (var j = 0; j < b.length; j++) {
        if (tmp[b[j]]) delete tmp[b[j]];
        else tmp[b[j]] = 1;
    }
    for (var k in tmp) res.push(k);
    return res;
}

//2차원배열생성
function createArr2D(yrow, xcol, cbfn) { //-->arr[y][x]
    var chkidx=0;
    var arr = [];
    for (var y=0;y<yrow;y++) {
        arr[y] = [];
        for (var x=0;x<xcol;x++) {
            if(cbfn === undefined){
                arr[y].push(chkidx);
                chkidx+=1;
            }else{
                arr[y].push(cbfn());
            }
        }
    }
    return arr;
}

//랜덤배열생성
function rangeByArr(start, edge, step) { //rangeByArr(10) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] //갯수(범위로 지정시 마지막값 제외)
    // If only one number was passed in make it the edge and 0 the start.
    if (arguments.length == 1) {
        edge = start;
        start = 0;
    }

    // Validate the edge and step numbers.
    edge = edge || 0;
    step = step || 1;

    // Create the array of numbers, stopping befor the edge.
    for (var ret = []; (edge - start) * step > 0; start += step) {
        ret.push(start);
    }
    return ret;
}
//console.log(convertStr2Arr1D(rangeByArr(10)));            //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//console.log(convertStr2Arr1D(rangeByArr(65, 69)));        //[65, 66, 67, 68]                   //마지막값 포함안됨!!
//console.log(convertStr2Arr1D(rangeByArr(10, -10.1, -5))); //[10, 5, 0, -5, -10]                //마지막값 포함 시키려면
//console.log(convertStr2Arr1D(rangeByArr(10, 1)));         //[]
//console.log(convertStr2Arr1D(rangeByArr(1, 3)));          //[1,2]                              //마지막값 포함안됨!!
//console.log(convertStr2Arr1D(rangeByArr(5, 2, -1)));      //[5,4,3]                            //마지막값 포함안됨!!

function fillArray0(cnt, value) {//제로열 [0,0,0,0,0,0,...]
    var arr = [], i = 0;
    for (; i < cnt;)arr[i++] = value;
    return arr;
}
function filledArray(len, value) {//제로배열 [0,0,0,0,0,0,...]
    if (len <= 0) return [];
    var result = [value];
    while (result.length < len / 2) {
        result = result.concat(result);
    }
    return result.concat(result.slice(0, len - result.length));
}
//스트링 --> 1자씩 배열생성(반복가능)
function filledArrayString(cnt, txt) {    //filledArrayString(2, "abc")); //['a','b','c','a','b','c']
    return new Array(cnt + 1).join(txt).split('');
}

//'aaa bbb'.split(' '); //스트링분할-->배열
//'aaa bbb'.replace(' ', "\n"); //줄바꿈

//배열을 --> 1줄 문자로 변환
function Arr2Str(arr) {//디버깅용 [a,b,c] ---> "[0]:a, [1]:b, [3]:c,"
    if(typeof(arr) === 'undefined') {
        console.log( "err: arr==undefined");
        return;
    }
    if(typeof(arr.length) === 'undefined') {
        console.log( "err: arr.length==undefined");
        return;
    }

    var s = "";
    for (var i = 0; i < arr.length; i++) {
        s += "[" + i + "]:" + arr[i].toString() + ", ";
    }
    return s;
}
function ArrXY2Str(arr) {//디버깅용 [{x:0,y:0},{x:0,y:0}] ---> "[0]0,0, [1]0:0, "
    if(typeof(arr) === 'undefined') {
        console.log( "err: arr==undefined");
        return;
    }
    if(typeof(arr.length) === 'undefined') {
        console.log( "err: arr.length==undefined");
        return;
    }

    var s = "";
    for (var i = 0; i < arr.length; i++) {
        s += "[" + i + "]:" + arr[i].x.toString() + ","+arr[i].y.toString()+", ";
    }
    return s;
}
function ArrXYC2Str(arr) {//디버깅용 [{xcol:0,yrow:0,col:0},{xcol:0,yrow:0,col:0}] ---> "[0]0,0,0, [1]0:0,0, "
    if(typeof(arr) === 'undefined') {
        console.log( "err: arr==undefined");
        return;
    }
    if(typeof(arr.length) === 'undefined') {
        console.log( "err: arr.length==undefined");
        return;
    }

    var s = "";
    for (var i = 0; i < arr.length; i++) {
        s += "[" + i + "]xy:" + arr[i].xcol.toString() + ","+arr[i].yrow.toString()+", cb:"+arr[i].colorbak.toString()+", c:"+arr[i].color.toString()+", ";
    }
    return s;
}
function Arr2D2Str(arr) {
    if(typeof(arr) === 'undefined') {
        console.log( "err: arr==undefined");
        return;
    }
    if(typeof(arr.length) === 'undefined') {
        console.log( "err: arr.length==undefined");
        return;
    }
    if(typeof(arr[0].length) === 'undefined') {
        console.log( "err: arr[0].length==undefined");
        return;
    }
    var s = "";
    for (var i = 0; i < arr.length; i++) {
        s += "[" + i + "]:";
        for (var k = 0; k < arr[i].length; k++) {
            s += " [" + k + "]:" + arr[i][k];
        }
        s += "\n";
    }
    return s;
}

//오브젝트속성제거----모든속성 //{a: 1, b: 2, length: 0}-->{} //리커시브지원안함
function deleteProperties(objectToClean) {
    for (var x in objectToClean) if (objectToClean.hasOwnProperty(x)) delete objectToClean[x];
}



function Str2Unicode( str ){
    var result = "";
    for(var i = 0; i < str.length; i++){
        // Assumption: all characters are < 0xffff
        result += "\\u" + ("000" + str[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
};

function CheckSizeWord(strValue, minByte, maxByte) { //문자를 영문바이트수로 체크한다.
    var strLen = strValue.length;
    var totalByte = 0;
    var len = 0;
    var oneChar = "";
    var str2 = "";

    for (var i = 0; i < strLen; i++) {
        oneChar = strValue.charAt(i);
        if (encodeURI(oneChar).length > 4) {
            totalByte += 2;
        } else {
            totalByte++;
        }
        // 입력한 문자 길이보다 넘치면 잘라내기 위해 저장
        if (totalByte <= maxByte) {
            len = i + 1;
        }
    }
    //----------------------------------
    if (totalByte >= maxByte) return 'high';
    else if (totalByte >= minByte) return 'good';
    else return 'low';
    //----------------------------------

    // 넘어가는 글자는 자른다. https://mainia.tistory.com/2410
    if (totalByte > maxByte) {
        alert(maxByte + "자를 초과 입력 할 수 없습니다.");
        str2 = strValue.substr(0, len);
        obj.value = str2;
        chkword(obj, 4000);
    }
}

function deepEqual(x, y) { //비교함수
    if ((typeof x === "object" && x !== null) && (typeof y === "object" && y !== null)) {
        if (Object.keys(x).length !== Object.keys(y).length) return false;
        for (var prop in x) {
            if (y.hasOwnProperty(prop)) {
                if (! deepEqual(x[prop], y[prop])) return false;
            }
            else return false;
        }
        return true;
    }
    else if (x !== y) return false;
    else return true;
}
//deepEqual([1,2,'hello'], [1,2,'hello']); //true
//deepEqual([1,2,'hello'], [1,'2','hello']); //false

//Fast & low GC 1item-splice: //가비지콜렉트줄이는 아이템제거 스프라이스
function splc1(arr, idx){ //arr[idx]만 제거      // 보통splice(a,2)는 배열[a+0],[a+1]제거한다.
    var len=arr.length;
    if (len){
        while (idx<len){
            arr[idx++] = arr[idx];
        }
        --arr.length;
    }
}
//-------------------------배열함수모음--끝--------------


//수학함수모음-------------------------------------------------
//var VxV  = Math.pow(3, 2)            //3^2=9//제곱
//var modV = 5 % 2                     //1    //나머지값
//var q = parseInt(13 / 5);            //

function clamp_MathHelper(value, min, max) { //최대최소값minmax
    if (value < min) {
        return min;
    }
    else if (value > max) {
        return max;
    }
    return value;
}
function lerp_MathHelper(value1, value2, amount) { //인터폴레이션,보간,
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
}

function distance2D(x1, y1, x2, y2) { //거리구하기
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
//Math.dist(0,0, 3,4); //the output will be 5
//Math.dist(1,1, 4,5); //the output will be 5
//Math.dist(3,4); //the output will be 5

//범위 포함, 랜덤 정수 생성
function randRangeFromInt(low, high) // Get a random int between low and high, inclusive
{
    return Math.floor(low + Math.random() * (high - low + 1));
}

//--------------------------공A중심xy, 공A반지름, 공B중심xy, 공B반지름 //충돌체크
function circleIntersectionFromPos(x1, y1, r1, x2, y2, r2) {
    // Calculate the distance between the centers
    var dx = x1 - x2;
    var dy = y1 - y2;
    var len = Math.sqrt(dx * dx + dy * dy);

    if (len < r1 + r2) {
        // Circles intersect
        return true;
    }

    return false;
}
//사용예 //레벨에 공이 들어갔을때 충돌체크
//        for (var i=0; i<level.columns; i++) {
//            for (var j=0; j<level.rows; j++) {
//                var tile = level.tiles[i][j];
//                if (circleIntersection(player.bubble.x + level.tilewidth/2,
//                                       player.bubble.y + level.tileheight/2,
//                                       level.radius*0.5,
//                                       coord.tilex + level.tilewidth/2,
//                                       coord.tiley + level.tileheight/2,
//                                       level.radius))
//                {
//                    snapBubble();//충돌처리
//                    return;
//                }
//            }
//        }


//포지션에서 각도를 계산할 때
//라디안값을 각도값으로
function radToDeg(angle) // Convert radians to degrees
{
    return angle * (180 / Math.PI);
}

//각도에서 포지션을 계산할 때
//각도값를 라디안값으로
function degToRad(angle) // Convert degrees to radians
{
    return angle * (Math.PI / 180);
}

function interpolateAngles(a1, a2, weight, radians) {  // interpolated between angles (short leg, scaled to -180..180 / -PI..PI)
    if (typeof radians === 'undefined') { radians = true; }
    var wrap = (radians) ? Math.PI : 180;
    if (Math.abs(a2 - a1) > wrap) {
        if (a2 > a1) {
            a1 += wrap * 2;
        } else {
            a2 += wrap * 2;
        }
    }
    var out = (a1 + ((a2 - a1) * weight));
    if (out >= 0 && out <= wrap * 2) { return out; }
    return (out % (wrap * 2));
}

function moveToAngle(angle, dist) //각도로 거리만큼 이동(로컬좌표리턴)
{
    var ret = [0, 0];
    ret[0] = dist * Math.cos(degToRad(angle));
    ret[1] = dist * -1 * Math.sin(degToRad(angle));
    return ret;
}

//주어진 degree값만큼 회전
function rotateFromPos(cx, cy, x, y, angle) //지정위치에서 회전계산함수
{
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

function getAngleFromPos(centerX, centerY, X, Y) {
    //   html screen
    //   (0,0)+---+
    //        |   |
    //        +---+(625,625)
    var mouseangle = radToDeg(Math.atan2(centerY - Y, X - centerX));
    //              (90)
    //               |
    //          179  |   1
    //      (-180)--중심--(0)
    //          -179 |  359
    //               |
    //             (-90)
    while (mouseangle < 0) {
        mouseangle = mouseangle + 360;
    }
    while (mouseangle > 360) {
        mouseangle = mouseangle - 360;
    }
    //               (90)
    //                 |
    //         (180)--중심--(0) Math.floor(mouseangle)시
    //                 |
    //               (270)

    return mouseangle;
}

function cropAngleWith180(angle, min, max) {
    //               (90)
    //                 |
    //         (180)--중심--(0) 좌표계
    //                 |
    //               (270)
    if (angle > 90 && angle < 270) // Left
    {
        if (angle > max) {
            angle = max;
        }
    } else // Right
    {
        if (angle < min || angle >= 270) {
            angle = min;
        }
    }
    return angle;
}
//원 안에서 랜덤위치(로컬)
function randomPointOnCircle(radius) { //randomPointOnCircle(2); // → 리턴값 [x,y] = [0.3667, 1.966]
    var angle = Math.random() * 2 * Math.PI;
    return [ radius * Math.cos(angle),radius * Math.sin(angle)];
}
//수학함수모음-------------------------------------------------



function delayTime(ms) {
    var cur_d = new Date();
    var cur_ticks = cur_d.getTime();
    var ms_passed = 0;
    while (ms_passed < ms) {
        var d = new Date(); // Possible memory leak?
        var ticks = d.getTime();
        ms_passed = ticks - cur_ticks;
        // d = null;  // Prevent memory leak?
    }
}
function toDelayRun() {
    setTimeout(function () {
        //
    }, 500); //0.5초 뒤
}

var MaxIntegerPositive = Number.MAX_SAFE_INTEGER/10;        // 900719925474099.1 //최대정수
var MaxIntegerNegative = Number.MAX_SAFE_INTEGER/10 * -1;   // -900719925474099.1 //최소정수

//  1.9=>1
//  1.1=>1
//  0.9=>0
//  0.1=>0
//    0=>0
// -0.1=>0
// -0.9=>0
// -1.1=>-1
// -1.9=>-1
function float2int_mirror(f) {
    return Math[f < 0 ? 'ceil' : 'floor'](f);
}
//  1.9=>1
//  1.1=>1
//  0.9=>0
//  0.1=>0
//    0=>0
// -0.1=>-1
// -0.9=>-1
// -1.1=>-2
// -1.9=>-2
function float2int(f) { //소수->정수
    return Math.floor(f);
}
//  1.9=>2
//  1.1=>1
//  0.9=>1
//  0.1=>0
// -0.1=>0
//    0=>0
// -0.9=>-1
// -1.1=>-1
// -1.9=>-2
function float2int_round(f) { //소수->정수
    return Math.round(f);
}
function float2int_fast(f) { //소수->정수 //빠르지만 정수크기를 넘으면 에러
    return f | 0;
}

//색값이 이상하게 변환되는걸 발견
function rgb2hex(rgbArr) //[1.0,1.0,1.0]->0x000000==[255,255,255] //픽시버젼에 문제가 잇어서 따로사용
{
    //return ((rgbArr[0] * 255 << 16) + (rgbArr[1] * 255 << 8) + rgbArr[1] * 255 << 0);
    //return (rgbArr[0] * 0x010000) + (rgbArr[1] * 0x000100) + (rgbArr[2] * 0x000001);
    return float2int_fast(((rgbArr[0]*255 << 16) + (rgbArr[1]*255 << 8) + rgbArr[2]*255));
}
function rgbfloat2rgb256(rgbArr)
{
    return ([rgbArr[0]*255,rgbArr[1]*255,rgbArr[2]*255]);
}


//dec2hexString(65535) => "0xFFFF"
function dec2hexString(dec) { //아직안사용
    return '0x' + (dec+0x10000).toString(16).substr(-4).toUpperCase();
}

//컬러휠 배열 생성
var hsvidx_loop = 0;
var hsvidx_loop_new = 0;
var hsvidx_step = 36;
var hsvcolors;
 hsvcolors =[ //컬러테이블//색테이블//색상테이블//칼라테이블
        0xFF0000, //       0: {r: 255, g:   0, b:   0},  //빨강
        0xFF7F00, //      30: {r: 255, g: 127, b:   0},  //오렌지
        0xFFFF00, //      60: {r: 255, g: 255, b:   0},  //노랑
        0x7FFF00, //      90: {r: 127, g: 255, b:   0},  //노랑+녹
        0x00FF00, //     120: {r:   0, g: 255, b:   0},  //녹         Lime
        0x00FF7F, //     150: {r:   0, g: 255, b: 127},  //녹+하늘
        0x00FFFF, //     180: {r:   0, g: 255, b: 255},  //하늘       Cyan
        0x007FFF, //     210: {r:   0, g: 125, b: 255},  //하늘+파랑
        0x0000FF, //     240: {r:   0, g:   0, b: 255},  //파랑
        0x7F00FF, //     270: {r: 127, g:   0, b: 255},  //파랑+보라
        0xFF00FF, //     300: {r: 255, g:   0, b: 255},  //보라       Magenta
        0xFF007F  //     330: {r: 255, g:   0, b: 127},  //빨강+보라
     ];
var hsvcolorlen = hsvcolors.length;

function getLoopColorHex() {
    hsvidx_loop = hsvidx_loop_new;
    hsvcolors[hsvidx_loop];
    hsvidx_loop_new += 1;
    if(hsvidx_loop_new>hsvcolorlen-1) hsvidx_loop_new = 0;
    return hsvcolors[hsvidx_loop];

    //이건 두색을 보간하는것
    //var hsvidx_loop_colorA = { red:1, green:1, blue:1 };
    //var hsvidx_loop_colorB = { red:1, green:1, blue:1 };
    //return Phaser.Color.interpolateColorWithRGB(hsvidx_loop_colorA, hsvidx_loop_colorB, 100, idx);
}
//컬러휠 배열 생성

function rgb2html(rgbArr) //f0f0f0-->'#0xf0f0f0'
{
    var hr = rgbArr[0].toString(16);
    var hg = rgbArr[1].toString(16);
    var hb = rgbArr[2].toString(16);
    if(hr.length<2) hr='0'+hr;
    if(hg.length<2) hg='0'+hg;
    if(hb.length<2) hb='0'+hb;
    return '#' + '0x' + hr + hg + hb;
}
function rgb2hexstr(rgbArr) //f0f0f0-->'0xf0f0f0'
{
    var hr = rgbArr[0].toString(16);
    var hg = rgbArr[1].toString(16);
    var hb = rgbArr[2].toString(16);
    if(hr.length<2) hr='0'+hr;
    if(hg.length<2) hg='0'+hg;
    if(hb.length<2) hb='0'+hb;
    return '0x' + hr + hg + hb;
}
function hex2rgb(hex) { //픽시에 있음, 똑같음
    return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF) / 255];
}
function hex2str(hex) //샵+헥사버젼 //0x000000->"#000000"
{
    hex = hex.toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;
    return '#' + hex;
}

function ref_string() {
    var isfind = "Hello".includes("hell");
}

function str2int(str) { //스트링을정수로변환,정수변환
    //parseInt("010", 10)  // == 10
    //parseInt("4.23")     // == 4
    //parseInt("012.23")   // == 12
    //parseInt("5.2aa")    // == 5
    //parseInt("5.2aa")    // == NaN
    //parseInt("aaa")      // == NaN
    //Number("aaa")        // == NaN //속도가 더 빠르고, 오류발생요건이 많다
    //"2"*1;               //2       //속도가 더 느림
    return Number(str);
}
function str2float(str) { //소수변환
    //parseFloat('2.34cms')  //Output: 2.34
    //parseFloat('12.5')     //Output: 12.5
    //parseFloat('012.3')    //Output: 12.3
    //parseFloat("34 45 66") //Output: 34
    return parseFloat(str);
}
function int2str(num) {  //스트링변환
    return num.toString();
}
function float2str(num) { //스트링변환
    return num.toString();
}
function floatFixed(num, count) {//소수점 제한
    return num.toFixed(count);
}
function str2int_limited(the_str) {//정수변환 //10배 빠름(Number랑 비교)
    var ret = 0;
    var len = the_str.length;
    if (len >= 1) ret += (the_str.charCodeAt(0) & 0xff) << 0;
    if (len >= 2) ret += (the_str.charCodeAt(1) & 0xff) << 8;
    if (len >= 3) ret += (the_str.charCodeAt(2) & 0xff) << 16;
    if (len >= 4) ret += (the_str.charCodeAt(3) & 0xff) << 24;
    return ret;
}

function number_pad1( a,b ) { //예,pad (1234, 3) => "234" //zerostring,제로스트링 만들기
    return (
        1e15 + a + // combine with large number
        "" // convert to string
    ).slice(-b) // cut leading "1"
}

// function number_pad2(input) { //zerostring,제로스트링 만들기(크기가4로 제한)
//     // var BASE = "0000";
//     // var thiscount =  Math.ceil(input / 10);
//     // return input ? BASE.substr(0, 4 - Math.ceil(input / 10)) + input : BASE;
//     //오류가 있다.
//     //   1 --> 0001,
//     //  11 --> 0011,
//     // 111 -->  111,
//     //1111 --> 1111,
//
//
//     // var BASE = "0000";
//     // var inputcount =  Math.ceil(input / 10);
//     // var sub = BASE.substr(0, 4 - inputcount);
//     // var ret = sub + input;
//     // return ret;
//
//     var BASE = zeropad;//"0000";
//     return input ? BASE.substr(0, (zeropad.length+1) - Math.ceil(input / 10)) + input : BASE;
//
//
//
// }
// function number_pad3(num, count){
//     var ret = num.toLocaleString('en-US',
//         {
//             style: 'decimal',
//             minimumIntegerDigits: count,
//             //minimumFractionDigits: 2, //표시 5.00
//             useGrouping: false
//         });
//     return ret;
// }

function int2str_limited(the_int) { //toString() 보다 빠르다
    /*
     Examples:
     int2str( str2int("test") ) == "test" // true
     int2str( str2int("t€st") ) // "t¬st", because "€".charCodeAt(0) is 8364, will be AND'ed with 0xff
     Limitations:
     max 4 chars, so it fits into an integer
     */
    var tmp = [
        (the_int & 0x000000ff) >> 0,
        (the_int & 0x0000ff00) >> 8,
        (the_int & 0x00ff0000) >> 16,
        (the_int & 0xff000000) >> 24
    ];
    var ret = "";
    for (var i = 0; i < 4; i++) {
        if (tmp[i] === 0)
            break;
        ret += String.fromCharCode(tmp[i]);
    }
    return ret;
}
//--날짜비교<-------------------------
function convertDayZeroFormat(y, m, d) { //int 2017,8,11 --> string '20170811'
    return ""+y+(m<10?('0'+m):m)+(d<10?('0'+d):d);
}
function getCurrentDayZeroFormat() { //현재날짜로 생성 --> string '20170811'
    var dt = new Date();
    var month = dt.getMonth() + 1; //0~11이므로 +1해야만 함
    var day = dt.getDate();
    var year = dt.getFullYear();
    return convertDayZeroFormat(year, month, day);
}
function getCustomDayZeroFormat(y,m,d,h,mi,s,ms) { //지정날짜로 생성 --> string '20170811'
    //var dt_limit = new Date(2017, 7, 11, 14, 52, 10, 0); //y,m,d,h=14,mi=52,s=10,ms=0
    var dt_limit = new Date(y, m, d, h, mi, s, ms); //y,m,d,h=14,mi=52,s=10,ms=0
    var month2 = dt_limit.getMonth() + 1; //0~11이므로 +1해야만 함
    var day2 = dt_limit.getDate();
    var year2 = dt_limit.getFullYear();
    return convertDayZeroFormat(year2, month2, day2);
}

//--날짜비교>-------------------------

//다이얼로그--트윈 시작-------------
function onFadeoutScale(con, fnEnd) //스케일작게사라지게
{
    //스케일트윈
    TweenMax.fromTo( con.scale,
        0.15, //time
        {
            x: 1,
            y: 1
        }, { //메달트윈
            x: 0.5,
            y: 0.5,
            ease: Linear.easeNone,
            onComplete: fnEnd,
            //onComplete: function(){ runFadeinScale(con);},
            delay: 0.0
        }
    );
    //알파트윈
    TweenMax.fromTo( con,
        0.15, //time
        {
            alpha: 1
        }, { //메달트윈
            alpha: 0,
            ease: Linear.easeNone,
            delay: 0.0
        }
    );
}
function onFadeinScale(con, fnEnd) //스케일크며보이기
{
    con.alpha = 0;
    //스케일트윈
    TweenMax.fromTo( con.scale,
        0.25, //time
        {
            x: 0.5,
            y: 0.5

        }, { //메달트윈
            x: 1,
            y: 1,
            ease: Elastic.easeOut,
            onComplete: fnEnd,
            delay: 0.0
        }
    );
    //알파트윈
    TweenMax.fromTo( con,
        0.25, //time
        {
            alpha: 0
        }, { //메달트윈
            alpha: 1,
            ease: Linear.easeNone,
            delay: 0.0
        }
    );
}
function onFadeout(con, begin, fnEnd) //사라지게
{
    //알파트윈
    TweenMax.fromTo( con,
        0.15, //time
        {
            alpha: begin
        }, { //메달트윈
            alpha: 0,
            ease: Linear.easeNone,
            delay: 0.2
        }
    );
}
function onFadein(con, end, fnEnd) //보이게
{
    //알파트윈
    TweenMax.fromTo( con,
        0.25, //time
        {
            alpha: 0
        }, { //메달트윈
            alpha: end,
            ease: Linear.easeNone,
            delay: 0.2
        }
    );
}
//다이얼로그--트윈 끝-------------

//그래픽스프라이트 생성(원형,사각)
//var o1 = {name:'gpbox1',type:'box',pgame:game,xpos:400,ypos:400,w:20,h:20,color:0x7f0000, alpha:0.75};
function createSimpleSpriteByGrahpic(o1) {
    var grph = o1.pgame.add.graphics(0, 0);
    grph.beginFill(o1.color, o1.alpha);
    if(o1.type === 'circle')
        grph.drawCircle(0, 0, o1.w); //x,y,r
    else //if(o1.type === 'box')
        grph.drawRect(0, 0, o1.w, o1.h); //x,y,w,h
    grph.endFill();

    var spr = o1.pgame.add.sprite(o1.xpos, o1.ypos, grph.generateTexture());
    spr.name = o1.name;
    spr.anchor.set(0.5);
    grph.destroy();
    return spr;
}

// //ping2(4000, function(){console.log('--ping2 ok--');}, function(){console.log('--ping2 failed--');});
// function ping2(t, cb_ok, cb_fail){
//     $.ajax({
//         url: 'index.html',
//         type: 'HEAD',
//         cache: false,
//         timeout : t,
//         success: function(result){ if(cb_ok) cb_ok(result); },
//         error: function(result){  if(cb_fail) cb_fail(result); }
//     });
// }
// function pingIndex(name) {
//     ping2(5000,
//         function () {
//             console.log('--pingIndex ok--, ' + (name?name:''));
//         },
//         function () {
//             console.log('--pingIndex fail--, ' + (name?name:''));
//             if(!MG.uiPME.main.visible)
//                 MG.uiPME.Show();
//         }
//     );
// }

function cloneObject(obj) {
    if(typeof obj === 'undefined') {
        return 'undefined';
    }
    return JSON.parse(JSON.stringify(obj));
}

function _ref_ajax_skip_beforesend() {
    $.ajax({
        type: "POST",
        url: "your url",
        dataType: "json",
        data: "your Data",
        traditional: true,    // or false, your choice
        async: false,    // or true, your choice
        beforeSend: function (xhr, opts) {
            // when validation is false
            if (false) {
                xhr.abort();
            }
        },
        success: function () {
            // success code
        },
        error: function () {
            // error code
        }
    });
}

function _ref_ajax_errorsetup() {
    $.ajaxSetup({
                         //request, status, error
        error: function (jqXHR, exception, err) {
            if (jqXHR.status === 0) {
                console.log('Not connect.\n Verify Network.', 'err:', err);
            } else if (jqXHR.status == 400) {
                console.log('Server understood the request, but request content was invalid. [400]', 'err:', err);
            } else if (jqXHR.status == 401) {
                console.log('Unauthorized access. [401]', 'err:', err);
            } else if (jqXHR.status == 403) {
                console.log('Forbidden resource can not be accessed. [403]', 'err:', err);
            } else if (jqXHR.status == 404) {
                console.log('Requested page not found. [404]', 'err:', err);
            } else if (jqXHR.status == 500) {
                console.log('Internal server error. [500]', 'err:', err);
            } else if (jqXHR.status == 503) {
                console.log('Service unavailable. [503]', 'err:', err);
            } else if (exception === 'parsererror') {
                console.log('Requested JSON parse failed. [Failed]', 'err:', err);
            } else if (exception === 'timeout') {
                console.log('Time out error. [Timeout]', 'err:', err);
            } else if (exception === 'abort') {
                console.log('Ajax request aborted. [Aborted]', 'err:', err);
            } else {
                console.log('Uncaught Error.n' + jqXHR.responseText, 'err:', err);
            }
        }
    });
}


var resultArray_opti = [];
function numberToKorean_arr_opti(number){
    var inputNumber  = number < 0 ? Math.abs(number) : number;
    var unitWords    = ['', '만', '억', '조', '경'];
    var splitUnit    = 10000;
    var splitCount   = unitWords.length;
    resultArray_opti  = [];
    for (var i = 0; i < splitCount; i++){
        var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
        unitResult = Math.floor(unitResult);
        if (unitResult > 0){
            resultArray_opti[i] = unitResult;
        }
    }
}
function to0000( a,b ) { //예,to0000(1234, 3) => "234" //zerostring,제로스트링 만들기
    return (
        1e15 + a + // combine with large number
        "" // convert to string
    ).slice(-b) // cut leading "1"
}

// function recurseInitXY(obj) {
//     if(obj.children.length>0) {
//         recurse();

//     } else {
//         // stop calling itself
//         //...
//     }
// }


//예)var val = ( 최대이동거리 * EasingFn.quadInOut(this.bias, 0, 1, 1));
//                                              (현재시간, 출발값, 도착값, 전체시간)
var EasingFn = {
    /**
     * @param {number} t Current time in millseconds//현재시간
     * @param {number} b Start value                //출발이동위치
     * @param {number} c Distance traveled relative to the start value //도착거리값(결과위치-출발이동점)
     * @param {number} d Duration in milliseconds   //전체시간
     */
    linear: function (t, b, c, d) {
        return c * t / d + b;
    },

    quadIn: function (t, b, c, d) { //(현재시간, 출발지점, 도착(상대적거리)값, 전체시간)
        t /= d;
        return c * t * t + b;
    },

    quadOut: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    },

    quadInOut: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t + b;
        }
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },

    cubeIn: function (t, b, c, d) {
        t /= d;
        return c*t*t*t + b;
    },

    cubeOut: function (t, b, c, d) {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    },

    cubeInOut: function (t, b, c, d) {
        t /= d/2;
        if (t < 1) {
            return c / 2 * t * t * t + b;
        }
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    },

    quartIn: function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t + b;
    },

    quartOut: function (t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    },

    quartInOut: function (t, b, c, d) {
        t /= d/2;
        if (t < 1) {
            return c / 2 * t * t * t * t + b;
        }
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    },

    quintIn: function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t * t + b;
    },

    quintOut: function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    },

    quintInOut: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    },

    sineIn: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    sineOut: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    sineInOut: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    expoIn: function (t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    expoOut: function (t, b, c, d) {
        return c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },

    expoInOut: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    },

    circIn: function (t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },

    circOut: function (t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    },

    circInOut: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        }
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    }
};

// //box.AddSpriteNine = function(parent, x, y, atlas, imgName, w, h, style, ax, ay, color)
// function createImg9(option){ //자체제작 나인패치
//     //option = { game, packname, pngname, x,y, w, h, off_l, off_r, off_t, off_b}
//     var parent = undefined;
//     var x = option.x;
//     var y = option.y;
//     var atlas = option.packname;
//     var imgName = option.pngname;
//     var w = option.w;
//     var h = option.h;
//     var style={top:option.off_t, bottom:option.off_b, left:option.off_l, right:option.off_r};
//     var ax = undefined;
//     var ay = undefined;
//     var color = undefined;
//
//     var main = MG.game.add.group();
//
//     if(ax===undefined) ax = 0.5;
//     if(ay===undefined) ay = 0.5;
//
//     var lc = style.left;
//     var rc = style.right;
//     var tc = style.top;
//     var bc = style.bottom;
//     var bw, bh;
//     var tw = -w*ax;
//     var th = -h*ay;
//
//     var TL;
//     // if(use4x4) TL = MG.AddSprite(main, tw, th, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     TL= MG.AddSprite(main, tw, th, atlas, imgName, undefined, undefined, 0, 0);
//     if(TL.width===1 || TL.height===1) console.log('warn: TL사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', TL.width,'h:', TL.height);
//     bw = TL.width;
//     bh = TL.height;
//     TL.crop(new Phaser.Rectangle(0, 0, lc, tc));
//
//     var TC;
//     // if(use4x4) TC = MG.AddSprite(main, tw+lc, th, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     TC = MG.AddSprite(main, tw+lc, th, atlas, imgName, undefined, undefined, 0, 0);
//     if(TC.width===1 || TC.height===1) console.log('warn: TC사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', TC.width,'h:', TC.height);
//     TC.crop(new Phaser.Rectangle(lc, 0, bw-lc-rc, tc));
//     TC.width = w-lc-rc;
//
//     var TR;
//     // if(use4x4) TR = MG.AddSprite(main, tw+w-rc, th, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     TR = MG.AddSprite(main, tw+w-rc, th, atlas, imgName, undefined, undefined, 0, 0);
//     if(TR.width===1 || TR.height===1) console.log('warn: TR사이즈가 1입니다.img:',imgName,'atlas:',atlas,'w:', TR.width,'h:', TR.height);
//     TR.crop(new Phaser.Rectangle(bw-rc, 0, rc, tc));
//     var CL;
//     // if(use4x4) CL = MG.AddSprite(main, tw, th+tc, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     CL = MG.AddSprite(main, tw, th+tc, atlas, imgName, undefined, undefined, 0, 0);
//     if(CL.width===1 || CL.height===1) console.log('warn: CL사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', CL.width,'h:', CL.height);
//     CL.crop(new Phaser.Rectangle(0, tc, lc, bh-tc-bc));
//     CL.height = h-tc-bc;
//     var CC;
//     // if(use4x4) CC = MG.AddSprite(main, tw+lc, th+tc, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     CC = MG.AddSprite(main, tw+lc, th+tc, atlas, imgName, undefined, undefined, 0, 0);
//     if(CC.width===1 || CC.height===1) console.log('warn: CC사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', CC.width,'h:', CC.height);
//     CC.crop(new Phaser.Rectangle(lc, tc, bw-lc-rc, bh-tc-bc));
//     CC.width = w-lc-rc;
//     CC.height = h-tc-bc;
//     var CR;
//     // if(use4x4) CR = MG.AddSprite(main, tw+w-rc, th+tc, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     CR = MG.AddSprite(main, tw+w-rc, th+tc, atlas, imgName, undefined, undefined, 0, 0);
//     if(CR.width===1 || CR.height===1) console.log('warn: CR사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', CR.width,'h:', CR.height);
//     CR.crop(new Phaser.Rectangle(bw-rc, tc, rc, bh-tc-bc));
//     CR.height = h-tc-bc;
//     var BL;
//     // if(use4x4) BL = MG.AddSprite(main, tw, th+h-bc, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     BL = MG.AddSprite(main, tw, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
//     if(BL.width===1 || BL.height===1) console.log('warn: BL사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', BL.width,'h:', BL.height);
//     BL.crop(new Phaser.Rectangle(0, bh-bc, lc, bc));
//     var BC;
//     // if(use4x4) BC = MG.AddSprite(main, tw+lc, th+h-bc, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     BC = MG.AddSprite(main, tw+lc, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
//     if(BC.width===1 || BC.height===1) console.log('warn: BC사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', BC.width,'h:', BC.height);
//     BC.crop(new Phaser.Rectangle(lc, bh-bc, bw-lc-rc, bc));
//     BC.width = w-lc-rc;
//     var BR;
//     // if(use4x4) BR = MG.AddSprite(main, tw+w-rc, th+h-bc, '_4x4pack', '_alpha1_4x4.png', undefined, undefined, 0, 0);
//     // else
//     BR = MG.AddSprite(main, tw+w-rc, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
//     if(BR.width===1 || BR.height===1) console.log('warn: BR사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', BR.width,'h:', BR.height);
//     BR.crop(new Phaser.Rectangle(bw-rc, bh-bc, rc, bc));
//
//     main.position.set(x, y);
//     if(parent!==undefined)
//         parent.addChild(main);
//     return main;
// }


function getWorldPos(obj){ //월드좌표뽑기,절대좌표,전역좌표
    var xy = [obj.x, obj.y];
    var p = obj.parent;
    while (p!==null) {
        xy[0] += p.x;
        xy[1] += p.y;
        p = p.parent;
    }
    return xy;
}
function getDestLocalFromDestWorld(o_spr, wDest) { //sprite, [x,y]
    var dtx;
    var dty;
    var wBegin = this.getWorldPos(o_spr); // 현재출발월드지점
    dtx = -(wBegin[0]-wDest[0]); //월드사이거리xy
    dty = -(wBegin[1]-wDest[1]);
    return [o_spr.x+dtx, o_spr.y+dty];
}
//현재로컬위치-->도착월드지점-->도착로컬지점
//예:W = this.getWorldPos(objcur);
//예:L = this.getDestLocalFromDestWorld(objdest, W);
//출발월드지점-->출발로컬지점
//beginW = this.getWorldPos(UIFs.node_begin.obj);
//beginL = this.getDestLocalFromDestWorld(o_end, beginW);



//var TimeBtnInit = 0.5; //기존
//var TimeBtnInit = 1.5;
var TimeBtnInit = 1.0;
var TimeBtnUp = TimeBtnInit;
var TimeBtnDown = TimeBtnInit;
var bBtnDown = true;
var bBtnUp = true;


'use strict';
var useDebugArr = false;                            //생성된 모든 UI를 Debug_UIArr[]에 저장
var usePrintDebugRecusive = false;

var scrw = 720;
var scrh = 1280;

function printDebugRecusive( cur, parent){
    console.log("create "+ cur +" in " + parent);
}
// //지워질예정
// function repostionCenterUIObsj_Canvas() {
// //모든 루트그룹 _OFFSET에서 화면중앙으로 이동;
//     var cnt = UIObjs_Canvas.length; //캔버스의 모든 패널 갯수
//     for (var i = 0; i < cnt; i++) {
//         var infoname = UIObjs_Canvas[i].info.name;                        //유니티ui정보 오브젝트 이름
//         if(UIFs[infoname].obj!==undefined)
//             UIFs[infoname].obj.position.setTo(scrw/2, scrh/2);//_OFFSET을 뺀 원위치로
//         else
//             console.log("UIFs[infoname].obj=== undefined이여서, 화면중앙으로 위치정렬을 못합니디.");
//     }
// }
// //지워질예정
// function create_UIObsj_CanvasAndRepositionOffset() {
//     var cnt = UIObjs_Canvas.length; //캔버스의 모든 패널 갯수
//     for (var i = 0; i < cnt; i++) {
//         //각각 루트 그룹생성
//         var uiobj = UIObjs_Canvas[i];                                  //유니티ui정보 오브젝트
//         var infoname = UIObjs_Canvas[i].info.name;                        //유니티ui정보 오브젝트 이름
//
//         //grp는 unity 0,0으로 배치, phaser에서는 화면중앙(예:360,640)으로 배치
//         var grp = makeRootGroup(uiobj, infoname, _OFFSET + (scrw/2), _OFFSET + (scrh/2));                            //더미그룹생성후할당, 루트그룹1생성
//         UIFs[infoname].obj = grp;                                   //UI제어하는 배열에 등록
//         EU.Alls[infoname] = grp;                                            //루트만 저장하는 배열에 등록
//
//         //각각의 children
//         var k_cnt = UIObjs_Canvas[i].children.length;
//         for (var k = 0; k < k_cnt; k++) {
//             recursiveAdd(UIObjs_Canvas[i].children[k], UIObjs_Canvas[i], UIFs[UIObjs_Canvas[i].info.name].obj);
//         }
//         //각각의 children
//     }
// }

function create_UIObj1_CanvasAndRepositionOffset(rootobj) {
    //var cnt = UIObjs_Canvas.length; //캔버스의 모든 패널 갯수

    //각각 루트 그룹생성
    //var uiobj = rootobj;                                  //유니티ui정보 오브젝트

    if(typeof rootobj === 'undefined'
        || typeof rootobj.info === 'undefined'){
        console.log('create_UIObj1_CanvasAndRepositionOffset()---> rootobj.info === undefined,  parent:',parent);
        return;
    }
    var infoname = rootobj.info.name;                        //유니티ui정보 오브젝트 이름

    var grp = undefined;
    if(typeof UIFs[infoname].obj !== 'undefined'){

        //기존 그룹을 그대로 사용하려고, grp생성 스킵함
    }else {

        //grp는 unity 0,0으로 배치, phaser에서는 화면중앙(예:360,640)으로 배치
        grp = makeRootGroup(rootobj,
            infoname,
            //_OFFSET + (scrw/2), _OFFSET + (scrh/2)
            (scrw / 2), (scrh / 2)
        );                            //더미그룹생성후할당, 루트그룹1생성
        UIFs[infoname].obj = grp;                                   //UI제어하는 배열에 등록
    }

    //EU.Alls[infoname] = grp;                                            //루트만 저장하는 배열에 등록
    //UIFsRoots[idx] = grp;
    //각각의 children
    var k_cnt = rootobj.children.length;

    for (var k = 0; k < k_cnt; k++) {
        // console.log('recursiveAdd..  ',
        //     rootobj.children[k].info.name,
        //     rootobj.children[k].info.pack,
        //     rootobj.children[k].info.sprite,
        // );
        recursiveAdd(rootobj.children[k], rootobj, UIFs[rootobj.info.name].obj);
    }


    //각각의 children

}

//자체제작 라인 슬라이스-------------------------------------------------------------------------------<<<
//box.AddSpriteNine에서 생성한후에, 리사이즈만한다
function setSizeSpriteNine( grp9, w9, h9, cl, ax, ay){
    //grp9=나인패치루트, w9=원하는 폭, h9=원하는 높이,
    //c1=클리핑{top:1, bottom:1, left:1, right:1}, ax,ay앵커포인트
    if(ax===undefined) ax=0.5;
    if(ay===undefined) ay=0.5;

    var wPixel = grp9.children[0].animations.currentFrame.sourceSizeW;//원본텍스쳐 픽셀크기
    var hPixel = grp9.children[0].animations.currentFrame.sourceSizeH;//원본텍스쳐 픽셀크기
    var midPixelX= wPixel - cl.left - cl.right; //중간스케일되는 픽셀수
    var midPixelY= hPixel - cl.top - cl.bottom; //중간스케일되는 픽셀수

    var midscalex = (w9 - (cl.left + cl.right)) / midPixelX;
    var midscaley = (h9 - (cl.top + cl.bottom)) / midPixelY;

    var posxL = -(w9 * ax);
    var posxM = -(w9 * ax) + cl.left;
    var posxR = -(w9 * ax) + cl.left + (midscalex*midPixelX);

    var posyT = -(h9 * ay);
    var posyM = -(h9 * ay) + cl.top;
    var posyB = -(h9 * ay) + cl.top + (midscaley*midPixelY);

    grp9.children[0].scale.setTo(1);                  //TL
    grp9.children[0].position.setTo(posxL, posyT);
    grp9.children[1].scale.setTo(midscalex, 1 );     //TM
    grp9.children[1].position.setTo(posxM, posyT);
    grp9.children[2].scale.setTo(1);                  //TR
    grp9.children[2].position.setTo(posxR, posyT);
    grp9.children[3].scale.setTo(1, midscaley);      //ML
    grp9.children[3].position.setTo(posxL,posyM);
    grp9.children[4].scale.setTo(midscalex, midscaley);//MM
    grp9.children[4].position.setTo(posxM, posyM);
    grp9.children[5].scale.setTo(1, midscaley);       //MR
    grp9.children[5].position.setTo(posxR, posyM);
    grp9.children[6].scale.setTo(1);                   //BL
    grp9.children[6].position.setTo(posxL, posyB);
    grp9.children[7].scale.setTo(midscalex, 1);        //BM
    grp9.children[7].position.setTo(posxM, posyB);
    grp9.children[8].scale.setTo(1);                   //BR
    grp9.children[8].position.setTo(posxR, posyB);
}

//var grp9 = UIFs.Image_cursor.obj;
//var strHexColor = '0xff0000';
function setTintSpriteNine(grp9, strHexColor ){
    var len = grp9.children.length;
    for(var i=0; i<len; i++) {
        grp9.children[i].tint = strHexColor;
    }
}
function setBlendSpriteNine(grp9, mode){
    if(typeof mode === 'undefined') mode = PIXI.blendModes.NORMAL;
    // PIXI.blendModes.NORMAL;
    // PIXI.blendModes.ADD;
    // PIXI.blendModes.MULTIPLY;
    // PIXI.blendModes.SCREEN;
    var len = grp9.children.length;
    for(var i=0; i<len; i++) {
        grp9.children[i].blendMode = mode;
    }
}
function setAlphaSpriteNine(grp9, a) {
    var len = grp9.children.length;
    for (var i = 0; i < len; i++) {
        grp9.children[i].alpha = a;
    }
}

//box.AddSpriteNine = function(parent, x, y, atlas, imgName, w, h, style, ax, ay, color)
function createImg9(option){ //자체제작 나인패치
    //option = { game, packname, pngname, x,y, w, h, off_l, off_r, off_t, off_b}
    var parent = undefined;
    var x = option.x;
    var y = option.y;
    var atlas = option.packname;
    var imgName = option.pngname;
    var w = option.w;
    var h = option.h;
    var style={top:option.off_t, bottom:option.off_b, left:option.off_l, right:option.off_r};
    var ax = undefined;
    var ay = undefined;
    var color = undefined;

    var main = MG.game.add.group();

    if(ax===undefined) ax = 0.5;
    if(ay===undefined) ay = 0.5;

    var lc = style.left;
    var rc = style.right;
    var tc = style.top;
    var bc = style.bottom;
    var bw, bh;
    var tw = -w*ax;
    var th = -h*ay;

    var TL;
    TL= MG.AddSprite(main, tw, th, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(TL, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(TL.width===1 || TL.height===1) console.log('warn: TL사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', TL.width,'h:', TL.height);
    bw = TL.width;
    bh = TL.height;
    TL.crop(new Phaser.Rectangle(0, 0, lc, tc));

    var TC;
    TC = MG.AddSprite(main, tw+lc, th, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(TC, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(TC.width===1 || TC.height===1) console.log('warn: TC사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', TC.width,'h:', TC.height);
    TC.crop(new Phaser.Rectangle(lc, 0, bw-lc-rc, tc));
    TC.width = w-lc-rc;

    var TR;
    TR = MG.AddSprite(main, tw+w-rc, th, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(TR, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(TR.width===1 || TR.height===1) console.log('warn: TR사이즈가 1입니다.img:',imgName,'atlas:',atlas,'w:', TR.width,'h:', TR.height);
    TR.crop(new Phaser.Rectangle(bw-rc, 0, rc, tc));
    var CL;
    CL = MG.AddSprite(main, tw, th+tc, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(CL, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(CL.width===1 || CL.height===1) console.log('warn: CL사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', CL.width,'h:', CL.height);
    CL.crop(new Phaser.Rectangle(0, tc, lc, bh-tc-bc));
    CL.height = h-tc-bc;
    var CC;
    CC = MG.AddSprite(main, tw+lc, th+tc, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(CC, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(CC.width===1 || CC.height===1) console.log('warn: CC사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', CC.width,'h:', CC.height);
    CC.crop(new Phaser.Rectangle(lc, tc, bw-lc-rc, bh-tc-bc));
    CC.width = w-lc-rc;
    CC.height = h-tc-bc;
    var CR;
    CR = MG.AddSprite(main, tw+w-rc, th+tc, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(CR, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(CR.width===1 || CR.height===1) console.log('warn: CR사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', CR.width,'h:', CR.height);
    CR.crop(new Phaser.Rectangle(bw-rc, tc, rc, bh-tc-bc));
    CR.height = h-tc-bc;
    var BL;
    BL = MG.AddSprite(main, tw, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(BL, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(BL.width===1 || BL.height===1) console.log('warn: BL사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', BL.width,'h:', BL.height);
    BL.crop(new Phaser.Rectangle(0, bh-bc, lc, bc));
    var BC;
    BC = MG.AddSprite(main, tw+lc, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(BC, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(BC.width===1 || BC.height===1) console.log('warn: BC사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', BC.width,'h:', BC.height);
    BC.crop(new Phaser.Rectangle(lc, bh-bc, bw-lc-rc, bc));
    BC.width = w-lc-rc;
    var BR;
    BR = MG.AddSprite(main, tw+w-rc, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
    //var test = MG.AddSprite(BR, 0, 0, undefined, '_alpha1_4x4.png', 0xFF0000, 0.5, 0, 0);
    if(BR.width===1 || BR.height===1) console.log('warn: BR사이즈가 1입니다. img:',imgName,'atlas:',atlas,'w:', BR.width,'h:', BR.height);
    BR.crop(new Phaser.Rectangle(bw-rc, bh-bc, rc, bc));

    main.position.set(x, y);
    if(parent!==undefined)
        parent.addChild(main);
    return main;
}
//자체제작 라인 슬라이스------------------------------------------------------------------------------->>>

//option = { game, packname, pngname, x,y, w, h, off_l, off_r, off_t, off_b}
function  createImg9_source(option) { //원본 페이저플러그인 나인패치

    if(option.packname === undefined){//싱글이미지경우
        option.packname = option.pngname;
        option.pngname = undefined;
    }
    //페이저나인패치 플러그인 --iptv에서 출력이 안되서 주석처리
    var ui9b = new PhaserNineSlice.NineSlice(
        option.game,                 //Phaser.Game
        option.x,                      //x
        option.y,                      //y
        option.packname,                  //atlas key //pack이름
        option.pngname,      //Image frame //png이름,
        option.w,                    //width
        option.h,                    //height
        {top: option.off_t, bottom: option.off_b, left: option.off_l, right: option.off_r}
    );
    ui9b.anchor.setTo(0.5, 0.5);//ui9b.resize(100,200);//ui9b.scale.setTo(0.5,0.5);
    return ui9b;
}

//option = {name:"", packname:"", pngname:"", x:0, y:0, anchorx:0.5, anchory:0.5}
function createSpriteImg(option) {
    var Obj;
    //if(!use4x4) {
        if (option.packname === undefined)//싱글이미지경우
            Obj = MG.game.make.sprite(option.x, option.y, option.pngname);
        else
            Obj = MG.game.make.sprite(option.x, option.y, option.packname, option.pngname);
    //}

    // if(use4x4){
    //     Obj = MG.game.make.sprite(option.x, option.y, '_alpha1_4x4.png');
    // }
    Obj.name = option.name;
    Obj.anchor.setTo(option.anchorx, option.anchory);
    return Obj;
}

function CreateProgress(spr, dir) { //dir = 'top', 'left', 'right', 'bottom'
    if(typeof dir === 'undefined') dir = 'left';
    if(dir==='top') spr.z_dir = 2;
    else if(dir==='bottom') spr.z_dir = 3;
    else if(dir==='right') spr.z_dir = 1;
    else spr.z_dir = 0;

    spr.old_bias=-1;
    // spr.onUpdatePr = function (aa) { } //피투끄려면
    // return spr; //피투끄려면
    var mask = MG.game.add.graphics(0, 0); //마스크 생성
    mask.beginFill(0xffffff);         //마스크 보이는영역(흰색)
    var reverseScaleX = (1/spr.scale.x);
    var reverseScaleY = (1/spr.scale.y);
    //피봇 위치
    //left 0-------+  right +-------+  top o-+ bottom +-+
    //     +-------+        +-------o      | |        | |
    //                                     | |        | |
    //                                     +-+        +-o
    if(dir==='top'|| dir==='left')
        mask.drawRect(0, 0, spr.width * reverseScaleX * 1 , spr.height * reverseScaleY * 1);    //마스크 구역생성
    if(dir==='bottom'|| dir==='right')
        mask.drawRect(0, 0, spr.width * reverseScaleX * -1 , spr.height * reverseScaleY * -1);    //마스크 구역생성
    mask.endFill();
    spr.mask = mask;       //마스크 할당
    //spr.mask.scale.x = 0.25;//테스트코드
    spr.addChild(mask);

    var halfw=spr.width*0.5;
    var halfh=spr.height*0.5;

    if(dir==='top' || dir==='left'){
        spr.anchor.setTo(0,0);
        spr.position.x -=halfw;
        spr.position.y -=halfh;
    }
    else if(dir==='bottom' || dir==='right') {
        spr.anchor.setTo(1,1);
        spr.position.x +=halfw;
        spr.position.y +=halfh;
    }

    spr.onUpdatePr = function(bias){ //프로그래스바
        if(spr.old_bias!== bias) {//업데이트 줄일 려고
            if(bias>=1) bias=1;
            else if(bias<=0) bias=0;
            spr.old_bias = bias;

           if(spr.z_dir===0) spr.mask.scale.x = bias;
           else if(spr.z_dir===3) spr.mask.scale.y = bias;
           else if(spr.z_dir===2) spr.mask.scale.y = bias;
           else if(spr.z_dir===1) spr.mask.scale.x = bias;
        }
    };
    return spr;
}

function CreateProgressRadial(spr) {
    spr.old_bias=-1;
    //return spr; //피투끄려면
    spr.z_halfw=spr.width*0.5;
    spr.z_halfh=spr.height*0.5;
    var reverseScaleX = (1/spr.scale.x);
    //var reverseScaleY = (1/spr.scale.y);

    var mask = MG.game.add.graphics(0, 0); //마스크 생성
    spr.mask = mask;       //마스크 할당
    spr.mask.clear();
    spr.mask.beginFill(0xffffff);
    spr.mask.arc(0, 0,
        spr.z_halfw*reverseScaleX,
        MG.game.math.degToRad(270),MG.game.math.degToRad(269),//도착각도, 출발각도
        true,
        128);
    spr.mask.endFill();

    spr.addChild(mask);

    spr.anchor.setTo(0.5);

    spr.onUpdatePr = function(bias){ //래디얼프로그래바
        //EL.Log("radial!! "+ (270+(360*bias)));
        if(spr.old_bias!== bias) {//업데이트 줄일 려고
            if(bias>=1) bias=1;
            else if(bias<=0) bias=0;
            spr.old_bias = bias;

            if(bias===1) {
                spr.mask.clear();
                return;
            }
            spr.mask.clear();
            spr.mask.beginFill(0xffffff);
            spr.mask.arc(0, 0,
                spr.z_halfw*reverseScaleX,
                MG.game.math.degToRad(270+(360*bias)),MG.game.math.degToRad(270),//시계
                //MG.game.math.degToRad(270),MG.game.math.degToRad(270-(360*bias)),//반시계
                true,
                128);
            spr.mask.endFill();
        }
    };
    return spr;
}

//option = {spr, x, y, tx, icon, isLock:false, name:'btn01', slotid:-1, slotstr:""}
function createBtn(option) { //버튼생성
    var spr = option.spr;

    // spr.sx=0;//피투끄려면
    // spr.sy=0;//피투끄려면
    // return spr; //피투끄려면

    if(typeof spr === 'undefined') {
        console.log("ERR: spr ==undefined in createBtn");
        return;
    }
    if(typeof option.icon === 'undefined') spr.z_icon = undefined;
    else{
        option.icon.anchor.setTo(0.5, 0.5);
        spr.addChild(option.icon);
        spr.z_icon = option.icon;
    }
    if(typeof option.tx === 'undefined') spr.z_tx = undefined;
    else{
        option.tx.anchor.setTo(0.5, 0.5);
        spr.addChild(option.tx);
        spr.z_tx = option.tx;
    }
    //옵션값
    if(typeof option.isLock === 'undefined') spr.z_isLock = undefined;
    else spr.z_isLock = option.isLock;
    if(typeof option.name === 'undefined') spr.name = undefined;
    else spr.name = option.name;
    if(typeof option.slotid === 'undefined') spr.z_slotid = undefined;
    else spr.z_slotid = option.slotid;
    if(typeof option.slotstr === 'undefined') spr.z_slotstr = undefined;
    else spr.z_slotstr = option.slotstr;
    //옵션값

    //iptv용 나인패치가 안나와서 커스텀을 사용시 anchor값이 없을때 예외처리
    if(typeof spr.anchor !== 'undefined') spr.anchor.setTo(0.5, 0.5);
    //iptv용 나인패치가 안나와서 커스텀을 사용시 anchor값이 없을때 예외처리

    spr.sx = spr.scale.x;
    spr.sy = spr.scale.y;

    spr.inputEnabled = true;
    spr.x = option.x;
    spr.y = option.y;

    spr.z_isdown = false; //눌려졋는지 체크하는 게 목적
    spr.z_tw=undefined;

    spr.fnover = function () {
        //EL.Log("Call fnover(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name+", id:"+spr.z_slotid);
    };

    spr.fnclick = function () {
        //EL.Log("Call fnclick(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name+", id:"+spr.z_slotid);
    };
    spr.fndown = function () {
        //EL.Log("Call fndown(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
    };
    spr.fnup = function () {
        console.log("Call fnup(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
    };
    //온오프버튼
    //spr.z_onoffbutton=false;
    spr.z_isonoff=true;
    spr.z_offsprite=undefined;
    //온오프버튼

    if(spr.events === undefined){ console.log('spr.events === undefined   name:', spr.name); }

    spr.events.onInputOver.add(function () {        //호버//버튼
        //console.log(spr.name +","+"fn_0a");
        if (spr.z_isLock) return;
        //EL.Log("onInputOver" + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
        spr.z_isdown = false;
        //spr.tint = 0xFFFFBB; //호버시 노란색 테스트 코드
        spr.fnover();
    }, this);
    spr.events.onInputOut.add(function () {        //취소
        //console.log(spr.name +","+"fn_1a");
        if (spr.z_isLock) return;
        //EL.Log("onInputOut" + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
        spr.z_isdown = false;
        if(typeof spr.z_tw !== 'undefined') spr.z_tw.kill();
        spr.z_tw = TwScaleTo(spr, 0.1, {x:spr.sx, y:spr.sy});
        //spr.tint = 0xFFFFFF; //벗어날때 하얀색 테스트 코드
    }, this);
    spr.events.onInputUp.add(function () {   //업 클릭
        //console.log(spr.name +","+"fn_2a"+", bBtnUp:"+bBtnUp + ", prev");

        //버튼다중업방지용
        if(bBtnUp===false) return;
        bBtnUp = false;
        TimeBtnUp = TimeBtnInit;
        //버튼다중업방지용


        //console.log(spr.name +","+"fn_2a"+", bBtnUp:"+bBtnUp);
        if(typeof spr.z_tw !== 'undefined') spr.z_tw.kill();
        spr.z_tw = TwScaleTo(spr, 0.1, {x:spr.sx, y:spr.sy});

        if (spr.z_isLock) return;

        setTimeout(function () {
            if (spr.z_isdown && spr.fnclick !== undefined) spr.fnclick(spr.z_slotid);
            spr.z_isdown = false;
            spr.fnup();
            //spr.tint = ColorSet.yellow;
        }, 100);

    }, this);

    // spr.events.onInputUp.add(function(){
    //     //버튼다중업방지용
    //     if(bBtnUp===false) return;
    //     bBtnUp = false;
    //     TimeBtnUp = TimeBtnInit;
    //     //버튼다중업방지용
    //
    //     spr.fnup();
    //     if(!arguments[2]) return;
    //     if (spr.z_isdown && spr.fnclick !== undefined) spr.fnclick(spr.z_slotid);
    //     spr.z_isdown = false;
    // }, this);


    spr.events.onInputDown.add(function () { //다운
        //console.log(spr.name +","+"fn_3a"+", bBtnDown:"+bBtnDown + ", prev");

        //버튼다중눌림방지용
        if(bBtnDown===false) return;
        bBtnDown = false;
        TimeBtnDown = TimeBtnInit;
        //버튼다중눌림방지용

        //console.log(spr.name +","+"fn_3a"+", bBtnDown:"+bBtnDown);

        if (spr.z_isLock) return;
        //EL.Log("onInputDown" + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);

        //if(typeof bSoundSE === 'undefined' || bSoundSE == true) {
           // SE_Click.play();
            //세탑웹오디오정지문제로끄기//MG.PlayAudio('SE_Click');//일반버튼클릭
            //EL.Log("print SE_Click.play()");

        //}
        //MG.PlayAudio('02_SE_Menu');

        //버튼이미지변경
        spr.z_isdown = true;
        if(typeof spr.z_tw !== 'undefined') spr.z_tw.kill();
        spr.z_tw = TwScaleTo(spr, 0.1, {x:(spr.sx*1.1), y:(spr.sy*1.1)});

        spr.fndown();
        //spr.tint = ColorSet.cyan;
    }, this);

    spr.onDelete = function(){
        if(spr.z_icon !== undefined) spr.z_icon.destroy();
        if(spr.z_tx !== undefined) spr.z_tx.destroy();
        spr.fnclick = null;
    };

    return spr;
}//버튼생성//createBtn

//롱프래스버튼//드래그버튼-------처리방법//Touch Stationary//스테이셔너리
//버튼.input.enableDrag();               //속성추가
//버튼.input.setDragLock(false, false);  //속성추가
//update()에서 if(버튼.input.isDragged){ 처리 }
//롱프래스버튼//드래그버튼-------처리방법

//드래그이벤트로 처리2
//버튼.inputEnabled = true;
//버튼.input.enableDrag();
//버튼.input.allowVerticalDrag = false;
//버튼.input.allowHorizontalDrag = false;
//버튼.events.onDragStart.add(function (spr, pt) { console.log('onDragStart', spr, pt, spr.name, pt.clientX, pt.clientY); }, this);
//버튼.events.onDragStop.add(function(spr, pt){ console.log('onDragStop dist:', spr, pt,  pt.positionUp.y - pt.positionDown.y); }, this);
//버튼.events.onDragUpdate.add(function(spr, pt){  console.log('onDragStart', spr, pt, spr.name, pt.clientX, pt.clientY); }, this);
//드래그이벤트로 처리2

//option = {spr, x, y, tx, icon, isLock:false, name:'btn01', slotid:-1, slotstr:""}
function createBtn_NoTween(option) { //버튼생성
    var spr = option.spr;
    if(typeof spr === 'undefined') {
        console.log("ERR: spr ==undefined in createBtn");
        return;
    }
    if(typeof option.icon === 'undefined') spr.z_icon = undefined;
    else{
        option.icon.anchor.setTo(0.5, 0.5);
        spr.addChild(option.icon);
        spr.z_icon = option.icon;
    }
    if(typeof option.tx === 'undefined') spr.z_tx = undefined;
    else{
        option.tx.anchor.setTo(0.5, 0.5);
        spr.addChild(option.tx);
        spr.z_tx = option.tx;
    }
    //옵션값
    if(typeof option.isLock === 'undefined') spr.z_isLock = undefined;
    else spr.z_isLock = option.isLock;
    if(typeof option.name === 'undefined') spr.name = undefined;
    else spr.name = option.name;
    if(typeof option.slotid === 'undefined') spr.z_slotid = undefined;
    else spr.z_slotid = option.slotid;
    if(typeof option.slotstr === 'undefined') spr.z_slotstr = undefined;
    else spr.z_slotstr = option.slotstr;
    //옵션값
    if(typeof spr.anchor !== 'undefined') spr.anchor.setTo(0.5, 0.5);
    spr.sx = spr.scale.x;
    spr.sy = spr.scale.y;

    spr.inputEnabled = true;
    spr.x = option.x;
    spr.y = option.y;

    spr.z_isdown = false; //눌려졋는지 체크하는 게 목적
    spr.z_tw=undefined;

    spr.fnover = function () {
        //EL.Log("Call notween fnover(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name+", id:"+spr.z_slotid);
    };

    spr.fnclick = function () {
        //EL.Log("Call notween  fnclick(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name+", id:"+spr.z_slotid);
    };
    spr.fndown = function () {
        //EL.Log("Call notween fndown(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
    };
    spr.fnup = function () {
        console.log("Call notween  fnup(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
    };
    spr.fnout = function () {
        //EL.Log("Call notween  fnout(), " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
    };

    //온오프버튼
    spr.z_isonoff=true;
    spr.z_offsprite=undefined;
    //온오프버튼

    if(spr.events === undefined){ console.log('spr.events === undefined   name:', spr.name); }

    spr.events.onInputOver.add(function () {        //호버//버튼NoTween
        //console.log(spr.name +","+"fn_0");
        if (spr.z_isLock) return;
        //EL.Log("onInputOver notween " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
        spr.z_isdown = false;
        //spr.tint = 0xFFFFBB; //호버시 노란색 테스트 코드
        spr.fnover();
    }, this);
    spr.events.onInputOut.add(function () {        //취소
        //console.log(spr.name +","+"fn_1");
        if (spr.z_isLock) return;
        //EL.Log("onInputOut notween " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);
        spr.z_isdown = false;
        spr.fnout();
    }, this);
    spr.events.onInputUp.add(function () {   //업 클릭

        //버튼다중업방지용
        if(bBtnUp===false) return;
        bBtnUp = false;
        TimeBtnUp = TimeBtnInit;
        //버튼다중업방지용

        console.log(spr.name +","+"fn_2");
        if (spr.z_isLock) return;
        if (spr.z_isdown && spr.fnclick !== undefined) spr.fnclick(spr.z_slotid);
        spr.z_isdown = false;
        spr.fnup();
    }, this);

    spr.events.onInputDown.add(function () { //다운

        //버튼다중눌림방지용
        if(bBtnDown===false) return;
        bBtnDown = false;
        TimeBtnDown = TimeBtnInit;
        //버튼다중눌림방지용

        console.log(spr.name +","+"fn_3");
        if (spr.z_isLock) return;
        //EL.Log("onInputDown notween " + ", xy:" + spr.x + "," + spr.y+", name:"+ spr.name);

        if(typeof bSoundSE === 'undefined' || bSoundSE == true){
            //SE_Click.play();
            //EL.Log("print SE_Click.play()");
        }

        spr.z_isdown = true;
        spr.fndown();
    }, this);

    spr.onDelete = function(){
        if(spr.z_icon !== undefined) spr.z_icon.destroy();
        if(spr.z_tx !== undefined) spr.z_tx.destroy();
        spr.fnclick = null;
    };

    return spr;
}//버튼생성//createBtn

//트루타임폰트생성(Arial)
function createTxt( option1) {
    var textObj1 = MG.game.make.text(option1.x, option1.y, option1.str, option1.style);
    textObj1.name = option1.name;
    textObj1.anchor.setTo(option1.anchorx, option1.anchory);
    return textObj1;
}
//비트맵폰트생성
//option1 = {name:"", str:"", x:0, y:0, anchorx:0.5, anchory:0.5, font:"", size:25, align:'center'}
function createBitmapTxt( option1) {
    var textObj1 = MG.game.make.bitmapText(option1.x, option1.y, option1.font, option1.str, option1.size, option1.align);
    textObj1.name = option1.name;
    textObj1.anchor.setTo(option1.anchorx, option1.anchory);
    return textObj1;
}

function TwScaleTo(obj, time, to) {
    var tween = TweenMax.to(
        obj.scale,
        time,
        {
            x:to.x, y:to.y,
            ease: Linear.easeNone,
            delay: 0.0
        }
    );
    return tween;
}
function TwMoveTo(obj, time, tox, toy) {
    var tween = TweenMax.to(
        obj.position,
        time,
        {
            x:tox, y:toy,
            ease: Linear.easeNone,
            delay: 0.0
        }
    );
    return tween;
}
// function TwMoveTo_local(obj, time, to) {
//     //트윈맥스로컬이동//로컬트윈맥스
//     TweenMax.to(combo, 0.5, {
//         y: "-=100",
//         alpha: 0,
//         ease: Linear.easeNone,
//         onComplete: function () { combo.onHide(); },
//         onUpdate: function () { console.log(combo.y); }
//     });
//
//     var tween = TweenMax.to(
//         obj.position,
//         time,
//         {
//             x:to.x, y:to.y,
//             ease: Linear.easeNone,
//             delay: 0.0
//         }
//     );
//     return tween;
// }

function checkObjFromUnity(rootOBJ, selectedname) { //체크유니티체크
    var ret = false;
    if(typeof rootOBJ === 'undefined') {
        console.log(selectedname+"이 없습니다 (checkObjFromUnity)");
        ret = false;
    }
    else{
        if(typeof rootOBJ[selectedname] === 'undefined'){
            console.log(selectedname+"이 없습니다 (checkObjFromUnity)");
            ret = false;
        }
        else if(typeof rootOBJ[selectedname].obj === 'undefined'){
            console.log(selectedname+"이 없습니다 (checkObjFromUnity)");
            ret = false;
        }
        else ret = true;
    }
    return ret;
}
//예)스파인애니
// UIFs.sp_12345.obj.z_anims = [['number_count_0'],['number_count_1'],['number_count_2'],['number_count_3'],['number_count_4'],['number_count_5'],['number_count_6'],['number_count_7'],['number_count_8'],['number_count_9']];
// UIFs.sp_12345.obj.fnover  = function(){ playSpineTracks_Loop(UIFs.sp_12345.obj, 1, function(){ }); };
// UIFs.sp_12345.obj.fnout   = function(){ playSpineTracks(UIFs.sp_12345.obj, 0, function(){ }); };
// UIFs.sp_12345.obj.fnclick = function(){ playSpineTracks(UIFs.sp_12345.obj, 2, function(){ }); };
function playSpineTracks_Loop( spine1, track1, cbfn ) { //마지막 애니 루핑
    spine1.z_track = track1;
    spine1.z_idxcur = 0;
    spine1.visible = true;
    //console.log("sptest 스파인loop, sp:"+ spine1.z_name  + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur] +", z_idxcur:"+ spine1.z_idxcur);
    var loop = false;
    if(spine1.z_anims[spine1.z_track].length === 1) loop = true;

    spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], loop);
    spine1.state.onComplete = function (trackIndex) {
        spine1.z_idxcur+=1;
        //console.log("sptest 스파인loop, 진입시작 sp:"+ spine1.z_name + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur]);
        if(spine1.z_idxcur >= spine1.z_anims[spine1.z_track].length ) {
            //콜백---
            if(typeof cbfn !== 'undefined'
                && spine1.z_idxcur === spine1.z_anims[spine1.z_track].length){
                cbfn();
                //console.log("sptest 스파인loop, 콜백호출됨 sp:"+ spine1.z_name  +", z_idxcur:"+spine1.z_idxcur);
            }
            //콜백---
            return;
        }
        spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], true);
        //console.log("sptest 스파인loop, 진입후실행완료 sp:"+ spine1.z_name + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur] +", z_idxcur:"+spine1.z_idxcur);
    };//onComplete
}
function playSpineTracks_Hide( spine1, track1, cbfn) { //애니끝에서 하이드
    if(spine1.z_name === "result_popup"){
        console.log("debug -------------------sp_result_bg");
    }
    spine1.z_track = track1;
    spine1.z_idxcur = 0;
    spine1.visible = true;
    //console.log("스파인hide "+ spine1.z_name +", i:"+ spine1.z_idxcur + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur]);
    spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], false);
    spine1.state.onComplete = function (trackIndex) {
        spine1.z_idxcur+=1;
        //console.log("스파인hide "+ spine1.z_name +", ++i:"+ spine1.z_idxcur + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur]);
        if(spine1.z_idxcur >= spine1.z_anims[spine1.z_track].length ) {
            //콜백--
            if(typeof cbfn !== 'undefined') cbfn();
            //콜백--
            spine1.visible = false;
            return;
        }
        spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], false);
    };//onComplete
}
function playSpineTracks( spine1, track1, cbfn ) { //순서대로 애니
    spine1.z_track = track1;
    spine1.z_idxcur = 0;
    spine1.visible = true;
    //spine1.skeleton.setToSetupPose();//첫시작만 되고 재시작이 안되서 급하게 추가한 것
    spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], false);
    //console.log("타임로그 spine 스파인 "+ spine1.z_name +", i:"+ spine1.z_idxcur + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur]);
    //console.log('타임로그 spine 스파인 ', getCurTimeLog());
    spine1.state.onComplete = function (trackIndex) {
        spine1.z_idxcur+=1;
        //console.log("타임로그 스파인 "+ spine1.z_name +", ++i:"+ spine1.z_idxcur + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur], 'trackIndex:',trackIndex);
        //console.log('타임로그 스파인 ', getCurTimeLog());
        if(spine1.z_idxcur >= spine1.z_anims[spine1.z_track].length ) {
            if(typeof cbfn !== 'undefined') cbfn();
            return;
        }
        spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], false);
    };//onComplete
}
function initSpineTracks2( spine1, track1, cbfn ) {
    spine1.z_track = track1;
    spine1.z_idxcur = 0;
    spine1.visible = true;
    spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], false);
    //console.log("스파인 "+ spine1.z_name +", i:"+ spine1.z_idxcur + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur]);
    spine1.state.onComplete = function (trackIndex) {
        spine1.z_idxcur+=1;
        //console.log("스파인 "+ spine1.z_name +", ++i:"+ spine1.z_idxcur + ", name:" + spine1.z_anims[spine1.z_track][spine1.z_idxcur]);
        if(spine1.z_idxcur >= spine1.z_anims[spine1.z_track].length ) {
            //콜백--
            if(typeof cbfn !== 'undefined') cbfn();
            //콜백--
            return;
        }
        spine1.setAnimationByName(0, spine1.z_anims[spine1.z_track][spine1.z_idxcur], false);
    };//onComplete
}
function playSpineTracks2( spine1, track1, cbfn ) { //스판수정
    //UIFs.sp_result_bg.obj.z_anims = [
    //    ['result_popup_in','result_popup_idle'],
    //    ['result_popup_idle']
    //];//애니리스트
     spine1.visible = true;
     spine1.setToSetupPose();
     spine1.setAnimationByName(0, "result_popup_in", false);
     //spine1.addAnimationByName(0, "result_popup_idle", true);
}

function playSpineInit(spine1){ //익스포트된 값으로 자동 애니하는 용도
    spine1.visible = true;
    spine1.setAnimationByName(0, spine1.z_initanim, spine1.z_initloop);
    //spine1.state.onComplete = function (trackIndex) { };
}

//텍스트위치수정(유니티상위치와 페이저상위치 미세하게 다른기 때문에)
function setOffsetY_UnityText(textObj1) {
    //var yoff = textObj1.height * 0.10;
    var yoff = textObj1.height * 0.05;
    textObj1.y += yoff;
}

var Debug_UIArr = [];

//unity 0,0으로 배치, phaser에서는 360,640으로 배치
function makeRootGroup( uiobj, infoname, centerx, centery){ //(유니티ui정보 오브젝트, 유니티ui정보 오브젝트 이름)
    var ret;
    ret = MG.game.make.group();                         //게임ui배열에 루트 그룹생성
    ret.name = infoname;                                      //루트그룹 이름저장
    ret.position.setTo(centerx, centery);   //루트그룹 위치중앙지정

    if (typeof uiobj.info.u_intvals !== 'undefined')
        ret.u_intvals = uiobj.info.u_intvals;
    if (typeof uiobj.info.u_strvals !== 'undefined')
        ret.u_strvals = uiobj.info.u_strvals;
    if (typeof uiobj.info.u_floatvals !== 'undefined')
        ret.u_floatvals = uiobj.info.u_floatvals;
    if (typeof uiobj.info.u_colorvals !== 'undefined')
        ret.u_colorvals = ui1.info.u_colorvals;
    if (typeof uiobj.info.u_namevals !== 'undefined')
        ret.u_namevals = uiobj.info.u_namevals;
    if (typeof uiobj.info.u_vec2vals !== 'undefined')
        ret.u_vec2vals = uiobj.info.u_vec2vals;
    if (typeof uiobj.info.u_usesavechild !== 'undefined'){
        ret.u_usesavechild = true;
        ret.u_savechild=[];
    }

    return ret;
}
//예)  curobj=자식들OBJ[], 루트OBJ_{}, 루트OBJ_Phaser
//    recursiveAdd(UIObjs_Canvas[i].children[k], UIObjs_Canvas[i], [UIObjs_Canvas[i].info.name].obj);
function recursiveAdd( curobj, parentobj, phaserparent ) {

    if(usePrintDebugRecusive) printDebugRecusive( curobj.info.name, parentobj.info.name);
    var phob; //페이저용 오브젝트

    //console.log("=====   "+curobj.info.utype);


    switch(curobj.info.utype) {
        case UNITYTYPE.NODE://-----------------------------------------유니티그룹
            phob = MG.game.make.group();
            phob.position.setTo(curobj.info.pos.x, curobj.info.pos.y);
            phob.name = curobj.info.name;
            //공통
            phob.scale.setTo(curobj.info.scale.x, curobj.info.scale.y);
            //회전
            if (curobj.info.angle !== undefined) phob.angle = curobj.info.angle;

            if(phaserparent !== undefined ) {
                phaserparent.addChild(phob); //부모가 있을 때만 대응한다

                // //부모배열에 현재오브젝트저장하기<<
                // if(parentobj.info.u_usesavechild !== undefined){
                //     UIFs[parentobj.info.name].obj.u_savechild.push(phob);//그룹을 배열에 저장할때
                // }
                // //부모배열에 현재오브젝트저장하기>>
            }

            if(typeof UIFs[curobj.info.name] !== 'undefined')
                UIFs[curobj.info.name].obj = phob; //오브젝트를 등록한다. //obj등록-유니티타입 노드인 경우

            // //저장배열 초기화 만들기<<
            // if(typeof UIFs[curobj.info.name] !== 'undefined') {
            //     if(typeof curobj.info.u_usesavechild !== 'undefined') {
            //         UIFs[curobj.info.name].obj.u_usesavechild = true; //실사용데이터만들기
            //         UIFs[curobj.info.name].obj.u_savechild = [];      //실사용배열데이터만들기
            //     }
            // }
            // //저장배열 초기화 만들기>>

            if(useDebugArr)
                Debug_UIArr.push(phob);//디버그용도
            break;

        case UNITYTYPE.IMAGE://-----------------------------------------유니티이미지

           // console.log("=====   "+curobj.info.ptype);

            if(curobj.info.ptype === PHASERTYPE.BUTTON) {
                //클릭시 반응하는 스프라이트인 경우 --------- //Notween버튼인경우
                var _intval0=0;
                var _strval0="";
                if(typeof curobj.info.u_intvals !== 'undefined') _intval0=curobj.info.u_intvals[0];
                if(typeof curobj.info.u_strvals !== 'undefined') _strval0=curobj.info.u_strvals[0];
                if(curobj.info.sliced!==undefined) {
                    //나인패치
                    var option9 = {
                        game:MG.game,
                        packname:curobj.info.pack,
                        pngname:curobj.info.sprite,
                        x:0,
                        y:0,
                        w:curobj.info.size.w,
                        h:curobj.info.size.h,
                        off_l:curobj.info.sliced.l,
                        off_r:curobj.info.sliced.r,
                        off_t:curobj.info.sliced.t,
                        off_b:curobj.info.sliced.b
                    };
                    //UIFs[curobj.info.name].slicedtxon = createImg9(option9);

                    //나인패치 버튼생성시
                    phob = createBtn_NoTween({
                        spr:createImg9(option9),//UIFs[curobj.info.name].slicedtxon,
                        x:curobj.info.pos.x,
                        y:curobj.info.pos.y,
                        tx:undefined,
                        icon:undefined,
                        isLock:false,
                        name:curobj.info.name,
                        slotid:_intval0, //나인패치버튼//노트윈
                        slotstr:_strval0 //나인패치버튼//노트윈
                    });

                    //오프용이미지(나인패치) 자식으로 링크
                    if(curobj.info.txdisable !== undefined) {
                        // var option9off = {
                        //     game: MG.game,
                        //     packname: curobj.info.pack,
                        //     pngname: curobj.info.txdisable,
                        //     x: 0,
                        //     y: 0,
                        //     w: curobj.info.size.w,
                        //     h: curobj.info.size.h,
                        //     off_l: curobj.info.sliced.l,
                        //     off_r: curobj.info.sliced.r,
                        //     off_t: curobj.info.sliced.t,
                        //     off_b: curobj.info.sliced.b
                        // };
                        // //전역변수에도 저장
                        // UIFs[curobj.info.name].z_offsprite = createImg9(option9off);
                        // UIFs[curobj.info.name].z_offsprite.visible = false;
                        // phob.addChild(UIFs[curobj.info.name].z_offsprite);
                        // //버튼에도 저장한다.
                        // phob.z_offsprite = UIFs[curobj.info.name].z_offsprite;

                        // 온오프 나인패치 리로드 텍스쳐 버젼--------------------------(Notween버튼포함)
                        UIFs[curobj.info.name].z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                        phob.z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                        // 온오프 나인패치 리로드 텍스쳐 버젼--------------------------(Notween버튼포함)

                    }
                    //오프용이미지(나인패치) 자식으로 링크
                    //나인패치>>
                }else {
                    //단일이미지경우
                    var _intval1=0;
                    var _strval1="";
                    if(typeof curobj.info.u_intvals !== 'undefined') _intval1=curobj.info.u_intvals[0];
                    if(typeof curobj.info.u_strvals !== 'undefined') _strval1=curobj.info.u_strvals[0];
                    var sprtemp;
                    // if(use4x4)
                    //     sprtemp = MG.game.make.sprite(0, 0, '_alpha1_4x4.png');
                    // else {
                    if(curobj.info.pack === undefined)
                        sprtemp = MG.game.make.sprite(0, 0, curobj.info.sprite);
                    else
                        sprtemp = MG.game.make.sprite(0, 0, curobj.info.pack, curobj.info.sprite);
                    // }
                    phob = createBtn_NoTween({
                        spr:sprtemp,
                        x:curobj.info.pos.x,
                        y:curobj.info.pos.y,
                        tx:undefined,
                        icon:undefined,
                        isLock:false,
                        name:curobj.info.name,
                        slotid:_intval1, //단일이미지버튼
                        slotstr:_strval1//단일이미지버튼
                    });
                    //오프용이미지생성, 자식으로 링크
                    if(curobj.info.txdisable !== undefined) { //오프상태 텍스쳐 정보 설정
                        // //전역변수에도 저장
                        // UIFs[curobj.info.name].z_offsprite = curobj.info.pack === undefined ? MG.game.make.sprite(0, 0, curobj.info.txdisable) : MG.game.make.sprite(0, 0, curobj.info.pack, curobj.info.txdisable);
                        // UIFs[curobj.info.name].z_offsprite.anchor.setTo(0.5);
                        // UIFs[curobj.info.name].z_offsprite.visible = false;
                        // phob.addChild(UIFs[curobj.info.name].z_offsprite);
                        // //버튼에도 저장한다.
                        // phob.z_offsprite = UIFs[curobj.info.name].z_offsprite;

                        //온오프버튼설정2 리로드 텍스쳐 버젼--------------------------(Notween버튼포함)
                        UIFs[curobj.info.name].z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                        phob.z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                        //온오프버튼설정2 텍스쳐교체 버젼--------------------------(Notween버튼포함)

                    }
                    //오프용이미지 생성
                    //단일이미지경우>>
                }
                phob.sx = curobj.info.scale.x;
                phob.sy = curobj.info.scale.y;
                phob.scale.setTo(curobj.info.scale.x,curobj.info.scale.y);

                phob.tint = curobj.info.color;
                phob.alpha = curobj.info.alpha;

                phaserparent.addChild(phob);

                if(typeof UIFs[curobj.info.name] !== 'undefined')
                    UIFs[curobj.info.name].obj = phob; //obj등록-이미지-클릭시반응

                if(curobj.info.ptype===PHASERTYPE.BUTTON
                    || curobj.info.ptype===PHASERTYPE.ONOFFBUTTON//등록함수연결
                    || curobj.info.ptype===PHASERTYPE.DISABLEBUTTON
                ){
                    if(typeof UIFs[curobj.info.name] !== 'undefined') {
                        phob.fnclick = UIFs[curobj.info.name].FnClick; //나인,단일버튼
                        phob.fnover = UIFs[curobj.info.name].FnOver;
                        phob.fndown = UIFs[curobj.info.name].FnDown;
                        phob.fnlong = UIFs[curobj.info.name].FnLongPress;
                    }else{
                        phob.fnclick = function() {
                            console.log("click NoFns Button");
                        };
                    }
                }
            } //curobj.info.ptype === PHASERTYPE.BUTTON //클릭시 반응하는 스프라이트인 경우 //Notween버튼인경우 //
            else
            { //curobj.info.ptype !== PHASERTYPE.BUTTON
                //클릭시 반응하지 않는 이미지속성인 경우 ---------디폴트 이미지인 경우------------------------

                if (curobj.info.sliced !== undefined) { //나인패치일때
                    if(curobj.info.name === 's_bg'){
                        console.log('s_bg');
                    }
                    phob = createImg9({
                        game: MG.game,
                        packname: curobj.info.pack,
                        pngname: curobj.info.sprite,
                        x: curobj.info.pos.x,
                        y: curobj.info.pos.y,
                        w: curobj.info.size.w,
                        h: curobj.info.size.h,
                        off_l: curobj.info.sliced.l,
                        off_r: curobj.info.sliced.r,
                        off_t: curobj.info.sliced.t,
                        off_b: curobj.info.sliced.b
                    });
                    phob.name = curobj.info.name;
                } else {
                    phob = createSpriteImg({ //단일이미지일때
                        name: curobj.info.name,
                        packname: curobj.info.pack,
                        pngname: curobj.info.sprite,
                        x: curobj.info.pos.x,
                        y: curobj.info.pos.y,
                        anchorx: 0.5,
                        anchory: 0.5
                    });
                }
                if (curobj.info.useinteractive === true) phob.inputEnabled = true; //클릭시 인풋 막기
                if (curobj.info.angle !== undefined) phob.angle = curobj.info.angle;
                phob.scale.setTo(curobj.info.scale.x, curobj.info.scale.y);
                phob.tint = curobj.info.color;
                phob.alpha = curobj.info.alpha;
                if(typeof phaserparent === 'undefined' || typeof phaserparent.addChild === 'undefined'){
                    console.log("phaserparent  == undefined");
                }

                phaserparent.addChild(phob);

                //이미지인경우 프로그래스바 예외 처리 ---------
                if (curobj.info.progress === PHASERDIRTYPE.TOP) {
                    // console.log("프로그래스바 이름(top):" + curobj.info.name);
                    CreateProgress(phob, 'top');
                } else if (curobj.info.progress === PHASERDIRTYPE.RIGHT) {
                    // console.log("프로그래스바 이름(right):" + curobj.info.name);
                    CreateProgress(phob, 'right');
                } else if (curobj.info.progress === PHASERDIRTYPE.BOTTOM) {
                    // console.log("프로그래스바 이름(bottom):" + curobj.info.name);
                    CreateProgress(phob, 'bottom');
                } else if (curobj.info.progress === PHASERDIRTYPE.LEFT) {
                    // console.log("프로그래스바 이름(left):" + curobj.info.name);
                    CreateProgress(phob, 'left');
                }
                if (curobj.info.radial === true) {
                    // console.log("래디알 프로그래스바 이름:" + curobj.info.name);
                    CreateProgressRadial(phob);
                }
                //이미지인경우 프로그래스바 예외 처리 ---------
             }

            if(typeof UIFs[curobj.info.name] !== 'undefined')
                UIFs[curobj.info.name].obj = phob; //obj등록-이미지-무반응

            if(useDebugArr) Debug_UIArr.push(phob);//디버그용도
            break;

        case UNITYTYPE.BUTTON://-----------------------------------------유니티버튼
            if(curobj.info.txdisable !== undefined) { //disable텍스쳐 체크 됬으면, 텍스쳐 저장 경고문
                //console.log("warn: disaable텍스쳐를 저장합니다. "+curobj.info.name);
            }
            var _intval0=0;
            var _strval0="";
            if(typeof curobj.info.u_intvals !== 'undefined') _intval0=curobj.info.u_intvals[0];
            if(typeof curobj.info.u_strvals !== 'undefined') _strval0=curobj.info.u_strvals[0];
            if(curobj.info.sliced!==undefined) {
                //나인패치
                var option9 = {
                    game:MG.game,
                    packname:curobj.info.pack,
                    pngname:curobj.info.sprite,
                    x:0,
                    y:0,
                    w:curobj.info.size.w,
                    h:curobj.info.size.h,
                    off_l:curobj.info.sliced.l,
                    off_r:curobj.info.sliced.r,
                    off_t:curobj.info.sliced.t,
                    off_b:curobj.info.sliced.b
                };
                //UIFs[curobj.info.name].slicedtxon = createImg9(option9);

                //나인패치 버튼생성시
                phob = createBtn({ //유니티버튼일때
                    spr:createImg9(option9),//UIFs[curobj.info.name].slicedtxon,
                    x:curobj.info.pos.x,
                    y:curobj.info.pos.y,
                    tx:undefined,
                    icon:undefined,
                    isLock:false,
                    name:curobj.info.name,
                    slotid:_intval0, //나인패치버튼
                    slotstr:_strval0 //나인패치버튼
                });

                //오프용이미지(나인패치) 자식으로 링크
                if(curobj.info.txdisable !== undefined) {
                    // 온오프 나인패치 버튼1
                    // var option9off = {
                    //     game: MG.game,
                    //     packname: curobj.info.pack,
                    //     pngname: curobj.info.txdisable,
                    //     x: 0,
                    //     y: 0,
                    //     w: curobj.info.size.w,
                    //     h: curobj.info.size.h,
                    //     off_l: curobj.info.sliced.l,
                    //     off_r: curobj.info.sliced.r,
                    //     off_t: curobj.info.sliced.t,
                    //     off_b: curobj.info.sliced.b
                    // };
                    // //전역변수에도 저장
                    // UIFs[curobj.info.name].z_offsprite = createImg9(option9off);
                    // UIFs[curobj.info.name].z_offsprite.visible = false;
                    // phob.addChild(UIFs[curobj.info.name].z_offsprite);
                    // //버튼에도 저장한다.
                    // phob.z_offsprite = UIFs[curobj.info.name].z_offsprite;
                    // 온오프 나인패치 버튼1

                    // 온오프 나인패치 버튼2 - 텍스쳐리로드버젼
                    UIFs[curobj.info.name].z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                    phob.z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                    // 온오프 나인패치 버튼2 - 텍스쳐리로드버젼
                }
                //오프용이미지(나인패치) 자식으로 링크
                //나인패치>>
            }else {
                //단일이미지경우
                var _intval1=0;
                var _strval1="";
                if(typeof curobj.info.u_intvals !== 'undefined') _intval1=curobj.info.u_intvals[0];
                if(typeof curobj.info.u_strvals !== 'undefined') _strval1=curobj.info.u_strvals[0];
                var sprtemp;
                // if(use4x4)
                //     sprtemp = MG.game.make.sprite(0, 0, '_alpha1_4x4.png');
                // else {
                if(curobj.info.pack === undefined)
                    sprtemp = MG.game.make.sprite(0, 0, curobj.info.sprite);
                else
                    sprtemp = MG.game.make.sprite(0, 0, curobj.info.pack, curobj.info.sprite);
                // }
                phob = createBtn({ //유니티버튼일때
                    spr:sprtemp,
                    x:curobj.info.pos.x,
                    y:curobj.info.pos.y,
                    tx:undefined,
                    icon:undefined,
                    isLock:false,
                    name:curobj.info.name,
                    slotid:_intval1, //단일이미지버튼
                    slotstr:_strval1//단일이미지버튼
                });
                // //온오프버튼설정1 차일드로 온오프--------------------------
                // var sprtemp2;
                // if(curobj.info.pack === undefined)
                //     sprtemp2 = MG.game.make.sprite(0, 0, curobj.info.txdisable);
                // else
                //     sprtemp2 = MG.game.make.sprite(0, 0, curobj.info.pack, curobj.info.txdisable);
                // //오프용이미지생성, 자식으로 링크
                // if(curobj.info.txdisable !== undefined) {
                //     //전역변수에도 저장
                //     UIFs[curobj.info.name].z_offsprite = sprtemp2;
                //     UIFs[curobj.info.name].z_offsprite.anchor.setTo(0.5);
                //     UIFs[curobj.info.name].z_offsprite.visible = false;
                //     phob.addChild(UIFs[curobj.info.name].z_offsprite);
                //     //버튼에도 저장한다.
                //     phob.z_offsprite = UIFs[curobj.info.name].z_offsprite;
                // }
                // //온오프버튼설정1 차일드로 온오프--------------------------

                //온오프버튼설정2 텍스쳐리로드 버젼--------------------------
                if(curobj.info.txdisable !== undefined) {
                    //전역변수에도 저장
                    UIFs[curobj.info.name].z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                    phob.z_offsprite = [ curobj.info.pack, curobj.info.sprite, curobj.info.txdisable];
                }
                //온오프버튼설정2 텍스쳐리로드 버젼--------------------------

                //단일이미지경우>>
            }
            phob.sx = curobj.info.scale.x;
            phob.sy = curobj.info.scale.y;
            phob.scale.setTo(curobj.info.scale.x,curobj.info.scale.y);

            phob.tint = curobj.info.color;
            phob.alpha = curobj.info.alpha;

            phaserparent.addChild(phob);

            // //부모배열에 현재오브젝트저장하기<<
            // if(parentobj.info.u_usesavechild !== undefined){
            //     UIFs[parentobj.info.name].obj.u_savechild.push(phob); //버튼(나인,단순이미지)
            // }
            // //부모배열에 현재오브젝트저장하기>>

            //유니티에서 설정
            //string TotalType = "var UNITYTYPE={NODE:0,IMAGE:1,TEXT:2,GRAPHIC:3,BUTTON:4};\n";
            //string TotalUSEType = "var PHASERTYPE={NOTUSE:0,GRP:1,BUTTON:2,ONOFFBUTTON:4,DISABLEBUTTON:5};\n";

            if(typeof UIFs[curobj.info.name] !== 'undefined')
                UIFs[curobj.info.name].obj = phob; //obj등록-버튼

            // //저장배열 초기화 만들기<<
            // if(typeof UIFs[curobj.info.name] !== 'undefined') {
            //     if(typeof curobj.info.u_usesavechild !== 'undefined') {
            //         UIFs[curobj.info.name].obj.u_usesavechild = true; //실사용데이터만들기
            //         UIFs[curobj.info.name].obj.u_savechild = [];      //실사용배열데이터만들기
            //     }
            // }
            // //저장배열 초기화 만들기>>

            if(curobj.info.ptype===PHASERTYPE.BUTTON
            || curobj.info.ptype===PHASERTYPE.ONOFFBUTTON//등록함수연결
            || curobj.info.ptype===PHASERTYPE.DISABLEBUTTON
            ){
                if(typeof UIFs[curobj.info.name] !== 'undefined') {
                    phob.fnclick = UIFs[curobj.info.name].FnClick;
                    phob.fnover = UIFs[curobj.info.name].FnOver;
                    phob.fndown = UIFs[curobj.info.name].FnDown;
                    phob.fnlong = UIFs[curobj.info.name].FnLongPress;
                }else{
                    phob.fnclick = function() {
                        console.log("click NoFns Button");
                    };
                }
            }
            if(useDebugArr) Debug_UIArr.push(phob);//디버그용도
            break;

        case UNITYTYPE.TEXT://-----------------------------------------유니티텍스트
            //비트맵폰트찾기
            if(curobj.info.font=== 'Arial') {
                phob = createTxt({
                    name: curobj.info.name,
                    str: curobj.info.str,
                    x: curobj.info.pos.x,
                    y: curobj.info.pos.y,
                    anchorx: curobj.info.anchor.x,
                    anchory: curobj.info.anchor.y,
                    style:curobj.info.txtype
                    //style:curobj.info.txtype
                });
                if(curobj.info.shadow!==undefined) {
                    //phob.setShadow(5, 5, 'rgba(0,0,0,0.5)', 0, true, false);
                    //console.log('--rgba(0,1,0,0.5)'+"\n"+curobj.info.shadow.color);
                    phob.setShadow(
                        curobj.info.shadow.x,
                        -1*curobj.info.shadow.y,
                        curobj.info.shadow.color,
                        //'rgba(0,1,0,1)',
                        curobj.info.shadow.blur,
                        curobj.info.shadow.stroke,
                        curobj.info.shadow.fill
                    );
                    var a0 = curobj.info.shadow.x;//,
                    var a1 = curobj.info.shadow.y;//,
                    var a2 = curobj.info.shadow.color;//,
                    var a3 = curobj.info.shadow.blur;//,
                    var a4 = curobj.info.shadow.stroke;//,
                    var a5 = curobj.info.shadow.fill;
                    // );
                }
            }
            else{
                //option1 = {name:"", str:"", x:0, y:0, anchorx:0.5, anchory:0.5, font:"", size:25, align:'center'}
                phob = createBitmapTxt({
                    name: curobj.info.name,
                    str: curobj.info.str,
                    x: curobj.info.pos.x,
                    y: curobj.info.pos.y,
                    anchorx: curobj.info.anchor.x,
                    anchory: curobj.info.anchor.y,
                    font:curobj.info.font,
                    size:curobj.info.size,
                    align:'center'
                });
            }
            //공통
            phob.scale.setTo(curobj.info.scale.x,curobj.info.scale.y);
            //회전
            if (curobj.info.angle !== undefined) phob.angle = curobj.info.angle;


            if(curobj.info.font === 'Arial')
                phob.tint = '0xFFFFFF';
            else
                phob.tint = curobj.info.color;

            phob.alpha = curobj.info.alpha;

            phaserparent.addChild(phob);

            // //부모배열에 현재오브젝트저장하기<<
            // if(parentobj.info.u_usesavechild !== undefined){
            //     UIFs[parentobj.info.name].obj.u_savechild.push(phob); //텍스트(비트맵,트루타입)
            // }
            // //부모배열에 현재오브젝트저장하기>>

            if(typeof UIFs[curobj.info.name] !== 'undefined')
                UIFs[curobj.info.name].obj = phob; //obj등록-텍스트

            // //저장배열 초기화 만들기<<
            // if(typeof UIFs[curobj.info.name] !== 'undefined') {
            //     if(typeof curobj.info.u_usesavechild !== 'undefined') {
            //         UIFs[curobj.info.name].obj.u_usesavechild = true; //실사용데이터만들기
            //         UIFs[curobj.info.name].obj.u_savechild = [];      //실사용배열데이터만들기
            //     }
            // }
            // //저장배열 초기화 만들기>>

            if(useDebugArr) Debug_UIArr.push(phob);//디버그용도
            break;

        case UNITYTYPE.SPINE://-----------------------------------------유니티스파인
            if(curobj.info.sprite===undefined) {
                console.log("err: recursiveAdd Spine: --> "+ curobj.info.name + ", 스파인이 없습니다");
                return;
            }
            //스파인생성
            phob = MG.game.add.spine(curobj.info.pos.x, curobj.info.pos.y, curobj.info.sprite);
            phob.z_name = curobj.info.sprite;

            if(typeof curobj.info.initanim !== 'undefined') {
                phob.z_initanim = curobj.info.initanim;
                phob.z_initloop = curobj.info.initloop;
                phob.setAnimationByName(0, curobj.info.initanim, curobj.info.initloop); //스파인 초기애니, 스파인디폴트애니
            }
            phob.sx = curobj.info.scale.x;
            phob.sy = curobj.info.scale.y;
            phob.scale.setTo(curobj.info.scale.x,curobj.info.scale.y);
            if (curobj.info.angle !== undefined) phob.angle = curobj.info.angle;
            phaserparent.addChild(phob);

            // //부모배열에 현재오브젝트저장하기<<
            // if(parentobj.info.u_usesavechild !== undefined){
            //     UIFs[parentobj.info.name].obj.u_savechild.push(phob);//스파인오브젝트
            // }
            // //부모배열에 현재오브젝트저장하기>>

            if(typeof UIFs[curobj.info.name] !== 'undefined')
                UIFs[curobj.info.name].obj = phob; //obj등록-스파인

            // //저장배열 초기화 만들기<<
            // if(typeof UIFs[curobj.info.name] !== 'undefined') {
            //     if(typeof curobj.info.u_usesavechild !== 'undefined') {
            //         UIFs[curobj.info.name].obj.u_usesavechild = true; //실사용데이터만들기
            //         UIFs[curobj.info.name].obj.u_savechild = [];      //실사용배열데이터만들기
            //     }
            // }
            // //저장배열 초기화 만들기>>

            if(useDebugArr) Debug_UIArr.push(phob);//디버그용도
            break;

        default:
            var curobjname = "";
            if(typeof curobj !== 'undefined'
                && typeof curobj.info !== 'undefined'
                && typeof curobj.info.name !== 'undefined'
            ) curobjname = curobj.info.name;
            console.log("err: recursiveAdd --> "+ curobjname );
            break;
    }//switch


    //--모든 오브젝트 공통저장소 가져오기---
    if(typeof phob !== 'undefined') {

        if (typeof curobj.info.u_intvals !== 'undefined') {
            phob.u_intvals = curobj.info.u_intvals;
        }
        if (typeof curobj.info.u_strvals !== 'undefined') {
            phob.u_strvals = curobj.info.u_strvals;
        }
        if (typeof curobj.info.u_floatvals !== 'undefined') {
            phob.u_floatvals = curobj.info.u_floatvals;
        }
        if (typeof curobj.info.u_colorvals !== 'undefined') {
            phob.u_colorvals = curobj.info.u_colorvals;
        }
        if (typeof curobj.info.u_namevals !== 'undefined') {
            phob.u_namevals = curobj.info.u_namevals;
        }
        if (typeof curobj.info.u_vec2vals !== 'undefined') {
            phob.u_vec2vals = curobj.info.u_vec2vals ;
        }
    }
    //--모든 오브젝트 공통저장소 가져오기---

    var cnt = curobj.children.length;
    for(var i=0; i<cnt; i++) {
        if( curobj.children[i].z_name ==='Image_test__0_'
        || curobj.children[i].z_name ==='MyObject_1')
        {
            console.log("Image_test__0_!!,,,,, MyObject_1!!1");
        }
        recursiveAdd( curobj.children[i], curobj , phob); //현재obj{}의 차일드, 현재obj{},  현재obj{}의 Phaser버젼
    }
} //recursiveAdd <-- 리커시브 ui생성

// function findIndexLastEnd(obj) {
//     var ret = [];
//     var iA = 0;
//     do {
//         iA += 10;
//     } while (iA < 100);
//     {
//         if (iB > 1000) break; //조건 탈출
//
//     }while();
// };

function RemoveBtnObj_Unity(btnobj){
    //console.log('RemoveBtnObj_Unity --> ', btnobj.obj.name);
    btnobj.obj.events.onInputDown.removeAll(); //중복
    btnobj.obj.events.onInputOut.removeAll();
    btnobj.obj.events.onInputUp.removeAll();
    btnobj.obj.events.onInputOver.removeAll();
    btnobj.obj.FnOver = undefined;
    btnobj.obj.FnDown = undefined;
    btnobj.obj.FnClick = undefined;
    btnobj.obj.fnover=undefined;
    btnobj.obj.fnclick=undefined;
    btnobj.obj.fndown=undefined;
    btnobj.obj.fnup=undefined;
    btnobj.obj=undefined;
}

//UI_lv_data_export.js

var lv_data_export = {
    info:{
        name:'lv_data_export',
        pos:{x:0, y:0},
        scale:{x:1, y:1},
    },
    children:[
        {
            info:{
                name:'lv1',
                pos:{x:0, y:0},
                scale:{x:1, y:1},
            },
            children:[
                {
                    info:{
                        name:'1_o_3',
                        pos:{x:247, y:11},
                        scale:{x:1, y:1},
                        pack:'stage1',
                        sprite:'1_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_o_10',
                        pos:{x:-183, y:-98},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_o_11',
                        pos:{x:-156, y:-164},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_1',
                        pos:{x:-13, y:-180},
                        scale:{x:1, y:1},
                        pack:'stage1',
                        sprite:'1_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_3',
                        pos:{x:136, y:-128},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_5',
                        pos:{x:164, y:36},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_6',
                        pos:{x:132, y:255},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_7',
                        pos:{x:-3, y:257},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_8',
                        pos:{x:-182, y:241},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_9',
                        pos:{x:-211, y:68},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_10',
                        pos:{x:-92, y:-53},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_c_1',
                        pos:{x:-31, y:18},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_c_2',
                        pos:{x:45, y:105},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage1',
                        sprite:'1_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv2',
                pos:{x:0, y:0},
                scale:{x:1, y:1},
            },
            children:[
                {
                    info:{
                        name:'2_o_0',
                        pos:{x:-41, y:-195},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_2',
                        pos:{x:14, y:-125},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_3',
                        pos:{x:132, y:-176},
                        scale:{x:1, y:1},
                        pack:'stage2',
                        sprite:'2_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_4',
                        pos:{x:215, y:-113},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_5',
                        pos:{x:185, y:59},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_o_5',
                        pos:{x:265, y:37},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_7',
                        pos:{x:216, y:193},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_8',
                        pos:{x:86, y:263},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_9',
                        pos:{x:-31, y:262},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_o_9',
                        pos:{x:-155, y:290},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_11',
                        pos:{x:-181, y:185},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_12',
                        pos:{x:-205, y:-2},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_o_12',
                        pos:{x:-272, y:63},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_b_14',
                        pos:{x:-147, y:-124},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_c_1',
                        pos:{x:60, y:15},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_c_2',
                        pos:{x:81, y:119},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_c_3',
                        pos:{x:-29, y:73},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'2_c_4',
                        pos:{x:-62, y:24},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage2',
                        sprite:'2_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv3',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'3_b_1',
                        pos:{x:39, y:-203},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_b_2',
                        pos:{x:134, y:-140},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_b_3',
                        pos:{x:133, y:67},
                        scale:{x:1, y:1},
                        pack:'stage3',
                        sprite:'3_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_o_4',
                        pos:{x:239, y:49},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_b_5',
                        pos:{x:105, y:276},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_b_6',
                        pos:{x:-70, y:245},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_b_7',
                        pos:{x:-189, y:140},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_o_8',
                        pos:{x:-209, y:-15},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_b_9',
                        pos:{x:-104, y:-42},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_b_10',
                        pos:{x:-120, y:-175},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_c_1',
                        pos:{x:-11, y:-61},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_c_3',
                        pos:{x:18, y:79},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'3_c_2',
                        pos:{x:-20, y:126},
                        scale:{x:1.000005, y:1.000005},
                        pack:'stage3',
                        sprite:'3_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv4',
                pos:{x:0, y:0},
                scale:{x:1, y:1},
            },
            children:[
                {
                    info:{
                        name:'1_o_2',
                        pos:{x:193, y:-81},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_o_9',
                        pos:{x:-213, y:-39},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_o_10',
                        pos:{x:-122, y:-149},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_1',
                        pos:{x:32, y:-167},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_3',
                        pos:{x:103, y:12},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_b_4',
                        pos:{x:188, y:99},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'4_b_9',
                        pos:{x:123, y:264},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'4_b_10',
                        pos:{x:-110, y:281},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'4_b_11',
                        pos:{x:-180, y:141},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'4_b_12',
                        pos:{x:-102, y:-3},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_c_1',
                        pos:{x:27, y:-103},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_c_2',
                        pos:{x:5, y:-53},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_c_3',
                        pos:{x:12, y:107},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_c_4',
                        pos:{x:92, y:159},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'1_c_5',
                        pos:{x:-41, y:146},
                        scale:{x:1, y:1},
                        pack:'stage4',
                        sprite:'4_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv5',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'5_o_1',
                        pos:{x:97, y:-153},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_2',
                        pos:{x:53, y:-130},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_3',
                        pos:{x:208, y:-13},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_4',
                        pos:{x:76, y:190},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_o_5',
                        pos:{x:183, y:213},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_6',
                        pos:{x:-64, y:256},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_7',
                        pos:{x:-90, y:118},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_o_8',
                        pos:{x:-197, y:131},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_9',
                        pos:{x:-192, y:64},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_10',
                        pos:{x:-200, y:-93},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_11',
                        pos:{x:-78, y:-80},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_b_12',
                        pos:{x:-122, y:-169},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_c_1',
                        pos:{x:3, y:20},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'5_c_2',
                        pos:{x:3, y:141},
                        scale:{x:1, y:1},
                        pack:'stage5',
                        sprite:'5_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv6',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'6_o_1',
                        pos:{x:-18, y:-197},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_2',
                        pos:{x:79, y:-192},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_3',
                        pos:{x:86, y:-93},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_o_4',
                        pos:{x:214, y:-150},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_5',
                        pos:{x:177, y:-41},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_6',
                        pos:{x:250, y:22},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_7',
                        pos:{x:208, y:128},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_8',
                        pos:{x:88, y:279},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_9',
                        pos:{x:-74, y:269},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_10',
                        pos:{x:-214, y:172},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_11',
                        pos:{x:-234, y:-35},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_b_12',
                        pos:{x:-99, y:-74},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_o_13',
                        pos:{x:-158, y:-155},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_c_6',
                        pos:{x:13, y:-56},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_c_3',
                        pos:{x:155, y:21},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_c_4',
                        pos:{x:15, y:46},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_c_1',
                        pos:{x:58, y:135},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_c_7',
                        pos:{x:85, y:156},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_c_2',
                        pos:{x:-59, y:160},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'6_c_5',
                        pos:{x:-111, y:40},
                        scale:{x:1, y:1},
                        pack:'stage6',
                        sprite:'6_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv7',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'7_o_1',
                        pos:{x:28, y:-223},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_2',
                        pos:{x:36, y:-176},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_3',
                        pos:{x:135, y:-174},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_4',
                        pos:{x:112, y:-84},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_5',
                        pos:{x:217, y:-54},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_o_6',
                        pos:{x:259, y:-55},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_7',
                        pos:{x:234, y:106},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_8',
                        pos:{x:155, y:99},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_9',
                        pos:{x:95, y:220},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_o_10',
                        pos:{x:163, y:251},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_11',
                        pos:{x:-10, y:254},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_o_12',
                        pos:{x:-98, y:300},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_13',
                        pos:{x:-152, y:179},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_o_14',
                        pos:{x:-232, y:194},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_15',
                        pos:{x:-224, y:62},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_16',
                        pos:{x:-174, y:-64},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_17',
                        pos:{x:-114, y:-85},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_o_18',
                        pos:{x:-228, y:-105},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_b_19',
                        pos:{x:-118, y:-180},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_c_3',
                        pos:{x:30, y:-72},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_c_6',
                        pos:{x:113, y:-9},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_c_1',
                        pos:{x:92, y:102},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_c_2',
                        pos:{x:5, y:119},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_c_5',
                        pos:{x:-75, y:75},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'7_c_4',
                        pos:{x:-12, y:-12},
                        scale:{x:1, y:1},
                        pack:'stage7',
                        sprite:'7_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv8',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'8_o_1',
                        pos:{x:-11, y:-216},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_2',
                        pos:{x:34, y:-112},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_3',
                        pos:{x:134, y:-204},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_4',
                        pos:{x:206, y:-121},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_5',
                        pos:{x:166, y:-28},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_6',
                        pos:{x:199, y:5},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_7',
                        pos:{x:267, y:2},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_8',
                        pos:{x:142, y:120},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_9',
                        pos:{x:225, y:179},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_10',
                        pos:{x:108, y:251},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_11',
                        pos:{x:-26, y:316},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_12',
                        pos:{x:-53, y:240},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_13',
                        pos:{x:-118, y:183},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_14',
                        pos:{x:-193, y:236},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_15',
                        pos:{x:-135, y:104},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_16',
                        pos:{x:-230, y:118},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_17',
                        pos:{x:-190, y:-30},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_18',
                        pos:{x:-269, y:-5},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_b_19',
                        pos:{x:-102, y:-131},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_o_20',
                        pos:{x:-143, y:-180},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_c_3',
                        pos:{x:-77, y:-6},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_c_2',
                        pos:{x:36, y:-17},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_c_4',
                        pos:{x:93, y:28},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_c_1',
                        pos:{x:-13, y:93},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'8_c_5',
                        pos:{x:1, y:175},
                        scale:{x:1, y:1},
                        pack:'stage8',
                        sprite:'8_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv9',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'9_o_1',
                        pos:{x:-60, y:-187},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_2',
                        pos:{x:94, y:-180},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_3',
                        pos:{x:57, y:-78},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_o_4',
                        pos:{x:221, y:-141},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_5',
                        pos:{x:179, y:-73},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_o_6',
                        pos:{x:258, y:-34},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_7',
                        pos:{x:207, y:104},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_8',
                        pos:{x:148, y:111},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_o_9',
                        pos:{x:195, y:237},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_o_10',
                        pos:{x:73, y:288},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_11',
                        pos:{x:55, y:232},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_12',
                        pos:{x:-69, y:259},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_o_13',
                        pos:{x:-230, y:155},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_14',
                        pos:{x:-135, y:134},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_15',
                        pos:{x:-203, y:-29},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_b_16',
                        pos:{x:-71, y:-82},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_o_17',
                        pos:{x:-247, y:-58},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_c_2',
                        pos:{x:45, y:-57},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_c_1',
                        pos:{x:83, y:30},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_c_5',
                        pos:{x:-38, y:-45},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_c_4',
                        pos:{x:-38, y:32},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_c_6',
                        pos:{x:32, y:114},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'9_c_3',
                        pos:{x:-39, y:131},
                        scale:{x:1, y:1},
                        pack:'stage9',
                        sprite:'9_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv10',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'10_o_1',
                        pos:{x:58, y:-181},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_2',
                        pos:{x:30, y:-108},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_3',
                        pos:{x:131, y:-144},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_4',
                        pos:{x:235, y:-108},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_5',
                        pos:{x:122, y:-36},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_6',
                        pos:{x:184, y:-57},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_7',
                        pos:{x:275, y:62},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_8',
                        pos:{x:223, y:55},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_9',
                        pos:{x:185, y:155},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_10',
                        pos:{x:218, y:235},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_11',
                        pos:{x:138, y:244},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_12',
                        pos:{x:12, y:298},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_13',
                        pos:{x:54, y:211},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_14',
                        pos:{x:37, y:147},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_15',
                        pos:{x:-52, y:260},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_16',
                        pos:{x:4, y:138},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_17',
                        pos:{x:-67, y:167},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_18',
                        pos:{x:-139, y:153},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_19',
                        pos:{x:-110, y:266},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_20',
                        pos:{x:-198, y:195},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_21',
                        pos:{x:-244, y:83},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_22',
                        pos:{x:-238, y:17},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_23',
                        pos:{x:-139, y:-69},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_24',
                        pos:{x:-244, y:-96},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_25',
                        pos:{x:-152, y:-138},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_b_26',
                        pos:{x:-79, y:-122},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_o_27',
                        pos:{x:-95, y:-212},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_c_4',
                        pos:{x:3, y:-32},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_c_2',
                        pos:{x:55, y:-3},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_c_7',
                        pos:{x:113, y:74},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_c_3',
                        pos:{x:164, y:49},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_c_5',
                        pos:{x:-17, y:17},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_c_1',
                        pos:{x:-83, y:126},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'10_c_6',
                        pos:{x:-131, y:45},
                        scale:{x:1, y:1},
                        pack:'stage10',
                        sprite:'10_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv11',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'11_o_1',
                        pos:{x:-45, y:-240},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_2',
                        pos:{x:-53, y:-194},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_3',
                        pos:{x:-82, y:-143},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_4',
                        pos:{x:2, y:-168},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_5',
                        pos:{x:94, y:-188},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_6',
                        pos:{x:83, y:-129},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_7',
                        pos:{x:198, y:-149},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_8',
                        pos:{x:103, y:-42},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_9',
                        pos:{x:188, y:-20},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_10',
                        pos:{x:238, y:-11},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_11',
                        pos:{x:229, y:52},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_12',
                        pos:{x:119, y:66},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_13',
                        pos:{x:251, y:151},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_14',
                        pos:{x:180, y:162},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_15',
                        pos:{x:193, y:221},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_16',
                        pos:{x:94, y:177},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_17',
                        pos:{x:131, y:201},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_18',
                        pos:{x:94, y:297},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_19',
                        pos:{x:38, y:249},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_20',
                        pos:{x:-64, y:291},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_21',
                        pos:{x:-44, y:227},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_22',
                        pos:{x:-113, y:213},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_23',
                        pos:{x:-68, y:167},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_24',
                        pos:{x:-181, y:246},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_25',
                        pos:{x:-197, y:65},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_26',
                        pos:{x:-246, y:172},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_27',
                        pos:{x:-126, y:60},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_28',
                        pos:{x:-258, y:21},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_29',
                        pos:{x:-138, y:-31},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_b_30',
                        pos:{x:-98, y:-63},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_o_31',
                        pos:{x:-211, y:-131},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_c_4',
                        pos:{x:0, y:-91},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_c_7',
                        pos:{x:47, y:44},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_c_5',
                        pos:{x:121, y:106},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_c_2',
                        pos:{x:1, y:178},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_c_1',
                        pos:{x:-1, y:55},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_c_6',
                        pos:{x:-68, y:45},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'11_c_3',
                        pos:{x:-104, y:62},
                        scale:{x:1, y:1},
                        pack:'stage11',
                        sprite:'11_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv12',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'12_b_1',
                        pos:{x:-29, y:-183},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_2',
                        pos:{x:145, y:-159},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_3',
                        pos:{x:76, y:-46},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_4',
                        pos:{x:129, y:-51},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_5',
                        pos:{x:234, y:9},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_6',
                        pos:{x:159, y:77},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_o_7',
                        pos:{x:260, y:141},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_8',
                        pos:{x:174, y:199},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_9',
                        pos:{x:114, y:260},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_10',
                        pos:{x:-8, y:163},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_o_11',
                        pos:{x:-65, y:267},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_12',
                        pos:{x:-127, y:145},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_o_13',
                        pos:{x:-211, y:208},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_o_14',
                        pos:{x:-233, y:60},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_15',
                        pos:{x:-58, y:-90},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_b_16',
                        pos:{x:-165, y:-42},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_o_17',
                        pos:{x:-259, y:-92},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_o_18',
                        pos:{x:-159, y:-153},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_c_1',
                        pos:{x:11, y:-104},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_c_3',
                        pos:{x:59, y:-30},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_c_5',
                        pos:{x:144, y:-1},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_c_2',
                        pos:{x:61, y:115},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_c_6',
                        pos:{x:-43, y:87},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'12_c_4',
                        pos:{x:-104, y:26},
                        scale:{x:1, y:1},
                        pack:'stage12',
                        sprite:'12_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv13',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'13_o_1',
                        pos:{x:74, y:-224},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_2',
                        pos:{x:107, y:-160},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_3',
                        pos:{x:170, y:-171},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_4',
                        pos:{x:181, y:-78},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_5',
                        pos:{x:183, y:-28},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_6',
                        pos:{x:263, y:-51},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_7',
                        pos:{x:224, y:95},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_8',
                        pos:{x:263, y:146},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_9',
                        pos:{x:218, y:230},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_10',
                        pos:{x:109, y:239},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_11',
                        pos:{x:88, y:293},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_12',
                        pos:{x:-40, y:306},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_13',
                        pos:{x:-40, y:278},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_14',
                        pos:{x:-161, y:248},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_15',
                        pos:{x:-202, y:138},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_16',
                        pos:{x:-253, y:109},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_17',
                        pos:{x:-231, y:4},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_18',
                        pos:{x:-206, y:-73},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_19',
                        pos:{x:-174, y:-191},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_20',
                        pos:{x:-43, y:-86},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_21',
                        pos:{x:61, y:-86},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_22',
                        pos:{x:13, y:-170},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_b_23',
                        pos:{x:-76, y:-154},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_o_24',
                        pos:{x:-87, y:-190},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_4',
                        pos:{x:105, y:-3},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_9',
                        pos:{x:168, y:74},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_6',
                        pos:{x:72, y:162},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_5',
                        pos:{x:71, y:195},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_7',
                        pos:{x:-51, y:210},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_1',
                        pos:{x:10, y:88},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_8',
                        pos:{x:-99, y:173},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_2',
                        pos:{x:-27, y:35},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_10',
                        pos:{x:-148, y:88},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_12',
                        pos:{x:-105, y:16},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_11',
                        pos:{x:-102, y:-60},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'13_c_3',
                        pos:{x:1, y:-11},
                        scale:{x:1, y:1},
                        pack:'stage13',
                        sprite:'13_c_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv14',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'14_o_1',
                        pos:{x:79, y:-228},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_2',
                        pos:{x:105, y:-115},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_3',
                        pos:{x:163, y:-170},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_4',
                        pos:{x:215, y:-83},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_5',
                        pos:{x:261, y:-75},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_6',
                        pos:{x:203, y:10},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_7',
                        pos:{x:226, y:18},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_8',
                        pos:{x:274, y:119},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_9',
                        pos:{x:191, y:106},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_10',
                        pos:{x:201, y:177},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_11',
                        pos:{x:245, y:208},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_12',
                        pos:{x:167, y:200},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_13',
                        pos:{x:173, y:271},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_14',
                        pos:{x:97, y:188},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_15',
                        pos:{x:90, y:274},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_16',
                        pos:{x:63, y:302},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_17',
                        pos:{x:28, y:218},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_18',
                        pos:{x:-73, y:308},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_19',
                        pos:{x:-67, y:234},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_20',
                        pos:{x:-161, y:254},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_21',
                        pos:{x:-124, y:182},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_22',
                        pos:{x:-180, y:157},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_23',
                        pos:{x:-253, y:157},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_24',
                        pos:{x:-175, y:62},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_25',
                        pos:{x:-259, y:76},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_26',
                        pos:{x:-259, y:-3},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_27',
                        pos:{x:-196, y:-57},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_28',
                        pos:{x:-255, y:-104},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_29',
                        pos:{x:-168, y:-89},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_30',
                        pos:{x:-181, y:-172},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_31',
                        pos:{x:-111, y:-65},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_b_32',
                        pos:{x:-26, y:-80},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_33',
                        pos:{x:-64, y:-154},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_34',
                        pos:{x:-113, y:-208},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_o_35',
                        pos:{x:-20, y:-210},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_c_3',
                        pos:{x:63, y:-71},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_c_4',
                        pos:{x:114, y:30},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_c_2',
                        pos:{x:27, y:-3},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_c_5',
                        pos:{x:41, y:121},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_c_1',
                        pos:{x:-19, y:88},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'14_c_6',
                        pos:{x:-115, y:87},
                        scale:{x:1, y:1},
                        pack:'stage14',
                        sprite:'14_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv15',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'15_o_1',
                        pos:{x:48, y:-238},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_2',
                        pos:{x:69, y:-204},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_3',
                        pos:{x:85, y:-139},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_4',
                        pos:{x:134, y:-168},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_5',
                        pos:{x:73, y:-58},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_6',
                        pos:{x:133, y:-29},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_7',
                        pos:{x:232, y:-101},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_8',
                        pos:{x:82, y:-1},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_9',
                        pos:{x:182, y:3},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_10',
                        pos:{x:288, y:21},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_11',
                        pos:{x:261, y:69},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_12',
                        pos:{x:166, y:71},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_13',
                        pos:{x:256, y:175},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_14',
                        pos:{x:165, y:197},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_15',
                        pos:{x:127, y:207},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_16',
                        pos:{x:139, y:298},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_17',
                        pos:{x:37, y:295},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_18',
                        pos:{x:-52, y:295},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_19',
                        pos:{x:-174, y:271},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_20',
                        pos:{x:-74, y:195},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_21',
                        pos:{x:-81, y:197},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_22',
                        pos:{x:-215, y:177},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_23',
                        pos:{x:-125, y:141},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_24',
                        pos:{x:-164, y:113},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_25',
                        pos:{x:-73, y:52},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_26',
                        pos:{x:-264, y:29},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_27',
                        pos:{x:-220, y:31},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_28',
                        pos:{x:-151, y:-24},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_29',
                        pos:{x:-91, y:-36},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_30',
                        pos:{x:-242, y:-30},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_b_31',
                        pos:{x:-53, y:-154},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_32',
                        pos:{x:-191, y:-171},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_o_33',
                        pos:{x:-46, y:-215},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_7',
                        pos:{x:4, y:-142},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_2',
                        pos:{x:4, y:-76},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_9',
                        pos:{x:4, y:-23},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_1',
                        pos:{x:25, y:46},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_6',
                        pos:{x:82, y:120},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_5',
                        pos:{x:4, y:183},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_4',
                        pos:{x:3, y:197},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_3',
                        pos:{x:-57, y:120},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'15_c_8',
                        pos:{x:-24, y:76},
                        scale:{x:1, y:1},
                        pack:'stage15',
                        sprite:'15_c_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv16',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'16_o_1',
                        pos:{x:56, y:-220},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_2',
                        pos:{x:57, y:-141},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_3',
                        pos:{x:160, y:-164},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_4',
                        pos:{x:207, y:-173},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_5',
                        pos:{x:256, y:-85},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_6',
                        pos:{x:180, y:-75},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_7',
                        pos:{x:244, y:-20},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_8',
                        pos:{x:170, y:-34},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_9',
                        pos:{x:109, y:-15},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_10',
                        pos:{x:263, y:36},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_11',
                        pos:{x:268, y:133},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_12',
                        pos:{x:189, y:97},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_13',
                        pos:{x:215, y:157},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_14',
                        pos:{x:214, y:235},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_15',
                        pos:{x:144, y:187},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_16',
                        pos:{x:157, y:235},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_17',
                        pos:{x:85, y:292},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_18',
                        pos:{x:63, y:260},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_19',
                        pos:{x:-84, y:285},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_20',
                        pos:{x:-60, y:215},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_21',
                        pos:{x:-203, y:222},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_22',
                        pos:{x:-256, y:138},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_23',
                        pos:{x:-193, y:96},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_24',
                        pos:{x:-112, y:26},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_25',
                        pos:{x:-199, y:33},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_26',
                        pos:{x:-257, y:32},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_27',
                        pos:{x:-190, y:-28},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_28',
                        pos:{x:-167, y:-109},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_29',
                        pos:{x:-241, y:-90},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_30',
                        pos:{x:9, y:-51},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_31',
                        pos:{x:-24, y:-133},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_o_32',
                        pos:{x:-50, y:-206},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_b_33',
                        pos:{x:-140, y:-204},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_3',
                        pos:{x:85, y:-124},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_8',
                        pos:{x:65, y:-53},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_9',
                        pos:{x:18, y:73},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_6',
                        pos:{x:123, y:118},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_7',
                        pos:{x:11, y:172},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_2',
                        pos:{x:-97, y:119},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_1',
                        pos:{x:-43, y:21},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_5',
                        pos:{x:-51, y:-52},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'16_c_4',
                        pos:{x:-72, y:-110},
                        scale:{x:1, y:1},
                        pack:'stage16',
                        sprite:'16_c_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv17',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'17_o_1',
                        pos:{x:145, y:-195},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_2',
                        pos:{x:162, y:-106},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_3',
                        pos:{x:122, y:-59},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_4',
                        pos:{x:98, y:-4},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_5',
                        pos:{x:174, y:30},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_6',
                        pos:{x:235, y:-72},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_7',
                        pos:{x:276, y:51},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_8',
                        pos:{x:234, y:134},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_9',
                        pos:{x:136, y:111},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_10',
                        pos:{x:199, y:183},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_11',
                        pos:{x:141, y:239},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_12',
                        pos:{x:150, y:298},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_13',
                        pos:{x:72, y:304},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_14',
                        pos:{x:68, y:241},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_15',
                        pos:{x:-23, y:310},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_16',
                        pos:{x:-33, y:244},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_17',
                        pos:{x:-89, y:312},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_18',
                        pos:{x:-123, y:243},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_19',
                        pos:{x:-204, y:215},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_20',
                        pos:{x:-169, y:141},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_21',
                        pos:{x:-230, y:120},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_22',
                        pos:{x:-207, y:56},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_23',
                        pos:{x:-124, y:36},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_24',
                        pos:{x:-235, y:22},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_25',
                        pos:{x:-76, y:-17},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_26',
                        pos:{x:-209, y:-75},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_27',
                        pos:{x:-59, y:-123},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_28',
                        pos:{x:-204, y:-153},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_29',
                        pos:{x:-127, y:-133},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_o_30',
                        pos:{x:-102, y:-226},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_b_31',
                        pos:{x:37, y:-180},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_c_2',
                        pos:{x:2, y:-56},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_c_5',
                        pos:{x:4, y:38},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_c_3',
                        pos:{x:77, y:138},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_c_4',
                        pos:{x:-12, y:137},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'17_c_1',
                        pos:{x:-72, y:160},
                        scale:{x:1, y:1},
                        pack:'stage17',
                        sprite:'17_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv18',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'18_o_1',
                        pos:{x:3, y:-208},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_2',
                        pos:{x:7, y:-142},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_3',
                        pos:{x:175, y:-195},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_4',
                        pos:{x:101, y:-130},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_5',
                        pos:{x:230, y:-69},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_6',
                        pos:{x:264, y:13},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_7',
                        pos:{x:266, y:100},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_8',
                        pos:{x:226, y:147},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_9',
                        pos:{x:259, y:192},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_10',
                        pos:{x:193, y:242},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_11',
                        pos:{x:75, y:263},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_12',
                        pos:{x:29, y:329},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_13',
                        pos:{x:-17, y:275},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_14',
                        pos:{x:-7, y:214},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_15',
                        pos:{x:-74, y:293},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_16',
                        pos:{x:-81, y:237},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_17',
                        pos:{x:-166, y:250},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_18',
                        pos:{x:-235, y:196},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_19',
                        pos:{x:-246, y:130},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_20',
                        pos:{x:-222, y:53},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_21',
                        pos:{x:-271, y:55},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_22',
                        pos:{x:-243, y:-47},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_23',
                        pos:{x:-170, y:-20},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_b_24',
                        pos:{x:-110, y:-98},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_o_25',
                        pos:{x:-176, y:-162},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_5',
                        pos:{x:-39, y:-43},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_7',
                        pos:{x:-32, y:17},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_6',
                        pos:{x:151, y:18},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_2',
                        pos:{x:77, y:47},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_3',
                        pos:{x:158, y:124},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_1',
                        pos:{x:60, y:175},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_4',
                        pos:{x:-81, y:148},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'18_c_8',
                        pos:{x:-165, y:108},
                        scale:{x:1, y:1},
                        pack:'stage18',
                        sprite:'18_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv19',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'19_o_1',
                        pos:{x:-21, y:-222},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_2',
                        pos:{x:-58, y:-168},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_3',
                        pos:{x:104, y:-196},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_4',
                        pos:{x:37, y:-173},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_5',
                        pos:{x:37, y:-100},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_6',
                        pos:{x:83, y:-86},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_7',
                        pos:{x:137, y:-158},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_8',
                        pos:{x:210, y:-163},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_9',
                        pos:{x:180, y:-94},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_10',
                        pos:{x:154, y:-27},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_11',
                        pos:{x:270, y:-70},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_12',
                        pos:{x:226, y:-42},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_13',
                        pos:{x:274, y:-16},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_14',
                        pos:{x:287, y:32},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_15',
                        pos:{x:265, y:58},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_16',
                        pos:{x:276, y:110},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_17',
                        pos:{x:209, y:171},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_18',
                        pos:{x:234, y:218},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_19',
                        pos:{x:136, y:291},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_20',
                        pos:{x:130, y:171},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_21',
                        pos:{x:35, y:200},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_22',
                        pos:{x:54, y:290},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_23',
                        pos:{x:5, y:269},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_24',
                        pos:{x:-5, y:304},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_25',
                        pos:{x:-52, y:235},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_26',
                        pos:{x:-112, y:310},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_27',
                        pos:{x:-77, y:182},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_28',
                        pos:{x:-145, y:245},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_29',
                        pos:{x:-154, y:168},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_30',
                        pos:{x:-239, y:214},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_31',
                        pos:{x:-247, y:137},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_32',
                        pos:{x:-240, y:56},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_33',
                        pos:{x:-275, y:42},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_34',
                        pos:{x:-248, y:-51},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_35',
                        pos:{x:-204, y:-71},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_b_36',
                        pos:{x:-78, y:-97},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_37',
                        pos:{x:-225, y:-136},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_o_38',
                        pos:{x:-138, y:-177},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_7',
                        pos:{x:-31, y:-34},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_3',
                        pos:{x:-13, y:10},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_1',
                        pos:{x:95, y:41},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_4',
                        pos:{x:190, y:56},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_8',
                        pos:{x:49, y:148},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_5',
                        pos:{x:-12, y:117},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_6',
                        pos:{x:-112, y:112},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'19_c_2',
                        pos:{x:-148, y:25},
                        scale:{x:1, y:1},
                        pack:'stage19',
                        sprite:'19_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv20',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'20_o_1',
                        pos:{x:-22, y:-214},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_2',
                        pos:{x:12, y:-152},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_3',
                        pos:{x:92, y:-202},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_4',
                        pos:{x:94, y:-100},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_5',
                        pos:{x:225, y:-74},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_6',
                        pos:{x:211, y:-31},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_7',
                        pos:{x:194, y:-156},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_8',
                        pos:{x:283, y:-35},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_9',
                        pos:{x:279, y:97},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_10',
                        pos:{x:194, y:95},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_11',
                        pos:{x:204, y:135},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_12',
                        pos:{x:223, y:233},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_13',
                        pos:{x:170, y:216},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_14',
                        pos:{x:125, y:227},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_15',
                        pos:{x:96, y:282},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_16',
                        pos:{x:27, y:220},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_17',
                        pos:{x:-31, y:307},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_18',
                        pos:{x:-72, y:264},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_19',
                        pos:{x:-114, y:195},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_20',
                        pos:{x:-178, y:264},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_21',
                        pos:{x:-156, y:92},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_22',
                        pos:{x:-209, y:172},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_23',
                        pos:{x:-226, y:96},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_24',
                        pos:{x:-184, y:-83},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_25',
                        pos:{x:-269, y:33},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_26',
                        pos:{x:-252, y:-89},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_27',
                        pos:{x:-124, y:-54},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_b_28',
                        pos:{x:-103, y:-123},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_29',
                        pos:{x:-139, y:-211},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_o_30',
                        pos:{x:-40, y:264},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_c_6',
                        pos:{x:6, y:-41},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_c_4',
                        pos:{x:90, y:5},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_c_2',
                        pos:{x:56, y:134},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_c_5',
                        pos:{x:-65, y:135},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_c_3',
                        pos:{x:-42, y:29},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'20_c_1',
                        pos:{x:-74, y:-16},
                        scale:{x:1, y:1},
                        pack:'stage20',
                        sprite:'20_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv21',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'21_o_1',
                        pos:{x:0, y:-239},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_2',
                        pos:{x:92, y:-243},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_3',
                        pos:{x:36, y:-152},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_4',
                        pos:{x:-72, y:-153},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_5',
                        pos:{x:-20, y:-123},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_6',
                        pos:{x:126, y:-186},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_7',
                        pos:{x:144, y:-150},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_8',
                        pos:{x:225, y:-149},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_9',
                        pos:{x:214, y:-72},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_10',
                        pos:{x:255, y:-64},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_11',
                        pos:{x:155, y:-30},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_12',
                        pos:{x:87, y:-53},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_13',
                        pos:{x:6, y:-16},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_14',
                        pos:{x:-41, y:6},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_15',
                        pos:{x:28, y:20},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_16',
                        pos:{x:116, y:41},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_17',
                        pos:{x:27, y:77},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_18',
                        pos:{x:46, y:106},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_19',
                        pos:{x:209, y:17},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_20',
                        pos:{x:262, y:17},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_21',
                        pos:{x:271, y:84},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_22',
                        pos:{x:204, y:91},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_23',
                        pos:{x:244, y:163},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_24',
                        pos:{x:189, y:210},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_25',
                        pos:{x:227, y:225},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_26',
                        pos:{x:146, y:240},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_27',
                        pos:{x:109, y:262},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_28',
                        pos:{x:79, y:285},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_29',
                        pos:{x:62, y:318},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_30',
                        pos:{x:-1, y:281},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_31',
                        pos:{x:-34, y:228},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_32',
                        pos:{x:-62, y:290},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_33',
                        pos:{x:-105, y:263},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_34',
                        pos:{x:-74, y:166},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_35',
                        pos:{x:-142, y:157},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_36',
                        pos:{x:-177, y:248},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_37',
                        pos:{x:-200, y:253},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_38',
                        pos:{x:-212, y:158},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_39',
                        pos:{x:-247, y:158},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_40',
                        pos:{x:-176, y:91},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_41',
                        pos:{x:-250, y:68},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_42',
                        pos:{x:-193, y:-2},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_43',
                        pos:{x:-237, y:14},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_44',
                        pos:{x:-280, y:26},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_45',
                        pos:{x:-239, y:-71},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_b_46',
                        pos:{x:-165, y:-139},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_47',
                        pos:{x:-230, y:-137},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_47.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_48',
                        pos:{x:-188, y:-175},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_48.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_49',
                        pos:{x:-119, y:-207},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_49.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_o_50',
                        pos:{x:-66, y:-218},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_50.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_c_6',
                        pos:{x:-129, y:-55},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_c_3',
                        pos:{x:-99, y:-40},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_c_4',
                        pos:{x:-100, y:68},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_c_1',
                        pos:{x:-31, y:142},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_c_5',
                        pos:{x:79, y:153},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_c_7',
                        pos:{x:96, y:197},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'21_c_2',
                        pos:{x:150, y:165},
                        scale:{x:1, y:1},
                        pack:'stage21',
                        sprite:'21_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv22',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'22_o_1',
                        pos:{x:69, y:-224},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_2',
                        pos:{x:37, y:-186},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_3',
                        pos:{x:81, y:-167},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_4',
                        pos:{x:184, y:-165},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_5',
                        pos:{x:177, y:-97},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_6',
                        pos:{x:229, y:-110},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_7',
                        pos:{x:201, y:-14},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_8',
                        pos:{x:265, y:-22},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_9',
                        pos:{x:267, y:31},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_10',
                        pos:{x:248, y:94},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_11',
                        pos:{x:279, y:121},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_12',
                        pos:{x:235, y:165},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_13',
                        pos:{x:159, y:179},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_14',
                        pos:{x:207, y:262},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_15',
                        pos:{x:185, y:244},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_16',
                        pos:{x:156, y:27},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_17',
                        pos:{x:156, y:93},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_18',
                        pos:{x:94, y:304},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_19',
                        pos:{x:70, y:245},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_20',
                        pos:{x:15, y:308},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_21',
                        pos:{x:-17, y:261},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_22',
                        pos:{x:-89, y:297},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_23',
                        pos:{x:-78, y:327},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_24',
                        pos:{x:-126, y:261},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_25',
                        pos:{x:-194, y:259},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_26',
                        pos:{x:-194, y:201},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_27',
                        pos:{x:-220, y:187},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_28',
                        pos:{x:-265, y:173},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_29',
                        pos:{x:-213, y:121},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_30',
                        pos:{x:-270, y:72},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_31',
                        pos:{x:-203, y:84},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_32',
                        pos:{x:-203, y:6},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_33',
                        pos:{x:-260, y:8},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_34',
                        pos:{x:-229, y:-62},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_35',
                        pos:{x:-185, y:-93},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_36',
                        pos:{x:-219, y:-109},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_37',
                        pos:{x:-224, y:-131},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_38',
                        pos:{x:-180, y:-172},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_b_39',
                        pos:{x:-89, y:-159},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_o_40',
                        pos:{x:-74, y:-223},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_6',
                        pos:{x:74, y:-96},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_9',
                        pos:{x:171, y:-8},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_11',
                        pos:{x:173, y:103},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_8',
                        pos:{x:57, y:-31},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_7',
                        pos:{x:68, y:115},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_4',
                        pos:{x:-9, y:194},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_5',
                        pos:{x:-6, y:71},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_2',
                        pos:{x:-129, y:185},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_10',
                        pos:{x:-80, y:147},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_3',
                        pos:{x:-138, y:26},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_12',
                        pos:{x:-60, y:-1},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'22_c_1',
                        pos:{x:-88, y:-69},
                        scale:{x:1, y:1},
                        pack:'stage22',
                        sprite:'22_c_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv23',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'23_o_1',
                        pos:{x:-20, y:-247},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_2',
                        pos:{x:-10, y:-224},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_3',
                        pos:{x:45, y:-253},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_4',
                        pos:{x:117, y:-222},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_5',
                        pos:{x:91, y:-192},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_6',
                        pos:{x:13, y:-156},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_7',
                        pos:{x:-65, y:-175},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_8',
                        pos:{x:-94, y:-115},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_9',
                        pos:{x:-45, y:-112},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_10',
                        pos:{x:51, y:-122},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_11',
                        pos:{x:124, y:-102},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_12',
                        pos:{x:173, y:-145},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_13',
                        pos:{x:167, y:-70},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_14',
                        pos:{x:213, y:-160},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_15',
                        pos:{x:248, y:-130},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_16',
                        pos:{x:243, y:-78},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_17',
                        pos:{x:189, y:23},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_18',
                        pos:{x:220, y:-24},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_19',
                        pos:{x:276, y:17},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_20',
                        pos:{x:285, y:88},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_21',
                        pos:{x:245, y:133},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_22',
                        pos:{x:223, y:200},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_23',
                        pos:{x:168, y:159},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_24',
                        pos:{x:160, y:74},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_25',
                        pos:{x:129, y:127},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_26',
                        pos:{x:191, y:238},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_27',
                        pos:{x:80, y:92},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_28',
                        pos:{x:44, y:155},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_29',
                        pos:{x:73, y:181},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_30',
                        pos:{x:106, y:277},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_31',
                        pos:{x:1, y:276},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_32',
                        pos:{x:22, y:276},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_33',
                        pos:{x:13, y:321},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_34',
                        pos:{x:-81, y:307},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_35',
                        pos:{x:-62, y:209},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_36',
                        pos:{x:-128, y:269},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_37',
                        pos:{x:-29, y:165},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_38',
                        pos:{x:-114, y:183},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_39',
                        pos:{x:-212, y:217},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_40',
                        pos:{x:-177, y:168},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_41',
                        pos:{x:-57, y:128},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_42',
                        pos:{x:-47, y:65},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_43',
                        pos:{x:-117, y:88},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_44',
                        pos:{x:-179, y:123},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_45',
                        pos:{x:-262, y:126},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_46',
                        pos:{x:-186, y:22},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_47',
                        pos:{x:-256, y:26},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_47.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_48',
                        pos:{x:-279, y:-16},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_48.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_49',
                        pos:{x:-249, y:-39},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_49.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_50',
                        pos:{x:-178, y:-51},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_50.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_b_51',
                        pos:{x:-127, y:-66},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_51.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_52',
                        pos:{x:-235, y:-111},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_52.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_53',
                        pos:{x:-164, y:-142},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_53.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_54',
                        pos:{x:-122, y:-190},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_54.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_o_55',
                        pos:{x:-89, y:-235},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_55.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_c_7',
                        pos:{x:66, y:-65},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_c_4',
                        pos:{x:105, y:-18},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_c_6',
                        pos:{x:36, y:15},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_c_5',
                        pos:{x:4, y:82},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_c_3',
                        pos:{x:-24, y:165},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_c_2',
                        pos:{x:-117, y:8},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'23_c_1',
                        pos:{x:-67, y:-55},
                        scale:{x:1, y:1},
                        pack:'stage23',
                        sprite:'23_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv24',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'24_o_1',
                        pos:{x:22, y:-239},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_2',
                        pos:{x:-28, y:-172},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_3',
                        pos:{x:-15, y:-112},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_4',
                        pos:{x:55, y:-150},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_5',
                        pos:{x:50, y:-187},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_6',
                        pos:{x:119, y:-235},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_7',
                        pos:{x:123, y:-178},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_8',
                        pos:{x:193, y:-191},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_9',
                        pos:{x:198, y:-131},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_10',
                        pos:{x:144, y:-74},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_11',
                        pos:{x:250, y:-76},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_12',
                        pos:{x:269, y:25},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_13',
                        pos:{x:204, y:48},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_14',
                        pos:{x:262, y:69},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_15',
                        pos:{x:257, y:163},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_16',
                        pos:{x:213, y:195},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_17',
                        pos:{x:153, y:137},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_18',
                        pos:{x:84, y:83},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_19',
                        pos:{x:54, y:171},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_20',
                        pos:{x:126, y:223},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_21',
                        pos:{x:152, y:292},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_22',
                        pos:{x:62, y:297},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_23',
                        pos:{x:12, y:203},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_24',
                        pos:{x:-54, y:186},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_25',
                        pos:{x:-36, y:281},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_26',
                        pos:{x:-5, y:311},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_27',
                        pos:{x:-50, y:330},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_28',
                        pos:{x:-98, y:272},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_29',
                        pos:{x:-134, y:291},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_30',
                        pos:{x:-180, y:246},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_31',
                        pos:{x:-225, y:222},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_32',
                        pos:{x:-155, y:159},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_33',
                        pos:{x:-261, y:145},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_34',
                        pos:{x:-203, y:141},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_35',
                        pos:{x:-72, y:65},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_36',
                        pos:{x:-4, y:-20},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_37',
                        pos:{x:-84, y:-4},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_b_38',
                        pos:{x:-170, y:58},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_39',
                        pos:{x:-266, y:67},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_40',
                        pos:{x:-255, y:36},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_41',
                        pos:{x:-255, y:-32},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_42',
                        pos:{x:-249, y:-113},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_43',
                        pos:{x:-134, y:-65},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_44',
                        pos:{x:-176, y:-94},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_45',
                        pos:{x:-174, y:-175},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_46',
                        pos:{x:-96, y:-165},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_o_47',
                        pos:{x:-85, y:-237},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_47.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_c_5',
                        pos:{x:83, y:-78},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_c_4',
                        pos:{x:47, y:25},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_c_1',
                        pos:{x:113, y:24},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_c_3',
                        pos:{x:170, y:-28},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_c_2',
                        pos:{x:-68, y:103},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'24_c_6',
                        pos:{x:-109, y:194},
                        scale:{x:1, y:1},
                        pack:'stage24',
                        sprite:'24_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv25',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'25_o_1',
                        pos:{x:-65, y:-184},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_2',
                        pos:{x:-10, y:-174},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_3',
                        pos:{x:-56, y:-92},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_4',
                        pos:{x:16, y:-68},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_5',
                        pos:{x:35, y:-125},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_6',
                        pos:{x:29, y:-234},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_7',
                        pos:{x:80, y:-205},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_8',
                        pos:{x:98, y:-119},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_9',
                        pos:{x:205, y:-165},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_10',
                        pos:{x:189, y:-116},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_11',
                        pos:{x:220, y:-46},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_12',
                        pos:{x:280, y:-26},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_13',
                        pos:{x:159, y:-29},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_14',
                        pos:{x:102, y:58},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_15',
                        pos:{x:185, y:67},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_16',
                        pos:{x:260, y:50},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_17',
                        pos:{x:241, y:112},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_18',
                        pos:{x:245, y:198},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_19',
                        pos:{x:182, y:187},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_20',
                        pos:{x:171, y:160},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_21',
                        pos:{x:188, y:258},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_22',
                        pos:{x:129, y:295},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_23',
                        pos:{x:115, y:226},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_24',
                        pos:{x:64, y:299},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_25',
                        pos:{x:31, y:321},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_26',
                        pos:{x:-4, y:305},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_27',
                        pos:{x:71, y:160},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_28',
                        pos:{x:-56, y:153},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_29',
                        pos:{x:-48, y:226},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_30',
                        pos:{x:-82, y:304},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_31',
                        pos:{x:-153, y:281},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_32',
                        pos:{x:-131, y:239},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_33',
                        pos:{x:-164, y:166},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_34',
                        pos:{x:-201, y:226},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_35',
                        pos:{x:-232, y:136},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_36',
                        pos:{x:-182, y:92},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_37',
                        pos:{x:-119, y:64},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_38',
                        pos:{x:-279, y:46},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_39',
                        pos:{x:-129, y:-3},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_40',
                        pos:{x:-218, y:31},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_41',
                        pos:{x:-244, y:-42},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_42',
                        pos:{x:-178, y:-67},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_43',
                        pos:{x:-246, y:-110},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_44',
                        pos:{x:-185, y:-117},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_b_45',
                        pos:{x:-145, y:-162},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_o_46',
                        pos:{x:-88, y:-220},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_c_1',
                        pos:{x:117, y:-62},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_c_4',
                        pos:{x:65, y:37},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_c_5',
                        pos:{x:110, y:165},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_c_6',
                        pos:{x:-60, y:26},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_c_2',
                        pos:{x:-72, y:115},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'25_c_3',
                        pos:{x:-96, y:-84},
                        scale:{x:1, y:1},
                        pack:'stage25',
                        sprite:'25_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv26',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'26_o_1',
                        pos:{x:-26, y:-235},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_2',
                        pos:{x:-54, y:-182},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_3',
                        pos:{x:-1, y:-167},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_4',
                        pos:{x:25, y:-209},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_5',
                        pos:{x:45, y:-190},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_6',
                        pos:{x:128, y:-190},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_7',
                        pos:{x:184, y:-174},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_8',
                        pos:{x:134, y:-151},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_9',
                        pos:{x:183, y:-104},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_10',
                        pos:{x:238, y:-102},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_11',
                        pos:{x:275, y:-82},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_12',
                        pos:{x:266, y:-26},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_13',
                        pos:{x:208, y:-7},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_14',
                        pos:{x:180, y:8},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_15',
                        pos:{x:258, y:58},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_16',
                        pos:{x:246, y:129},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_17',
                        pos:{x:168, y:105},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_18',
                        pos:{x:227, y:220},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_19',
                        pos:{x:179, y:216},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_20',
                        pos:{x:139, y:194},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_21',
                        pos:{x:77, y:246},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_22',
                        pos:{x:78, y:294},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_23',
                        pos:{x:31, y:324},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_24',
                        pos:{x:-30, y:299},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_25',
                        pos:{x:20, y:231},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_26',
                        pos:{x:-13, y:124},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_27',
                        pos:{x:37, y:59},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_28',
                        pos:{x:-25, y:59},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_29',
                        pos:{x:-98, y:251},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_30',
                        pos:{x:-137, y:289},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_31',
                        pos:{x:-185, y:273},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_32',
                        pos:{x:-175, y:176},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_33',
                        pos:{x:-248, y:205},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_34',
                        pos:{x:-249, y:143},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_35',
                        pos:{x:-198, y:74},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_36',
                        pos:{x:-249, y:64},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_37',
                        pos:{x:-282, y:44},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_38',
                        pos:{x:-128, y:-16},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_39',
                        pos:{x:-186, y:-32},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_40',
                        pos:{x:-274, y:-50},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_41',
                        pos:{x:-186, y:-61},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_42',
                        pos:{x:-211, y:-140},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_43',
                        pos:{x:-121, y:-138},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_o_44',
                        pos:{x:-133, y:-190},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_45',
                        pos:{x:-23, y:-62},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_46',
                        pos:{x:39, y:-62},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_47',
                        pos:{x:88, y:-62},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_47.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_b_48',
                        pos:{x:89, y:37},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_48.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_5',
                        pos:{x:89, y:-41},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_8',
                        pos:{x:103, y:86},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_7',
                        pos:{x:76, y:128},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_6',
                        pos:{x:40, y:-20},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_9',
                        pos:{x:-42, y:16},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_3',
                        pos:{x:-114, y:141},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_1',
                        pos:{x:-125, y:112},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_2',
                        pos:{x:-55, y:-85},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'26_c_4',
                        pos:{x:4, y:-101},
                        scale:{x:1, y:1},
                        pack:'stage26',
                        sprite:'26_c_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv27',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'27_o_1',
                        pos:{x:-29, y:-236},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_2',
                        pos:{x:-34, y:-222},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_3',
                        pos:{x:-4, y:-148},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_4',
                        pos:{x:56, y:-223},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_5',
                        pos:{x:115, y:-205},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_6',
                        pos:{x:104, y:-128},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_7',
                        pos:{x:178, y:-163},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_8',
                        pos:{x:194, y:-94},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_9',
                        pos:{x:233, y:-138},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_10',
                        pos:{x:159, y:-81},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_11',
                        pos:{x:64, y:-104},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_12',
                        pos:{x:35, y:-40},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_13',
                        pos:{x:256, y:-69},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_14',
                        pos:{x:226, y:-14},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_15',
                        pos:{x:289, y:27},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_16',
                        pos:{x:252, y:15},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_17',
                        pos:{x:227, y:58},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_18',
                        pos:{x:150, y:77},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_19',
                        pos:{x:235, y:130},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_20',
                        pos:{x:254, y:170},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_21',
                        pos:{x:184, y:167},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_22',
                        pos:{x:169, y:272},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_23',
                        pos:{x:141, y:266},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_24',
                        pos:{x:160, y:185},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_25',
                        pos:{x:92, y:180},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_26',
                        pos:{x:42, y:247},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_27',
                        pos:{x:52, y:306},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_28',
                        pos:{x:7, y:214},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_29',
                        pos:{x:-43, y:307},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_30',
                        pos:{x:-82, y:270},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_31',
                        pos:{x:-138, y:277},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_32',
                        pos:{x:-32, y:197},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_33',
                        pos:{x:-103, y:172},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_34',
                        pos:{x:-136, y:154},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_35',
                        pos:{x:-114, y:99},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_36',
                        pos:{x:-19, y:95},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_37',
                        pos:{x:-214, y:241},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_38',
                        pos:{x:-201, y:194},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_39',
                        pos:{x:-226, y:163},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_40',
                        pos:{x:-208, y:123},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_41',
                        pos:{x:-196, y:96},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_42',
                        pos:{x:-243, y:92},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_43',
                        pos:{x:-281, y:106},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_44',
                        pos:{x:-160, y:31},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_45',
                        pos:{x:-264, y:41},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_46',
                        pos:{x:-250, y:-14},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_47',
                        pos:{x:-216, y:-45},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_47.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_48',
                        pos:{x:-127, y:-51},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_48.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_49',
                        pos:{x:-76, y:-93},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_49.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_50',
                        pos:{x:-4, y:-148},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_50.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_b_51',
                        pos:{x:-81, y:-174},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_51.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_52',
                        pos:{x:-130, y:-141},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_52.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_53',
                        pos:{x:-234, y:-102},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_53.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_o_54',
                        pos:{x:-181, y:-174},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_54.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_3',
                        pos:{x:16, y:-122},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_8',
                        pos:{x:-25, y:-17},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_7',
                        pos:{x:-112, y:31},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_5',
                        pos:{x:58, y:39},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_2',
                        pos:{x:139, y:13},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_4',
                        pos:{x:46, y:103},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_6',
                        pos:{x:-2, y:196},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'27_c_1',
                        pos:{x:-13, y:-57},
                        scale:{x:1, y:1},
                        pack:'stage27',
                        sprite:'27_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv28',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'28_o_1',
                        pos:{x:7, y:-223},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_2',
                        pos:{x:21, y:-195},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_3',
                        pos:{x:-46, y:-112},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_4',
                        pos:{x:134, y:-193},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_5',
                        pos:{x:51, y:-126},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_6',
                        pos:{x:157, y:-125},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_7',
                        pos:{x:223, y:-71},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_8',
                        pos:{x:208, y:-148},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_9',
                        pos:{x:269, y:-71},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_10',
                        pos:{x:198, y:-18},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_11',
                        pos:{x:251, y:22},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_12',
                        pos:{x:183, y:52},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_13',
                        pos:{x:183, y:106},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_14',
                        pos:{x:246, y:106},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_15',
                        pos:{x:277, y:143},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_16',
                        pos:{x:252, y:193},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_17',
                        pos:{x:219, y:193},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_18',
                        pos:{x:146, y:131},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_19',
                        pos:{x:155, y:211},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_20',
                        pos:{x:173, y:285},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_21',
                        pos:{x:69, y:158},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_22',
                        pos:{x:62, y:209},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_23',
                        pos:{x:67, y:211},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_24',
                        pos:{x:119, y:289},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_25',
                        pos:{x:45, y:291},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_26',
                        pos:{x:-20, y:291},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_27',
                        pos:{x:-23, y:313},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_28',
                        pos:{x:-44, y:229},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_29',
                        pos:{x:-153, y:272},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_30',
                        pos:{x:-130, y:245},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_31',
                        pos:{x:-39, y:157},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_32',
                        pos:{x:-126, y:157},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_33',
                        pos:{x:-206, y:199},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_34',
                        pos:{x:-184, y:132},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_35',
                        pos:{x:-262, y:168},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_36',
                        pos:{x:-261, y:102},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_37',
                        pos:{x:-166, y:23},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_38',
                        pos:{x:-261, y:36},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_39',
                        pos:{x:-216, y:9},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_40',
                        pos:{x:-169, y:-46},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_41',
                        pos:{x:-225, y:-79},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_42',
                        pos:{x:-202, y:-148},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_43',
                        pos:{x:-268, y:-44},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_44',
                        pos:{x:-119, y:-176},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_b_45',
                        pos:{x:52, y:-49},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_o_46',
                        pos:{x:-106, y:-218},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_7',
                        pos:{x:-5, y:-24},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_8',
                        pos:{x:80, y:41},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_3',
                        pos:{x:117, y:-21},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_5',
                        pos:{x:44, y:75},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_4',
                        pos:{x:17, y:147},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_9',
                        pos:{x:13, y:197},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_6',
                        pos:{x:-25, y:96},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_10',
                        pos:{x:-79, y:52},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_2',
                        pos:{x:-87, y:-51},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'28_c_1',
                        pos:{x:-138, y:-98},
                        scale:{x:1, y:1},
                        pack:'stage28',
                        sprite:'28_c_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv29',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'29_o_1',
                        pos:{x:48, y:-233},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_2',
                        pos:{x:59, y:-202},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_3',
                        pos:{x:119, y:-198},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_4',
                        pos:{x:60, y:-134},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_5',
                        pos:{x:125, y:-133},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_6',
                        pos:{x:70, y:-82},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_7',
                        pos:{x:166, y:-101},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_8',
                        pos:{x:199, y:-181},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_9',
                        pos:{x:190, y:-137},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_10',
                        pos:{x:157, y:-48},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_11',
                        pos:{x:223, y:-85},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_12',
                        pos:{x:276, y:-48},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_13',
                        pos:{x:219, y:-3},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_14',
                        pos:{x:257, y:89},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_15',
                        pos:{x:228, y:178},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_16',
                        pos:{x:213, y:120},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_17',
                        pos:{x:160, y:120},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_18',
                        pos:{x:161, y:92},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_19',
                        pos:{x:189, y:248},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_20',
                        pos:{x:147, y:203},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_21',
                        pos:{x:89, y:178},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_22',
                        pos:{x:52, y:210},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_23',
                        pos:{x:74, y:266},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_24',
                        pos:{x:148, y:287},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_25',
                        pos:{x:44, y:322},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_26',
                        pos:{x:24, y:298},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_27',
                        pos:{x:-35, y:317},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_28',
                        pos:{x:-30, y:263},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_29',
                        pos:{x:-43, y:200},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_30',
                        pos:{x:-101, y:298},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_31',
                        pos:{x:-164, y:271},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_32',
                        pos:{x:-119, y:224},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_33',
                        pos:{x:-162, y:182},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_34',
                        pos:{x:-236, y:200},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_35',
                        pos:{x:-151, y:111},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_36',
                        pos:{x:-218, y:108},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_37',
                        pos:{x:-267, y:109},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_38',
                        pos:{x:-217, y:12},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_39',
                        pos:{x:-245, y:-18},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_40',
                        pos:{x:-171, y:-34},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_41',
                        pos:{x:-136, y:-117},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_42',
                        pos:{x:-50, y:-101},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_43',
                        pos:{x:-46, y:-134},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_44',
                        pos:{x:-205, y:-143},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_45',
                        pos:{x:-142, y:-190},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_o_46',
                        pos:{x:-36, y:-214},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_b_47',
                        pos:{x:-34, y:-201},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_47.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_12',
                        pos:{x:30, y:-87},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_11',
                        pos:{x:98, y:-49},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_13',
                        pos:{x:72, y:29},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_2',
                        pos:{x:180, y:42},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_10',
                        pos:{x:105, y:77},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_9',
                        pos:{x:30, y:191},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_7',
                        pos:{x:-104, y:142},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_3',
                        pos:{x:-106, y:88},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_1',
                        pos:{x:15, y:105},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_6',
                        pos:{x:-39, y:46},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_8',
                        pos:{x:-146, y:-4},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_4',
                        pos:{x:-110, y:-67},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'29_c_5',
                        pos:{x:-42, y:-42},
                        scale:{x:1, y:1},
                        pack:'stage29',
                        sprite:'29_c_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'lv30',
                pos:{x:0, y:0},
                scale:{x:1.000005, y:1.000005},
            },
            children:[
                {
                    info:{
                        name:'30_o_1',
                        pos:{x:-32, y:-227},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_2',
                        pos:{x:-26, y:-164},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_3',
                        pos:{x:1, y:-153},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_4',
                        pos:{x:39, y:-164},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_5',
                        pos:{x:97, y:-231},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_6',
                        pos:{x:130, y:-168},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_7',
                        pos:{x:208, y:-160},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_7.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_8',
                        pos:{x:190, y:-107},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_8.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_9',
                        pos:{x:117, y:-100},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_9.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_10',
                        pos:{x:69, y:-2},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_10.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_11',
                        pos:{x:139, y:-20},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_11.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_12',
                        pos:{x:141, y:50},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_12.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_13',
                        pos:{x:226, y:-46},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_13.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_14',
                        pos:{x:284, y:-34},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_14.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_15',
                        pos:{x:254, y:52},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_15.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_16',
                        pos:{x:202, y:52},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_16.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_17',
                        pos:{x:264, y:146},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_17.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_18',
                        pos:{x:163, y:129},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_18.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_19',
                        pos:{x:105, y:127},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_19.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_20',
                        pos:{x:209, y:157},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_20.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_21',
                        pos:{x:226, y:210},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_21.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_22',
                        pos:{x:185, y:236},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_22.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_23',
                        pos:{x:111, y:217},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_23.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_24',
                        pos:{x:82, y:182},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_24.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_25',
                        pos:{x:120, y:294},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_25.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_26',
                        pos:{x:64, y:290},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_26.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_27',
                        pos:{x:2, y:220},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_27.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_28',
                        pos:{x:14, y:293},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_28.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_29',
                        pos:{x:-63, y:314},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_29.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_30',
                        pos:{x:-99, y:283},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_30.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_31',
                        pos:{x:-56, y:252},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_31.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_32',
                        pos:{x:-114, y:241},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_32.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_33',
                        pos:{x:-179, y:282},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_33.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_34',
                        pos:{x:-197, y:210},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_34.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_35',
                        pos:{x:-167, y:134},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_35.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_36',
                        pos:{x:-87, y:154},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_36.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_37',
                        pos:{x:-252, y:177},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_37.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_38',
                        pos:{x:-239, y:145},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_38.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_39',
                        pos:{x:-194, y:26},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_39.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_40',
                        pos:{x:-228, y:70},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_40.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_41',
                        pos:{x:-273, y:47},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_41.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_42',
                        pos:{x:-194, y:-2},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_42.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_43',
                        pos:{x:-80, y:7},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_43.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_44',
                        pos:{x:-96, y:-55},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_44.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_45',
                        pos:{x:-217, y:-78},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_45.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_b_46',
                        pos:{x:-134, y:-123},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_46.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_47',
                        pos:{x:-195, y:-125},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_47.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_o_48',
                        pos:{x:-157, y:-197},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_48.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_c_4',
                        pos:{x:5, y:-116},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_c_1.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_c_2',
                        pos:{x:66, y:31},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_c_2.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_c_5',
                        pos:{x:-43, y:16},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_c_3.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_c_1',
                        pos:{x:-38, y:-54},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_c_4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_c_3',
                        pos:{x:4, y:181},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_c_5.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'30_c_6',
                        pos:{x:-53, y:151},
                        scale:{x:1, y:1},
                        pack:'stage30',
                        sprite:'30_c_6.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
    ],
};

var UNITYTYPE={NODE:0,IMAGE:1,TEXT:2,GRAPHIC:3,BUTTON:4,SPINE:5};
var PHASERTYPE={NOTUSE:0,GRP:1,BUTTON:2,ONOFFBUTTON:4,DISABLEBUTTON:5,SPINE:6};
var PHASERDIRTYPE={LEFT:0,RIGHT:1,TOP:3,BOTTOM:4};
var BtsObj = {};
var _uts ={
t0:{font:'bold Arial',align:'center',fill:'#DF9731',fontSize:32,stroke:'#FFFFFF',strokeThickness:4},
t1:{font:'bold Arial',align:'center',fill:'#FFFFFF',fontSize:30},
t2:{font:'bold Arial',align:'center',fill:'#00A0FF',fontSize:42},
t3:{font:'bold Arial',align:'center',fill:'#FFFFFF',fontSize:37,stroke:'#000000',strokeThickness:4},
t4:{font:'bold Arial',align:'center',fill:'#323232',fontSize:89},
t5:{font:'bold Arial',align:'center',fill:'#323232',fontSize:25},
t6:{font:'Arial',align:'center',fill:'#D95700',fontSize:35},
t7:{font:'bold Arial',align:'right',fill:'#DC9628',fontSize:17}
};
//사용된폰트 정보들
var UsedTypes = {
u_tx_best_t:_uts.t0,
u_tx_best_v:_uts.t0,
u_tx_prg:_uts.t1,
u_tx_lv:_uts.t2,
u_tx_help:_uts.t3,
u_c_tx_success:_uts.t4,
u_c_tx_fail:_uts.t4,
u_c_tx_best:_uts.t5,
u_c_tx_cur:_uts.t5,
u_g_f_tx:_uts.t6,
s_tx_ver:_uts.t7
};
//사용된스파인 정보들
var SpineInfos = {
    Result:{'fail':2,'success_1_idle':2,'success_1_in':2,'success_2_idle':2,'success_2_in':2.3333},
};
var UIFs ={
};

var RootsNames = {
    b:0,
    g:1,
    u:2,
    s:3,
    t:4,
    f:5,
};


var UIOsRoots={};
 //루트그룹 이름
 var UIFsRoots=[];
 //var UIFsRoots = [
//    UIFs['b'].obj,
//    UIFs['g'].obj,
//    UIFs['u'].obj,
//    UIFs['s'].obj,
//    UIFs['t'].obj,
//    UIFs['f'].obj,
//];



//UI_b.js

UIFs.b={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.bg_img={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.bg_img_pre={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };

UIOsRoots.b = {
    info:{
        name:'b',
        pos:{x:0, y:0},
        scale:{x:1, y:1},
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.NOTUSE,
    },
    children:[
        {
            info:{
                name:'bg_post',
                pos:{x:0, y:0},
                scale:{x:180, y:320},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0x213627',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'bg_img',
                pos:{x:0, y:0},
                scale:{x:730, y:1},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack: undefined,
                sprite:'bg_01.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'bg_img_pre',
                pos:{x:0, y:0},
                scale:{x:730, y:1},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack: undefined,
                sprite:'bg_01.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
    ],
};

//UI_g.js

UIFs.g={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.g_post={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.g_grp_grid={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };

UIOsRoots.g = {
    info:{
        name:'g',
        pos:{x:0, y:0},
        scale:{x:1, y:1},
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.NOTUSE,
    },
    children:[
        {
            info:{
                name:'g_post',
                pos:{x:0, y:0},
                scale:{x:180, y:320},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                useinteractive:true,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xFFFFFF',
                alpha:0,
            },
            children:[
            ],
        },
        {
            info:{
                name:'g_grp_grid',
                pos:{x:0, y:0},
                scale:{x:1, y:1},
                utype:UNITYTYPE.NODE,
                ptype:PHASERTYPE.NOTUSE,
            },
            children:[
                {
                    info:{
                        name:'im_grid_0',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_1',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_2',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_3',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_4',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_5',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_6',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_7',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_8',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_9',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_10',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_11',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_12',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_13',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_14',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_15',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_16',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_17',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_18',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_19',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_20',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_21',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_22',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_23',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_24',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_25',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_26',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_27',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_28',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_29',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_30',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_31',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_32',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_33',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_34',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_35',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_36',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_37',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_38',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_39',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_40',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_41',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_42',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_43',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_44',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_45',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_46',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_47',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_48',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_49',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_50',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_51',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_52',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_53',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_54',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_55',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_56',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_57',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_58',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_59',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_60',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_61',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_62',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_63',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_64',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_65',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_66',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_67',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_68',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_69',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_70',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_71',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_72',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_73',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_74',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_75',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_76',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_77',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_78',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_79',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'im_grid_80',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
    ],
};

//UI_u.js

UIFs.u={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.u_tx_best_t={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_tx_best_v={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_prg_bg={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_prg={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_tx_prg={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_prg_star1={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_prg_star2={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_tx_lv={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_bt_menu={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.u_bt_option={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.u_bt_sp_left={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.u_bt_sp_right={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.u_tx_help={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_grp_clear={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.u_c_white_upper={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_c_white_lower={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_c_sp_result={
        obj:undefined,
        utype:UNITYTYPE.SPINE,
        ptype:PHASERTYPE.SPINE,
    };
UIFs.u_c_im_fail={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_c_star_pre={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.u_c_bt_next={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.u_c_bt_menu={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.u_c_bt_retry={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.u_c_tx_success={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_c_tx_fail={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_c_tx_best={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_c_tx_cur={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_grp_fin={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.u_g_f_bg={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_g_f_dlg={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.u_g_bt_goto_scroll={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };

UIOsRoots.u = {
    info:{
        name:'u',
        pos:{x:0, y:0},
        scale:{x:1, y:1},
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.NOTUSE,
    },
    children:[
        {
            info:{
                name:'u_tx_best_t',
                pos:{x:0, y:-605},
                scale:{x:1, y:1},
                utype:UNITYTYPE.TEXT,
                str:'Best Record',
                size:32,
                font:'Arial',
                txtype:UsedTypes.u_tx_best_t,
                anchor:{x:0.5,y:0.5},
                color:'0xDF9731',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_tx_best_v',
                pos:{x:0, y:-564},
                scale:{x:1.000014, y:1.000014},
                utype:UNITYTYPE.TEXT,
                str:'--:--:--',
                size:32,
                font:'Arial',
                txtype:UsedTypes.u_tx_best_v,
                anchor:{x:0.5,y:0.5},
                color:'0xDF9731',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_prg_bg',
                pos:{x:0, y:-424},
                scale:{x:1, y:1},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack:'ui_dalgona',
                sprite:'Time Bar.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_prg',
                pos:{x:30, y:-414},
                scale:{x:1, y:1},
                utype:UNITYTYPE.IMAGE,
                progress:PHASERDIRTYPE.LEFT,
                pack:'ui_dalgona',
                sprite:'Pro_bar.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_tx_prg',
                pos:{x:33, y:-411},
                scale:{x:1, y:1},
                utype:UNITYTYPE.TEXT,
                str:'0',
                size:30,
                font:'Arial',
                txtype:UsedTypes.u_tx_prg,
                anchor:{x:0.5,y:0.5},
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_prg_star1',
                pos:{x:90, y:-466},
                scale:{x:1, y:1},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack:'ui_dalgona',
                sprite:'gauge_star_normal.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_prg_star2',
                pos:{x:0, y:-466},
                scale:{x:0.9999838, y:0.9999838},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack:'ui_dalgona',
                sprite:'gauge_star_normal.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_tx_lv',
                pos:{x:-222, y:-414},
                scale:{x:1, y:1},
                utype:UNITYTYPE.TEXT,
                str:'0',
                size:42,
                font:'Arial',
                txtype:UsedTypes.u_tx_lv,
                anchor:{x:0.5,y:0.5},
                color:'0x00A0FF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_bt_menu',
                pos:{x:-271, y:-566},
                scale:{x:1, y:1},
                utype:UNITYTYPE.BUTTON,
                ptype:PHASERTYPE.BUTTON,
                pack:'ui_dalgona',
                sprite:'back.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_bt_option',
                pos:{x:-189, y:-884},
                scale:{x:1, y:1},
                utype:UNITYTYPE.BUTTON,
                ptype:PHASERTYPE.BUTTON,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_bt_sp_left',
                pos:{x:-340, y:0},
                scale:{x:1, y:1},
                utype:UNITYTYPE.BUTTON,
                ptype:PHASERTYPE.BUTTON,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_bt_sp_right',
                pos:{x:337, y:0},
                scale:{x:1, y:1},
                utype:UNITYTYPE.BUTTON,
                ptype:PHASERTYPE.BUTTON,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_tx_help',
                pos:{x:0, y:-320},
                scale:{x:1, y:1},
                utype:UNITYTYPE.TEXT,
                str:'가장자리부터 \n조심히 떼어내봐요',
                size:37,
                font:'Arial',
                txtype:UsedTypes.u_tx_help,
                anchor:{x:0.5,y:0.5},
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'u_grp_clear',
                pos:{x:0, y:0},
                scale:{x:1, y:1},
                utype:UNITYTYPE.NODE,
                ptype:PHASERTYPE.NOTUSE,
            },
            children:[
                {
                    info:{
                        name:'u_c_white_upper',
                        pos:{x:0, y:-448},
                        scale:{x:109.05, y:72.1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack:'ui_dalgona',
                        sprite:'ingame_menu_bg.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_white_lower',
                        pos:{x:0, y:514},
                        scale:{x:109.05, y:72.1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack:'ui_dalgona',
                        sprite:'ingame_menu_bg.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_sp_result',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.SPINE,
                        ptype:PHASERTYPE.SPINE,
                        sprite:'Result',
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_im_fail',
                        pos:{x:264, y:95},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack:'ui_dalgona',
                        sprite:'character.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_star_pre',
                        pos:{x:797, y:-337},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.NODE,
                        ptype:PHASERTYPE.NOTUSE,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_bt_next',
                        pos:{x:202, y:389},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.BUTTON,
                        ptype:PHASERTYPE.BUTTON,
                        pack:'ui_dalgona',
                        sprite:'icon_next.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_bt_menu',
                        pos:{x:2, y:389},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.BUTTON,
                        ptype:PHASERTYPE.BUTTON,
                        pack:'ui_dalgona',
                        sprite:'icon_menu.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_bt_retry',
                        pos:{x:-202, y:389},
                        scale:{x:1.000004, y:1.000004},
                        utype:UNITYTYPE.BUTTON,
                        ptype:PHASERTYPE.BUTTON,
                        pack:'ui_dalgona',
                        sprite:'icon_refresh.png',
                        color:'0xFFFFFF',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_tx_success',
                        pos:{x:698, y:-492},
                        scale:{x:1.000021, y:1.000021},
                        utype:UNITYTYPE.TEXT,
                        str:'성공',
                        size:89,
                        font:'Arial',
                        txtype:UsedTypes.u_c_tx_success,
                        anchor:{x:0.5,y:0.5},
                        color:'0x323232',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_tx_fail',
                        pos:{x:698, y:-492},
                        scale:{x:1.000025, y:1.000025},
                        utype:UNITYTYPE.TEXT,
                        str:'실패',
                        size:89,
                        font:'Arial',
                        txtype:UsedTypes.u_c_tx_fail,
                        anchor:{x:0.5,y:0.5},
                        color:'0x323232',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_tx_best',
                        pos:{x:0, y:-266},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.TEXT,
                        str:'Best Record: 00:00:00',
                        size:25,
                        font:'Arial',
                        txtype:UsedTypes.u_c_tx_best,
                        anchor:{x:0.5,y:0.5},
                        color:'0x323232',
                        alpha:1,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_c_tx_cur',
                        pos:{x:0, y:-225},
                        scale:{x:1.000021, y:1.000021},
                        utype:UNITYTYPE.TEXT,
                        str:'Present Record: 00:00:00',
                        size:25,
                        font:'Arial',
                        txtype:UsedTypes.u_c_tx_cur,
                        anchor:{x:0.5,y:0.5},
                        color:'0x323232',
                        alpha:1,
                    },
                    children:[
                    ],
                },
            ],
        },
        {
            info:{
                name:'u_grp_fin',
                pos:{x:0, y:0},
                scale:{x:1, y:1},
                utype:UNITYTYPE.NODE,
                ptype:PHASERTYPE.NOTUSE,
            },
            children:[
                {
                    info:{
                        name:'u_g_f_bg',
                        pos:{x:0, y:0},
                        scale:{x:203.46, y:338.6},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        useinteractive:true,
                        pack: undefined,
                        sprite:'_alpha1_4x4.png',
                        color:'0x000000',
                        alpha:0.497,
                    },
                    children:[
                    ],
                },
                {
                    info:{
                        name:'u_g_f_dlg',
                        pos:{x:0, y:0},
                        scale:{x:1, y:1},
                        utype:UNITYTYPE.IMAGE,
                        ptype:PHASERTYPE.NOTUSE,
                        pack:'ui_dalgona',
                        sprite:'9xPOPUP.png',
                        color:'0xFFFFFF',
                        alpha:1,
                        size:{w:613,h:390},
                        sliced:{l:80,b:82,r:72,t:77},
                    },
                    children:[
                        {
                            info:{
                                name:'u_g_f_tx',
                                pos:{x:0, y:-45},
                                scale:{x:1, y:1},
                                utype:UNITYTYPE.TEXT,
                                str:'Please wait for the stage update!',
                                size:35,
                                font:'Arial',
                                txtype:UsedTypes.u_g_f_tx,
                                anchor:{x:0.5,y:0.5},
                                color:'0xD95700',
                                alpha:1,
                            },
                            children:[
                            ],
                        },
                        {
                            info:{
                                name:'u_g_bt_goto_scroll',
                                pos:{x:0, y:110},
                                scale:{x:1, y:1},
                                utype:UNITYTYPE.BUTTON,
                                ptype:PHASERTYPE.BUTTON,
                                pack:'ui_dalgona',
                                sprite:'icon_menu.png',
                                color:'0xFFFFFF',
                                alpha:1,
                            },
                            children:[
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

//UI_s.js

UIFs.s={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.s_bg={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.s_grp_a={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.s_grp_b={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.s_bt_close={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.s_bt_tab_a={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.s_bt_tab_b={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };
UIFs.s_tx_ver={
        obj:undefined,
        utype:UNITYTYPE.TEXT,
        ptype:PHASERTYPE.NOTUSE,
    };
UIFs.s_bt_sfx={
        obj:undefined,
        utype:UNITYTYPE.BUTTON,
        ptype:PHASERTYPE.BUTTON,
        FnOver:function(){console.log('FnOver: '+this.name);},
        FnDown:function(){console.log('FnDown: '+this.name);},
        FnClick:function(){
            console.log('FnClick:'+ this.name +', id:'+this.z_slotid+', str:'+this.z_slotstr);
        },
    };

UIOsRoots.s = {
    info:{
        name:'s',
        pos:{x:0, y:0},
        scale:{x:1, y:1},
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.NOTUSE,
    },
    children:[
        {
            info:{
                name:'s_bg',
                pos:{x:0, y:0},
                scale:{x:729, y:1.01},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                useinteractive:true,
                pack: undefined,
                sprite:'bg_01.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_grp_a',
                pos:{x:-360, y:-660},
                scale:{x:1, y:1},
                utype:UNITYTYPE.NODE,
                ptype:PHASERTYPE.NOTUSE,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_grp_b',
                pos:{x:-360, y:-660},
                scale:{x:1, y:1},
                utype:UNITYTYPE.NODE,
                ptype:PHASERTYPE.NOTUSE,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_im_arrow_dn',
                pos:{x:0, y:571},
                scale:{x:1, y:1},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack:'ui_dalgona',
                sprite:'scrool.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_bt_close',
                pos:{x:269, y:-785},
                scale:{x:1.000011, y:1.000011},
                utype:UNITYTYPE.BUTTON,
                ptype:PHASERTYPE.BUTTON,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_bt_tab_a',
                pos:{x:-282, y:-786},
                scale:{x:1.000012, y:1.000012},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.BUTTON,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xAA7D35',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_bt_tab_b',
                pos:{x:-223, y:-786},
                scale:{x:1.000012, y:1.000012},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.BUTTON,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_im_title',
                pos:{x:0, y:-531},
                scale:{x:1, y:1},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack:'ui_dalgona',
                sprite:'LOGO.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_tx_ver',
                pos:{x:285, y:-452},
                scale:{x:1, y:1},
                utype:UNITYTYPE.TEXT,
                str:'ver 1.0.0',
                size:17,
                font:'Arial',
                txtype:UsedTypes.s_tx_ver,
                anchor:{x:1,y:1},
                color:'0xDC9628',
                alpha:1,
            },
            children:[
            ],
        },
        {
            info:{
                name:'s_bt_sfx',
                pos:{x:-289, y:-561},
                scale:{x:1.000014, y:1.000014},
                utype:UNITYTYPE.BUTTON,
                ptype:PHASERTYPE.BUTTON,
                pack:'ui_dalgona',
                sprite:'sound_on.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
    ],
};

//UI_t.js

UIFs.t={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.im_allgrade={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };

UIOsRoots.t = {
    info:{
        name:'t',
        pos:{x:0, y:0},
        scale:{x:1, y:1},
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.NOTUSE,
    },
    children:[
        {
            info:{
                name:'im_allgrade',
                pos:{x:267, y:-531},
                scale:{x:1, y:1},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                pack: undefined,
                sprite:'all.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
    ],
};

//UI_f.js

UIFs.f={
        obj:undefined,
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.GRP,
    };
UIFs.im_fade={
        obj:undefined,
        utype:UNITYTYPE.IMAGE,
        ptype:PHASERTYPE.NOTUSE,
    };

UIOsRoots.f = {
    info:{
        name:'f',
        pos:{x:0, y:0},
        scale:{x:1, y:1},
        utype:UNITYTYPE.NODE,
        ptype:PHASERTYPE.NOTUSE,
    },
    children:[
        {
            info:{
                name:'im_fade',
                pos:{x:0, y:0},
                scale:{x:195.7, y:332.56},
                utype:UNITYTYPE.IMAGE,
                ptype:PHASERTYPE.NOTUSE,
                useinteractive:true,
                pack: undefined,
                sprite:'_alpha1_4x4.png',
                color:'0xFFFFFF',
                alpha:1,
            },
            children:[
            ],
        },
    ],
};

'use strict';
//UI_g의 UI컴포넌트를 억세스한다
function UI_g_controller() {
    this.name = 'UI_g_controller';
    this.runcnt = {
        'init_g':0,
        'update_g':0
    }

}
UI_g_controller.prototype.chkcnt = function (name, wantcnt){
    if(wantcnt===this.runcnt[name]){
        this.runcnt[name]+=1;
        return true;
    }else{
        this.runcnt[name]+=1;
        return false;
    }
};
UI_g_controller.prototype.init_g = function (){
    if(this.chkcnt('init_g', 0)) console.log('init_g');
    init_setting_level();
};

UI_g_controller.prototype.update_g = function () {
    if (this.chkcnt('update_g', 0)) {
        console.log('update_g');
        // setTimeout(() => {
        //     Define.focus_first = 1;
        // }, 500);
    }
    // if (Define.focus_first===1){//안사용//백그라운드로 해결//.disableVisibilityChange
    //     let canv = MG.game.canvas;
    //     canv.setAttribute('tabindex', '0');
    //     canv.focus();
    //     console.log('canv.focus()');
    // }

    // if(time_ad_minimum>0){
    //     time_ad_minimum -= deltaTime;
    // }

    //픽셀린트주석//<<
    // if(ing_hint){ //힌트작동
    //     if(timelazy<0) {
    //         if (timehint > 0) { //힌트알파
    //
    //             if (dirhint) { //힌트알파 방향
    //                 //console.log('dirhint:', dirhint, 'ra:', ra);
    //                 var ra = (timehint / timehintinit);
    //                 UIFs.g_grp_hint.obj.alpha = 1 - ra;
    //                 //UIFs.g_grp_grid.obj.alpha = ra; //이건 계속 보여야하므로
    //                 UIFs.g_grp_hint_upper.obj.alpha = ra;
    //             } else {
    //                 //console.log('dirhint:', dirhint, 'ra:', ra);
    //                 var ra = (timehint / (timehintinit*0.65));
    //                 UIFs.g_grp_hint.obj.alpha = ra;
    //                 //UIFs.g_grp_grid.obj.alpha = 1 - ra; //이건 계속 보여야하므로
    //                 UIFs.g_grp_hint_upper.obj.alpha = 1 - ra;
    //             }
    //             timehint -= deltaTime;
    //         } else {
    //             //알파애니 방향변경
    //             if(dirhint === true){
    //                 dirhint = false;
    //                 timehint = timehintinit*0.65;
    //
    //                 UIFs.g_grp_hint.obj.alpha = 1;
    //                 //UIFs.g_grp_grid.obj.alpha = 0; //이건 계속 보여야하므로
    //                 UIFs.g_grp_hint_upper.obj.alpha = 0;
    //
    //                 if(UIFs.g_grp_hint_upper.obj.z_alpha_step===0){
    //                     UIFs.g_grp_hint_upper.obj.z_alpha_step = 1;
    //                     var uplen = UIFs.g_grp_hint_upper.obj.children.length;
    //                     for(var k =0; k<uplen; k++){
    //                         UIFs.g_grp_hint_upper.obj.children[k].alpha = 0.6;
    //                     }
    //                 }
    //                 console.log('UIFs.g_grp_hint.obj.alpha: 1 -- showed hint');
    //                 console.log('UIFs.g_grp_hint_upper.obj.alpha: 0');
    //             }else{
    //                 dirhint = true;
    //                 timehint = timehintinit;
    //
    //                 UIFs.g_grp_hint.obj.alpha = 0;
    //                 //UIFs.g_grp_grid.obj.alpha = 1;
    //                 UIFs.g_grp_hint_upper.obj.alpha = 1;
    //
    //                 console.log('UIFs.g_grp_hint.obj.alpha: 0 -- hidden hint');
    //                 console.log('UIFs.g_grp_hint_upper.obj.alpha: 1');
    //             }
    //         }
    //         timelazy = timelazyinit;
    //     }else{
    //         timelazy -= deltaTime;
    //     }
    //     //console.log('timelazy:', timelazy, 'timehint:', timehint, 'dirhint:', dirhint);
    // }
    // if(ing_gradent){
    //     if(timelazy_gradient<0) {
    //         ing_gradent = update_ui_clear_gradient(idx_gradent);
    //         idx_gradent += 1;
    //         timelazy_gradient = timelazy_gradient_init;
    //     }else{
    //         timelazy_gradient -= deltaTime;
    //     }
    // }
    //픽셀린트주석//>>
};

'use strict';
//UI_dummy의 UI컴포넌트를 억세스한다
function UI_dummy_controller() {
    this.name = 'UI_dummy_controller';
    this.runcnt = {
        'init_g':0,
        'update_g':0
    }

}
UI_dummy_controller.prototype.chkcnt = function (name, wantcnt){
    if(wantcnt===this.runcnt[name]){
        this.runcnt[name]+=1;
        return true;
    }else{
        this.runcnt[name]+=1;
        return false;
    }
};
UI_dummy_controller.prototype.init_g = function (){
    if(this.chkcnt('init_g', 0)) console.log('init_g');
};

UI_dummy_controller.prototype.update_g = function (){
    if(this.chkcnt('update_g', 0)) console.log('update_g');
};
'use strict';
function scrlx(name, listview, maxcnt){
    this.name = name;

    this.table={};
    this.i=0;
    this.j=0;
    this.idx_purchased=undefined;
    this.midslot=1; //_arr5[2]중앙용도 //스크롤 될때만 증감
    //this.par=undefined; //슬롯의 루트= UIFs.grp_sp_list_bat.obj;
    this.cur=undefined; //커서 = UIFs.Image_sp_slot1_selected.obj;
    this.plist=undefined; //슬롯의 차일드 = UIFs.grp_sp_list_bat.obj.children;
    this.idx_l=0;     //왼쪽 끝 idx
    this.idx_r=6;     //오른쪽 끝 idx
    this.idx_remain=7; //여분 idx
    this._arr5=[];
    this.len_arr5=7;
    this._end='';
    this._listview = listview;
    this._maxcnt = maxcnt;
    //작동함수들 할당 꼭 할것
    this.fnclick = function () {};
}
//슬롯1 방망이 업데이트(버튼+속성+슬롯숨김여부)
//refreshSlots_after_tw에서 에서 5번 호출
//refreshSlots 에서 1번 호출(여분슬롯)
scrlx.prototype.setSlot1= function(idx, slotobj1, _tbl) { //사용자변경
    //if(lg) console.log('setSlot1() idx:',idx,'obj:',slotobj1.name, 'table:', _tbl);
    if(idx===undefined) {   //
        //여분슬롯1 업데이트(처음,끝에 도달시 슬롯1 스킵)
        slotobj1.visible = false;   //슬롯 인덱스범위가 벗어나면 숨김처리
    }else{   //처음,끝이 아니면 슬롯1 작동
        //여분슬롯1 업데이트(스크롤시)
        this.refreshCommon(idx, slotobj1, _tbl); //여분슬롯1 속성
        this.refreshState('상태를 넘겨줌', slotobj1); //여분슬롯1 사용중

        slotobj1.visible = true;
    }
};

scrlx.prototype.refreshSlots_after_tw_dc = function() {
    console.log('refreshSlots_after_tw_dc');

    //this.par.x = this.par.z_initx;    //원본
    //this.par.position.setTo(-640,-360); //디씨버젼

    this._listview.setPosition(0);

    this.removeSlotAll(); //전부제거하고

    //console.log('02스크롤 MG.s.listView2.items.length:', MG.s.listView2.items.length);
    //var _len = MG.s.ch_scrlx.table.length;
    var _len = this._maxcnt;
    if (_len > 0) {
        for (var i = 0; i < _len; i++) {
            //var add_slot1 = MG.s.listView2.arr_item_remain.pop();
            var add_slot1 = this._listview.grp_all_list[i];
            add_slot1.visible = true;

            add_slot1.x = 0;
            add_slot1.y = 0;
            this._listview.add(add_slot1); //제거후, 다시 슬롯1 추가함

            this.setSlot1(i, add_slot1.children[0], this.table);//트윈종료후 슬롯 5개 업데이트
            //console.log('02스크롤 refreshSlots_after_tw_dc()',i, '  items1:',add_slot1.children[0].name, '  plist1:',this.plist[i].name);
        }
    }
    //console.log('01스크롤 MG.s.listView2.items.length:', MG.s.listView2.items.length);

    for(var h=_len; h<this._listview.slot_list.length; h++){
        this._listview.grp_all_list[h].x = -5000;
        this._listview.grp_all_list[h].y = -5000;
        this._listview.grp_all_list[h].visible = false;
        //console.log('04스크롤 visible off -->  h:',h, '  plist1:',MG.s.ch_scrlx.plist[h].name);
    }
    //console.log('03스크롤 MG.s.listView2.items.length:', MG.s.listView2.items.length);

    // for(var i=0; i<MG.s.listView2.grp_all_list.length; i++){
    //     console.log('04스크롤 최종확인-->',
    //         '  i:',i,
    //         '  grp:',  MG.s.listView2.grp_all_list[i].name,
    //         MG.s.listView2.grp_all_list[i].visible,
    //         '  child:',
    //         MG.s.listView2.grp_all_list[i].children[0].name,
    //         MG.s.listView2.grp_all_list[i].children[0].visible,
    //     );
    // }
};

scrlx.prototype.removeSlotAll = function() {
    console.log('removeSlotAll()');
    var cnt_list =  this._listview.items.length;
    for (var i = 0; i < cnt_list; i++) {
        var remove_slot1 =  this._listview.remove(
            this._listview.items[ this._listview.items.length-1]
        );
        //var _c = remove_slot1.children[0];
        //MG.s.listView2.arr_item_remain.push(remove_slot1);
        // console.log('_dc arr_item_remain속에 저장, idx:', i, 'xy:', remove_slot1.x, remove_slot1.y, 'child1.name:', remove_slot1.children[0].name, 'xy:',_c.x, _c.y );
    }
};

'use strict';

var time_ad_minimum_init = -1;//var time_ad_minimum_init = 20;
var time_ad_minimum = time_ad_minimum_init;

//리스트뷰관련//스크롤뷰관련
var scr2_opt = {};
var slot2_rect = {};

var slotScrollForce = -208; //새로


var spr_normal = []; //버튼스프라이트

var stage_mode = 0; //0:normal, 1:special

var paint_mode = 'none'; //none, begin
var sel_paint_color = '0xFFFFFF';
var sel_paint_idx = 0;

var isLastLevel = false; //초기화
var idxLastLevel = 30; //1~297
var idxLastLevelRow = 9; //0~32
var bk_sfx = true;
var bk_bgm = true;

var loaded = {};

var loaded_cnt = 0;
function set_ui_all(){
    set_btns();
    var slotcnt_normal= 10; //99개 기준

    create_list_view(UIFs.s_grp_a.obj,'listview_a', slotcnt_normal );

    UIFs.s_bt_tab_a.obj.visible = false;
    UIFs.s_bt_tab_b.obj.visible = false;// 스페셜스크롤 끄려고 주석처리 false //on하려면 true


    //드로우용 그리드 인풋세팅
    set_grids_with_input('g_grp_grid', click_dalgona_dn, click_dalgona, click_dalgona_up);

    //----상단버튼3개----
    UIFs.u_bt_menu.obj.sx = 0.9;
    UIFs.u_bt_menu.obj.sy = 0.9;
    UIFs.u_bt_menu.obj.scale.setTo(0.9);
    UIFs.u_bt_option.obj.sx = 0.9;
    UIFs.u_bt_option.obj.sy = 0.9;
    UIFs.u_bt_option.obj.scale.setTo(0.9);


    //---루트노드의 초기 위치값, 스케일값 저장---
    var arr_ob =[
        UIFs.g_grp_grid.obj        //그리드
    ]
    // for (var p of arr_ob) {
    //     p.z_initx = p.x;
    //     p.z_inity = p.y;
    //     p.z_initsx = p.scale.x;
    //     p.z_initsy = p.scale.y;
    // }
    var plen = arr_ob.length;
    for (var i= 0; i<plen; i++) {
        var p = arr_ob[i];
        p.z_initx = p.x;
        p.z_inity = p.y;
        p.z_initsx = p.scale.x;
        p.z_initsy = p.scale.y;
    }
    //---루트노드의 초기 위치값, 스케일값 저장---

    //2번째 실행 --set_ui_all시
    //첫시작시--loadLevel 바로전--<<
    var ilv = kData.cur_lv;
    var sid = ilv.toString();

    UIFs.u_bt_sp_left.obj.visible = false;
    UIFs.u_bt_sp_right.obj.visible = false;

    //show_ui_btn_lower();//ui생성시 //빈함수
    loadLevel(sid, 0); //set_ui_all

    isFirstInitSvPos = false;
    //첫시작시--loadLevel-->>

    //--------스크롤바 업데이트-------<<
    refreshScroll_icons('set_ui_all click'); //set_ui_all//--//스크롤바 끄려면 주석처리

    //------------------------------------강제스크롤-----<< set_ui_all
    var idx_gotolv = kData.cur_lv-1;
    if(idx_gotolv<0) idx_gotolv = idxLastLevel-1;

    var dt_row = 0;
    var calc_row_idx = Math.floor((idx_gotolv)/3);

    var grid1_y = (scr2_opt.padding + MG.s.scrlx_listview_a._listview.items[0].height);
    var grid_scroll_dist = 0;
    var is_grid_end = false;

    if(calc_row_idx>=4)
    {
        if(calc_row_idx>idxLastLevelRow) {        //99레벨 쉐도우상태일때
            //마지막 레벨일경우 calc_row_idx가 idxLastLevelRow+1이 된다
            //그래서 예외처리
            calc_row_idx = idxLastLevelRow;
        }

        if( calc_row_idx === idxLastLevelRow
            || calc_row_idx === idxLastLevelRow-1
            || calc_row_idx === idxLastLevelRow-2
        ){
            //마지막 하단 3줄까지 예외처리(스크롤 고정시킴)
            //dt_row를 4로 만들려고(즉, 강제로 4줄 밑으로 스크롤 시킨다)
            dt_row = idxLastLevelRow - 5;
            is_grid_end = true;
        } else {
            //일반적인 강제스크롤
            dt_row = calc_row_idx - 3;
        }

        if(is_grid_end === true){
            grid_scroll_dist = -1070;
        }else{
            grid_scroll_dist = -1 * grid1_y * dt_row;
        }
        console.log('calc_row_idx:', calc_row_idx, 'dt_row:',dt_row);
        MG.s.scrlx_listview_a._listview.setPosition(grid_scroll_dist); //스크롤.스크롤강제 //버튼생성시
    }
    //------------------------------------강제스크롤----->>
    //--------스크롤바 업데이트-------


    //UIFs.tx_ver.obj.text = Define.txtVer;

    UIFs.u_grp_fin.obj.visible = false; //초기화

    //스크롤뷰 탭버튼 초기 세팅
    UIFs.s_bt_tab_a.obj.alpha = 1;
    UIFs.s_bt_tab_b.obj.alpha = 0.5;
    //스크롤뷰 초기 세팅
    UIFs.s_grp_a.obj.visible = true;
    UIFs.s_grp_b.obj.visible = false;

    init_ui_clear();


    UIFs.s_bt_sfx.obj.z_initx = UIFs.s_bt_sfx.obj.x; //사운드버튼위치저장
    UIFs.s_bt_sfx.obj.z_inity = UIFs.s_bt_sfx.obj.y; //사운드버튼위치저장


    //나가가버튼 생성
    var sprexit = MG.game.add.sprite(0, -1200, "btn_exit.png");
    sprexit.anchor.setTo(0.5, 0.5);
    //sprexit.tint = '0xffffff';
    sprexit.tint = '0xe1af5e';
    sprexit.inputEnabled = true;
    sprexit.events.onInputUp.add(function () {
        MSSDK.gameExit(true);
    }.bind(this));
    UIFs.s.obj.addChild(sprexit); //나가기버튼 부모
    MG.sprexit = sprexit;
    //나가가버튼 생성

    // if(MSSDK.getBackButton() == true) {
    //     //나가기버튼 위치보정
    //     sprexit.x = UIFs.s_bt_sfx.obj.z_initx - 30;
    //     sprexit.y = UIFs.s_bt_sfx.obj.z_inity;
    //     UIFs.s_bt_sfx.obj.x = UIFs.s_bt_sfx.obj.z_initx + 45;
    //     //나가기버튼 위치보정
    // }

    UIFs.s_bt_sfx.obj.visible = false;

} //set_ui_all

function init_ui_clear(){
    UIFs.u_grp_clear.obj.visible = false; //초기화
    UIFs.u_c_tx_success.obj.visible = false; //초기화
    UIFs.u_c_tx_fail.obj.visible = false; //초기화
    UIFs.u_c_tx_best.obj.visible = false; //초기화
    UIFs.u_c_tx_cur.obj.visible = false; //초기화

    var arr_clear = [ UIFs.u_c_bt_next.obj, UIFs.u_c_bt_retry.obj, UIFs.u_c_bt_menu.obj];
    var clen = arr_clear.length;
    for(var i=0; i<clen; i++) {
        var s = arr_clear[i];
        s.z_initx = s.x;
        s.z_inity = s.y;
        s.z_initsx = s.scale.x;
        s.z_initsy = s.scale.y;
    }

    UIFs.u_c_sp_result.obj.z_initx = UIFs.u_c_sp_result.obj.x;
    UIFs.u_c_sp_result.obj.z_inity = UIFs.u_c_sp_result.obj.y;


    //MG.game.physics.startSystem(Phaser.Physics.ARCADE);
    UIFs.u_grp_clear.obj.z_emits=[];
    for(var i=0; i<2; i++) {
        var xoff = i===0? -360: 360;
        //var xspeed = i===0? 350: -350;
        var xspeed = i===0? 400: -400;
        var emitter = MG.game.add.emitter(xoff, 0, 20);
        emitter.makeParticles('ui_dalgona',['p_01.png','p_02.png','p_03.png','p_04.png']);

        //emitter.gravity = 600;
        emitter.gravity = 800;
        emitter.setXSpeed(xspeed-(xspeed*0.5), xspeed+(xspeed*0.5));
        emitter.setYSpeed(-150, -700);
        emitter.setRotation(-360, 360);
        emitter.setScale(1, 3, 1, 3);
        emitter.setAlpha(1, 1);
        emitter.bringToTop = true;
        UIFs.u_grp_clear.obj.z_emits.push(emitter);
        UIFs.u_grp_clear.obj.addChild(emitter);
    }

}

function particle2_Burst(lifetime,count) { //particle2_Burst(3000,10);
    UIFs.u_grp_clear.obj.z_emits[0].start(true, lifetime, null, count);
    UIFs.u_grp_clear.obj.z_emits[1].start(true, lifetime, null, count);
}


function tween_to_left(cb, mode){
    var time = 0.48;
    var obj0 = UIFs.g.obj;
    var tw0 = TweenMax.to(obj0,time,{x:-360, ease:Linear.easeNone, delay: 0.0});

    //스파인 추가
    var obj1 = UIFs.u_c_sp_result.obj;
    var tw1 = TweenMax.to(obj1,time,{x:-720, ease:Linear.easeNone, delay: 0.0});
    //스파인 추가

    if(mode === 'changebg') {
    }
    setTimeout(function (){
            cb();
    }, time*1000);
}
function tween_to_center(){
    var time = 0.5;
    var obj_0 = UIFs.g.obj;
    TweenMax.fromTo( obj_0, time, { x: 360+720, },
        {   x: +360,
            ease: Linear.easeNone,
            delay: 0.0
        }
    );

    //스파인추가
    var obj_1 = UIFs.u_c_sp_result.obj;
    obj_1.x = 720;
    var tw1 = TweenMax.to(obj_1,time,{x:0, ease:Linear.easeNone, delay: 0.0,
        onStart: function (){
            obj_1.x = 720;
        }
    });
    //스파인추가

    var obj_2 = UIFs.u_c_star_pre.obj;
    obj_2.x = 720;
    var tw2 = TweenMax.to(obj_2,time,{x:0, ease:Linear.easeNone, delay: 0.0,
        onStart: function (){
            obj_2.x = 720;
        },
        onComplete: function (){
            //drawingmode = true; //tocenter.트윈종료
            gamestate_old = gamestate;
            gamestate = STATE_GAME; //tocenter.트윈종료시
            MG.NM.start();
            isstart=true;
            time_ingame_play = 0;
            console.log('gamestate:',gamestate_old,'-->',gamestate);
       }
    });
}

var arr_tw = []; //트윈맥스저장소
var arr_to = []; //타임아웃저장소
function show_ui_clear_tween(_delay, _medal){
    var tw0, tw1, tw2, tw3;
    var to0 = setTimeout(function () {
        var obj1 = UIFs.g_grp_grid.obj;
        var time = 0.25;
        tw3 = TweenMax.to(obj1.scale, time,{x:0.75, y:0.75, ease:Linear.easeNone, delay: 0.0,
            onComplete:function (){
            }
        });
        // arr_tw.push(tw0);
        // arr_tw.push(tw1);
        // arr_tw.push(tw2);
        // arr_tw.push(tw3);

        if(_medal !== mretry) {
            //dalgona조각 사라지기<<
            var len = arr_bside.length;
            for (var i = 0; i < len; i++) {
                var obj1 = arr_bside[i];
                var time = 0.25;
                var tw = TweenMax.to(obj1, time, {
                    alpha: 0, ease: Linear.easeNone, delay: 0.5
                    // onComplete: function () { }
                });
                // arr_tw.push(tw);
            }
            var len = arr_oside.length;
            for (var i = 0; i < len; i++) {
                var obj1 = arr_oside[i];
                var tw = TweenMax.to(obj1, time, {
                    alpha: 0, ease: Linear.easeNone, delay: 0.5
                    // onComplete: function () { }
                });
                // arr_tw.push(tw);
            }
            //dalgona조각 사라지기>>
        }

    }, _delay*1000);
    //arr_to.push(to0);
}

function show_ui_clear(medal_color, _delay){
    var tw0, tw1, tw2, tw0s, tw1s, tw2s;
    var accum_time = 0;
    var to0, to1, to2, to3;

    UIFs.u_c_tx_success.obj.visible = false; //등장준비
    UIFs.u_c_tx_fail.obj.visible = false; //등장준비
    UIFs.u_c_tx_best.obj.visible = false; //등장준비
    UIFs.u_c_tx_cur.obj.visible = false; //등장준비

    UIFs.u_c_white_upper.obj.visible = false; //등장준비
    UIFs.u_c_white_lower.obj.visible = false; //등장준비
    UIFs.u_c_sp_result.obj.visible = false; //등장준비
    UIFs.u_c_im_fail.obj.visible = false; //등장준비

    UIFs.u_grp_clear.obj.visible = true;



    //--클리어메뉴 버튼 숨기기
    hideUI_btn_lower_clear();
    //--클리어메뉴 버튼 숨기기

    var _time = 0.5;
    if(medal_color === mgold || medal_color === msilver || medal_color === mbronze){
        var track = -1;
        if(medal_color === mgold){
            track = 3;
        }else if(medal_color === msilver){
            track = 2;
        }else if(medal_color === mbronze){
            track = 1;
        }else{
            console.log('err:  medal_color:',medal_color);
            track = 1;
        }

        to0 = setTimeout(function (){
            playSpine_loop(UIFs.u_c_sp_result.obj, track, 'UIFs.u_c_sp_result.obj', function(){
                console.log('--cb spine');
            });

            UIFs.u_c_white_upper.obj.visible = true;
            UIFs.u_c_white_lower.obj.visible = true;

            // arr_tw.push(tw0);
            // arr_tw.push(tw0s);
        }, _delay*1000);
        accum_time+=(_time + 0.8 + _delay);
    }else if(medal_color === mretry) {
        setTimeout(function (){
            playSpine_loop(UIFs.u_c_sp_result.obj, 0, 'UIFs.u_c_sp_result.obj', function(){
                console.log('--cb spine');
            });

            UIFs.u_c_white_upper.obj.visible = true;
            UIFs.u_c_white_lower.obj.visible = true;

            var boy = UIFs.u_c_im_fail.obj;
            UIFs.u_c_im_fail.obj.visible = true;
            TweenMax.fromTo( boy, 0.25, { x: 512 },
                {   x: boy.z_initx, ease: Linear.easeNone, delay: 0.0}
            );
            TweenMax.fromTo( boy, 0.25, { alpha: 0 },
                {   alpha: 1, ease: Linear.easeNone, delay: 0.0}
            );
        }, _delay*1000);
        accum_time+=(_time+ _delay);
    }//mretry

    if(medal_color === mgold || medal_color === msilver || medal_color === mbronze ){
        to1 = setTimeout(function (){
            particle2_Burst(3000,10);
            MG.PlayAudio('se_clear');

            UIFs.u_c_tx_success.obj.visible = true;
            UIFs.u_c_tx_fail.obj.visible = false;

            UIFs.u_c_tx_best.obj.visible = true;
            UIFs.u_c_tx_cur.obj.visible = true;

        }, accum_time*1000);

        to2 = setTimeout(function (){
            show_ui_btn_lower_clear();
        }, (accum_time+1.8)*1000);
    }else if(medal_color === mretry) {
        UIFs.u_c_bt_retry.obj.x = 0;
        to1 = setTimeout(function (){
            MG.PlayAudio('SE_Gameover'); //게임오버사운드
            UIFs.u_c_tx_success.obj.visible = false;
            UIFs.u_c_tx_fail.obj.visible = true;

            UIFs.u_c_tx_best.obj.visible = true;
            UIFs.u_c_tx_cur.obj.visible = true;

            show_ui_btn_lower_clear_except_next();//스파인에서 처리 했다가, 출력안되서 다시 여기로
        }, accum_time*1000);
    }//mretry
    //arr_to.push(to0);
    //arr_to.push(to1);
    //arr_to.push(to2);
}

function hide_ui_clear(){
    UIFs.u_grp_clear.obj.visible = false;
    UIFs.g_grp_grid.obj.scale.setTo(1);
}

function set_btns(){
    UIFs.u_bt_menu.obj.fnclick = function (){

        console.log('UIFs.u_c_bt_menu.obj.fnclick()  메뉴로 가기(클리어)');
        //콜백으로 이동
        //UIFs.u_bt_menu.obj.fnclick();
        cb_bt_menu();
    }; //u_bt_menu

    UIFs.s_bt_close.obj.fnclick = function (){//스크롤창닫기
        UIFs.s.obj.visible = false;
        MG.PlayAudio('se_click');
    };
    UIFs.u_bt_option.obj.fnclick = function (){//옵션창열기
        //UIFs.o.obj.visible = true;
        MG.PlayAudio('se_click');
    };
    // UIFs.o_bt_close.obj.fnclick = function (){//옵션창닫기
    //     UIFs.o.obj.visible = false;
    //     MG.PlayAudio('se_click');
    // };
    UIFs.s_bt_tab_a.obj.fnclick = function (){
        UIFs.s_grp_a.obj.visible = true;
        UIFs.s_grp_b.obj.visible = false;
        UIFs.s_bt_tab_a.obj.alpha = 1;
        UIFs.s_bt_tab_b.obj.alpha = 0.5;
        MG.PlayAudio('se_click');
    };
    UIFs.s_bt_tab_b.obj.fnclick = function (){
        UIFs.s_grp_a.obj.visible = false;
        UIFs.s_grp_b.obj.visible = true;
        UIFs.s_bt_tab_a.obj.alpha = 0.5;
        UIFs.s_bt_tab_b.obj.alpha = 1;
        MG.PlayAudio('se_click');
    };
    // UIFs.o_bt_bgm.obj.fnclick = function () {
    //     MGGAME.cbButtonSound_bgm();
    // };
    // UIFs.o_bt_sfx.obj.fnclick = function () {
    //     MGGAME.cbButtonSound_sfx();
    // };
    UIFs.s_bt_sfx.obj.fnclick = function () {
        MGGAME.cbButtonSound_sfx();
    };
    UIFs.g_post.obj.isfirst = true;
    UIFs.g_post.obj.events.onInputUp.add(function (){
        console.log(' UIFs.g_post.obj.events.onInputUp()', arguments[0].name);
        if(UIFs.g_post.obj.isfirst) {
            MG.PlayAudio();
            UIFs.g_post.obj.isfirst = false;
        }
        //UIFs.u_pre.obj.inputEnabled = false;
        //UIFs.u_pre.obj.visible = false;
        paint_mode = 'none';
    }, this);
    UIFs.g_post.obj.events.onInputDown.add(function (){
        console.log(' UIFs.g_post.obj.events.onInputDown()', arguments[0].name);
        paint_mode = 'begin'; //down
    }, this);

    UIFs.u_c_bt_menu.obj.fnclick = function () {
        console.log('UIFs.u_c_bt_menu.obj.fnclick()  메뉴로 가기(클리어)');
        cb_bt_menu();
    };

    UIFs.u_c_bt_next.obj.fnclick = function (){
        console.log('UIFs.u_c_bt_next.obj.fnclick()  다음 버튼(클리어)');
        //u_c_bt_next_obj_fnclick();
        if(isLastLevel === true){ //마지막레벨팝업//트윈연출이후
            console.log('Please wait for the stage update!');
            UIFs.u_grp_fin.obj.visible = true;
            var obj =  UIFs.u_g_f_dlg.obj;
            UIFs.u_g_f_dlg.obj.scale.setTo(0.5);
            onFadeinScale(obj, function (){

            });
        }else {
            console.log('6 before kData.cur_lv:', kData.cur_lv);
            kData.cur_lv = kData.cur_lv + 1;      //새로운 레벨
            console.log(' -->6 after kData.cur_lv:', kData.cur_lv);

            tween_to_left(u_c_bt_next_obj_fnclick, 'changebg');
        }

        //클릭시 바로 사라지게 하려고
        UIFs.u_c_tx_best.obj.visible = false;
        UIFs.u_c_tx_cur.obj.visible = false;
        //클릭시 바로 사라지게 하려고
    };

    UIFs.u_c_bt_retry.obj.fnclick = function (){
        console.log('UIFs.u_c_bt_retry.obj.fnclick()  다음 버튼(클리어)');
        cb_bt_next();
    };

    // UIFs.o_bt_exit.obj.fnclick = function (){
    //     console.log('--나가기 클릭--');
    //     MSSDK.gameExit(true);
    // };

    UIFs.u_g_bt_goto_scroll.obj.fnclick = function(){
        UIFs.u_grp_fin.obj.visible = false; //엔딩창메뉴클릭
        UIFs.u_bt_menu.obj.fnclick();

        //MSSDK.gameOver(); //게임스낵 //게임오버-->뒤로가기버튼으로 이동

    };//u_g_bt_goto_scroll

} //set_btns
function u_bt_retry_obj_fnclick(){
    console.log('u_bt_retry_obj_fnclick()');

    //show_ui_btn_lower(); //재시작버튼시 //빈함수
    show_ui_btn_upper(); //재시작버튼시
    hide_ui_clear(); //재시작버튼시
}

function u_c_bt_next_obj_fnclick(){
    hide_ui_clear(); //u_c_bt_next버튼시
    UIFs_u_bt_skip_obj_fnclick('next'); //넥스트버튼클릭시

    var lv_fnm = 'stage'+kData.cur_lv;
    var sid = kData.cur_lv;
    UIFs.g_grp_grid.obj.z_sid = sid;
    if(loaded[lv_fnm] === true) {      //u_c_bt_next_obj_fnclick시
        loadLevel(sid, 0);            //u_c_bt_next_obj_fnclick시 //기존로딩완료후
        reset_dalgona_grid();         //u_c_bt_next_obj_fnclick시 //기존로딩완료후
        tween_to_center();
    }else{
        part_loadLevel(lv_fnm, tween_to_center); //u_c_bt_next_obj_fnclick시 //부분로딩시작// reset_dalgona_grid가 포함된 상태
    }

    //tween_to_center();
}

function cb_bt_menu(){
    //UIFs.u_bt_menu.obj.fnclick = function (){

        MSSDK.gameOver(); //게임스낵 게임오버

        gamestate_old = gamestate;
        gamestate = STATE_TITLE;
        console.log('gamestate:',gamestate_old,'-->',gamestate);

        UIFs.s.obj.visible = true;
        MG.PlayAudio('se_click');
        refreshScroll_icons('u_bt_menu클릭시');

        hideUI_btn_upper(); //u_bt_menu.obj

        //------------------------------------강제스크롤-----<<u_bt_menu.obj
        var idx_gotolv = kData.cur_lv-1;
        if(idx_gotolv<0) idx_gotolv = idxLastLevel-1;

        var dt_row = 0;
        var calc_row_idx = Math.floor((idx_gotolv)/3);

        var grid1_y = (scr2_opt.padding + MG.s.scrlx_listview_a._listview.items[0].height);
        var grid_scroll_dist = 0;
        var is_grid_end = false;
        if(isstart){

            MG.NM.end({type:'home'});//메뉴로 나가기버튼
            isstart=false;
        }
        if(calc_row_idx>=4)
        {
            if(calc_row_idx>idxLastLevelRow) {        //99레벨 쉐도우상태일때
                //마지막 레벨일경우 calc_row_idx가 idxLastLevelRow+1이 된다
                //그래서 예외처리
                calc_row_idx = idxLastLevelRow;
            }

            if( calc_row_idx === idxLastLevelRow
                || calc_row_idx === idxLastLevelRow-1
                || calc_row_idx === idxLastLevelRow-2
            ){
                //마지막 하단 3줄까지 예외처리(스크롤 고정시킴)
                //dt_row를 4로 만들려고(즉, 강제로 4줄 밑으로 스크롤 시킨다)
                dt_row = idxLastLevelRow - 5;
                is_grid_end = true;
            } else {
                //일반적인 강제스크롤
                dt_row = calc_row_idx - 3;
            }

            if(is_grid_end === true){
                grid_scroll_dist = -1070;
            }else{
                grid_scroll_dist = -1 * grid1_y * dt_row;
            }
            console.log('calc_row_idx:', calc_row_idx, 'dt_row:',dt_row);
            MG.s.scrlx_listview_a._listview.setPosition(grid_scroll_dist); //스크롤.스크롤강제 //버튼생성시
        }
        //------------------------------------강제스크롤----->>
    //}; //u_bt_menu
}

function cb_bt_next(){
    //u_c_bt_retry_obj_fnclick();
    tween_to_left(u_c_bt_retry_obj_fnclick, '');

    //클릭시 바로 사라지게 하려고
    UIFs.u_c_tx_best.obj.visible = false;
    UIFs.u_c_tx_cur.obj.visible = false;
    //클릭시 바로 사라지게 하려고
    if(UIFs.u_c_im_fail.obj.visible === true) {
        var boy = UIFs.u_c_im_fail.obj;
        TweenMax.fromTo(boy, 0.25, {alpha: 1},
            {alpha: 0, ease: Linear.easeNone, delay: 0.0}
        );
    }
}

function u_c_bt_retry_obj_fnclick(){
    hide_ui_clear(); //u_c_bt_retry버튼시

    //픽셀린트주석//UIFs.u_bt_retry.obj.fnclick('clear');
    UIFs_u_bt_retry_obj_fnclick('clear');

    //show_ui_btn_lower(); //클리어시 retry버튼 //빈함수

    var lv_fnm = 'stage'+kData.cur_lv;
    var sid = kData.cur_lv;
    UIFs.g_grp_grid.obj.z_sid = sid;
    if(loaded[lv_fnm] === true) {          //u_c_bt_retry_obj_fnclick시 //기존로딩완료후
        loadLevel(sid, 0);                //u_c_bt_retry_obj_fnclick시 //기존로딩완료후
        reset_dalgona_grid();             //u_c_bt_retry_obj_fnclick시 //기존로딩완료후
        tween_to_center();
    }else{
        part_loadLevel(lv_fnm, tween_to_center);  //u_c_bt_retry_obj_fnclick시 //부분로딩시작// reset_dalgona_grid가 포함된 상태
    }

    //tween_to_center();
}

function set_grids_with_input(node_name, fndn, fnov, fnup){
    console.log( 'set_grids_input()', node_name );
    var node = UIFs[node_name].obj;
    var len = node.children.length;
    //var log = '';
    for(var i=0; i<len; i++){
        var g = node.children[i];
        //log += g.name+', ';
        g.inputEnabled = true;
        g.input.pixelPerfectClick = true;
        g.input.pixelPerfectOver = true;
        g.events.onInputDown.add(fndn, this);
        g.events.onInputOver.add(fnov, this);
        g.events.onInputUp.add(fnup, this);
    }
    //console.log(log);
}


function set_dot_tint(spr, r255, g255, b255){
    //console.log("before warn set_dot_tint  ", r255, g255, b255);
    var _r = r255.toString(16); //0~ff
    var _g = g255.toString(16); //0~ff
    var _b = b255.toString(16); //0~ff
    if (_r.length==1) _r = '0' + _r;
    if (_g.length==1) _g = '0' + _g;
    if (_b.length==1) _b = '0' + _b;
    var c = '0x' + _r + _g + _b;
    //console.log("after warn set_dot_tint  ", c);
    spr.tint = c;
}
function convert_Float2FF(r,g,b,pre) {
    var r255 = float2int(r * 255);   //0~255
    var g255 = float2int(g * 255);   //0~255
    var b255 = float2int(b * 255);   //0~255
    var _r = r255.toString(16); //0~ff
    var _g = g255.toString(16); //0~ff
    var _b = b255.toString(16); //0~ff
    if (_r.length==1) _r = '0' + _r;
    if (_g.length==1) _g = '0' + _g;
    if (_b.length==1) _b = '0' + _b;
    if(!pre) pre = '0x';
    var c = pre + _r + _g + _b;
    return c;
}

function createGradientBG(color_begin, color_end) {
    var myBitmap = MG.game.add.bitmapData(9, 16);
    var grd = myBitmap.context.createLinearGradient(0, 0, 0, 16);
    grd.addColorStop(0, color_begin); //"#FFFFFF"
    grd.addColorStop(16/16, color_end); //"#0a68b0"
    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0, 0, 9, 16);
    var spr_grd = MG.game.add.sprite(0, 0, myBitmap);
    spr_grd.scale.setTo(80, 80);
    spr_grd.anchor.setTo(0.5, 0.5);
    return spr_grd;
}
//사용예:
//if (UIFs.bg_img.obj) UIFs.bg_img.obj.destroy();
//var s_begin = convert_Float2FF(1,1,1, '#');
//var s_end = convert_Float2FF(0.8,1,1,'#');
//var grdspr = createGradientBG(s_begin, s_end);
//UIFs.bg_img.obj = grdspr;
//UIFs.b.obj.addChild(UIFs.bg_img.obj);

var isFirstInitSvPos = true;

function create_list_view(list_view_par, list_view_name, slotmaxcnt){
    //---------------리스트뷰생성----------<<
    scr2_opt = {
        autocull: false, //디폴트는 true, 화면밖으로 나가기전에 사라져서 비활성시킴
        bouncing: true,
        snapping: false,

        searchForClicks: true,
        direction: 'y',
        overflow: 100,//default:100 //boxW만큼 스피링이동
        momentum: true,
        padding: 20, //between
        offTL:20, //왼쪽여백
        offBR:20,
        blockSize:217,
        viewMask:false //세로만
    };
    slot2_rect = { //마스킹 영역
        rectx:40,
        recty:230, //슬롯배치왼쪽상단
        rectw:720-40-40,
        recth:960, //슬롯마스킹영역크기
    };
    //페이저 스크롤뷰 //페이저 리스트뷰
    //MG.s.listview_a
    MG.s[list_view_name] = new PhaserListView.ListView(
        MG.game,
        list_view_par,
        new Phaser.Rectangle( //마스킹
            slot2_rect.rectx,
            slot2_rect.recty,
            slot2_rect.rectw,
            slot2_rect.recth
        ), scr2_opt
    );
    MG.s[list_view_name].grp.name = 'phaserlistview_'+list_view_name+'.grp';
    MG.s[list_view_name].slot_list = []; //슬롯+버튼3만 저장
    MG.s[list_view_name].g_slotmaxcnt = slotmaxcnt;
    MG.s[list_view_name].grp_all_list = []; //grp+슬롯+버튼3저장

    UIFs.s_grp_a.obj.x = -355; //-360에도 이동

    //-------------------------------------------------------cbBtn-----------<<
    list_view_par.cbBtn = function (btn){ //스크롤.클릭.콜백
        console.log('MG.s.s_grp_*.cbBtn()');
        if(typeof this.clickedbtn === 'undefined'){
            console.log(' warn: .clickedbtn == undefined');
            return;
        }else if(typeof this.clickedbtn.name === 'undefined') {
            console.log(' warn: .clickedbtn.name == undefined');
            return;
        }
        console.log(
            ' .clickedbtn.name:', this.clickedbtn.name, //'listview_a_icon_0_0'
            '.name:', this.name                        //'s_grp_a'
        );

        //this는 스프라이트,
        // 아이콘3개중 1개,
        // 예) 이름 'listview_a_icon_15_0'
        // 최종 오픈레벨 아이콘은 알파0.5, tint블랙 이므로, 유지되게 예외처리한다.
        //if (this.clickedbtn.alpha > 0.49 && this.clickedbtn.alpha < 0.51) {
            //console.log('');
        //} else {
            this.clickedbtn.tint = this.clickedbtn.baseTint;

            var _thisbtn = this.clickedbtn;
            var len = _thisbtn.children.length;
            for(var i = 0; i<len; i++){
                if(_thisbtn.children[i].tint) _thisbtn.children[i].tint = _thisbtn.baseTint;
            }

        //}

        if(isdetectDrag === true) {
            console.log('드래그상태에서 클릭함!!1');
            return;
        }

        gamestate_old = gamestate;
        gamestate = STATE_GAME;//스크롤.클릭.콜백시
        MG.NM.start();
        isstart=true;
        time_ingame_play = 0;
        console.log('gamestate:',gamestate_old,'-->',gamestate);

        //인게임ui 나오기
        UIFs.u.obj.visible = true;

        UIFs.g_grp_grid.obj.visible = true;
        UIFs.g_grp_grid.obj.scale.setTo(1);

        //인게임 도움말 나오기
        if(this.clickedbtn.z_idx === 0) {
            UIFs.u_tx_help.obj.visible = true;
            var obj = UIFs.u_tx_help.obj;
            var tween = TweenMax.to(
                obj,
                0.5,
                {
                    alpha:0,
                    ease: Linear.easeNone,
                    delay: 1.5
                }
            );
        }else{
            UIFs.u_tx_help.obj.visible = false;
        }

        //if(kData.cur_lv>=1 && kData.cur_lv<=9999) stage_mode = 0;
        //if(kData.cur_lv>=10001 && kData.cur_lv<=19999) stage_mode = 1;

        console.log(this.name,  this.clickedbtn.z_idx);
        var id = -1;
        var sid = '';
        var subid = -1;

        var base_idx = 0;//scrollpage_idx * 99; //스크롤페이지당 99개씩

        id = this.clickedbtn.z_idx + base_idx;
        sid = (id+1).toString();

        UIFs.u_bt_sp_left.obj.visible = false;
        UIFs.u_bt_sp_right.obj.visible = false;

        UIFs.u_tx_lv.obj.text = '';
        UIFs.u_tx_prg.obj.text = '';

        console.log('1 before kData.cur_lv:', kData.cur_lv);
        kData.cur_lv = id+1;
        console.log(' -->1 after kData.cur_lv:', kData.cur_lv);


        console.log('cbBtn---JSON.stringify(kData):', JSON.stringify(kData) );

        //show_ui_btn_lower(); //스크롤.cbBtn시 //빈함수
        show_ui_btn_upper(); //스크롤.cbBtn시 //빈함수
        hide_ui_clear(); //스크롤.cbBtn시


        var lv_fnm = 'stage'+kData.cur_lv;
        UIFs.g_grp_grid.obj.z_sid = sid;

        if(loaded[lv_fnm] === true) {       //cbBtn //기존로딩완료후
            loadLevel(sid, 0);              //스크롤.cbBtn시 //기존로딩완료후
            reset_dalgona_grid();           //cbBtn //기존로딩완료후
        }else{
            part_loadLevel(lv_fnm);          //cbBtn //부분로딩시작// reset_dalgona_grid가 포함된 상태
        }


        //픽셀린트주석//backupGridAtt('when cbBtn'); //스크롤.cbBtn시
        MG.NM.LocalSave(); //스크롤.cbBtn시

        UIFs.s.obj.visible = false;
        MG.PlayAudio('se_click');
        /*if(time_ad_minimum<0) {
            Define.iADCnt = 0; //cbbtn시
        }*/

        //계층구조:
        //s_grp_a
        // +0:MG.s.listview_a.grp
        //  +0:grp_scr_0
        //   +0:listview_a_slot_0
        //    +0:listview_a_icon_0_0
        //    +1:listview_a_icon_0_1
        //    +2:listview_a_icon_0_2
        //   +1:text '+'
        //   +2:text '+'
        //   +3:text '+'
        //   +4:text "listview_a_i:0"
        //  +1:grp_scr_1
        //  +2:...

    }.bind(list_view_par);
    //-------------------------------------------------------cbBtn----------->>

    //전체 슬롯 미리 생성한다------------------------------------------------------
    //버튼아이콘3개를 포함하는 슬롯1개씩 총 50개 생성한다.
    //MG.s[list_view_name]에 저장한다.
    //슬롯을 미리 생성해서, 페이저리스트뷰.slot_list배열에 저장해둔다.(슬롯+버튼3)
    //기존 방식 createSlotAll_btn3(list_view_name, list_view_par); //슬롯+버튼3 저장
    createSlotAll_btn3_emptybmd(list_view_name, list_view_par); //슬롯+버튼3 저장//--//스크롤바 끄려면 주석처리

    //리스트뷰에 슬롯을 연결(등록)한다.
    //페이저리스트뷰.grp_all_list배열에 저장해둔다.(grp+슬롯+버튼3)
    createGrpSlotAll(list_view_name); //grp+슬롯+버튼3 저장//--//스크롤바 끄려면 주석처리

    //리스트생성완료후 //MG.s.scrlx_listview_a
    //예전 리모컨대응용 스크롤바인데,
    MG.s['scrlx_'+list_view_name] = new scrlx('scrlx_'+list_view_name,  MG.s[list_view_name], slotmaxcnt); //스크롤.생성

    //개별로 적용되는 테스트 이므로  true로 하지 말것!!!
    // if(false) { //-----스크롤테스트, 리스트테스트 코드 모음-----<<
    //     //더미스프라이트--테스트
    //     //var par = UIFs.grp_ch.obj;
    //     var par = UIFs.s_grp_a.obj;
    //     var o1 = { name:'gpbox1', type:'box', pgame:MG.game, xpos:0, ypos:0, w:20, h:20, anchorx:0.5, anchory:0.5, color: 0x00ffff, alpha:0.75};
    //     var img = createSimpleSpriteByGrahpic(o1);
    //     par.addChild(img);
    //
    //     //슬롯1개 제거하기--테스트
    //     var remove_slot1 = MG.s[list_view_name].remove(MG.s.listView2.items[MG.s.listView2.items.length-1]);
    //     //MG.s.listView2.arr_item_remain.push(remove_slot1); //테스트코드
    //     //console.log('아이템 추가했습니다.', MG.s.listView2.items, MG.s.listView2.arr_item_remain);
    //
    //     //슬롯1개 추가하기--테스트
    //     //var add_slot1 = MG.s.listView2.arr_item_remain.shift(); //테스트코드
    //     //if(add_slot1!==undefined) {
    //     //    MG.s.listView2.add(add_slot1); //슬롯1 추가시-테스트코드
    //     // }else{
    //     //    console.log('arr_item_remain[]에서 꺼낼 것이 없습니다.');
    //     //}
    //
    //     //x축 순간 스크롤시키기--테스트
    //     MG.s[list_view_name].setPosition(-2*(slotszw + scr2_opt.padding));
    //
    //     //MG.s.scrlx_listview_a._listview.setPosition(-161*96); //픽셀린트 스크롤바
    //
    //     //x축 순간 예전위치로 스크롤시키기--테스트
    //     var oldpos = MG.s[list_view_name].position;
    //     MG.s[list_view_name].setPosition(oldpos);
    //
    //     //마스크영역 크기기 조절
    //     MG.s[list_view_name].setSize({x: 0, y: 350, width: 1280, height: 117, type: 22});
    //
    //     //var co = cloneObject( MG.s.listView2.o);
    //     //MG.s.listView2.o.padding = 100;
    //     //MG.s.listView2.reset(); //에러가 발생함, 스크롤이 잘 되는
    // }//-----스크롤테스트, 리스트테스트 코드 모음-----
    //개별로 적용되는 테스트 이므로  true로 하지 말것!!!

    //---------------리스트뷰생성---------->>
}//create_list_view

function reset_dalgona_grid(){ //레벨로드이후에 호출할것
    console.log('레벨 reset_dalgona_grid()');

    //-------------dalgona reset------------------
    arr_center = [];
    arr_bside = [];
    arr_oside = [];
    isdn = false;
    var len = UIFs.g_grp_grid.obj.children.length;
    for(var i=0;i<len;i++){
        var ob = UIFs.g_grp_grid.obj.children[i];
        ob.alpha = 1;
        ob.scale.setTo(1);
        ob.z_checked = false;                        //초기화
        if( ob.name.indexOf('_o_')>-1){
            ob.visible = true;
            arr_oside.push(ob);
        }else if(ob.name.indexOf('_c_')>-1){
            ob.visible = true;
            arr_center.push(ob);
        }else if(ob.name.indexOf('_b_')>-1){
            ob.visible = true;
            arr_bside.push(ob);
        }else{
            ob.visible = false;
        }
    }
    //-------------dalgona reset------------------

    //--시간 초기화--
    t_gold =  tb_stars[kData.cur_lv].gold;
    t_silver =  tb_stars[kData.cur_lv].silver;
    t_bronze = tb_stars[kData.cur_lv].bronze;

    time_ingame_play_max = t_bronze;
    UIFs.u_tx_prg.obj.text = t_bronze;
    time_ingame_old = -99;
    time_ingame_play = 0;
    //--시간 초기화--

    //--프로그래스바 초기화--
    UIFs.u_prg.obj.onUpdatePr(1);     //(maxtime-time_ingame_play)/maxtime
    //--프로그래스바 초기화--

    //--프로그래스바상단 별위치 리셋--
    //프로그래바위치는 왼쪽 위로 변경되므로
    //보정해줘야한다.
    var prw = UIFs.u_prg.obj.width;
    //   24  =    -124          + (296 * 0.5)
    var offx = UIFs.u_prg.obj.x + (prw * 0.5);
    //  124  =   -(148)     + 24;
    var begin = -(prw * 0.5)+offx;

    var bias_gold = t_gold/t_bronze;
    var bias_silver = t_silver/t_bronze;
    var dist_gold = (1.0 - bias_gold) * prw;
    var dist_silver = (1.0 - bias_silver) * prw;

    UIFs.u_prg_star1.obj.x = begin + dist_gold;
    UIFs.u_prg_star2.obj.x =  begin + dist_silver;
    //--프로그래스바상단 별위치 리셋--

    //--프로그래스바상단 별 리셋--
    console.log('update medal textrue --> gold');
    cur_medal = mgold; //리셋//프로그래스바 메달 업데이트용
    UIFs.u_prg_star1.obj.loadTexture('ui_dalgona', 'gauge_star_normal.png');
    UIFs.u_prg_star2.obj.loadTexture('ui_dalgona', 'gauge_star_normal.png');
    //--프로그래스바상단 별 리셋--

    if(kData.sv_record[kData.cur_lv]<0) {
        UIFs.u_tx_best_v.obj.text = '--:--.--';
    }else if(kData.sv_record[kData.cur_lv] == undefined) {
        UIFs.u_tx_best_v.obj.text = '--:--.--';
    }else {
        UIFs.u_tx_best_v.obj.text = kData.sv_record[kData.cur_lv];
    }
    //UIFs.u_c_tx_best.obj.text = '';
    //UIFs.u_c_tx_cur.obj.text = '';

}

function isgameover_dalgona_center(){
    console.log('isgameover_dalgona_center()');
    var len = arr_center.length;
    for(var i=0; i<len; i++){
        if(arr_center[i].z_checked === true){
            console.log('arr_center[',i,'].z_checked == true');
            return true;
        }
    }
    if(len===0) {
        console.log('warn: arr_center[]속성이 없습니다, true를 리턴합니다.');
    }
    return false;
}
function isclear_dalgona_side(){
    console.log('isclear_dalgona_side()');
    var len = arr_bside.length;
    var cnt = 0;
    for(var i=0; i<len; i++){
        cnt +=1;
        if(arr_bside[i].z_checked === false){
            console.log('arr_bside[',i,'].z_checked == false');
            return false;
        }
    }
    if(len===0) {
        console.log('warn: arr_bside[]속성이 없습니다, true를 리턴합니다.');
    }
    return true;
}
function isclear_dalgona_out(){
    console.log('isclear_dalgona_out()');
    var len = arr_oside.length;
    for(var i=0; i<len; i++){
        if(arr_oside[i].z_checked === false){
            console.log('arr_oside[',i,'].z_checked == false');
            return false;
        }
    }
    if(len===0) {
        console.log('warn: arr_oside[]속성이 없습니다, true를 리턴합니다.');
    }
    return true;
}

function createSlotAll_btn3_emptybmd( _list_view_name, _list_view_par) { //슬롯생성함수
    console.log('createSlotAll_btn3()',  _list_view_name, _list_view_par.name);
    var _slotcnt = MG.s[_list_view_name].g_slotmaxcnt;
    var lvidx = 0;
    var lvidx_b = 0;
    var base_idx = 0; //scrollpage_idx * 99; //스크롤페이지당 99개씩
    for (var i = 0; i < _slotcnt; i++) {
        //슬롯배경1만들기
        var _slotnm = _list_view_name + '_slot_' + i;
        var o1 = {                           //스크롤.생성//슬롯
            name: _slotnm,
            type: 'box',
            pgame: MG.game,
            xpos: 0,
            ypos: 0,
            w: 635,
            h: 181,
            anchorx: 0.5,
            anchory: 0.5,
            color: 0x505050,
            alpha: 0.0
        };
        var slot_img = createSimpleSpriteByGrahpic(o1);
        _list_view_par.addChild(slot_img);
        //슬롯배열에 저장 //리스트뷰안에 배열속에저장
        MG.s[_list_view_name].slot_list.push(slot_img);

        //아이콘3개 추가하기
        var iconxcnt = 3;
        for (var j = 0; j < iconxcnt; j++) {
            lvidx_b = lvidx + base_idx;

            var name =  _list_view_name + '_icon_' + i + '_' + j;
            //                         왼쪽-----------가운데-----------오른쪽
            //                    왼쪽끝 + 옵셋                     오른쪽끝 + 옵셋
            var xpos = j === 0 ? -(635 / 2) + 130 : j === 1 ? 0 : (635 / 2) - 130;
            var ypos = 0;
            //var btn = MG.game.add.sprite(xpos, ypos, 's_icon.png');
            var btn = MG.game.add.sprite(xpos, ypos,  'ui_dalgona', 'base_00.png');
            btn.name = name;
            btn.anchor.setTo(0.5);
            slot_img.addChild(btn);

            var idx = (i*iconxcnt) + j;
            btn.z_idx = idx; //버튼 생성시(아이콘)

            spr_normal.push(btn);

            //var dalgona1 = MG.game.add.sprite(btn.x, btn.y, "s_icon.png");
            var dalgona1 = MG.game.add.sprite(0, 0, 'ui_dalgona', "thumb_"+((i*3)+j+1)+".png");
            dalgona1.name = 'dalgona1_' + i + '_' + j;
            dalgona1.anchor.setTo(0.5, 0.5);
            //btn.parent.addChild(dalgona1);
            btn.addChild(dalgona1);
            btn.z_dalgona1 = dalgona1;

            //--아이콘별3개 생성하기---<<
            var star1 = MG.game.add.sprite(-40, -72, 'ui_dalgona', "star_00.png");
            var star2 = MG.game.add.sprite(0, -72, 'ui_dalgona', "star_00.png");
            var star3 = MG.game.add.sprite(40, -72, 'ui_dalgona', "star_00.png");
            star1.name = 'star1_' + i + '_' + j;
            star2.name = 'star2_' + i + '_' + j;
            star3.name = 'star3_' + i + '_' + j;
            star1.anchor.setTo(0.5, 0.5);
            star2.anchor.setTo(0.5, 0.5);
            star3.anchor.setTo(0.5, 0.5);
             btn.addChild(star1);
            btn.addChild(star2);
            btn.addChild(star3);
            btn.z_star1 = star1;
            btn.z_star2 = star2;
            btn.z_star3 = star3;
            //--아이콘별3개 생성하기--->>

            var perfect1 = MG.game.add.sprite(32, 22, 'ui_dalgona', "perfect.png");
            perfect1.anchor.setTo(0.5, 0.5);
            perfect1.name = 'perfect_' + i + '_' + j;
            //btn.parent.addChild(perfect1);
            btn.addChild(perfect1);
            btn.z_perfect1 = perfect1;

            var disable1 = MG.game.add.sprite(0, 0, 'ui_dalgona', "disable.png");
            disable1.anchor.setTo(0.5, 0.5);
            disable1.name = 'disable_' + i + '_' + j;
            btn.addChild(disable1);
            btn.z_disable1 = disable1;


            //----디버깅용//아이콘에 이름붙이기//레벨표시//아이콘레벨표시
            // var phob = createTxt({
            //     name: (idx+1),
            //     str: (idx+1),
            //     x: 50,
            //     y: 50,
            //     anchorx: 0.5,
            //     anchory: 0.5,
            //     style:UsedTypes.tx_ver
            // });
            // btn.addChild(phob);
            // btn.z_tx = phob;
            //----디버깅용//아이콘에 이름붙이기

            btn.inputEnabled = true;
            btn.baseTint = btn.tint;
            btn.z_isLock = false;

            btn.events.onInputDown.add(function () { //스크롤.클릭.다운//아이콘
                console.log('onInputDown(),   name:', this.name, '  z_idx:', this.z_idx);

                Define.focus_first = 2;

                // var clickedspr = arguments[0]; //스프라이트
                // var clickedpos = [arguments[1].clientX, arguments[1].clientY];//클릭위치
                // var clicked_isrange = arguments[2];//클릭범위안
                if(this.z_isLock === true){ //console.log('');//잠긴 상태일때 예외처리
                }else {
                    this.tint = 0x808080;

                    var len = this.children.length;
                    for(var i = 0; i<len; i++){
                        if(this.children[i].tint) this.children[i].tint = 0x808080;;
                    }

                    var slot1 = this.parent;
                    var grp1 = slot1.parent;
                    var scrl = grp1.parent;
                    var scrl_par = scrl.parent;
                    scrl_par.clickedbtn = this;
                    grp1.onInputUpCallBack = scrl_par.cbBtn; //스크롤콜백등록-버튼업시 틴트 원상복구
                    console.log(' dn cb저장, grp1.name:', grp1.name);
                }
            }, btn);
            btn.events.onInputUp.add(function () { //스크롤.클릭.업//아이콘
                console.log('onInputUp()', this.name);
                if(this.z_isLock === true){ //잠긴 상태일때 예외처리
                    //console.log('');
                }else {
                    this.tint = this.baseTint;
                    var len = this.children.length;
                    for(var i = 0; i<len; i++){
                        if(this.children[i].tint) this.children[i].tint = this.baseTint;
                    }
                }
                var slot1 = this.parent;
                var grp1 = slot1.parent;
                var scrl = grp1.parent;
                var scrl_par = scrl.parent;
                scrl_par.clickedbtn = undefined;
            }, btn);

            // btn.events.onInputOut.add(function () { }, btn);    //리스트뷰에서는 여기로 호출이 안됨!!

            btn.onInputUpCallBack = function () {// 버튼의 경우 down시 색상이 변하게 설정되어 있는데 up시 이벤트가 발생하지 않았을때 다시 원상태의 색상으로 바꾸기 위해 설정한다.
                console.log('onInputUpCallBack()', this.name);
                if(this.z_isLock === true){ //console.log(''); //잠긴 상태일때 예외처리
                }else {
                    this.tint = this.baseTint;

                    var len = this.children.length;
                    for(var i = 0; i<len; i++){
                        if(this.children[i].tint) this.children[i].tint = this.baseTint;
                    }

                }

            }.bind(btn);
            //--버튼생성--
            //console.log('001 lvidx:', lvidx);
            lvidx+=1;
        } //for(var j=0; j<3; j++)

    } //for (var i = 0; i < _slotmaxcnt; i++)
}


function createGrpSlotAll(_list_view_name){ //grp+슬롯생성함수
    var _slotcnt = MG.s[_list_view_name].g_slotmaxcnt;
    for (var i = 0; i < _slotcnt; i++) {
        var pv = MG.game.add.group(); //스크롤2
        pv.name = 'grp_scr_'+i;
        //슬롯배열에서 1개가져오기
        var slot1 =  MG.s[_list_view_name].slot_list[i]; //var slot1 = g_scrolls[i];
        var w_off = slot1.width/2;
        var h_off = slot1.height/2;
        slot1.position.setTo(w_off,h_off);
        pv.addChild(slot1);

        //슬롯1 디버깅용<< ----------- 아이템슬롯십자가표시
        if(false) {
            var tx_str_pivot = '+';
            var tx_pivot = MG.game.add.text(0, 0, tx_str_pivot, {font: "32px Arial", fill: "#00FF00"});
            tx_pivot.anchor.setTo(0.5);
            tx_pivot.position.setTo(0, 3);
            pv.addChild(tx_pivot);

            var tx_str_center = '+';
            var tx_center = MG.game.add.text(0, 0, tx_str_center, {font: "32px Arial", fill: "#00FFFF"});
            tx_center.anchor.setTo(0.5);
            tx_center.position.setTo((slot1.width / 2) + 0, (slot1.height / 2) + 3);
            pv.addChild(tx_center);

            var tx_str_end = '+';
            var tx_end = MG.game.add.text(0, 0, tx_str_end, {font: "32px Arial", fill: "#FFFF00"});
            tx_end.anchor.setTo(0.5);
            tx_end.position.setTo(slot1.width + 0, slot1.height + 3);
            pv.addChild(tx_end);

            var tx_str = _list_view_name+'~'+'i:' + i.toString();
            var tx = MG.game.add.text(0, 0, tx_str, {font: "32px Arial", fill: "#0000FF"});
            tx.anchor.setTo(0.5);
            tx.x = (slot1.width / 2) + 0;
            tx.y = (slot1.height / 2) + 20;
            pv.addChild(tx);
        }
        //슬롯1 디버깅용>> ----------- 아이템슬롯십자가표시

        MG.s[_list_view_name].grp_all_list.push(pv);
        MG.s[_list_view_name].add(pv); //리스트뷰생성시 슬롯추가
    }
}

function init_setting_level(){
    var glen = UIFs.g_grp_grid.obj.children.length;
    for (var i = 0; i < glen; i++) {
        UIFs.g_grp_grid.obj.children[i].z_idx = i;
    }
}

var loadlevelcnt = 0;

function loadLevel(_sid, _subid){
    console.log('레벨 loadLevel()', _sid, _subid);

    if(loadlevelcnt===0){
        loadlevelcnt+=1
    }else {
        console.log('PopconGame.Sdk.log("2");');
        if (typeof PopconGame !== 'undefined') PopconGame.Sdk.log("2");
    }

    //픽셀린트주석//setPosCursor(0, 'init');
    sel_paint_idx = 0; //loadlevel시

    UIFs.u_tx_lv.obj.text = _sid;


    var _lvnm = 'lv'+ _sid;
    var lvdata = getLeveDataByName(_lvnm);
    var len_lvdata = lvdata.length;
    for(var i = 0; i<lvdata; i++){

    }
    var glen = UIFs.g_grp_grid.obj.children.length;
    for (var i = 0; i < glen; i++) {
        if(i<len_lvdata){
            //텍스쳐교체
            if(lvdata[i].info.pack) {
                UIFs.g_grp_grid.obj.children[i].loadTexture( lvdata[i].info.pack, lvdata[i].info.sprite );
            }else{
                UIFs.g_grp_grid.obj.children[i].loadTexture( lvdata[i].info.sprite );
            }
            //좌표,색,이름 업데이트
            UIFs.g_grp_grid.obj.children[i].position.setTo( lvdata[i].info.pos.x, lvdata[i].info.pos.y );
            //UIFs.g_grp_grid.obj.children[i].scale.setTo( lvdata[i].info.scale.x, lvdata[i].info.scale.y );
            //UIFs.g_grp_grid.obj.children[i].alpha = lvdata[i].info.alpha; // --> reset_dalgona_grid 에서 처리
            UIFs.g_grp_grid.obj.children[i].tint =  lvdata[i].info.color;
            UIFs.g_grp_grid.obj.children[i].name =  lvdata[i].info.name;
            //UIFs.g_grp_grid.obj.children[i].visible = true; // --> reset_dalgona_grid 에서 처리
            UIFs.g_grp_grid.obj.children[i].visible = true;
        }else{
            //숨기기
            //UIFs.g_grp_grid.obj.children[i].visible = false; // --> reset_dalgona_grid 에서 처리
            UIFs.g_grp_grid.obj.children[i].name =  'im_'+ UIFs.g_grp_grid.obj.children[i].z_idx;
            UIFs.g_grp_grid.obj.children[i].visible = false;
        }

        //픽셀린트주석//UIFs.g_grp_hint.obj.children[i].z_idx =  undefined; //grid세팅시
    }
    console.log('_lvnm:', _lvnm, '  _len:', _len);

}
function part_loadLevel(lv_fnm, cb){
    //부분로딩1<<
    var load_obj = {'atlas':[]};
    load_obj.atlas.push(
        [
            lv_fnm,
            'assets/atlas/'+lv_fnm+'.png?v='+Define.IMG_VER,
            'assets/atlas/'+lv_fnm+'.json?v='+Define.IMG_VER,
            Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY
        ]
    );

    //console.log('0:', lv_fnm,);
    console.log('1:','assets/atlas/'+lv_fnm+'.png?v='+Define.IMG_VER);
    console.log('2:', 'assets/atlas/'+lv_fnm+'.json?v='+Define.IMG_VER);

    var loader = MG.game.load;

    loader.onLoadStart.removeAll();
    loader.onFileComplete.removeAll();
    loader.onLoadComplete.removeAll();
    loader.onFileError.removeAll();

    loader.atlas(
        lv_fnm,
        'assets/atlas/'+lv_fnm+'.png?v='+Define.IMG_VER,
        'assets/atlas/'+lv_fnm+'.json?v='+Define.IMG_VER,
        Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY
    );
    loader.onLoadComplete.add(function(){
        console.log('part onLoadComplete');
        var sid = UIFs.g_grp_grid.obj.z_sid;
        //var subid = UIFs.g_grp_grid.obj.z_subid;
        loadLevel(sid, 0);  //스크롤.cbBtn시 //부분로딩직후
        reset_dalgona_grid();//cbBtn //부분로딩후
        var lv_fnm = 'stage'+sid;
        loaded[lv_fnm] = true; //부분로딩후
        if(cb) cb();
        loader.onLoadComplete.removeAll();
    });

    var glen = UIFs.g_grp_grid.obj.children.length;
    for (var i = 0; i < glen; i++) {
        UIFs.g_grp_grid.obj.children[i].x = -1000;
    }

    loader.onLoadStart.add(function(){
        console.log('part onLoadStart');
    });
    loader.start();
    //부분로딩1
}


var tint_ref = 0;
function refreshScroll_icons(comment){ //스크롤.리플레쉬
    console.log('refreshScroll_icons  ', comment);
    tint_ref +=1;
    var _slotcnt = 0;
    //if(stage_mode===0) {
        _slotcnt = MG.s['listview_a'].g_slotmaxcnt;
    // }
    // if(stage_mode===1) {
    //     _slotcnt = MG.s['listview_b'].g_slotmaxcnt;
    // }
    var base_idx = 0; //scrollpage_idx * 99; //스크롤페이지당 99개씩

    var lvidx = 0;
    var ilvnm = 1; //밑에서 다시 선언
    var btns = spr_normal;
    var lvidx_b = 0; //lvidx + base_idx;
    for (var i = 0; i < _slotcnt; i++) {
        //슬롯배경1만들기
         //아이콘3개 추가하기
        var iconxcnt = 3;
        for (var j = 0; j < iconxcnt; j++) {

            //lvidx 0 일때, spr_normal[0] 은 레벨1 아이콘
            var btn = btns[lvidx];

            ilvnm = (lvidx+1)+base_idx;
            lvidx_b = lvidx + base_idx;
            var s3 = kData.sv_star[ilvnm];
            if(btn.z_star1) {

                if (s3 === 0) {
                    btn.z_star1.loadTexture('ui_dalgona', "star_00.png"); //staroff
                    btn.z_star1.loadTexture('ui_dalgona', "star_00.png"); //staroff
                    btn.z_star1.loadTexture('ui_dalgona', "star_00.png"); //staroff
                } else if (s3 === 1) {
                    //btn.z_star1.visible = true;
                    btn.z_star1.loadTexture('ui_dalgona', "star_02.png");
                    btn.z_star2.loadTexture('ui_dalgona', "star_00.png"); //staroff
                    btn.z_star3.loadTexture('ui_dalgona', "star_00.png"); //staroff
                } else if (s3 === 2) {
                    //btn.z_star1.visible = true;
                    //btn.z_star2.visible = true;
                    btn.z_star1.loadTexture('ui_dalgona', "star_02.png");
                    btn.z_star2.loadTexture('ui_dalgona', "star_02.png");
                    btn.z_star3.loadTexture('ui_dalgona', "star_00.png"); //staroff
                } else if (s3 === 3) {
                    //btn.z_star1.visible = true;
                    //btn.z_star2.visible = true;
                    //btn.z_star3.visible = true;
                    btn.z_star1.loadTexture('ui_dalgona', "star_02.png");
                    btn.z_star2.loadTexture('ui_dalgona', "star_02.png");
                    btn.z_star3.loadTexture('ui_dalgona', "star_02.png");
                }

                //var base_idx = scrollpage_idx * 99; //스크롤페이지당 99개씩

                var shadowlv = kData.shadow_lv; //스크롤.리플레쉬
                if (ilvnm < shadowlv) { //오픈된              //스크롤생성시
                    //bmd_*[0]부터저장되어 잇어서
                    //copySrc2Icon_bmd(lvidx_b, lvidx, stage_mode == 0 ? 'normal' : 'special');//리플레쉬
                    btn.z_isLock = false;
                    btn.z_star1.visible = true;
                    btn.z_star2.visible = true;
                    btn.z_star3.visible = true;
                    btn.z_disable1.visible = false;
                } else if (ilvnm === shadowlv) { //히든상태      //스크롤.리플레쉬
                    //bmd_*[0]부터저장되어 잇어서
                    //copyShadow2Icon_bmd(lvidx_b, lvidx, stage_mode == 0 ? 'normal' : 'special'); //리플레쉬
                    btn.z_isLock = false;
                    btn.z_star1.visible = false;
                    btn.z_star2.visible = false;
                    btn.z_star3.visible = false;
                    //btn.tint = 0xFFFFFB;
                    btn.z_disable1.visible = false;
                } else if (ilvnm > shadowlv) { //잠금상태        //스크롤.리플레쉬
                    //bmd_*[0]부터저장되어 잇어서
                    //copyLock2Icon_bmd(lvidx, stage_mode == 0 ? 'normal' : 'special');
                    btn.z_isLock = true;
                    btn.z_star1.visible = false;
                    btn.z_star2.visible = false;
                    btn.z_star3.visible = false;
                    btn.z_disable1.visible = true;
                }

                //console.log('lvidx:', lvidx, '  lvidx_b:', lvidx_b );

                if(kData.sv_perfect[ilvnm] === 1){
                    btn.z_perfect1.visible = true;
                }else{
                    btn.z_perfect1.visible = false;
                }
            }
            //--잠금 텍스쳐-->>
            lvidx+=1;
        } //for(var j=0; j<3; j++)
    } //for (var i = 0; i < _slotmaxcnt; i++)

    //---------마지막레벨예외처리-----2
    // if(idxLastLevel === ilvnm) {
    //     console.log('마지막레벨예외처리시도 2,    ilvnm:', ilvnm);
    // }
    //---------마지막레벨예외처리-----2
}

function show_ui_btn_lower_clear_except_next() {
    console.log('show_ui_btn_lower_clear_except_next()');
    UIFs.u_c_bt_menu.obj.x = UIFs.u_c_bt_retry.obj.z_initx+70;
    UIFs.u_c_bt_retry.obj.x = UIFs.u_c_bt_next.obj.z_initx-70;

    UIFs.u_c_bt_next.obj.visible = false;
    UIFs.u_c_bt_menu.obj.visible = true;
    UIFs.u_c_bt_retry.obj.visible = true;

    if(time_ad_minimum<0) {
        if ((++Define.iADCnt) % 2 === 1) { //트윈에서 공용으로 처리
            if (typeof ShowAD === 'undefined') {
                console.log('ShowAD가 없습니다!');
                ShowAD = function (a, b, c, d) { console.log('showad'); c(); };
            }

            bBtnUp = false;
            TimeBtnUp = TimeBtnInit+TimeBtnInit;

            bk_sfx = kData.isSfx;
            bk_bgm = kData.isBGM;
            //달고나음악없음//MG.PauseBgm('bgm_game');
            kData.isSfx = false;
            ad_ing = true;
            ShowAD("basic", 'menu_fail', function () {
                console.log('showad호출함--성공');
                kData.isSfx = bk_sfx;
                //달고나음악없음// MG.PlayBgm('bgm_game', true);
                time_ad_minimum = time_ad_minimum_init;
                ad_ing = false;

                //UIFs.im_fade.obj.visible = false;
                //UIFs.im_fade.obj.alpha = 0.55; //끄기
                window.focus();

            }, function () {
                console.log('showad호출함--실패');
                kData.isSfx = bk_sfx;
                //달고나음악없음//MG.PlayBgm('bgm_game', true);
                time_ad_minimum = time_ad_minimum_init;
                ad_ing = false;

                //UIFs.im_fade.obj.visible = false;
                //UIFs.im_fade.obj.alpha = 0.55; //끄기
                window.focus();
            });
        } else {
            console.log('조건체크 showad호출안함');
            ad_ing = false;


            //UIFs.im_fade.obj.visible = false;
            //UIFs.im_fade.obj.alpha = 0.55; //끄기
            window.focus();
        } //Define.iADCnt
    } //time_ad_minimum
}
function hideUI_btn_lower_clear() {
    UIFs.u_c_bt_retry.obj.visible = false;
    UIFs.u_c_bt_menu.obj.visible = false;
    UIFs.u_c_bt_next.obj.visible = false;
}
function show_ui_btn_lower_clear() {
    console.log('show_ui_btn_lower_clear()');
    UIFs.u_c_bt_retry.obj.x = UIFs.u_c_bt_retry.obj.z_initx;
    UIFs.u_c_bt_menu.obj.x = UIFs.u_c_bt_menu.obj.z_initx;
    UIFs.u_c_bt_next.obj.x = UIFs.u_c_bt_next.obj.z_initx;

    UIFs.u_c_bt_retry.obj.visible = true;
    UIFs.u_c_bt_menu.obj.visible = true;
    UIFs.u_c_bt_next.obj.visible = true;

    if(time_ad_minimum<0) {
        if ((++Define.iADCnt) % 2 === 1) { //트윈에서 공용으로 처리
            if (typeof ShowAD === 'undefined') {
                console.log('ShowAD가 없습니다!');
                ShowAD = function (a, b, c, d) { console.log('showad'); c(); };
            }

            bBtnUp = false;
            TimeBtnUp = TimeBtnInit+TimeBtnInit;

            bk_sfx = kData.isSfx;
            bk_bgm = kData.isBGM;
            //달고나음악없음//MG.PauseBgm('bgm_game');
            kData.isSfx = false;
            ad_ing = true;
            ShowAD("basic", 'menu_clear', function () {
                console.log('showad호출함--성공');
                kData.isSfx = bk_sfx;
                //달고나음악없음// MG.PlayBgm('bgm_game', true);
                time_ad_minimum = time_ad_minimum_init;
                ad_ing = false;

                //UIFs.im_fade.obj.visible = false;
                //UIFs.im_fade.obj.alpha = 0.55; //끄기
                window.focus();

            }, function () {
                console.log('showad호출함--실패');
                kData.isSfx = bk_sfx;
                //달고나음악없음//MG.PlayBgm('bgm_game', true);
                time_ad_minimum = time_ad_minimum_init;
                ad_ing = false;

                //UIFs.im_fade.obj.visible = false;
                //UIFs.im_fade.obj.alpha = 0.55; //끄기
                window.focus();
            });
        } else {
            if ( Define.PID == "100064")
            {
                PopconGame.Sdk.drawAppMoreGameList(MG.game, Define.GAME_CODE,function (){
                    ad_ing = false;
                });
            }


            console.log('조건체크 showad호출안함');

            //UIFs.im_fade.obj.visible = false;
            //UIFs.im_fade.obj.alpha = 0.55; //끄기
            window.focus();
        } //Define.iADCnt
    } //time_ad_minimum
}

function show_ui_btn_upper(){
    UIFs.u_bt_menu.obj.visible = true;
    UIFs.u_bt_option.obj.visible = true;
    //픽셀린트주석//UIFs.u_bt_retry.obj.visible = true;

    UIFs.u_tx_best_t.obj.visible = true;
    UIFs.u_tx_best_v.obj.visible = true;
    UIFs.u_prg_bg.obj.visible = true;
    UIFs.u_prg.obj.visible = true;
    UIFs.u_prg_star1.obj.visible = true;
    UIFs.u_prg_star2.obj.visible = true;
    //UIFs.u_tx_lv_bg.obj.visible = true;
    UIFs.u_tx_lv.obj.visible = true;
    UIFs.u_tx_prg.obj.visible = true;

    //MG.copyright.visible = true;

    UIFs.u_prg.obj.onUpdatePr(1);
}
function hideUI_btn_upper(){
    UIFs.u_bt_menu.obj.visible = false;
    UIFs.u_bt_option.obj.visible = false;
    //픽셀린트주석//UIFs.u_bt_retry.obj.visible = false;

    UIFs.u_tx_best_t.obj.visible = false;
    UIFs.u_tx_best_v.obj.visible = false;
    UIFs.u_prg_bg.obj.visible = false;
    UIFs.u_prg.obj.visible = false;
    UIFs.u_prg_star1.obj.visible = false;
    UIFs.u_prg_star2.obj.visible = false;
    //UIFs.u_tx_lv_bg.obj.visible = false;
    UIFs.u_tx_lv.obj.visible = false;
    UIFs.u_tx_prg.obj.visible = false;

    //MG.copyright.visible = false;
}
function forceShowGrid(){
    console.log('forceShowGrid');
    var glen = UIFs.g_grp_grid.obj.children.length;
    //힌트 출력전에, 기존그리드투명으로 처리하기
    for(var i=0; i<glen; i++) {
        var grid1 = UIFs.g_grp_grid.obj.children[i];
        if(grid1.z_idx !==8
            && grid1.z_idx !==9
            && grid1.z_idx !== undefined
        ) {
            grid1.alpha = 1;
        }
    }
    //debug_grid('forceShowGrid후');
}

//픽셀린트주석//
// function hideHint(){
//     //그림 복사전에 비우기
//     arr_grid_before_hint_zidx = [];
//     arr_grid_before_hint_tint = [];
//
//     ing_hint = false;
//
//     UIFs.u_bt_hint.obj.visible = true;
//
//     timehint = timehintinit;
//     dirhint = true;
//
//     UIFs.g_grp_grid.obj.alpha = 1;
//     UIFs.g_grp_grid.obj.visible = true;
//
//     //픽셀린트주석//UIFs.g_grp_hint.obj.alpha = 0;
//     //픽셀린트주석//UIFs.g_grp_hint.obj.visible = false;
//
//     //픽셀린트주석//UIFs.g_grp_hint_upper.obj.alpha = 0;
//     //픽셀린트주석//UIFs.g_grp_hint_upper.obj.visible = false;
// }
//픽셀린트주석//

var bk_grid_att = []
var compare_att_bk = []
var compare_att_cur = []

function compareGrid(comment){
    console.log('무조건 compareGrid()에서 0으로 리턴함!!');
    return 0;

    console.log('compareGrid()  ',comment?comment:'');
    compare_att_cur = [];
    var glen = UIFs.g_grp_grid.obj.children.length;
    for(var i=0; i<glen; i++) {
        var att = UIFs.g_grp_grid.obj.children[i].z_idx;
        if(att!==9 && att!==8 && att!==undefined){
            compare_att_cur.push(att);
        }
    }
    var bk_len = compare_att_bk.length;
    var equalcnt = 0;
    for(var i=0; i<bk_len; i++) {
        if(compare_att_bk[i] === compare_att_cur[i]){
            equalcnt+=1;
        }
    }
    var percent = Math.floor((equalcnt/bk_len)*100);
    console.log('equalcnt/bk_len:  ',equalcnt,'/',bk_len , 'precent:', percent);

    console.log('compare_att_cur');
    var _s = ' 0-1-2-3-4-5-6-7-9-0-1-2\n';
    for(var i=0; i<glen; i++) {
        var att = compare_att_cur[i];
        if(att === undefined) att = 'u';
        else if(att === -1) att = '-';
        _s += ' '+ att;
        if((i+1)%12===0){
            _s += '\n';
        }
    }
    console.log(_s);
    console.log('compare_att_bk');
    var _s = ' 0-1-2-3-4-5-6-7-9-0-1-2\n';
    for(var i=0; i<glen; i++) {
        var att = compare_att_bk[i];
        if(att === undefined) att = 'u';
        else if(att === -1) att = '-';
        _s += ' '+ att;
        if((i+1)%12===0){
            _s += '\n';
        }
    }
    console.log(_s);

    return percent;
}

function debug_grid(comment){
    console.log('debug_grid()  ',comment?comment:'');
    var _s = ' 0-1-2-3-4-5-6-7-9-0-1-2\n';
    var glen = UIFs.g_grp_grid.obj.children.length;
    for(var i=0; i<glen; i++) {
        var att = UIFs.g_grp_grid.obj.children[i].z_idx;
        if(att === undefined) att = 'u';
        else if(att === -1) att = '-';
        _s += ' '+ att;
        if((i+1)%12===0){
            _s += '\n';
        }
    }
    console.log(_s);
}

function cheat_123(cnt){
    if(!cnt) cnt = 300;
    kData.cur_lv = 1;
    kData.shadow_lv = cnt;
    kData.sv_star = [];
    kData.sv_star[0] = -9;
    kData.sv_star[0] = -9;
    for(var i=1; i<cnt; i++){
        if(i===cnt-1){
            kData.sv_star[i] = 3;//치트
            kData.sv_star[i] = 3;//치트
        }else{
            kData.sv_star[i] = 3;//치트
            kData.sv_star[i] = 3;//치트
        }
    }
    kData.sv_star[cnt] = 0;
    kData.sv_star[cnt] = 0;
    MG.NM.LocalSave();
}

//픽셀린트주석//
function u_bt_skip_post(_bt_option){
    //hideHint(); //ing_hint = false; //skip버튼 선택시  힌트종료시키려고
    //픽셀린트주석//resetFillWhite();

    //--------------------------------------------------------저장추가기존
    if(_bt_option!=='next') {
        isLastLevel = false; //초기화
        //var idxLastLevel = lvjson.normalcnt; //밑에서 다시 설정
        //var idxLastLevel = 297;
        //if (stage_mode === 0) {
            if (idxLastLevel <= kData.cur_lv) {//skip_post호출시//초과시 라스트레벨
                console.log('레벨 최대치 넘어서 스킵--노말스테이지');
                isLastLevel = true;//skip_post호출시//297도달시
                //idxLastLevel = 297;
                //return;
            }
        //}
        // if (stage_mode === 1) {
        //     if (kData.cur_lv >= 20000) {
        //         isLastLevel = true;//skip_post호출시//20000도달시//스페셜레벨
        //         //idxLastLevel = lvjson.specialcnt;
        //         console.log('레벨 20000 넘어서 스킵--스페셜스테이지');
        //         //return;
        //     }
        //     //lvjson.specialcnt 스페셜레벨갯수
        //     //kData.cur_lv는 1부터 시작, 최종 레벨은 갯수랑 동일
        //     if (lvjson.specialcnt <= kData.cur_lv) {
        //         console.log('레벨 최대치 넘어서 스킵--스페셜스테이지');
        //         isLastLevel = true;//skip_post호출시//스페셜레벨
        //         //idxLastLevel = lvjson.specialcnt;
        //         //return;
        //     }
        // }
        var lv_played = kData.cur_lv; //별을 저장하는 래밸
        var lv_new = kData.cur_lv + 1;      //새로운 레벨
        if (isLastLevel === true) {
            lv_new = lv_played;
        }
        console.log('2 before kData.cur_lv:', kData.cur_lv);
        kData.cur_lv = lv_new; //현재레벨증가+1
        console.log(' -->2 after kData.cur_lv:', kData.cur_lv);

        if (isLastLevel === true) {
            console.log('3 before kData.cur_lv:', kData.cur_lv);
            kData.cur_lv = idxLastLevel;
            console.log(' -->3 after kData.cur_lv:', kData.cur_lv);
        }
        if (kData.cur_lv > kData.shadow_lv) {
            console.log('1 before kData.shadow_lv:', kData.shadow_lv);
            kData.shadow_lv = kData.cur_lv; //그림자레벨이 현재레벨보다 작으면, 그림자레벨업데이트
            console.log(' -->1 after kData.shadow_lv:', kData.shadow_lv);
        }
        if (isLastLevel === true) {
            console.log('2 before kData.shadow_lv:', kData.shadow_lv);
            kData.shadow_lv = idxLastLevel + 1;
            console.log(' -->2 after kData.shadow_lv:', kData.shadow_lv);
        }
        //var star_cnt = 3;
        //클리어된 레벨 저장값보다 좋으면, 별 업데이트한다.
        if (_bt_option === 'next') {

        } else {
            kData.sv_star[lv_played] = 3;
        }
        //새레벨이동시, 저장값이 없으면,
        //별은 0으로, 그림자레벨도 업데이트한다.
        if (kData.sv_star[lv_new] == undefined
            || kData.sv_star[lv_new] == null
        ) {
            kData.sv_star[lv_new] = 0;
            console.log('3 before kData.shadow_lv:', kData.shadow_lv);
            kData.shadow_lv = kData.cur_lv; //별이 없으면, 그림자레벨로 변경
            console.log('-->3 after kData.shadow_lv:', kData.shadow_lv);
        }

        console.log('skip버튼---JSON.stringify(kData):', JSON.stringify(kData));
        MG.NM.LocalSave();

        if(isLastLevel === true) { //마지막레벨팝업
            console.log('Please wait for the stage update!');
            UIFs.u_grp_fin.obj.visible = true;
            var obj =  UIFs.u_g_f_dlg.obj;
            UIFs.u_g_f_dlg.obj.scale.setTo(0.5);
            onFadeinScale(obj, function (){

            });
        }
    }
    //--------------------------------------------------------저장추가기존

    show_ui_btn_upper(); //skip버튼시
    hide_ui_clear(); //skip버튼시

    var lv_fnm = 'stage'+kData.cur_lv;
    var sid = kData.cur_lv;
    UIFs.g_grp_grid.obj.z_sid = sid;
    if(loaded[lv_fnm] === true) {               //u_bt_skip_post시
        loadLevel(sid, 0);               //u_bt_skip_post시 //기존로딩완료후
        reset_dalgona_grid();                  //u_bt_skip_post //기존로딩완료후
        tween_to_center();
    }else{
        part_loadLevel(lv_fnm, tween_to_center); //u_bt_skip_post//부분로딩시작// reset_dalgona_grid가 포함된 상태
    }

    //--------스크롤바 업데이트-------<<
    refreshScroll_icons('u_bt_skip클릭');

    //------------------------------------강제스크롤-----<< u_bt_skip_post
    var idx_gotolv = kData.cur_lv-1;
    if(idx_gotolv<0) idx_gotolv = idxLastLevel-1;

    var dt_row = 0;
    var calc_row_idx = Math.floor((idx_gotolv)/3);

    var grid1_y = (scr2_opt.padding + MG.s.scrlx_listview_a._listview.items[0].height);
    var grid_scroll_dist = 0;
    var is_grid_end = false;

    if(calc_row_idx>=4)
    {
        if(calc_row_idx>idxLastLevelRow) {        //99레벨 쉐도우상태일때
            //마지막 레벨일경우 calc_row_idx가 idxLastLevelRow+1이 된다
            //그래서 예외처리
            calc_row_idx = idxLastLevelRow;
        }

        if( calc_row_idx === idxLastLevelRow
            || calc_row_idx === idxLastLevelRow-1
            || calc_row_idx === idxLastLevelRow-2
        ){
            //마지막 하단 3줄까지 예외처리(스크롤 고정시킴)
            //dt_row를 4로 만들려고(즉, 강제로 4줄 밑으로 스크롤 시킨다)
            dt_row = idxLastLevelRow - 5;
            is_grid_end = true;
        } else {
            //일반적인 강제스크롤
            dt_row = calc_row_idx - 3;
        }

        if(is_grid_end === true){
            grid_scroll_dist = -1070;
        }else{
            grid_scroll_dist = -1 * grid1_y * dt_row;
        }
        console.log('calc_row_idx:', calc_row_idx, 'dt_row:',dt_row);
        MG.s.scrlx_listview_a._listview.setPosition(grid_scroll_dist); //스크롤.스크롤강제 //버튼생성시
    }
    //------------------------------------강제스크롤----->>
    //--------스크롤바 업데이트-------
}
//픽셀린트주석//

function calcTime(){
    if(time_ingame_play<=t_gold){
        console.log('calcTime()  -->  ', mgold);
        return mgold;
    }else if(time_ingame_play<=t_silver){
        console.log('calcTime()  -->  ', msilver);
        return msilver;
    }else if(time_ingame_play<=t_bronze){
        console.log('calcTime()  -->  ', mbronze);
        return mbronze;
    }else{
        console.log('calcTime()  -->  ', mretry);
        return mretry;
    }
} //calctime

function goto_showClear( option ){
    console.log('goto_showClear()  ', option);

    MSSDK.gameOver();//GameSnacks

    hideUI_btn_upper(); //goto_showClear

    var medal = calcTime();
    if(option === 'gameover'){
        medal = mretry;
        console.log('게임오버상태라 변경 --> medal:', medal);
    }

    var curlv = kData.cur_lv;

    if (kData.sv_record[curlv]) { //최고기록-업데이트
        UIFs.u_c_tx_best.obj.text = 'Best Record: ' + kData.sv_record[curlv];
    }else {
        UIFs.u_c_tx_best.obj.text = 'Best Record: --:--.--';
    }

    if(option === 'gameover'){
        UIFs.u_c_tx_cur.obj.text = 'Present Record: --:--.--';
    }else if(option === 'clear') {
        UIFs.u_c_tx_cur.obj.text = 'Present Record: ' + cur_record;
        if (kData.sv_record[curlv]) { //최고기록-업데이트
            if (kData.sv_record[curlv] > cur_record) {
                kData.sv_record[curlv] = cur_record;
                UIFs.u_c_tx_best.obj.text = 'Best Record: ' + cur_record;
                console.log('update record:', cur_record, '  curlv:', curlv);
            }
        } else {//최고기록-첫업데이트
            kData.sv_record[curlv] = cur_record;
            UIFs.u_c_tx_best.obj.text = 'Best Record: ' + cur_record;
            console.log('first record:', cur_record, '  curlv:', curlv);
        }

        if (medal === mgold) {
            if (typeof kData.sv_star[curlv] === 'undefined'
                || kData.sv_star[curlv] < 3) {
                kData.sv_star[curlv] = 3;
            }
        } else if (medal === msilver) {
            if (typeof kData.sv_star[curlv] === 'undefined'
                || kData.sv_star[curlv] < 2) {
                kData.sv_star[curlv] = 2;
            }
        } else if (medal === mbronze) {
            if (typeof kData.sv_star[curlv] === 'undefined'
                || kData.sv_star[curlv] < 1) {
                kData.sv_star[curlv] = 1;
            }
        }

        var clear_side = isclear_dalgona_side();
        var clear_out = isclear_dalgona_out();
        if(clear_side && clear_out){
            kData.sv_perfect[curlv] = 1;
        }else{
            kData.sv_perfect[curlv] = 0;
        }
    }
    //--------------------------------------------------------저장추가새로
    var _bt_option = 'next';
    if(medal !== mretry) {
        isLastLevel = false; //초기화

        if (idxLastLevel <= kData.cur_lv) { //done버튼//초과시 라스트레벨
            console.log('레벨 최대치 넘어서 스킵--노말스테이지');
            isLastLevel = true; //don버튼시//297도달시

        }

        var lv_played = kData.cur_lv; //별을 저장하는 래밸
        var lv_new = kData.cur_lv + 1;      //새로운 레벨
        if (isLastLevel === true) {
            lv_new = lv_played;
        }
        //console.log('4 before kData.cur_lv:', kData.cur_lv);
        //kData.cur_lv = lv_new; //현재레벨증가+1
        //console.log(' -->4 after kData.cur_lv:', kData.cur_lv);

        if (isLastLevel === true) {
            console.log('5 before kData.cur_lv:', kData.cur_lv);
            kData.cur_lv = idxLastLevel;
            console.log(' -->5 after kData.cur_lv:', kData.cur_lv);
        }
        if (kData.cur_lv > kData.shadow_lv) {
            console.log('4 before kData.shadow_lv:', kData.shadow_lv);
            kData.shadow_lv = kData.cur_lv; //그림자레벨이 현재레벨보다 작으면, 그림자레벨업데이트
            console.log(' -->4 after kData.shadow_lv:', kData.shadow_lv);
        }
        if (isLastLevel === true) {
            console.log('5 before kData.shadow_lv:', kData.shadow_lv);
            kData.shadow_lv = idxLastLevel + 1;
            console.log('-->5 after kData.shadow_lv:', kData.shadow_lv);
        }
        //클리어된 레벨 저장값보다 좋으면, 별 업데이트한다.
        if (_bt_option === 'next') {

        } else {
            kData.sv_star[lv_played] = 3;
        }
        //새레벨이동시, 저장값이 없으면,
        //별은 0으로, 그림자레벨도 업데이트한다.
        if (typeof kData.sv_star[lv_new] === 'undefined'
            || kData.sv_star[lv_new] == null
        ) {
            kData.sv_star[lv_new] = 0;
            console.log('6 before kData.shadow_lv:', kData.shadow_lv);
            kData.shadow_lv = lv_new; //별이 없으면, 그림자레벨로 변경
            console.log('-->6 after kData.shadow_lv:', kData.shadow_lv);
        }

        console.log('skip버튼---JSON.stringify(kData):', JSON.stringify(kData));
        MG.NM.LocalSave();

        MSSDK.scoreUpdate(kData.shadow_lv);////게임스낵 점수
        MSSDK.levelComplete(kData.shadow_lv); //게임스낵 레벨크리어
    }
    //--------------------------------------------------------저장추가새로

    //drawingmode = false;

    var delay_sec = 0.2;
    var delay_sec_next = 0.2 + 1.5;
    if(medal === mretry) {
        delay_sec = 1;
        delay_sec_next = 1 + 1.0;
    }

    show_ui_clear_tween(delay_sec, medal); //종료시
    show_ui_clear(medal, delay_sec_next);

    //UIFs.im_fade.obj.visible = true;
    //UIFs.im_fade.obj.alpha = 0.55; //켜기

} //goto_showClear


function UIFs_u_bt_retry_obj_fnclick (op){  //UIFs.u_bt_retry.obj.fnclick
    console.log('UIFs_u_bt_retry_obj_fnclick()  재시작버튼', op);
    MG.PlayAudio('se_click');
    //drawingmode = true; //retry.클릭

    //콜백안으로 이동
    u_bt_retry_obj_fnclick();

}

function getLeveDataByName(lvnm){
    var ret = [];
    var len = lv_data_export.children.length;
    for(var i = 0; i<len; i++){
        if(lv_data_export.children[i].info.name === lvnm){
            console.log('found level name:', lvnm, '  i:', i);
            ret = lv_data_export.children[i].children;
        }
    }
    return ret;
}

function UIFs_u_bt_skip_obj_fnclick(bt_option){ //스킵버튼시,넥스트버튼시
    console.log('UIFs_u_bt_skip_obj_fnclick()  스킵버튼시 또는 넥스트버튼시');
    MG.PlayAudio('se_click');
    if(typeof ShowAD === 'undefined'){ console.log('ShowAD가 없습니다!'); ShowAD = function (a,b,c,d){ c();};  }

    //달고나에서는 무조건 'next'로만 들어온다
    u_bt_skip_post(bt_option); //스킵버튼(넥스트버튼)-광고조건아닌때

} //UIFs_u_bt_skip_obj_fnclick

function getCurRecord() {
    //클리어시 시간 정산
    var min = Math.floor(time_ingame_play / 60);
    var sec = Math.floor(time_ingame_play % 60);
    var mil = Math.floor((time_ingame_play % 1) * 100);
    var stime = number_pad1(min, 2) + ':' + number_pad1(sec, 2) + '.' + number_pad1(mil, 2);
    console.log('cur record time:', stime);
    //클리어시 시간 정산
    return stime;
}

function setSpine_Result(){
    var sp = UIFs.u_c_sp_result.obj;
    //예)스파인세팅
    //child = sprgrp.children[6];  //레벨 상대편 //UIFs.g_sel_first_peerlv.obj
    //AttachToSpineNode(sp, 'enemy_level_num', child);

    sp.z_anims = [
    	['fail', 'fail_idle'], //0
    	['success_1_in', 'success_1_idle'], //star1개
        ['success_2_in', 'success_2_idle'], //star2개
        ['success_3_in', 'success_3_idle']  //star3개
    ];
    //setOffsetY_UnityText(child);
}
//예)스파인애니실행시
//playSpine_(UIFs.u_c_sp_result.obj, 1, 'UIFs.u_c_sp_result.obj', function(){ console.log('--cb spine');});


function playSpine_loop(sp, track, name, fn){
    sp.visible = true;
    console.log("playSpineTracks begin -----", sp, track, name);
    playSpineTracks_Loop(sp, track, function () {
        console.log("playSpineTracks end -----", sp, track, name);
        if(fn) fn();
    });
}
function playSpine_(sp, track, name, fn){
    sp.visible = true;
    console.log("playSpineTracks begin -----", sp, track, name);
    playSpineTracks(sp, track, function () {
        console.log("playSpineTracks end -----", sp, track, name);
        if(fn) fn();
    });
}


ResourcesManager = function (game) {
    this.game = game;
};
ResourcesManager.prototype = {
    preload: function () {
    },
    create: function () {
    },
    update: function () {
    },
    loader: function (res) {
        var pack = res;
        for(var method in pack) {
            pack[method].forEach(function(args) {
                var loader = this.game.load[method];
                loader && loader.apply(this.game.load, args);
            }, this);
        }
    }
};

ResourcesManager.MoviLoad ={
	'image': [
		// ['pop.png', 'assets/load/pop.png?v='+Define.IMG_VER],
		// ['movi.png', 'assets/load/movi.png?v='+Define.IMG_VER],
        //['logo_movisoft_0.png', 'assets/atlas/load/logo_movisoft_0.png?v='+Define.IMG_VER],
	]
};
//https://popcongamebucket.s3.ap-northeast-2.amazonaws.com/RunExt/data.json
ResourcesManager.Preloader = {
    'image': [
		['loading.png', 'assets/img/loading.png?v='+Define.IMG_VER],
        ['_alpha1_3x3.png', 'assets/img/_alpha1_3x3.png?v='+Define.IMG_VER],
        ['_alpha1_4x4.png', 'assets/img/_alpha1_4x4.png?v='+Define.IMG_VER],
        ['_alpha1_8x8.png', 'assets/img/_alpha1_8x8.png?v='+Define.IMG_VER],
        ['_alpha1_256x1.png', 'assets/img/_alpha1_256x1.png?v='+Define.IMG_VER],
        ['all.png', 'assets/img/all.png?v='+Define.IMG_VER],
        ['btn_exit.png', 'assets/img/btn_exit.png?v='+Define.IMG_VER],

        ['bg_01.png', 'assets/png/bg_01.png?v='+Define.IMG_VER],
    ],
    'atlas': [
        //['blast_atlas', 'assets/atlas/blast_atlas.png?v='+Define.IMG_VER, 'assets/atlas/blast_atlas.json?v='+Define.IMG_VER, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY],
        //['ui_pixelint', 'assets/atlas/ui_pixelint.png?v='+Define.IMG_VER, 'assets/atlas/ui_pixelint.json?v='+Define.IMG_VER, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY],
        ['ui_dalgona', 'assets/atlas/ui_dalgona.png?v='+Define.IMG_VER, 'assets/atlas/ui_dalgona.json?v='+Define.IMG_VER, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY],
        //['png_dalgona1', 'assets/atlas/png_dalgona1.png?v='+Define.IMG_VER, 'assets/atlas/png_dalgona1.json?v='+Define.IMG_VER, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY],
        //['png_dalgona2', 'assets/atlas/png_dalgona2.png?v='+Define.IMG_VER, 'assets/atlas/png_dalgona2.json?v='+Define.IMG_VER, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY],
    ],
	'spine': [
        //['sp_Heart_Warning', 'assets/spine/Heart_Warning.json?v='+Define.IMG_VER],
        ['Result', 'assets/spine/Result.json?v='+Define.IMG_VER],
	],
    'audio': [
		['se_click', [
			'assets/sound/se_click.mp3?v='+Define.SND_VER,
			'assets/sound/se_click.ogg?v='+Define.SND_VER]],
        ['se_clear', [
            'assets/sound/se_clear.mp3?v='+Define.SND_VER,
            'assets/sound/se_clear.ogg?v='+Define.SND_VER]],
        ['SE_Break', [
            'assets/sound/SE_Break.mp3?v='+Define.SND_VER,
            'assets/sound/SE_Break.ogg?v='+Define.SND_VER]],
        ['SE_Gameover', [
            'assets/sound/SE_Gameover.mp3?v='+Define.SND_VER,
            'assets/sound/SE_Gameover.ogg?v='+Define.SND_VER]]

    ],
	'bitmapFont':[
		//['Number-export', 'assets/font/Number-export.png?v='+Define.IMG_VER, 'assets/font/Number-export.xml?v='+Define.IMG_VER],
		//['Number_Yellow-export', 'assets/font/Number_Yellow-export.png?v='+Define.IMG_VER, 'assets/font/Number_Yellow-export.xml?v='+Define.IMG_VER],
		//['Number_White-export', 'assets/font/Number_White-export.png?v='+Define.IMG_VER, 'assets/font/Number_White-export.xml?v='+Define.IMG_VER],
	],
    'json':[
        //['test_json', 'assets/json/test_json.json'], //var phaserJSON = MG.game.cache.getJSON('test_json');
        //['lv.json', 'assets/json/lv.json'] //var lvjson = MG.game.cache.getJSON('lv.json');
    ]
};

/*ResourcesManager.MenuLoader ={

};

ResourcesManager.GameLoader ={

};*/


window[''] = window[''] || {};
window[''].ResourcesManager = ResourcesManager;




'use strict';

function MoviGame() {
	var args = Array.prototype.slice.call(arguments);// arguments을 배열로 바꾼다.
	var callback = args.pop();// 마지막 인자는 콜백 함수
	var modules = (args[0] && typeof args[0] === "string") ? args : args[0];// 모듈은 배열로 전달될 수도있고 개별 인자로 전달 될 수도 있습니다.
	// 함수가 생성자로 호출되도록 보장(new를 강제하지 않는 패턴)
	if (!(this instanceof MoviGame)) return new MoviGame(modules, callback);
	// "this객체에 모듈을 추가" : 모듈이 없거나 "*"(전부)이면 사용 가능한 모든 모듈을 사용한다는 의미입니다.
	if (!modules || modules === '*' || modules[0] === '*') {
		modules = [];
		for (var i in MoviGame.Modules) {
			if (MoviGame.modules.hasOwnProperty(i)) {
				modules.push(i);
			}
		}
	}
	// 필요한 모듈들을 초기화
	for (var i=0, m_length=modules.length; i<m_length; i+=1) {
		MoviGame.modules[modules[i]](this);
	}
	// 콜백 함수 호출
	callback(this);
	//==================================================================================
	// 여기서 부터 변수선언..
	//==================================================================================
	// Phaser
	this.game = null;
	this.resourcesManager = null;
//	this.version = Define.VERSION;

	this._sound = null;
	this._bgm = null;

	this.iMSW = 720;
	this.iMSH = 1280;
	this.iCSX = this.iMSW/2;
	this.iCSY = this.iMSH/2;
}

// 필요한 프로토타입 프로퍼티들을 추가
MoviGame.prototype = {
	/*name: "ColorPop",//

	getName: function () {
		return this.name;
	},
	*/
	Initialize : function(game){
		// 디바이스 구분.
		if (/Android/i.test(navigator.userAgent))
			Define.DEVICE = Enum.DEVICE_STATE.ANDROID;
		else if (/iPhone|iPad|iPod/i.test(navigator.userAgent))
			Define.DEVICE = Enum.DEVICE_STATE.IOS;
		else
			Define.DEVICE = Enum.DEVICE_STATE.PC;

		this.game = game;

		this.game.stage.disableVisibilityChange = true;  // 포커스 무시하고 시간이 흐름..
		// Prevent certain keys from propagating to the browser:
		/*var arrPreventedKeys = [
			Phaser.Keyboard.SPACEBAR,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT
		];
		this.game.input.keyboard.addKeyCapture(arrPreventedKeys);*/
        this.pid = this.getParameterByName('pid');
        // _game_pk = MSSDK.getParameterByName('game_pk');
        // class_user = MSSDK.getParameterByName('class_user');
        //_ads = MSSDK.getParameterByName('ads');

		this.game.plugins.add(PhaserSpine.SpinePlugin);	// 스파인 추가.
		this.resourcesManager = game.plugins.add(ResourcesManager);
		/*this.networkManager = NetworkManager(this.getServiceString(), function() { });*/
		/*this.storage = game.plugins.add(StorageManager);*/
		this.NM = new NetworkManager();
		this.initScreenSize();

		// 프레임설정을 해줘야 120hz, 144hz모니터에서 제대로 작동하게 된다.
		this.game.time._desiredFps = 144;
		this.game.time.advancedTiming = true;
	},
    getParameterByName : function (name) {
    	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/%20/gi, "+").replace(/%2F/gi, "/"));
	},
	// initScreenSize: function(){
	// 	var that = this;
	// 	this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	// 	this.game.pageAlignHorizontally = false;
	// 	this.game.pageAlignVertically = false;
	// 	this.game.scale.parentIsWindow = true;//지우니간 폭만 맞고 길이가 길어지는 화면이 됨
	// 	window.addEventListener("resize", function() {
	// 		that.reScreenSize();
	// 	});
	// 	this.game.scale.setShowAll();
	// 	this.reScreenSize();
	// },
	// reScreenSize : function () {
	// 	//기존
	// 	// var per = (window.innerWidth*MG.iMSH) / (window.innerHeight*MG.iMSW);
	// 	// if(per >= 0.85 && per <= 1.15)
	// 	// 	this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	// 	// else
	// 	// 	this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	// 	// this.game.scale.refresh();
	// 	//삼성버젼에서 가져온 것
	// 	var per = (window.innerWidth*MG.iMSH) / (window.innerHeight*MG.iMSW);
	// 	console.log("per "+per);
	// 	if(per >= 0.85 && per <= 1.15)
	// 		this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	// 	else
	// 		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//
	//
	// 	if (window.innerWidth < window.innerHeight) {
	// 		var width = Math.min(window.innerWidth, window.outerWidth);
	// 		var height = Math.min(window.innerHeight, window.outerHeight);
	//
	// 		this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	//
	//
	// 		var ratio_w = parseFloat(width / this.game.width);
	// 		var ratio_h = parseFloat(height / this.game.height);
	//
	// 		console.log("ratio_w " + ratio_w);
	// 		console.log("ratio_h " + ratio_h);
	//
	// 		//this.game.scale.setUserScale(ratio_w>1? 1: ratio_w, ratio_h>1?1:ratio_h);
	// 		//this.game.scale.setUserScale(ratio_w > 1 ? 1 : ratio_w, ratio_h);
	//
	// 		this.game.scale.setUserScale(Math.min(ratio_w,ratio_h), Math.min(ratio_w,ratio_h));
	// 	}
	//
	//
	// 	//this.game.scale.setUserScale(ratio_w, ratio_w);
	//
	// 	this.game.scale.refresh();
	// }
	initScreenSize: function(){
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.pageAlignHorizontally = false;
		this.game.pageAlignVertically = false;
		this.game.scale.parentIsWindow = true;//지우니간 폭만 맞고 길이가 길어지는 화면이 됨
		var that = this;
		window.addEventListener("resize", function() {
		 	that.reScreenSize();
		});
		// this.game.scale.setResizeCallback(function(scale, parentBounds) {
		// 	this.reScreenSize();
		// }.bind(this));
		this.game.scale.setShowAll();
		this.reScreenSize();
	},
	reScreenSize : function () {
		console.log('reScreenSize',window.innerWidth,window.innerHeight);
		// if(this.innerWidthOld == window.innerWidth && this.innerHeightOld == window.innerHeight)
		// 	return;
		//
		// this.innerWidthOld = window.innerWidth;
		// this.innerHeightOld = window.innerHeight;
		//
		// var per = (window.innerWidth*MG.iMSH) / (window.innerHeight*MG.iMSW);
		// //	console.log("per "+per);
		// if(per >= 0.85 && per <= 1.15)
		// 	this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		// else
		// 	this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//
		// if(window.innerWidth < window.innerHeight){
		// 	var width = Math.min(window.innerWidth, window.outerWidth);
		// 	var height = Math.min(window.innerHeight, window.outerHeight);
		//
		// 	this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		//
		// 	var ratio_w = parseFloat(width / this.game.width);
		// 	var ratio_h = parseFloat(height/ this.game.height);
		// 	this.game.scale.setUserScale(ratio_w>1? 1: ratio_w, ratio_h);
		// }
		// this.game.scale.refresh();

		var per = (window.innerWidth*MG.iMSH) / (window.innerHeight*MG.iMSW);
		if(per >= 0.85 && per <= 1.15)
			this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		else
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


		if(window.innerWidth < window.innerHeight && /Android/i.test(navigator.userAgent))
		{
			var width = Math.min(window.innerWidth, window.outerWidth);
			var height = Math.min(window.innerHeight, window.outerHeight);
			this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			var ratio_w = parseFloat(width / this.game.width);
			var ratio_h = parseFloat(height/ this.game.height);
			this.game.scale.setUserScale(ratio_w>1? 1: ratio_w, ratio_h);
		}

		this.game.scale.refresh();
	},
};

MoviGame.modules = {
	utils : function (box) {
		box.Init = function() {
			console.log("  utils  ==");
		};
		box.GetSecondsToTimeString = function(s) {
			var min = Math.floor(s/60);
			var sec = Math.floor(s%60);
			var strMin = (min >= 10) ? min.toString():"0"+min;
			var strSec = (sec >= 10) ? sec.toString():"0"+sec;
			return (strMin+':' +strSec);
		};
		box.AddSprite = function(parent, x, y, atlas, imgName, color, alpha, ax, ay, width, height) {
			var spr;
			if(atlas)
				spr = this.game.add.sprite(x, y, atlas, imgName);
			else
				spr = this.game.add.sprite(x, y, imgName);

			if(color != undefined) spr.tint = color;
			if(alpha != undefined) spr.alpha = alpha;
			if(ax == undefined) 	spr.anchor.x = 0.5;
			else					spr.anchor.x = ax;
			if(ay == undefined) 	spr.anchor.y = 0.5;
			else					spr.anchor.y = ay;
			if(width != undefined)	spr.width = width;
			if(height != undefined)	spr.height = height;
			if(parent) parent.addChild(spr);
			return spr;
		};
		box.AddSpriteButton = function(parent, x, y, atlas, imgName, sound, color, alpha, ax, ay, width, height){
			var btn = MG.AddSprite(parent, x, y, atlas, imgName, color, alpha, ax, ay, width, height);
			btn.inputEnabled = true;
			btn.baseTint = btn.tint;
			if(sound)	btn.sound = sound;
			else		btn.sound = "click";
			btn.events.onInputDown.add(function(){
				MG.PlayAudio(btn.sound);
				btn.tint = 0x808080;
				for(var i=0;i<btn.children.length;++i)
					btn.getChildAt(i).tint = 0x808080;
			});
			btn.events.onInputUp.add(function(){
				btn.tint = btn.baseTint;
				for(var i=0;i<btn.children.length;++i)
					btn.getChildAt(i).tint = btn.baseTint;
			});
			return btn;
		};
		box.AddSpriteNine_phaser = function(parent, x, y, atlas, imgName, w, h, style, ax, ay, color){
			var spr = new PhaserNineSlice.NineSlice(MG.game, x, y, atlas, imgName, w, h, style);
			if(ax == undefined) spr.anchor.x = 0.5;
			else				spr.anchor.x = ax;
			if(ay == undefined) spr.anchor.y = 0.5;
			else				spr.anchor.y = ay;
			if(color != undefined) spr.tint = color;
			parent.addChild(spr);
			return spr;
		};
		box.AddSpriteNine = function(parent, x, y, atlas, imgName, w, h, style, ax, ay, color){
			var main = MG.game.add.group();
			main.style = style;

			if(ax===undefined) ax = 0.5;
			if(ay===undefined) ay = 0.5;

			var lc = style.left;
			var rc = style.right;
			var tc = style.top;
			var bc = style.bottom;
			var bw, bh;
			var tw = -w*ax;
			var th = -h*ay;

			var TL = MG.AddSprite(main, tw, th, atlas, imgName, undefined, undefined, 0, 0);
			bw = TL.width;
			bh = TL.height;
			TL.crop(new Phaser.Rectangle(0, 0, lc, tc));
			var TC = MG.AddSprite(main, tw+lc, th, atlas, imgName, undefined, undefined, 0, 0);
			TC.crop(new Phaser.Rectangle(lc, 0, bw-lc-rc, tc));
			TC.width = w-lc-rc;
			var TR = MG.AddSprite(main, tw+w-rc, th, atlas, imgName, undefined, undefined, 0, 0);
			TR.crop(new Phaser.Rectangle(bw-rc, 0, rc, tc));
			var CL = MG.AddSprite(main, tw, th+tc, atlas, imgName, undefined, undefined, 0, 0);
			CL.crop(new Phaser.Rectangle(0, tc, lc, bh-tc-bc));
			CL.height = h-tc-bc;
			var CC = MG.AddSprite(main, tw+lc, th+tc, atlas, imgName, undefined, undefined, 0, 0);
			CC.crop(new Phaser.Rectangle(lc, tc, bw-lc-rc, bh-tc-bc));
			CC.width = w-lc-rc;
			CC.height = h-tc-bc;
			var CR = MG.AddSprite(main, tw+w-rc, th+tc, atlas, imgName, undefined, undefined, 0, 0);
			CR.crop(new Phaser.Rectangle(bw-rc, tc, rc, bh-tc-bc));
			CR.height = h-tc-bc;
			var BL = MG.AddSprite(main, tw, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
			BL.crop(new Phaser.Rectangle(0, bh-bc, lc, bc));
			var BC = MG.AddSprite(main, tw+lc, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
			BC.crop(new Phaser.Rectangle(lc, bh-bc, bw-lc-rc, bc));
			BC.width = w-lc-rc;
			var BR = MG.AddSprite(main, tw+w-rc, th+h-bc, atlas, imgName, undefined, undefined, 0, 0);
			BR.crop(new Phaser.Rectangle(bw-rc, bh-bc, rc, bc));

			main.position.set(x, y);
			parent.addChild(main);
			return main;
		};
		box.AddSpriteButtonScroll = function(parent, x, y, atlas, imgName, color, alpha, ax, ay, width, height){
			var btn = MG.AddSprite(parent, x, y, atlas, imgName, color, alpha, ax, ay, width, height);
			btn.inputEnabled = true;
			btn.baseTint = btn.tint;
			btn.events.onInputDown.add(function(){
				btn.tint = 0x808080;
				for(var i=0;i<btn.children.length;++i)
					btn.getChildAt(i).tint = 0x808080;
			});
			btn.events.onInputUp.add(function(){
				btn.tint = btn.baseTint;
				for(var i=0;i<btn.children.length;++i)
					btn.getChildAt(i).tint = btn.baseTint;
			});
			btn.onInputUpCallBack = function(){// 버튼의 경우 down시 색상이 변하게 설정되어 있는데 up시 이벤트가 발생하지 않았을때 다시 원상태의 색상으로 바꾸기 위해 설정한다.
				btn.tint = btn.baseTint;
				for(var i=0;i<btn.children.length;++i)
					btn.getChildAt(i).tint = btn.baseTint;
			};
			return btn;
		};
		// box.AddSpriteButtonScroll_retro = function(parent, x, y, atlas, imgName, color, alpha, ax, ay, width, height){
		// 	var btn = MG.AddSprite(parent, x, y, atlas, imgName, color, alpha, ax, ay, width, height);
		// 	btn.inputEnabled = true;
		// 	btn.baseTint = btn.tint;
		// 	btn.lockTint = false;
		// 	btn.events.onInputDown.add(function(){
		// 		btn.tint = 0x808080;
		// 		// for(var i=0;i<btn.children.length;++i) {
		// 		// 	btn.getChildAt(i).tint = 0x808080;
		// 		// }
		// 	});
		// 	btn.events.onInputUp.add(function(){
		// 		btn.tint = btn.baseTint;
		// 		// for(var i=0;i<btn.children.length;++i) {
		// 		// 	btn.getChildAt(i).tint = btn.baseTint;
		// 		// }
		// 	});
		// 	btn.onInputUpCallBack = function(){// 버튼의 경우 down시 색상이 변하게 설정되어 있는데 up시 이벤트가 발생하지 않았을때 다시 원상태의 색상으로 바꾸기 위해 설정한다.
		// 		btn.tint = btn.baseTint;
		// 		// for(var i=0;i<btn.children.length;++i) {
		// 		// 	btn.getChildAt(i).tint = btn.baseTint;
		// 		// }
		// 	};
		// 	return btn;
		// };
		box.AddText = function(parent, x, y, txt, fontStyle, ax, ay) {
			var txt = MG.game.add.text(x, y, txt, fontStyle);
			if(ax == undefined) txt.anchor.x = 0.5;
			else 				txt.anchor.x = ax;
			if(ay == undefined)	txt.anchor.y = 0.5;
			else 				txt.anchor.y = ay;
			if(parent) parent.addChild(txt);
			return txt;
		};
		box.AddBitmapText = function(parent, x, y, font, txt, size, ax, ay) {
			var txt = MG.game.add.bitmapText(x, y, font, txt, size, parent);
			if(ax == undefined) 	txt.anchor.x = 0.5;
			else 					txt.anchor.x = ax;
			if(ay == undefined)	txt.anchor.y = 0.5;
			else 					txt.anchor.y = ay;
			if(parent) parent.addChild(txt);
			return txt;
		};
		/*box.textNumberCounting = function(text, cur_number, add_number, aniTime){
			var nFrameTime = 10;
			var nAdd = 0;
			var isEnd = false;
			var nFrame = parseInt(aniTime/nFra0meTime);
			var totalNum = cur_number + add_number;
			var increase_time;
			text.setText(MG.GetSecondsToTimeString(cur_number));

			increase_time = this.game.time.events.loop(10, function(){
				nAdd += (add_number / nFrame);

				if(nAdd+cur_number < totalNum)
				{
					text.setText((cur_number +nAdd).toLocaleString());
				}
				else {
					text.setText(totalNum.toLocaleString());
					this.game.time.events.remove(increase_time);
				}

			}, this);
		};*/
		box.DrawRect = function (parent, x, y, w, h, color, alpha, input){
			var grp = MG.game.add.graphics(0, 0);
			grp.beginFill(color);
			grp.drawRect(x, y, w, h);
			grp.endFill();
			grp.alpha = alpha;
			if(input)
				grp.inputEnabled = input;
			parent.addChild(grp);

			return grp;
		};
		box.DrawRoundedRect = function (parent, x, y, w, h, r, color, alpha, input){
			var grp = MG.game.add.graphics(0, 0);
			grp.beginFill(color);
			grp.drawRoundedRect(x, y, w, h, r);
			grp.endFill();
			grp.alpha = alpha;
			if(input)
				grp.inputEnabled = input;
			parent.addChild(grp);

			return grp;
		};
		/*box.gameExit = function (bDirect) {
			if(bDirect)history.back();
			var strExit = MSSDK.getParameterByName('lang') == "en" ? "Do you want to exit?" : "게임을 종료하시겠습니까?";
			MG.confirm("", strExit, "YES", "NO", function () {
				PopconGame.Sdk.exitGame();
			}, function () {
				history.pushState(null, document.title, location.href);
			});
		};*/
		box.alert = function (title, comment, cb) {
			Swal.fire({
				title: title,
				width: 400,
				html: "<br>"+comment.replace(/\n/gi, '<br>')+"<br><br>",
				allowOutsideClick: false,
			}).then(function(result){
				if (result.value) {
					if(cb) cb();
				}
			});
		};
		box.confirm = function (title, comment, btnYes, btnNo, cb, fcb) {
			if (btnYes == undefined) btnYes = "YES";
			if (btnNo == undefined) btnNo = "NO";

			Swal.fire({
				title: title,
				width: 400,
				html: "<br>"+comment.replace(/\n/gi, '<br>')+"<br><br>",
				allowOutsideClick: false,
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: btnYes,
				cancelButtonText: btnNo
			}).then(function(result){
				if (result.value) {
					if(cb) cb();
				}else{
					if(fcb) fcb();
				}
			});
		};
		box.STR2BIN = function (str) {
			console.log('STR2BIN',str);
			var compressData = str.split('').map(function(e) {
				return e.charCodeAt(0);
			});
			var inflate = new Zlib.Deflate(compressData);
			var output = inflate.compress();
			var binstr = Array.prototype.map.call(output, function (ch) {
				return String.fromCharCode(ch);
			}).join('');
			return btoa(binstr);
		};
		box.BIN2STR = function (binstr) {
			console.log('BIN2STR',binstr);
			binstr = atob(binstr);
			var compressData = binstr.split('').map(function(e) {
				return e.charCodeAt(0);
			});
			var inflate = new Zlib.Inflate(compressData);
			var output = inflate.decompress();
			var str = Array.prototype.map.call(output, function (ch) {
				return String.fromCharCode(ch);
			}).join('');
			return str;
		};
	},
	audio: function (box) {
		/*this.isSfx = false;
		this.isBGM = false;*/
		box.Init = function() {
		};
		box.AudioInit = function() {
			this._sound = [];
			this._bgm = [];

			var audioList = ResourcesManager.Preloader['audio'];
			audioList.forEach(function(args) {
				if(args[2] === 'bgm')
					this._bgm[args[0]] = this.game.add.audio(args[0],1,true);
				else
					this._sound[args[0]] = this.game.add.audio(args[0]);
			}, this);

			// 아이폰 사운드 오프상태에서 홈버튼으로 나갔다가 돌아오면, 사운드(온/오프)해도 사운드가 안나오는 문제
			this.game.input.onDown.addOnce(function() {
				try {
					this.game.sound.context.resume();
				} catch (e) {}
			});
		};

		box.AudioSwitch = function(on) {
			kData.isSfx = !on;
			kData.isBGM = !on;
			// todo : 사운드 온오프시 세이브처리는 박에서 해준다.
			//	this.storage.set('isSfx', this.isSfx );
			//	this.storage.set('isBGM', this.isBGM );
		};
		box.AudioSwitch_sfx = function(on) {
			kData.isSfx = !on;
		};
		box.AudioSwitch_bgm = function(on) {
			kData.isBGM = !on;
		};
		box.PlayAudio = function(sound) {
			if(kData.isSfx){
				if(this._sound && this._sound[sound]) {
					this._sound[sound].play();
				}
				// 아이폰 사운드 오프상태에서 홈버튼으로 나갔다가 돌아오면, 사운드(온/오프)해도 사운드가 안나오는 문제
				try {
					this.game.sound.context.resume();
				} catch (e) {}
			}
		};
		box.StopAudio  = function(sound) {
			this._sound[sound].stop();
		};
		box.PlayBgm  = function(bgm, loop) {
			if(kData.isBGM){
				if(this._bgm && this._bgm[bgm]) {
					if(loop === undefined)
						loop = false;
					// play: function (marker, position, volume, loop, forceRestart)
					this._bgm[bgm].play('',0,1,loop);
				}
				// 아이폰 사운드 오프상태에서 홈버튼으로 나갔다가 돌아오면, 사운드(온/오프)해도 사운드가 안나오는 문제
				try {
					this.game.sound.context.resume();
				} catch (e) {}
			}
		};
		box.StopBgm  = function(bgm) {
			this._bgm[bgm].stop();
		};
		box.PauseBgm  = function(bgm) {
			this._bgm[bgm].pause();
		};
		box.ResumeBgm  = function(bgm) {
			this._bgm[bgm].resume();
		};
		box.isPlayingBgm  = function(bgm) {
			return this._bgm[bgm].isPlaying;
		};
	}
};
window[''] = window[''] || {};
window[''].MoviGame = MoviGame;
'use strict';
var MG = MoviGame('utils','audio', function(){});
function Boot() {}
Boot.prototype = {
	preload: function () {
		MG.Initialize(this.game);
		MG.resourcesManager.loader(ResourcesManager.MoviLoad);
	},
	create: function () {
		// setTimeout(function (){
		// 	this.game.state.start('preloader');
		// }.bind(this), 10);

		// MSSDK를 초기화를 해준다. 이안에 adsInit가 들어있다.
		MSSDK.initializeAsync({}, function(){   // {isBanner:true}광고 결제로 인해 광고가 안보여야 할경우 isBanner:false로 설정해준다.
			MG.NM.LocalLoad(function(){
				adsInit({isBanner:true});
				Define.LANG = (MSSDK.LANG=="ko"?Define.tbLang[0]:Define.tbLang[1]);
				if(kData.iVer < Define.SAVE_VER){
					// todo : 마이그레이션 작업
				}

				console.log('1MSSDK.audioIsEnabled');
				MSSDK.audioIsEnabled(function (onoff){ //GameSnacks
					kData.isSfx = onoff;
					kData.isBGM = onoff;
					window.focus(); //GameSnacks//포커스추가
					console.log('4window.focus');
				});

				MSSDK.scoreUpdate(kData.shadow_lv);//GameSnacks

				this.game.state.start('preloader');
			}.bind(this));
		}.bind(this));

	},
	update: function () {
		if(bPopconSDKLoad == true)
		{
			bPopconSDKLoad = false;
			setTimeout(function (){
				this.game.state.start('preloader');
			}.bind(this), 100);
		}
			//this.game.state.start('preloader');
	}
};
window[''] = window[''] || {};
window[''].Boot = Boot;
'use strict';
function Preloader() {
	this.ready = false;
	this.loadingText = null;
	this.sprLoad = null;
}

Preloader.prototype = {
	preload: function () {
		if(loaded_cnt>0) {
			console.log('err: loaded_cnt:',loaded_cnt);
			return;
		}
		console.log('ok loaded_cnt:',loaded_cnt);
		loaded_cnt +=1;

		//this.stage.backgroundColor = '#ffcc3c'; #예전
		this.stage.backgroundColor = '#ffffff';

		this.sprLoad = [];

		//this.sprLoad[0] = MG.AddSprite(this.main, MG.iCSX, MG.iCSY - 100, 'logo_movisoft_0.png');
		this.loadingText = this.add.text(MG.iCSX, MG.iCSY, "12%",
			{ font: "32px Arial", fill: "#636363", align: "center" });

		// this.sprLoad[0] = this.add.graphics(MG.iCSX, 520);
		// this.sprLoad[0].beginFill(0xe7eaf0);
		// this.sprLoad[0].arc(0, 0, 250, 0, Math.PI*2);
		// this.sprLoad[0].endFill();
		//
		// this.sprLoad[1] = this.add.graphics(MG.iCSX, 520);
		// this.sprLoad[1].beginFill(0xfe7234);
		// this.sprLoad[1].arc(0, 0, 250, MG.game.math.degToRad(-90), MG.game.math.degToRad(360-90+0), true, 360);
		// this.sprLoad[1].endFill();
		//
		// this.sprLoad[2] = this.add.sprite(MG.iCSX, 520, 'pop.png');
		// this.sprLoad[2].anchor.setTo(0.5, 0.5);
		//
		// this.sprLoad[3] = this.add.sprite(MG.iCSX, 836, 'movi.png');
		// this.sprLoad[3].anchor.setTo(0.5, 0.5);
		//
		// this.loadingText = this.add.text(MG.iCSX, 675, "0%", { font: "32px Arial", fill: "#636363", align: "center" });
		// this.loadingText.anchor.setTo(0.5, 0.5);

		this.load.onFileComplete.add(this.onFileComplete, this);
		this.load.onLoadComplete.add(this.onLoadComplete, this);

		// 이미지 로드

		//부분로딩0<<
		var lv_fnm = 'stage'+kData.cur_lv;
		loaded[lv_fnm] = true; //리소스로딩시
		ResourcesManager.Preloader.atlas.push(
			[
				lv_fnm,
				'assets/atlas/'+lv_fnm+'.png?v='+Define.IMG_VER,
				'assets/atlas/'+lv_fnm+'.json?v='+Define.IMG_VER,
				Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY
			]
		);
		//부분로딩0

		MG.resourcesManager.loader(ResourcesManager.Preloader);

	},
	onFileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
		progress = progress*0.98;
		// this.sprLoad[1].beginFill(0xfe7234);
		// this.sprLoad[1].arc(0, 0, 250, this.math.degToRad(-90), this.math.degToRad(270-(3.59999*progress)), true, 360);
		// this.sprLoad[1].endFill();
		this.loadingText.setText('' + Math.floor(progress) + "%");
	},
	onLoadComplete: function () {
		// 리소스 로드 완료후 오디오 셋팅
		MG.AudioInit();
		if(window.cordova)
		{
			//setTimeout(function (){
				console.log('eeee');
				console.log('loaded_cnt b');
				MG.game.state.start('game');
				this.destroy();
			//}.bind(this), 200);
			return;
		}

		// if(Define.bLocalHost === false){
		// 	adsInit({isBanner:true}, function(){});
		// }
		//강제로 로딩완료 보이게
		var that = this;
		setTimeout(function (){
			that.destroy();
			console.log('aa loaded_cnt:', loaded_cnt);
			MG.game.state.start('game');
		},200);
	},
	destroy :function () {
		console.log("  >>>>  destroy  <<<<");
		// this.sprLoad.forEach(function (t) {
		// 	t.destroy();
		// });

		this.loadingText.destroy();

	}
};
window[''] = window[''] || {};
window[''].Preloader = Preloader;



'use strict';
function Game() {}

var gamestate_old = '';  //현재사용안함
var gamestate = '';      //현재사용안함
var STATE_TITLE = 'STATE_TITLE';
var STATE_OPEN = 'STATE_OPEN';
var STATE_GAME = 'STATE_GAME';
var STATE_END = 'STATE_END';
var STATE_GAME_CLEAR = 'STATE_GAME_CLEAR';
var STATE_GAME_CLEAR_ING = 'STATE_GAME_CLEAR_ING';
var STATE_GAME_OVER = 'STATE_GAME_OVER';
var STATE_GAME_OVER_ING = 'STATE_GAME_OVER_ING';

var bPopconSDKLoad = false;

var isdetectDrag = true; //false가 정상이다, 즉 정지상태에서 클릭
// window.addEventListener("load", function() {
//     MG.NM.Init(cbGamePocketSdkrefresh);
// });

var time_all = 0;
var time_ingame_play = 0;
var time_ingame_play_max = 0;
var time_ingame_old = -99;
var time_ingame_cur = 0;
var remain_time = 0; //업데이트에서 사용
var remain_prg = 0; //업데이트에서 사용

//첫로딩시 t_bronze == 0인경우가 있어서, 게임오버가 발생해서
var t_gold = 100;
var t_silver = 100;
var t_bronze = 100;

var mgold = 'gold';
var msilver = 'silver';
var mbronze = 'bronze';
var mretry = 'retry';
var cur_medal = mgold;
var cur_record = '00:00:00';

var arr_bside = [];
var arr_center = [];
var arr_oside = [];

var ad_ing = false;

var isdn = false;
var _len = 0;
function click_dalgona(a1, b1, c1){
	if(gamestate !== STATE_GAME){
		return;
	}
	if(a1.z_checked === true){
		return;
	}
	if(isdn === true) {
		a1.z_checked = true;
		MG.PlayAudio('SE_Break');

		console.log('name:', a1.name, '  touch:', b1, '  option:', c1);
		if (a1.name.indexOf('_c_')>-1) {
			//UIFs.g.obj.children[_len-1].visible = false; //그림완성조각
			console.log('실패 fail');

			cur_record = getCurRecord(); //실패시 시간 정산

			gamestate_old = gamestate;
			gamestate = STATE_GAME_OVER;
			console.log('gamestate:',gamestate_old,'-->',gamestate);

			onFadeoutScale(a1, function () { a1.visible = false;	} );
			MG.game.camera.shake(0.005, 100);
		} else if (a1.name.indexOf('_o_') > -1 || a1.name.indexOf('_b_') > -1) {
			console.log('success');
			onFadeoutScale(a1, function () { a1.visible = false; } );

		}

		//--게임 클리어 검사,처리시도--
		var clear_side = isclear_dalgona_side();
		var clear_out = isclear_dalgona_out();
		//var isgameover = isgameover_dalgona_center();
		if (clear_side
			//&& clear_out
		) {

			cur_record = getCurRecord(); //클리어시 시간 정산

			gamestate_old = gamestate;
			gamestate = STATE_GAME_CLEAR;
			console.log('gamestate:', gamestate_old, '-->', gamestate);
		}
		//--게임 클리어 검사,처리시도--

	} //isdn === true
}

function click_dalgona_dn(a1, b1, c1){
	if(gamestate !== STATE_GAME){
		return;
	}
	if(a1.z_checked === true){
		return;
	}
	console.log('name:', a1.name, '  touch:', b1, '  option:', c1);
	isdn = true;
	a1.z_checked = true;

	MG.PlayAudio('SE_Break');

	if(a1.name.indexOf('_c_')>-1){
		console.log('실패 fail');

		cur_record = getCurRecord(); //실패시 시간 정산

		gamestate_old = gamestate;
		gamestate = STATE_GAME_OVER;
		console.log('gamestate:',gamestate_old,'-->',gamestate);

		onFadeoutScale(a1, function (){ a1.visible = false; } );
		MG.game.camera.shake(0.005, 100);
	} else if (a1.name.indexOf('_o_') > -1 || a1.name.indexOf('_b_') > -1) {
		console.log('success');
		onFadeoutScale(a1, function (){ a1.visible = false; } );
    }

	//--게임 클리어 검사,처리시도--
	var clear_side = isclear_dalgona_side();
	var clear_out = isclear_dalgona_out();
	//var isgameover = isgameover_dalgona_center();
	if (clear_side
		//&& clear_out
	) {

		cur_record = getCurRecord(); //클리어시 시간 정산

		gamestate_old = gamestate;
		gamestate = STATE_GAME_CLEAR;
		console.log('gamestate:', gamestate_old, '-->', gamestate);
	}
	//--게임 클리어 검사,처리시도--

}
function click_dalgona_up(a1, b1, c1){
	isdn = false; //이게 맨앞으로 와야해서
	if(gamestate !== STATE_GAME){
		return;
	}
	if(a1.z_checked === true){
		return;
	}
	console.log('name:', a1.name, '  touch:', b1, '  option:', c1);
	a1.z_checked = true;

	MG.PlayAudio('SE_Break');

	if(a1.name.indexOf('_c_')>-1){
		console.log('실패 fail');

		cur_record = getCurRecord(); //실패시 시간 정산

		gamestate_old = gamestate;
		gamestate = STATE_GAME_OVER;
		console.log('gamestate:',gamestate_old,'-->',gamestate);

		onFadeoutScale(a1, function (){ a1.visible = false; } );
		MG.game.camera.shake(0.005, 100);
	} else if (a1.name.indexOf('_o_') > -1 || a1.name.indexOf('_b_') > -1) {
		console.log('success');
		onFadeoutScale(a1, function (){ a1.visible = false; } );
	}

	//--게임 클리어 검사,처리시도--
	var clear_side = isclear_dalgona_side();
	var clear_out = isclear_dalgona_out();
	//var isgameover = isgameover_dalgona_center();
	if (clear_side
		//&& clear_out
	) {

		cur_record = getCurRecord(); //클리어시 시간 정산

		gamestate_old = gamestate;
		gamestate = STATE_GAME_CLEAR;
		console.log('gamestate:', gamestate_old, '-->', gamestate);
	}
	//--게임 클리어 검사,처리시도--

}

function force_create_popcon(){
	var PopconGame = PopconGame || {"Sdk": {
				log: function () {
			},
			adBannerEnable: function () {
			},
			adBannerDisable: function () {
			},
			RankingInfo: function () {
			},
			getJsonPID: function () {
			},
			getGooleID: function () {
				return '';
			},
			checkRecommendations: function (a,cb) {
				if(cb) cb();
			},
			createRecommendationIcon: function (a,b,cb) {
				if(cb) cb();
			},
			setRecommendationVisible: function (){
			},
			CW_AppDataGet: function (a,cb) {
				if(cb) cb();
			},
		}
	};
	PopconGame.name = 'fake'
	PopconGame.SdkLoader = {
		onLoad: function(cb) {
			cb();
		}
	};
	return PopconGame;
}

// function cbGamePocketSdkrefresh(){
// 	if(typeof PopconGame === 'undefined'){
// 		console.log('-------------팝콘sdk가 없어서, 강제로 더미팝콘sdk를 생성합니다.----------');
// 		PopconGame = force_create_popcon();
// 	}
// 	bPopconSDKLoad = true;
//
// 	MG.NM.LocalLoad();
// 	var td = kData;
//
// 	console.log('td:', td);
// 	if (td == null) {	// todo : 세이브가 없을경우 바로 세이브를 한번 해준다.
// 		// PopconGame.Sdk.CW_AppDataGet(Define.GIDX,function (data) {
// 		// 	if(data == null)
// 		// 	{
//
// 				kData = new Data();
// 				MG.NM.LocalSave(kData);
// 		// 	}
// 		// 	else
// 		// 	{
// 		// 		if(data.bindresult == 1) kData = JSON.parse(data.save);
// 		// 		MG.NM.LocalSave();
// 		// 	}
// 		// });
// 	} else {
// 		if (td.iVer == Define.SAVE_VER) {
// 			kData = td;
// 		} else {
// 			// todo : 세이브버젼이 다를경우 마이그레이션 작업을 진행한다.
// 			MG.NM.LocalSave(function () {
//
// 			});
// 		}
// 	}
// }


Game.prototype = {
	init: function(){
		MGGAME = this;
		//mixBlock.Mix(Random.Range(100, 200));
		//lvjson = MG.game.cache.getJSON('lv.json');

	},
	preload: function () {
		MG.Game = this;
		gamestate_old = gamestate;
		gamestate = STATE_TITLE;
		console.log('gamestate:',gamestate_old,'-->',gamestate);

		MG.game.stage.backgroundColor = '#000000';


		MG.b = new UI_dummy_controller();//인게임//ui생성전에 세팅할것
		create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.b);


		MG.g = new UI_g_controller();//인게임//ui생성전에 세팅할것
		create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.g);

		MG.g.init_g();


		MG.u = new UI_dummy_controller();//인게임//ui생성전에 세팅할것
		create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.u);


		// MG.sp = new UI_dummy_controller();//인게임//ui생성전에 세팅할것
		// create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.sp);


		MG.s = new UI_dummy_controller();//인게임//ui생성전에 세팅할것
		create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.s);

		// MG.o = new UI_dummy_controller();//인게임//ui생성전에 세팅할것
		// create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.o);


		MG.t = new UI_dummy_controller();//인게임//ui생성전에 세팅할것
		create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.t);

		MG.f = new UI_dummy_controller();//인게임//ui생성전에 세팅할것
		create_UIObj1_CanvasAndRepositionOffset(UIOsRoots.f);




		var help_msg = '가장자리 부터 조심히 떼어내봐요';
		//if(Define.LANG !== 'ko'){
		if(Define.LANG !== 0){
			help_msg = 'Take off the edges carefully';
		}
		UIFs.u_tx_help.obj.text = help_msg;

		//게임스낵 MG.copyright = MG.AddText(UIFs.s.obj,0,MG.iCSY-10, "Ⓒ MoviSoft Co.,Ltd. All Rights Reserved.",{font:"bold 20px Arial", fill:'#AB7D36', align:"center"}, 0.5, 1);


		UIFs.s_tx_ver.obj.text = Define.txtVer;

		UIFs.u.obj.visible = false; //초기생성시//인게임ui 사라지게
		UIFs.s.obj.visible = false; //초기생성시//스크롤창 사라지게
		//UIFs.o.obj.visible = false; //초기생성시//옵션창 사라지게
		//UIFs.sp.obj.visible = false; //초기생성시//스페셜 시작창 사라지게
		UIFs.g_grp_grid.obj.visible = false; //초기생성시//달고나그리드 사라지게

		//트윈을 하게 되므로 저장
		UIFs.g.obj.z_initx = UIFs.g.obj.x;
		UIFs.g.obj.z_inity = UIFs.g.obj.y;


		//실패시등장하는소년
		UIFs.u_c_im_fail.obj.z_initx = UIFs.u_c_im_fail.obj.x;
		UIFs.u_c_im_fail.obj.z_inity = UIFs.u_c_im_fail.obj.y;
		UIFs.u_c_im_fail.obj.visible = false;
		//실패시등장하는소년

		UIFs.im_allgrade.obj.x = 275;
		UIFs.im_allgrade.obj.y = -550;



		set_ui_all();
		hideUI_btn_upper(); //시작시

		if(kData.isSfx===false) {
			UIFs.s_bt_sfx.obj.loadTexture('ui_dalgona', 'sound_off.png'); //효과음
		}

		setSpine_Result();

		//페이드아웃, 알파0~1
		setTimeout(function (){
			var obj = UIFs.im_fade.obj;
			var tween = TweenMax.to(
				obj,
				0.5,
				{
					alpha:0,
					ease: Linear.easeNone,
					delay: 0.0,
					onCompleteParams:['im_fade'],
					onComplete: function (nm){
						if(typeof UIFs[nm] === 'undefined'){
							console.log('오브젝트를 못 찾음:', nm);
							return;
						}
						UIFs[nm].obj.visible = false;
						//show_ui_btn_upper(); //시작시
						//show_ui_btn_lower(); //시작시 //빈함수

						UIFs.s.obj.visible = true; //초기등장시//스크롤창
					}
				}
			);
		}, 100);

		//전체이용가사라짐, 알파1~0
		setTimeout(function (){
			var obj = UIFs.im_allgrade.obj;
			var tween = TweenMax.to(
				obj,
				0.5,
				{
					alpha:0,
					ease: Linear.easeNone,
					delay: 3.0 + 0.1 + 0.5,
					onCompleteParams:['im_allgrade'],
					onComplete: function (nm){
						if(typeof UIFs[nm] === 'undefined'){
							console.log('오브젝트를 못 찾음:', nm);
							return;
						}
						UIFs[nm].obj.visible = false;
					}
				}
			);
		}, 100);

		//ui등장시키려고 추가
		//UIFs.u.obj.alpha = 0; //ui 등장하게
		//ui등장시키려고 추가
		// //ui(버튼들)등장, 알파0~1
		// setTimeout(function (){
		// 	var obj = UIFs.u.obj;
		// 	var tween = TweenMax.to(
		// 		obj,
		// 		0.5,
		// 		{
		// 			alpha:1,
		// 			ease: Linear.easeNone,
		// 			delay: 3.0 + 0.1 + 0.5
		// 		}
		// 	);
		// }, 100);

		//달고나음악없음//MG.PlayBgm('bgm_game', true); //첫오디오
		//gamestate_old = undefined;
		//gamestate = STATE_TITLE;
		//console.log('state:', gamestate_old,'->', gamestate);
		// setTimeout(function (){
		// 	if ( Define.PID == "100064") PopconGame.Sdk.createAppMoreGame(MG.game,60,160);
		// },2500);

	},
	create: function () {
		MSSDK.ready(); //게임스낵 ready
		MSSDK.audioSubscribe(function (onoff){ //게임스낵 오디오콜백
			if(MG && MG.Game){
				MG.Game.sound_googlesnack(onoff);
			}
		});

		// if(kData.isSfx===false) {
		// 	UIFs.o_bt_sfx.obj.loadTexture('ui_pixelint','BGM_off.png'); //효과음
		// }
		// if(kData.isBGM===false) {
		// 	UIFs.o_bt_bgm.obj.loadTexture('ui_pixelint', 'SE_off.png'); //배경음
		// }
		if(Define.RANKING_GAME == true){
			setTimeout(function(){
				if(PopconGame.PhaserRanking) PopconGame.PhaserRanking.CreateIcon(this.game, MG.iCSX, MG.iCSY);
			}.bind(this), 500);
		}
		if ( Define.PID == "100064") PopconGame.Sdk.createAppMoreGame(MG.game,60,160);

	}, //create
	cbButtonSound_sfx: function(){
		if(kData.isSfx == false){
			MG.AudioSwitch_sfx(kData.isSfx);
			MG.PlayAudio('se_click');
			//UIFs.o_bt_sfx.obj.loadTexture('ui_dalgona','sound_on.png'); //효과음
			UIFs.s_bt_sfx.obj.loadTexture('ui_dalgona','sound_on.png'); //효과음
		}else {
			MG.PlayAudio('se_click');
			MG.AudioSwitch_sfx(kData.isSfx);
			//UIFs.o_bt_sfx.obj.loadTexture('ui_dalgona','sound_off.png'); //효과음
			UIFs.s_bt_sfx.obj.loadTexture('ui_dalgona','sound_off.png'); //효과음
		}
		MG.NM.LocalSave();
	},
	cbButtonSound_bgm: function(){
		if(kData.isBGM == false){
			//달고나음악없음//MG.AudioSwitch_bgm(kData.isBGM);
			if(MG._bgm['bgm_game'].paused == true) { //이괄호 없으면 paused==false일때 else 안넘어가는 문제가 있음
				//if (gamestate === "STATE_TITLE") {
				//달고나음악없음//MG.ResumeBgm('bgm_game');
				//}
			}
			else {
				//if(gamestate === "STATE_TITLE") {
				//달고나음악없음//MG.PlayBgm('bgm_game', true);
				//}
			}
			//달고나음악없음//MG.PlayAudio('se_click');
			//UIFs.o_bt_bgm.obj.loadTexture('ui_pixelint', 'SE_on.png'); //배경음
		}else {
			MG.PlayAudio('se_click');
			//달고나음악없음//MG.PauseBgm('bgm_game');
			//달고나음악없음//MG.AudioSwitch_bgm(kData.isBGM);
			//달고나음악없음//UIFs.o_bt_bgm.obj.loadTexture('ui_pixelint', 'SE_off.png'); //배경음
		}
		MG.NM.LocalSave();
	},
	update: function () { //주업

		time_all += deltaTime;
		MG.g.update_g();

		//--버튼클릭방지---<<
		if (bBtnDown === false) {
			TimeBtnDown -= deltaTime;
			//console.log('bBtnDown:', bBtnDown);
			if (TimeBtnDown < 0) {
				bBtnDown = true;
			}//버튼다운됫고, 시간완충이면
		}
		if (bBtnUp === false) {
			TimeBtnUp -= deltaTime;
			//console.log('TimeBtnUp:', TimeBtnUp);
			if (TimeBtnUp < 0) {
				bBtnUp = true;
			}//버튼업됫고, 시간완충이면
		}
		//--버튼클릭방지---

		switch(gamestate){
			case STATE_TITLE:

				//게임스낵이 요청해서 추가
				if(MG.s && MG.s.scrlx_listview_a){
					if(MG.s.scrlx_listview_a._listview.position<-1015){
						if(UIFs.s.obj.children[3].visible)
							UIFs.s.obj.children[3].visible = false; //'s_im_arrow_dn'
					}else{
						if(!UIFs.s.obj.children[3].visible)
							UIFs.s.obj.children[3].visible = true; //'s_im_arrow_dn'
					}
				}
				//게임스낵이 요청해서 추가

				break;
			case STATE_OPEN:
				break;
			case STATE_GAME:
				if( ad_ing === false) {

					if(cur_medal === mretry) { //재시작 메달이 이미 할당된 상태면
						cur_record = getCurRecord(); //실패시 시간 정산
						gamestate_old = gamestate;
						gamestate = STATE_GAME_OVER;
						return;
					}

					//--------------프로그래스바 상단별 처리-------
					//time_ingame_play는 0 ~ +증가
					//골드영역은 0 ~ t_gold 까지
					//실버영역은 t_gold ~ t_silver 까지
					//브론즈영역은 t_silver ~ t_brone 까지
					//retry영역은 t_brone ~ 최대치 까지
					if(time_ingame_play<=t_gold) {

					}else if(time_ingame_play<=t_silver){
						if(cur_medal !== msilver) { //골드-->실버 변경
							console.log('update medal textrue --> silver');
							cur_medal = msilver;
							UIFs.u_prg_star1.obj.loadTexture('ui_dalgona','gauge_star_disable.png');
						}
					}else if(time_ingame_play<=t_bronze){
						if(cur_medal !== mbronze) { //실버-->브론즈 변경
							console.log('update medal textrue --> bronze');
							cur_medal = mbronze;
							UIFs.u_prg_star2.obj.loadTexture('ui_dalgona','gauge_star_disable.png');
						}
					}else if(time_ingame_play>t_bronze){
						console.log('time_ingame_play:', time_ingame_play, 't_bronze:', t_bronze);
						if(cur_medal !== mretry) {
							console.log('update medal textrue --> retry');
							cur_medal = mretry;
						}
					}
					//--------------프로그래스바 상단별 처리-------

					//--------------프로그래스바 텍스트 처리-------
					time_ingame_cur = Math.floor(time_ingame_play);
					if (time_ingame_cur !== time_ingame_old
						&& time_ingame_cur <= time_ingame_play_max
					) {
						remain_time = Math.floor(time_ingame_play_max - time_ingame_cur);
						if (remain_time <= 0) remain_time = 0;
						UIFs.u_tx_prg.obj.text = remain_time;
						time_ingame_old = time_ingame_cur;
						// console.log('update_time_prg_text:', UIFs.u_tx_prg.obj.text,
						// 	'  time_ingame_cur:', time_ingame_cur,
						// 	'  time_ingame_old:', time_ingame_old
						// 	);
					}
					//--------------프로그래스바 텍스트 처리-------


					// var min = Math.floor(time_ingame_play/60);
					// var sec = Math.floor(time_ingame_play%60);
					// var mil = Math.floor((time_ingame_play%1)*100);
					// console.log(min,sec,mil);

					//--------------프로그래스바 처리-------
					time_ingame_cur = time_ingame_play;
					time_ingame_play += deltaTime;	// 게임오버가 되었을때 바로 클릭되서 사라지는걸 방지하기 위해 설정..
					remain_prg = (time_ingame_play_max - time_ingame_play) / time_ingame_play_max;
					if (remain_prg <= 0) remain_prg = 0.001;
					UIFs.u_prg.obj.onUpdatePr(remain_prg);
					//--------------프로그래스바 처리-------

				}
				break;
			case STATE_GAME_CLEAR:
				goto_showClear('clear');
				gamestate_old = gamestate;
				gamestate = STATE_GAME_CLEAR_ING;
				console.log('gamestate:', gamestate_old, '-->', gamestate);
				if(isstart) {
					MG.NM.end({type:'gameclear'}); //클리어시
					isstart=false
				}
				break;
			case STATE_GAME_OVER:
				//MSSDK.gameOver(); //게임스낵 게임오버-->뒤로가기버튼으로 이동
				
				goto_showClear('gameover');
				gamestate_old = gamestate;
				gamestate = STATE_GAME_OVER_ING;
				console.log('gamestate:', gamestate_old, '-->', gamestate);
				if(isstart) {
					MG.NM.end({type:'gameover'}); //게임오버시
					isstart=false
				}
				break;
			case STATE_END:
				break;

		}
        this.fGameOverTimeDelay -= deltaTime;	// 게임오버가 되었을때 바로 클릭되서 사라지는걸 방지하기 위해 설정..
		updateTick();
	},
	sound_googlesnack(onoff){ //게임스낵// 모든 사운드 버튼 업데이트
		window.focus();
		if(onoff) {
			kData.isBGM = kData.isSfx = true;
			UIFs.s_bt_sfx.obj.loadTexture('ui_dalgona','sound_on.png'); //효과음
		}else{
			kData.isBGM = kData.isSfx = false;
			UIFs.s_bt_sfx.obj.loadTexture('ui_dalgona','sound_off.png'); //효과음
		}
	},
};

window[''] = window[''] || {};
window[''].Game = Game;





