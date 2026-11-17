/*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.1.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=r.isArray(d)))?(e?(e=!1,f=c&&r.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext,B=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,C=/^.[^:#\[\.,]*$/;function D(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):C.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(D(this,a||[],!1))},not:function(a){return this.pushStack(D(this,a||[],!0))},is:function(a){return!!D(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var E,F=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,G=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||E,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:F.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),B.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};G.prototype=r.fn,E=r(d);var H=/^(?:parents|prev(?:Until|All))/,I={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function J(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return J(a,"nextSibling")},prev:function(a){return J(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return a.contentDocument||r.merge([],a.childNodes)}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(I[a]||r.uniqueSort(e),H.test(a)&&e.reverse()),this.pushStack(e)}});var K=/[^\x20\t\r\n\f]+/g;function L(a){var b={};return r.each(a.match(K)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?L(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function M(a){return a}function N(a){throw a}function O(a,b,c){var d;try{a&&r.isFunction(d=a.promise)?d.call(a).done(b).fail(c):a&&r.isFunction(d=a.then)?d.call(a,b,c):b.call(void 0,a)}catch(a){c.call(void 0,a)}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,M,e),g(f,c,N,e)):(f++,j.call(a,g(f,c,M,e),g(f,c,N,e),g(f,c,M,c.notifyWith))):(d!==M&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==N&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:M,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:M)),c[2][3].add(g(0,a,r.isFunction(d)?d:N))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(O(a,g.done(h(c)).resolve,g.reject),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)O(e[c],h(c),g.reject);return g.promise()}});var P=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&P.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var Q=r.Deferred();r.fn.ready=function(a){return Q.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,holdReady:function(a){a?r.readyWait++:r.ready(!0)},ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||Q.resolveWith(d,[r]))}}),r.ready.then=Q.then;function R(){d.removeEventListener("DOMContentLoaded",R),
a.removeEventListener("load",R),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",R),a.addEventListener("load",R));var S=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)S(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},T=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function U(){this.expando=r.expando+U.uid++}U.uid=1,U.prototype={cache:function(a){var b=a[this.expando];return b||(b={},T(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){r.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(K)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var V=new U,W=new U,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Y=/[A-Z]/g;function Z(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:X.test(a)?JSON.parse(a):a)}function $(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Y,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=Z(c)}catch(e){}W.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return W.hasData(a)||V.hasData(a)},data:function(a,b,c){return W.access(a,b,c)},removeData:function(a,b){W.remove(a,b)},_data:function(a,b,c){return V.access(a,b,c)},_removeData:function(a,b){V.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=W.get(f),1===f.nodeType&&!V.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),$(f,d,e[d])));V.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){W.set(this,a)}):S(this,function(b){var c;if(f&&void 0===b){if(c=W.get(f,a),void 0!==c)return c;if(c=$(f,a),void 0!==c)return c}else this.each(function(){W.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){W.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=V.get(a,b),c&&(!d||r.isArray(c)?d=V.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return V.get(a,c)||V.access(a,c,{empty:r.Callbacks("once memory").add(function(){V.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=V.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var _=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,aa=new RegExp("^(?:([+-])=|)("+_+")([a-z%]*)$","i"),ba=["Top","Right","Bottom","Left"],ca=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function ea(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&aa.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var fa={};function ga(a){var b,c=a.ownerDocument,d=a.nodeName,e=fa[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),fa[d]=e,e)}function ha(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=V.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&ca(d)&&(e[f]=ga(d))):"none"!==c&&(e[f]="none",V.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ha(this,!0)},hide:function(){return ha(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ca(this)?r(this).show():r(this).hide()})}});var ia=/^(?:checkbox|radio)$/i,ja=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,ka=/^$|\/(?:java|ecma)script/i,la={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};la.optgroup=la.option,la.tbody=la.tfoot=la.colgroup=la.caption=la.thead,la.th=la.td;function ma(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&r.nodeName(a,b)?r.merge([a],c):c}function na(a,b){for(var c=0,d=a.length;c<d;c++)V.set(a[c],"globalEval",!b||V.get(b[c],"globalEval"))}var oa=/<|&#?\w+;/;function pa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(oa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ja.exec(f)||["",""])[1].toLowerCase(),i=la[h]||la._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=ma(l.appendChild(f),"script"),j&&na(g),c){k=0;while(f=g[k++])ka.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var qa=d.documentElement,ra=/^key/,sa=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ta=/^([^.]*)(?:\.(.+)|)/;function ua(){return!0}function va(){return!1}function wa(){try{return d.activeElement}catch(a){}}function xa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)xa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=va;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(qa,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(K)||[""],j=b.length;while(j--)h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.hasData(a)&&V.get(a);if(q&&(i=q.events)){b=(b||"").match(K)||[""],j=b.length;while(j--)if(h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&V.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(V.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==wa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===wa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&r.nodeName(this,"input"))return this.click(),!1},_default:function(a){return r.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ua:va,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:va,isPropagationStopped:va,isImmediatePropagationStopped:va,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ua,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ua,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ua,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&ra.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&sa.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return xa(this,a,b,c,d)},one:function(a,b,c,d){return xa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=va),this.each(function(){r.event.remove(this,a,c,b)})}});var ya=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,za=/<script|<style|<link/i,Aa=/checked\s*(?:[^=]|=\s*.checked.)/i,Ba=/^true\/(.*)/,Ca=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Da(a,b){return r.nodeName(a,"table")&&r.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function Ea(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Fa(a){var b=Ba.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ga(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(V.hasData(a)&&(f=V.access(a),g=V.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}W.hasData(a)&&(h=W.access(a),i=r.extend({},h),W.set(b,i))}}function Ha(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ia.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ia(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Aa.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ia(f,b,c,d)});if(m&&(e=pa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(ma(e,"script"),Ea),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,ma(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Fa),l=0;l<i;l++)j=h[l],ka.test(j.type||"")&&!V.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Ca,""),k))}return a}function Ja(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(ma(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&na(ma(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(ya,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=ma(h),f=ma(a),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);if(b)if(c)for(f=f||ma(a),g=g||ma(h),d=0,e=f.length;d<e;d++)Ga(f[d],g[d]);else Ga(a,h);return g=ma(h,"script"),g.length>0&&na(g,!i&&ma(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(T(c)){if(b=c[V.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[V.expando]=void 0}c[W.expando]&&(c[W.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ja(this,a,!0)},remove:function(a){return Ja(this,a)},text:function(a){return S(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.appendChild(a)}})},prepend:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(ma(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return S(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!za.test(a)&&!la[(ja.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(ma(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ia(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(ma(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var Ka=/^margin/,La=new RegExp("^("+_+")(?!px)[a-z%]+$","i"),Ma=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",qa.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,qa.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Na(a,b,c){var d,e,f,g,h=a.style;return c=c||Ma(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&La.test(g)&&Ka.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Oa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Pa=/^(none|table(?!-c[ea]).+)/,Qa={position:"absolute",visibility:"hidden",display:"block"},Ra={letterSpacing:"0",fontWeight:"400"},Sa=["Webkit","Moz","ms"],Ta=d.createElement("div").style;function Ua(a){if(a in Ta)return a;var b=a[0].toUpperCase()+a.slice(1),c=Sa.length;while(c--)if(a=Sa[c]+b,a in Ta)return a}function Va(a,b,c){var d=aa.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Wa(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ba[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ba[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ba[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ba[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ba[f]+"Width",!0,e)));return g}function Xa(a,b,c){var d,e=!0,f=Ma(a),g="border-box"===r.css(a,"boxSizing",!1,f);if(a.getClientRects().length&&(d=a.getBoundingClientRect()[b]),d<=0||null==d){if(d=Na(a,b,f),(d<0||null==d)&&(d=a.style[b]),La.test(d))return d;e=g&&(o.boxSizingReliable()||d===a.style[b]),d=parseFloat(d)||0}return d+Wa(a,b,c||(g?"border":"content"),e,f)+"px"}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Na(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=a.style;return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=aa.exec(c))&&e[1]&&(c=ea(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b);return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Na(a,b,d)),"normal"===e&&b in Ra&&(e=Ra[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Pa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?Xa(a,b,d):da(a,Qa,function(){return Xa(a,b,d)})},set:function(a,c,d){var e,f=d&&Ma(a),g=d&&Wa(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=aa.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Va(a,c,g)}}}),r.cssHooks.marginLeft=Oa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Na(a,"marginLeft"))||a.getBoundingClientRect().left-da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ba[d]+b]=f[d]||f[d-2]||f[0];return e}},Ka.test(a)||(r.cssHooks[a+b].set=Va)}),r.fn.extend({css:function(a,b){return S(this,function(a,b,c){var d,e,f={},g=0;if(r.isArray(b)){for(d=Ma(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function Ya(a,b,c,d,e){return new Ya.prototype.init(a,b,c,d,e)}r.Tween=Ya,Ya.prototype={constructor:Ya,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=Ya.propHooks[this.prop];return a&&a.get?a.get(this):Ya.propHooks._default.get(this)},run:function(a){var b,c=Ya.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ya.propHooks._default.set(this),this}},Ya.prototype.init.prototype=Ya.prototype,Ya.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},Ya.propHooks.scrollTop=Ya.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=Ya.prototype.init,r.fx.step={};var Za,$a,_a=/^(?:toggle|show|hide)$/,ab=/queueHooks$/;function bb(){$a&&(a.requestAnimationFrame(bb),r.fx.tick())}function cb(){return a.setTimeout(function(){Za=void 0}),Za=r.now()}function db(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ba[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function eb(a,b,c){for(var d,e=(hb.tweeners[b]||[]).concat(hb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function fb(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&ca(a),q=V.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],_a.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=V.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ha([a],!0),j=a.style.display||j,k=r.css(a,"display"),ha([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=V.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ha([a],!0),m.done(function(){p||ha([a]),V.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=eb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function gb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],r.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function hb(a,b,c){var d,e,f=0,g=hb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Za||cb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:Za||cb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(gb(k,j.opts.specialEasing);f<g;f++)if(d=hb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,eb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}r.Animation=r.extend(hb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return ea(c.elem,a,aa.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(K);for(var c,d=0,e=a.length;d<e;d++)c=a[d],hb.tweeners[c]=hb.tweeners[c]||[],hb.tweeners[c].unshift(b)},prefilters:[fb],prefilter:function(a,b){b?hb.prefilters.unshift(a):hb.prefilters.push(a)}}),r.speed=function(a,b,c){var e=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off||d.hidden?e.duration=0:"number"!=typeof e.duration&&(e.duration in r.fx.speeds?e.duration=r.fx.speeds[e.duration]:e.duration=r.fx.speeds._default),null!=e.queue&&e.queue!==!0||(e.queue="fx"),e.old=e.complete,e.complete=function(){r.isFunction(e.old)&&e.old.call(this),e.queue&&r.dequeue(this,e.queue)},e},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(ca).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=hb(this,r.extend({},a),f);(e||V.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=V.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&ab.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=V.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(db(b,!0),a,d,e)}}),r.each({slideDown:db("show"),slideUp:db("hide"),slideToggle:db("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(Za=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),Za=void 0},r.fx.timer=function(a){r.timers.push(a),a()?r.fx.start():r.timers.pop()},r.fx.interval=13,r.fx.start=function(){$a||($a=a.requestAnimationFrame?a.requestAnimationFrame(bb):a.setInterval(r.fx.tick,r.fx.interval))},r.fx.stop=function(){a.cancelAnimationFrame?a.cancelAnimationFrame($a):a.clearInterval($a),$a=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var ib,jb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return S(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?ib:void 0)),
void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&r.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(K);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),ib={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=jb[b]||r.find.attr;jb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=jb[g],jb[g]=e,e=null!=c(a,b,d)?g:null,jb[g]=f),e}});var kb=/^(?:input|select|textarea|button)$/i,lb=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return S(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):kb.test(a.nodeName)||lb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function mb(a){var b=a.match(K)||[];return b.join(" ")}function nb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,nb(this)))});if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,nb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,nb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(K)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=nb(this),b&&V.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":V.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+mb(nb(c))+" ").indexOf(b)>-1)return!0;return!1}});var ob=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":r.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(ob,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:mb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!r.nodeName(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(r.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var pb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!pb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,pb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(V.get(h,"events")||{})[b.type]&&V.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&T(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!T(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=V.access(d,b);e||d.addEventListener(a,c,!0),V.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=V.access(d,b)-1;e?V.access(d,b,e):(d.removeEventListener(a,c,!0),V.remove(d,b))}}});var qb=a.location,rb=r.now(),sb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var tb=/\[\]$/,ub=/\r?\n/g,vb=/^(?:submit|button|image|reset|file)$/i,wb=/^(?:input|select|textarea|keygen)/i;function xb(a,b,c,d){var e;if(r.isArray(b))r.each(b,function(b,e){c||tb.test(a)?d(a,e):xb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)xb(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(r.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)xb(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&wb.test(this.nodeName)&&!vb.test(a)&&(this.checked||!ia.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:r.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(ub,"\r\n")}}):{name:b.name,value:c.replace(ub,"\r\n")}}).get()}});var yb=/%20/g,zb=/#.*$/,Ab=/([?&])_=[^&]*/,Bb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Cb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Db=/^(?:GET|HEAD)$/,Eb=/^\/\//,Fb={},Gb={},Hb="*/".concat("*"),Ib=d.createElement("a");Ib.href=qb.href;function Jb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(K)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Kb(a,b,c,d){var e={},f=a===Gb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Lb(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Mb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Nb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:qb.href,type:"GET",isLocal:Cb.test(qb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Hb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Lb(Lb(a,r.ajaxSettings),b):Lb(r.ajaxSettings,a)},ajaxPrefilter:Jb(Fb),ajaxTransport:Jb(Gb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Bb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||qb.href)+"").replace(Eb,qb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(K)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Ib.protocol+"//"+Ib.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Kb(Fb,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Db.test(o.type),f=o.url.replace(zb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(yb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(sb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Ab,"$1"),n=(sb.test(f)?"&":"?")+"_="+rb++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Hb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Kb(Gb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Mb(o,y,d)),v=Nb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ob={0:200,1223:204},Pb=r.ajaxSettings.xhr();o.cors=!!Pb&&"withCredentials"in Pb,o.ajax=Pb=!!Pb,r.ajaxTransport(function(b){var c,d;if(o.cors||Pb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Ob[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Qb=[],Rb=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Qb.pop()||r.expando+"_"+rb++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Rb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rb.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Rb,"$1"+e):b.jsonp!==!1&&(b.url+=(sb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Qb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=B.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=pa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=mb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length};function Sb(a){return r.isWindow(a)?a:9===a.nodeType&&a.defaultView}r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),d.width||d.height?(e=f.ownerDocument,c=Sb(e),b=e.documentElement,{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}):d):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),r.nodeName(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||qa})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return S(this,function(a,d,e){var f=Sb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Oa(o.pixelPosition,function(a,c){if(c)return c=Na(a,b),La.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return S(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.parseJSON=JSON.parse,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Tb=a.jQuery,Ub=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Ub),b&&a.jQuery===r&&(a.jQuery=Tb),r},b||(a.jQuery=a.$=r),r});

/*!
* sweetalert2 v7.33.1
* Released under the MIT License.
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Sweetalert2 = factory());
}(this, (function () { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var consolePrefix = 'SweetAlert2:';
/**
 * Filter the unique values into a new array
 * @param arr
 */

var uniqueArray = function uniqueArray(arr) {
  var result = [];

  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }

  return result;
};
/**
 * Convert NodeList to Array
 * @param nodeList
 */

var toArray = function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
};
/**
 * Converts `inputOptions` into an array of `[value, label]`s
 * @param inputOptions
 */

var formatInputOptions = function formatInputOptions(inputOptions) {
  var result = [];

  if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
    inputOptions.forEach(function (value, key) {
      result.push([key, value]);
    });
  } else {
    Object.keys(inputOptions).forEach(function (key) {
      result.push([key, inputOptions[key]]);
    });
  }

  return result;
};
/**
 * Standardise console warnings
 * @param message
 */

var warn = function warn(message) {
  console.warn("".concat(consolePrefix, " ").concat(message));
};
/**
 * Standardise console errors
 * @param message
 */

var error = function error(message) {
  console.error("".concat(consolePrefix, " ").concat(message));
};
/**
 * Private global state for `warnOnce`
 * @type {Array}
 * @private
 */

var previousWarnOnceMessages = [];
/**
 * Show a console warning, but only if it hasn't already been shown
 * @param message
 */

var warnOnce = function warnOnce(message) {
  if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
    previousWarnOnceMessages.push(message);
    warn(message);
  }
};
/**
 * If `arg` is a function, call it (with no arguments or context) and return the result.
 * Otherwise, just pass the value through
 * @param arg
 */

var callIfFunction = function callIfFunction(arg) {
  return typeof arg === 'function' ? arg() : arg;
};
var isPromise = function isPromise(arg) {
  return arg && Promise.resolve(arg) === arg;
};

var DismissReason = Object.freeze({
  cancel: 'cancel',
  backdrop: 'overlay',
  close: 'close',
  esc: 'esc',
  timer: 'timer'
});

var argsToParams = function argsToParams(args) {
  var params = {};

  switch (_typeof(args[0])) {
    case 'object':
      _extends(params, args[0]);

      break;

    default:
      ['title', 'html', 'type'].forEach(function (name, index) {
        switch (_typeof(args[index])) {
          case 'string':
            params[name] = args[index];
            break;

          case 'undefined':
            break;

          default:
            error("Unexpected type of ".concat(name, "! Expected \"string\", got ").concat(_typeof(args[index])));
        }
      });
  }

  return params;
};

/**
 * Adapt a legacy inputValidator for use with expectRejections=false
 */
var adaptInputValidator = function adaptInputValidator(legacyValidator) {
  return function adaptedInputValidator(inputValue, extraParams) {
    return legacyValidator.call(this, inputValue, extraParams).then(function () {
      return undefined;
    }, function (validationMessage) {
      return validationMessage;
    });
  };
};

var swalPrefix = 'swal2-';
var prefix = function prefix(items) {
  var result = {};

  for (var i in items) {
    result[items[i]] = swalPrefix + items[i];
  }

  return result;
};
var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'toast', 'toast-shown', 'toast-column', 'fade', 'show', 'hide', 'noanimation', 'close', 'title', 'header', 'content', 'actions', 'confirm', 'cancel', 'footer', 'icon', 'icon-text', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'validation-message', 'progresssteps', 'activeprogressstep', 'progresscircle', 'progressline', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl']);
var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

var states = {
  previousBodyPadding: null
};
var hasClass = function hasClass(elem, className) {
  return elem.classList.contains(className);
};
var focusInput = function focusInput(input) {
  input.focus(); // place cursor at end of text in text input

  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915
    var val = input.value;
    input.value = '';
    input.value = val;
  }
};

var addOrRemoveClass = function addOrRemoveClass(target, classList, add) {
  if (!target || !classList) {
    return;
  }

  if (typeof classList === 'string') {
    classList = classList.split(/\s+/).filter(Boolean);
  }

  classList.forEach(function (className) {
    if (target.forEach) {
      target.forEach(function (elem) {
        add ? elem.classList.add(className) : elem.classList.remove(className);
      });
    } else {
      add ? target.classList.add(className) : target.classList.remove(className);
    }
  });
};

var addClass = function addClass(target, classList) {
  addOrRemoveClass(target, classList, true);
};
var removeClass = function removeClass(target, classList) {
  addOrRemoveClass(target, classList, false);
};
var getChildByClass = function getChildByClass(elem, className) {
  for (var i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i];
    }
  }
};
var show = function show(elem) {
  elem.style.opacity = '';
  elem.style.display = elem.id === swalClasses.content ? 'block' : 'flex';
};
var hide = function hide(elem) {
  elem.style.opacity = '';
  elem.style.display = 'none';
}; // borrowed from jquery $(elem).is(':visible') implementation

var isVisible = function isVisible(elem) {
  return elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
};
var contains = function contains(haystack, needle) {
  if (typeof haystack.contains === 'function') {
    return haystack.contains(needle);
  }
};

var getContainer = function getContainer() {
  return document.body.querySelector('.' + swalClasses.container);
};

var elementByClass = function elementByClass(className) {
  var container = getContainer();
  return container ? container.querySelector('.' + className) : null;
};

var getPopup = function getPopup() {
  return elementByClass(swalClasses.popup);
};
var getIcons = function getIcons() {
  var popup = getPopup();
  return toArray(popup.querySelectorAll('.' + swalClasses.icon));
};
var getTitle = function getTitle() {
  return elementByClass(swalClasses.title);
};
var getContent = function getContent() {
  return elementByClass(swalClasses.content);
};
var getImage = function getImage() {
  return elementByClass(swalClasses.image);
};
var getProgressSteps = function getProgressSteps() {
  return elementByClass(swalClasses.progresssteps);
};
var getValidationMessage = function getValidationMessage() {
  return elementByClass(swalClasses['validation-message']);
};
var getConfirmButton = function getConfirmButton() {
  return elementByClass(swalClasses.confirm);
};
var getCancelButton = function getCancelButton() {
  return elementByClass(swalClasses.cancel);
};
/* @deprecated */

/* istanbul ignore next */

var getButtonsWrapper = function getButtonsWrapper() {
  warnOnce("swal.getButtonsWrapper() is deprecated and will be removed in the next major release, use swal.getActions() instead");
  return elementByClass(swalClasses.actions);
};
var getActions = function getActions() {
  return elementByClass(swalClasses.actions);
};
var getFooter = function getFooter() {
  return elementByClass(swalClasses.footer);
};
var getCloseButton = function getCloseButton() {
  return elementByClass(swalClasses.close);
};
var getFocusableElements = function getFocusableElements() {
  var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
  .sort(function (a, b) {
    a = parseInt(a.getAttribute('tabindex'));
    b = parseInt(b.getAttribute('tabindex'));

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }

    return 0;
  }); // https://github.com/jkup/focusable/blob/master/index.js

  var otherFocusableElements = toArray(getPopup().querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls]')).filter(function (el) {
    return el.getAttribute('tabindex') !== '-1';
  });
  return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(function (el) {
    return isVisible(el);
  });
};
var isModal = function isModal() {
  return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
};
var isToast = function isToast() {
  return document.body.classList.contains(swalClasses['toast-shown']);
};
var isLoading = function isLoading() {
  return getPopup().hasAttribute('data-loading');
};

// Detect Node env
var isNodeEnv = function isNodeEnv() {
  return typeof window === 'undefined' || typeof document === 'undefined';
};

var sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <div class=\"").concat(swalClasses.header, "\">\n     <ul class=\"").concat(swalClasses.progresssteps, "\"></ul>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.error, "\">\n       <span class=\"swal2-x-mark\"><span class=\"swal2-x-mark-line-left\"></span><span class=\"swal2-x-mark-line-right\"></span></span>\n     </div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.question, "\">\n       <span class=\"").concat(swalClasses['icon-text'], "\">?</span>\n      </div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.warning, "\">\n       <span class=\"").concat(swalClasses['icon-text'], "\">!</span>\n      </div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.info, "\">\n       <span class=\"").concat(swalClasses['icon-text'], "\">i</span>\n      </div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.success, "\">\n       <div class=\"swal2-success-circular-line-left\"></div>\n       <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n       <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n       <div class=\"swal2-success-circular-line-right\"></div>\n     </div>\n     <img class=\"").concat(swalClasses.image, "\" />\n     <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n     <button type=\"button\" class=\"").concat(swalClasses.close, "\">\xD7</button>\n   </div>\n   <div class=\"").concat(swalClasses.content, "\">\n     <div id=\"").concat(swalClasses.content, "\"></div>\n     <input class=\"").concat(swalClasses.input, "\" />\n     <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n     <div class=\"").concat(swalClasses.range, "\">\n       <input type=\"range\" />\n       <output></output>\n     </div>\n     <select class=\"").concat(swalClasses.select, "\"></select>\n     <div class=\"").concat(swalClasses.radio, "\"></div>\n     <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n       <input type=\"checkbox\" />\n       <span class=\"").concat(swalClasses.label, "\"></span>\n     </label>\n     <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n     <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   </div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\">OK</button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\">Cancel</button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\">\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');
/*
 * Add modal + backdrop to DOM
 */

var init = function init(params) {
  // Clean up the old popup if it exists
  var c = getContainer();

  if (c) {
    c.parentNode.removeChild(c);
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
  }
  /* istanbul ignore if */


  if (isNodeEnv()) {
    error('SweetAlert2 requires document to initialize');
    return;
  }

  var container = document.createElement('div');
  container.className = swalClasses.container;
  container.innerHTML = sweetHTML;
  var targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target;
  targetElement.appendChild(container);
  var popup = getPopup();
  var content = getContent();
  var input = getChildByClass(content, swalClasses.input);
  var file = getChildByClass(content, swalClasses.file);
  var range = content.querySelector(".".concat(swalClasses.range, " input"));
  var rangeOutput = content.querySelector(".".concat(swalClasses.range, " output"));
  var select = getChildByClass(content, swalClasses.select);
  var checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input"));
  var textarea = getChildByClass(content, swalClasses.textarea); // a11y

  popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
  popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

  if (!params.toast) {
    popup.setAttribute('aria-modal', 'true');
  } // RTL


  if (window.getComputedStyle(targetElement).direction === 'rtl') {
    addClass(getContainer(), swalClasses.rtl);
  }

  var oldInputVal; // IE11 workaround, see #1109 for details

  var resetValidationMessage = function resetValidationMessage(e) {
    if (Swal.isVisible() && oldInputVal !== e.target.value) {
      Swal.resetValidationMessage();
    }

    oldInputVal = e.target.value;
  };

  input.oninput = resetValidationMessage;
  file.onchange = resetValidationMessage;
  select.onchange = resetValidationMessage;
  checkbox.onchange = resetValidationMessage;
  textarea.oninput = resetValidationMessage;

  range.oninput = function (e) {
    resetValidationMessage(e);
    rangeOutput.value = range.value;
  };

  range.onchange = function (e) {
    resetValidationMessage(e);
    range.nextSibling.value = range.value;
  };

  return popup;
};

var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
  if (!param) {
    return hide(target);
  } // DOM element


  if (param instanceof HTMLElement) {
    target.appendChild(param); // JQuery element(s)
  } else if (_typeof(param) === 'object') {
    target.innerHTML = '';

    if (0 in param) {
      for (var i = 0; i in param; i++) {
        target.appendChild(param[i].cloneNode(true));
      }
    } else {
      target.appendChild(param.cloneNode(true));
    }
  } else if (param) {
    target.innerHTML = param;
  }

  show(target);
};

var animationEndEvent = function () {
  // Prevent run in Node env

  /* istanbul ignore if */
  if (isNodeEnv()) {
    return false;
  }

  var testEl = document.createElement('div');
  var transEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd oanimationend',
    'animation': 'animationend'
  };

  for (var i in transEndEventNames) {
    if (transEndEventNames.hasOwnProperty(i) && typeof testEl.style[i] !== 'undefined') {
      return transEndEventNames[i];
    }
  }

  return false;
}();

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
var measureScrollbar = function measureScrollbar() {
  var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

  if (supportsTouch) {
    return 0;
  }

  var scrollDiv = document.createElement('div');
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

var renderActions = function renderActions(params) {
  var actions = getActions();
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton(); // Actions (buttons) wrapper

  if (!params.showConfirmButton && !params.showCancelButton) {
    hide(actions);
  } else {
    show(actions);
  } // Cancel button


  if (params.showCancelButton) {
    cancelButton.style.display = 'inline-block';
  } else {
    hide(cancelButton);
  } // Confirm button


  if (params.showConfirmButton) {
    confirmButton.style.removeProperty('display');
  } else {
    hide(confirmButton);
  } // Edit text on confirm and cancel buttons


  confirmButton.innerHTML = params.confirmButtonText;
  cancelButton.innerHTML = params.cancelButtonText; // ARIA labels for confirm and cancel buttons

  confirmButton.setAttribute('aria-label', params.confirmButtonAriaLabel);
  cancelButton.setAttribute('aria-label', params.cancelButtonAriaLabel); // Add buttons custom classes

  confirmButton.className = swalClasses.confirm;
  addClass(confirmButton, params.confirmButtonClass);
  cancelButton.className = swalClasses.cancel;
  addClass(cancelButton, params.cancelButtonClass); // Buttons styling

  if (params.buttonsStyling) {
    addClass([confirmButton, cancelButton], swalClasses.styled); // Buttons background colors

    if (params.confirmButtonColor) {
      confirmButton.style.backgroundColor = params.confirmButtonColor;
    }

    if (params.cancelButtonColor) {
      cancelButton.style.backgroundColor = params.cancelButtonColor;
    } // Loading state


    var confirmButtonBackgroundColor = window.getComputedStyle(confirmButton).getPropertyValue('background-color');
    confirmButton.style.borderLeftColor = confirmButtonBackgroundColor;
    confirmButton.style.borderRightColor = confirmButtonBackgroundColor;
  } else {
    removeClass([confirmButton, cancelButton], swalClasses.styled);
    confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = '';
    cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = '';
  }
};

var renderContent = function renderContent(params) {
  var content = getContent().querySelector('#' + swalClasses.content); // Content as HTML

  if (params.html) {
    parseHtmlToContainer(params.html, content); // Content as plain text
  } else if (params.text) {
    content.textContent = params.text;
    show(content);
  } else {
    hide(content);
  }
};

var renderIcon = function renderIcon(params) {
  var icons = getIcons();

  for (var i = 0; i < icons.length; i++) {
    hide(icons[i]);
  }

  if (params.type) {
    if (Object.keys(iconTypes).indexOf(params.type) !== -1) {
      var icon = Swal.getPopup().querySelector(".".concat(swalClasses.icon, ".").concat(iconTypes[params.type]));
      show(icon); // Animate icon

      if (params.animation) {
        addClass(icon, "swal2-animate-".concat(params.type, "-icon"));
      }
    } else {
      error("Unknown type! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.type, "\""));
    }
  }
};

var renderImage = function renderImage(params) {
  var image = getImage();

  if (params.imageUrl) {
    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt);
    show(image);

    if (params.imageWidth) {
      image.setAttribute('width', params.imageWidth);
    } else {
      image.removeAttribute('width');
    }

    if (params.imageHeight) {
      image.setAttribute('height', params.imageHeight);
    } else {
      image.removeAttribute('height');
    }

    image.className = swalClasses.image;

    if (params.imageClass) {
      addClass(image, params.imageClass);
    }
  } else {
    hide(image);
  }
};

var renderProgressSteps = function renderProgressSteps(params) {
  var progressStepsContainer = getProgressSteps();
  var currentProgressStep = parseInt(params.currentProgressStep === null ? Swal.getQueueStep() : params.currentProgressStep, 10);

  if (params.progressSteps && params.progressSteps.length) {
    show(progressStepsContainer);
    progressStepsContainer.innerHTML = '';

    if (currentProgressStep >= params.progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }

    params.progressSteps.forEach(function (step, index) {
      var circle = document.createElement('li');
      addClass(circle, swalClasses.progresscircle);
      circle.innerHTML = step;

      if (index === currentProgressStep) {
        addClass(circle, swalClasses.activeprogressstep);
      }

      progressStepsContainer.appendChild(circle);

      if (index !== params.progressSteps.length - 1) {
        var line = document.createElement('li');
        addClass(line, swalClasses.progressline);

        if (params.progressStepsDistance) {
          line.style.width = params.progressStepsDistance;
        }

        progressStepsContainer.appendChild(line);
      }
    });
  } else {
    hide(progressStepsContainer);
  }
};

var renderTitle = function renderTitle(params) {
  var title = getTitle();

  if (params.titleText) {
    title.innerText = params.titleText;
  } else if (params.title) {
    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }

    parseHtmlToContainer(params.title, title);
  }
};

var fixScrollbar = function fixScrollbar() {
  // for queues, do not do this more than once
  if (states.previousBodyPadding !== null) {
    return;
  } // if the body has overflow


  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
    document.body.style.paddingRight = states.previousBodyPadding + measureScrollbar() + 'px';
  }
};
var undoScrollbar = function undoScrollbar() {
  if (states.previousBodyPadding !== null) {
    document.body.style.paddingRight = states.previousBodyPadding;
    states.previousBodyPadding = null;
  }
};

/* istanbul ignore next */

var iOSfix = function iOSfix() {
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
    var offset = document.body.scrollTop;
    document.body.style.top = offset * -1 + 'px';
    addClass(document.body, swalClasses.iosfix);
  }
};
/* istanbul ignore next */

var undoIOSfix = function undoIOSfix() {
  if (hasClass(document.body, swalClasses.iosfix)) {
    var offset = parseInt(document.body.style.top, 10);
    removeClass(document.body, swalClasses.iosfix);
    document.body.style.top = '';
    document.body.scrollTop = offset * -1;
  }
};

var isIE11 = function isIE11() {
  return !!window.MSInputMethodContext && !!document.documentMode;
}; // Fix IE11 centering sweetalert2/issues/933

/* istanbul ignore next */


var fixVerticalPositionIE = function fixVerticalPositionIE() {
  var container = getContainer();
  var popup = getPopup();
  container.style.removeProperty('align-items');

  if (popup.offsetTop < 0) {
    container.style.alignItems = 'flex-start';
  }
};
/* istanbul ignore next */


var IEfix = function IEfix() {
  if (typeof window !== 'undefined' && isIE11()) {
    fixVerticalPositionIE();
    window.addEventListener('resize', fixVerticalPositionIE);
  }
};
/* istanbul ignore next */

var undoIEfix = function undoIEfix() {
  if (typeof window !== 'undefined' && isIE11()) {
    window.removeEventListener('resize', fixVerticalPositionIE);
  }
};

// Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
// elements not within the active modal dialog will not be surfaced if a user opens a screen
// reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

var setAriaHidden = function setAriaHidden() {
  var bodyChildren = toArray(document.body.children);
  bodyChildren.forEach(function (el) {
    if (el === getContainer() || contains(el, getContainer())) {
      return;
    }

    if (el.hasAttribute('aria-hidden')) {
      el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
    }

    el.setAttribute('aria-hidden', 'true');
  });
};
var unsetAriaHidden = function unsetAriaHidden() {
  var bodyChildren = toArray(document.body.children);
  bodyChildren.forEach(function (el) {
    if (el.hasAttribute('data-previous-aria-hidden')) {
      el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
      el.removeAttribute('data-previous-aria-hidden');
    } else {
      el.removeAttribute('aria-hidden');
    }
  });
};

var RESTORE_FOCUS_TIMEOUT = 100;

var globalState = {};
var restoreActiveElement = function restoreActiveElement() {
  return new Promise(function (resolve) {
    var x = window.scrollX;
    var y = window.scrollY;
    globalState.restoreFocusTimeout = setTimeout(function () {
      if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
        globalState.previousActiveElement.focus();
        globalState.previousActiveElement = null;
      } else if (document.body) {
        document.body.focus();
      }

      resolve();
    }, RESTORE_FOCUS_TIMEOUT); // issues/900

    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      // IE doesn't have scrollX/scrollY support
      window.scrollTo(x, y);
    }
  });
};

/*
 * Global function to close sweetAlert
 */

var close = function close(onClose, onAfterClose) {
  var container = getContainer();
  var popup = getPopup();

  if (!popup) {
    return;
  }

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup);
  }

  removeClass(popup, swalClasses.show);
  addClass(popup, swalClasses.hide);

  var removePopupAndResetState = function removePopupAndResetState() {
    if (!isToast()) {
      restoreActiveElement().then(function () {
        return triggerOnAfterClose(onAfterClose);
      });
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    } else {
      triggerOnAfterClose(onAfterClose);
    }

    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }

    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['toast-column']]);

    if (isModal()) {
      undoScrollbar();
      undoIOSfix();
      undoIEfix();
      unsetAriaHidden();
    }
  }; // If animation is supported, animate


  if (animationEndEvent && !hasClass(popup, swalClasses.noanimation)) {
    popup.addEventListener(animationEndEvent, function swalCloseEventFinished() {
      popup.removeEventListener(animationEndEvent, swalCloseEventFinished);

      if (hasClass(popup, swalClasses.hide)) {
        removePopupAndResetState();
      }
    });
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState();
  }
};

var triggerOnAfterClose = function triggerOnAfterClose(onAfterClose) {
  if (onAfterClose !== null && typeof onAfterClose === 'function') {
    setTimeout(function () {
      onAfterClose();
    });
  }
};

/*
 * Global function to determine if swal2 popup is shown
 */

var isVisible$1 = function isVisible() {
  return !!getPopup();
};
/*
 * Global function to click 'Confirm' button
 */

var clickConfirm = function clickConfirm() {
  return getConfirmButton().click();
};
/*
 * Global function to click 'Cancel' button
 */

var clickCancel = function clickCancel() {
  return getCancelButton().click();
};

function fire() {
  var Swal = this;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _construct(Swal, args);
}

/**
 * Extends a Swal class making it able to be instantiated without the `new` keyword (and thus without `Swal.fire`)
 * @param ParentSwal
 * @returns {NoNewKeywordSwal}
 */
function withNoNewKeyword(ParentSwal) {
  var NoNewKeywordSwal = function NoNewKeywordSwal() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!(this instanceof NoNewKeywordSwal)) {
      return _construct(NoNewKeywordSwal, args);
    }

    Object.getPrototypeOf(NoNewKeywordSwal).apply(this, args);
  };

  NoNewKeywordSwal.prototype = _extends(Object.create(ParentSwal.prototype), {
    constructor: NoNewKeywordSwal
  });

  if (typeof Object.setPrototypeOf === 'function') {
    Object.setPrototypeOf(NoNewKeywordSwal, ParentSwal);
  } else {
    // Android 4.4

    /* istanbul ignore next */
    // eslint-disable-next-line
    NoNewKeywordSwal.__proto__ = ParentSwal;
  }

  return NoNewKeywordSwal;
}

var defaultParams = {
  title: '',
  titleText: '',
  text: '',
  html: '',
  footer: '',
  type: null,
  toast: false,
  customClass: '',
  customContainerClass: '',
  target: 'body',
  backdrop: true,
  animation: true,
  heightAuto: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  stopKeydownPropagation: true,
  keydownListenerCapture: false,
  showConfirmButton: true,
  showCancelButton: false,
  preConfirm: null,
  confirmButtonText: 'OK',
  confirmButtonAriaLabel: '',
  confirmButtonColor: null,
  confirmButtonClass: null,
  cancelButtonText: 'Cancel',
  cancelButtonAriaLabel: '',
  cancelButtonColor: null,
  cancelButtonClass: null,
  buttonsStyling: true,
  reverseButtons: false,
  focusConfirm: true,
  focusCancel: false,
  showCloseButton: false,
  closeButtonAriaLabel: 'Close this dialog',
  showLoaderOnConfirm: false,
  imageUrl: null,
  imageWidth: null,
  imageHeight: null,
  imageAlt: '',
  imageClass: null,
  timer: null,
  width: null,
  padding: null,
  background: null,
  input: null,
  inputPlaceholder: '',
  inputValue: '',
  inputOptions: {},
  inputAutoTrim: true,
  inputClass: null,
  inputAttributes: {},
  inputValidator: null,
  validationMessage: null,
  grow: false,
  position: 'center',
  progressSteps: [],
  currentProgressStep: null,
  progressStepsDistance: null,
  onBeforeOpen: null,
  onAfterClose: null,
  onOpen: null,
  onClose: null,
  useRejections: false,
  expectRejections: false
};
var deprecatedParams = ['useRejections', 'expectRejections', 'extraParams'];
var toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusCancel', 'heightAuto', 'keydownListenerCapture'];
/**
 * Is valid parameter
 * @param {String} paramName
 */

var isValidParameter = function isValidParameter(paramName) {
  return defaultParams.hasOwnProperty(paramName) || paramName === 'extraParams';
};
/**
 * Is deprecated parameter
 * @param {String} paramName
 */

var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
  return deprecatedParams.indexOf(paramName) !== -1;
};
/**
 * Show relevant warnings for given params
 *
 * @param params
 */

var showWarningsForParams = function showWarningsForParams(params) {
  for (var param in params) {
    if (!isValidParameter(param)) {
      warn("Unknown parameter \"".concat(param, "\""));
    }

    if (params.toast && toastIncompatibleParams.indexOf(param) !== -1) {
      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
    }

    if (isDeprecatedParameter(param)) {
      warnOnce("The parameter \"".concat(param, "\" is deprecated and will be removed in the next major release."));
    }
  }
};

var deprecationWarning = "\"setDefaults\" & \"resetDefaults\" methods are deprecated in favor of \"mixin\" method and will be removed in the next major release. For new projects, use \"mixin\". For past projects already using \"setDefaults\", support will be provided through an additional package.";
var defaults = {};
function withGlobalDefaults(ParentSwal) {
  var SwalWithGlobalDefaults =
  /*#__PURE__*/
  function (_ParentSwal) {
    _inherits(SwalWithGlobalDefaults, _ParentSwal);

    function SwalWithGlobalDefaults() {
      _classCallCheck(this, SwalWithGlobalDefaults);

      return _possibleConstructorReturn(this, _getPrototypeOf(SwalWithGlobalDefaults).apply(this, arguments));
    }

    _createClass(SwalWithGlobalDefaults, [{
      key: "_main",
      value: function _main(params) {
        return _get(_getPrototypeOf(SwalWithGlobalDefaults.prototype), "_main", this).call(this, _extends({}, defaults, params));
      }
    }], [{
      key: "setDefaults",
      value: function setDefaults(params) {
        warnOnce(deprecationWarning);

        if (!params || _typeof(params) !== 'object') {
          throw new TypeError('SweetAlert2: The argument for setDefaults() is required and has to be a object');
        }

        showWarningsForParams(params); // assign valid params from `params` to `defaults`

        Object.keys(params).forEach(function (param) {
          if (ParentSwal.isValidParameter(param)) {
            defaults[param] = params[param];
          }
        });
      }
    }, {
      key: "resetDefaults",
      value: function resetDefaults() {
        warnOnce(deprecationWarning);
        defaults = {};
      }
    }]);

    return SwalWithGlobalDefaults;
  }(ParentSwal); // Set default params if `window._swalDefaults` is an object


  if (typeof window !== 'undefined' && _typeof(window._swalDefaults) === 'object') {
    SwalWithGlobalDefaults.setDefaults(window._swalDefaults);
  }

  return SwalWithGlobalDefaults;
}

/**
 * Returns an extended version of `Swal` containing `params` as defaults.
 * Useful for reusing Swal configuration.
 *
 * For example:
 *
 * Before:
 * const textPromptOptions = { input: 'text', showCancelButton: true }
 * const {value: firstName} = await Swal({ ...textPromptOptions, title: 'What is your first name?' })
 * const {value: lastName} = await Swal({ ...textPromptOptions, title: 'What is your last name?' })
 *
 * After:
 * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
 * const {value: firstName} = await TextPrompt('What is your first name?')
 * const {value: lastName} = await TextPrompt('What is your last name?')
 *
 * @param mixinParams
 */

function mixin(mixinParams) {
  return withNoNewKeyword(
  /*#__PURE__*/
  function (_this) {
    _inherits(MixinSwal, _this);

    function MixinSwal() {
      _classCallCheck(this, MixinSwal);

      return _possibleConstructorReturn(this, _getPrototypeOf(MixinSwal).apply(this, arguments));
    }

    _createClass(MixinSwal, [{
      key: "_main",
      value: function _main(params) {
        return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, _extends({}, mixinParams, params));
      }
    }]);

    return MixinSwal;
  }(this));
}

// private global state for the queue feature
var currentSteps = [];
/*
 * Global function for chaining sweetAlert popups
 */

var queue = function queue(steps) {
  var swal = this;
  currentSteps = steps;

  var resetQueue = function resetQueue() {
    currentSteps = [];
    document.body.removeAttribute('data-swal2-queue-step');
  };

  var queueResult = [];
  return new Promise(function (resolve) {
    (function step(i, callback) {
      if (i < currentSteps.length) {
        document.body.setAttribute('data-swal2-queue-step', i);
        swal(currentSteps[i]).then(function (result) {
          if (typeof result.value !== 'undefined') {
            queueResult.push(result.value);
            step(i + 1, callback);
          } else {
            resetQueue();
            resolve({
              dismiss: result.dismiss
            });
          }
        });
      } else {
        resetQueue();
        resolve({
          value: queueResult
        });
      }
    })(0);
  });
};
/*
 * Global function for getting the index of current popup in queue
 */

var getQueueStep = function getQueueStep() {
  return document.body.getAttribute('data-swal2-queue-step');
};
/*
 * Global function for inserting a popup to the queue
 */

var insertQueueStep = function insertQueueStep(step, index) {
  if (index && index < currentSteps.length) {
    return currentSteps.splice(index, 0, step);
  }

  return currentSteps.push(step);
};
/*
 * Global function for deleting a popup from the queue
 */

var deleteQueueStep = function deleteQueueStep(index) {
  if (typeof currentSteps[index] !== 'undefined') {
    currentSteps.splice(index, 1);
  }
};

/**
 * Show spinner instead of Confirm button and disable Cancel button
 */

var showLoading = function showLoading() {
  var popup = getPopup();

  if (!popup) {
    Swal('');
  }

  popup = getPopup();
  var actions = getActions();
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton();
  show(actions);
  show(confirmButton);
  addClass([popup, actions], swalClasses.loading);
  confirmButton.disabled = true;
  cancelButton.disabled = true;
  popup.setAttribute('data-loading', true);
  popup.setAttribute('aria-busy', true);
  popup.focus();
};

/**
 * If `timer` parameter is set, returns number of milliseconds of timer remained.
 * Otherwise, returns undefined.
 */

var getTimerLeft = function getTimerLeft() {
  return globalState.timeout && globalState.timeout.getTimerLeft();
};
/**
 * Stop timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var stopTimer = function stopTimer() {
  return globalState.timeout && globalState.timeout.stop();
};
/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var resumeTimer = function resumeTimer() {
  return globalState.timeout && globalState.timeout.start();
};
/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var toggleTimer = function toggleTimer() {
  var timer = globalState.timeout;
  return timer && (timer.running ? timer.stop() : timer.start());
};
/**
 * Increase timer. Returns number of milliseconds of an updated timer.
 * If `timer` parameter isn't set, returns undefined.
 */

var increaseTimer = function increaseTimer(n) {
  return globalState.timeout && globalState.timeout.increase(n);
};
/**
 * Check if timer is running. Returns true if timer is running
 * or false if timer is paused or stopped.
 * If `timer` parameter isn't set, returns undefined
 */

var isTimerRunning = function isTimerRunning() {
  return globalState.timeout && globalState.timeout.isRunning();
};



var staticMethods = Object.freeze({
	isValidParameter: isValidParameter,
	isDeprecatedParameter: isDeprecatedParameter,
	argsToParams: argsToParams,
	adaptInputValidator: adaptInputValidator,
	close: close,
	closePopup: close,
	closeModal: close,
	closeToast: close,
	isVisible: isVisible$1,
	clickConfirm: clickConfirm,
	clickCancel: clickCancel,
	getContainer: getContainer,
	getPopup: getPopup,
	getTitle: getTitle,
	getContent: getContent,
	getImage: getImage,
	getIcons: getIcons,
	getCloseButton: getCloseButton,
	getButtonsWrapper: getButtonsWrapper,
	getActions: getActions,
	getConfirmButton: getConfirmButton,
	getCancelButton: getCancelButton,
	getFooter: getFooter,
	getFocusableElements: getFocusableElements,
	getValidationMessage: getValidationMessage,
	isLoading: isLoading,
	fire: fire,
	mixin: mixin,
	queue: queue,
	getQueueStep: getQueueStep,
	insertQueueStep: insertQueueStep,
	deleteQueueStep: deleteQueueStep,
	showLoading: showLoading,
	enableLoading: showLoading,
	getTimerLeft: getTimerLeft,
	stopTimer: stopTimer,
	resumeTimer: resumeTimer,
	toggleTimer: toggleTimer,
	increaseTimer: increaseTimer,
	isTimerRunning: isTimerRunning
});

// https://github.com/Riim/symbol-polyfill/blob/master/index.js

/* istanbul ignore next */
var _Symbol = typeof Symbol === 'function' ? Symbol : function () {
  var idCounter = 0;

  function _Symbol(key) {
    return '__' + key + '_' + Math.floor(Math.random() * 1e9) + '_' + ++idCounter + '__';
  }

  _Symbol.iterator = _Symbol('Symbol.iterator');
  return _Symbol;
}();

// WeakMap polyfill, needed for Android 4.4
// Related issue: https://github.com/sweetalert2/sweetalert2/issues/1071
// http://webreflection.blogspot.fi/2015/04/a-weakmap-polyfill-in-20-lines-of-code.html
/* istanbul ignore next */

var WeakMap$1 = typeof WeakMap === 'function' ? WeakMap : function (s, dP, hOP) {
  function WeakMap() {
    dP(this, s, {
      value: _Symbol('WeakMap')
    });
  }

  WeakMap.prototype = {
    'delete': function del(o) {
      delete o[this[s]];
    },
    get: function get(o) {
      return o[this[s]];
    },
    has: function has(o) {
      return hOP.call(o, this[s]);
    },
    set: function set(o, v) {
      dP(o, this[s], {
        configurable: true,
        value: v
      });
    }
  };
  return WeakMap;
}(_Symbol('WeakMap'), Object.defineProperty, {}.hasOwnProperty);

/**
 * This module containts `WeakMap`s for each effectively-"private  property" that a `swal` has.
 * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
 * This is the approach that Babel will probably take to implement private methods/fields
 *   https://github.com/tc39/proposal-private-methods
 *   https://github.com/babel/babel/pull/7555
 * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
 *   then we can use that language feature.
 */
var privateProps = {
  promise: new WeakMap$1(),
  innerParams: new WeakMap$1(),
  domCache: new WeakMap$1()
};

/**
 * Enables buttons and hide loader.
 */

function hideLoading() {
  var innerParams = privateProps.innerParams.get(this);
  var domCache = privateProps.domCache.get(this);

  if (!innerParams.showConfirmButton) {
    hide(domCache.confirmButton);

    if (!innerParams.showCancelButton) {
      hide(domCache.actions);
    }
  }

  removeClass([domCache.popup, domCache.actions], swalClasses.loading);
  domCache.popup.removeAttribute('aria-busy');
  domCache.popup.removeAttribute('data-loading');
  domCache.confirmButton.disabled = false;
  domCache.cancelButton.disabled = false;
}

function getInput(inputType) {
  var innerParams = privateProps.innerParams.get(this);
  var domCache = privateProps.domCache.get(this);
  inputType = inputType || innerParams.input;

  if (!inputType) {
    return null;
  }

  switch (inputType) {
    case 'select':
    case 'textarea':
    case 'file':
      return getChildByClass(domCache.content, swalClasses[inputType]);

    case 'checkbox':
      return domCache.popup.querySelector(".".concat(swalClasses.checkbox, " input"));

    case 'radio':
      return domCache.popup.querySelector(".".concat(swalClasses.radio, " input:checked")) || domCache.popup.querySelector(".".concat(swalClasses.radio, " input:first-child"));

    case 'range':
      return domCache.popup.querySelector(".".concat(swalClasses.range, " input"));

    default:
      return getChildByClass(domCache.content, swalClasses.input);
  }
}

function enableButtons() {
  var domCache = privateProps.domCache.get(this);
  domCache.confirmButton.disabled = false;
  domCache.cancelButton.disabled = false;
}
function disableButtons() {
  var domCache = privateProps.domCache.get(this);
  domCache.confirmButton.disabled = true;
  domCache.cancelButton.disabled = true;
}
function enableConfirmButton() {
  var domCache = privateProps.domCache.get(this);
  domCache.confirmButton.disabled = false;
}
function disableConfirmButton() {
  var domCache = privateProps.domCache.get(this);
  domCache.confirmButton.disabled = true;
}
function enableInput() {
  var input = this.getInput();

  if (!input) {
    return false;
  }

  if (input.type === 'radio') {
    var radiosContainer = input.parentNode.parentNode;
    var radios = radiosContainer.querySelectorAll('input');

    for (var i = 0; i < radios.length; i++) {
      radios[i].disabled = false;
    }
  } else {
    input.disabled = false;
  }
}
function disableInput() {
  var input = this.getInput();

  if (!input) {
    return false;
  }

  if (input && input.type === 'radio') {
    var radiosContainer = input.parentNode.parentNode;
    var radios = radiosContainer.querySelectorAll('input');

    for (var i = 0; i < radios.length; i++) {
      radios[i].disabled = true;
    }
  } else {
    input.disabled = true;
  }
}

function showValidationMessage(error$$1) {
  var domCache = privateProps.domCache.get(this);
  domCache.validationMessage.innerHTML = error$$1;
  var popupComputedStyle = window.getComputedStyle(domCache.popup);
  domCache.validationMessage.style.marginLeft = "-".concat(popupComputedStyle.getPropertyValue('padding-left'));
  domCache.validationMessage.style.marginRight = "-".concat(popupComputedStyle.getPropertyValue('padding-right'));
  show(domCache.validationMessage);
  var input = this.getInput();

  if (input) {
    input.setAttribute('aria-invalid', true);
    input.setAttribute('aria-describedBy', swalClasses['validation-message']);
    focusInput(input);
    addClass(input, swalClasses.inputerror);
  }
} // Hide block with validation message

function resetValidationMessage() {
  var domCache = privateProps.domCache.get(this);

  if (domCache.validationMessage) {
    hide(domCache.validationMessage);
  }

  var input = this.getInput();

  if (input) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedBy');
    removeClass(input, swalClasses.inputerror);
  }
} // @deprecated

/* istanbul ignore next */

function resetValidationError() {
  warnOnce("Swal.resetValidationError() is deprecated and will be removed in the next major release, use Swal.resetValidationMessage() instead");
  resetValidationMessage.bind(this)();
} // @deprecated

/* istanbul ignore next */

function showValidationError(error$$1) {
  warnOnce("Swal.showValidationError() is deprecated and will be removed in the next major release, use Swal.showValidationMessage() instead");
  showValidationMessage.bind(this)(error$$1);
}

function getProgressSteps$1() {
  var innerParams = privateProps.innerParams.get(this);
  return innerParams.progressSteps;
}
function setProgressSteps(progressSteps) {
  var innerParams = privateProps.innerParams.get(this);

  var updatedParams = _extends({}, innerParams, {
    progressSteps: progressSteps
  });

  privateProps.innerParams.set(this, updatedParams);
  renderProgressSteps(updatedParams);
}
function showProgressSteps() {
  var domCache = privateProps.domCache.get(this);
  show(domCache.progressSteps);
}
function hideProgressSteps() {
  var domCache = privateProps.domCache.get(this);
  hide(domCache.progressSteps);
}

var Timer = function Timer(callback, delay) {
  _classCallCheck(this, Timer);

  var id,
      started,
      remaining = delay;
  this.running = false;

  this.start = function () {
    if (!this.running) {
      this.running = true;
      started = new Date();
      id = setTimeout(callback, remaining);
    }

    return remaining;
  };

  this.stop = function () {
    if (this.running) {
      this.running = false;
      clearTimeout(id);
      remaining -= new Date() - started;
    }

    return remaining;
  };

  this.increase = function (n) {
    var running = this.running;

    if (running) {
      this.stop();
    }

    remaining += n;

    if (running) {
      this.start();
    }

    return remaining;
  };

  this.getTimerLeft = function () {
    if (this.running) {
      this.stop();
      this.start();
    }

    return remaining;
  };

  this.isRunning = function () {
    return this.running;
  };

  this.start();
};

var defaultInputValidators = {
  email: function email(string, extraParams) {
    return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.reject(extraParams && extraParams.validationMessage ? extraParams.validationMessage : 'Invalid email address');
  },
  url: function url(string, extraParams) {
    // taken from https://stackoverflow.com/a/3809435 with a small change from #1306
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(string) ? Promise.resolve() : Promise.reject(extraParams && extraParams.validationMessage ? extraParams.validationMessage : 'Invalid URL');
  }
};

/**
 * Set type, text and actions on popup
 *
 * @param params
 * @returns {boolean}
 */

function setParameters(params) {
  // Use default `inputValidator` for supported input types if not provided
  if (!params.inputValidator) {
    Object.keys(defaultInputValidators).forEach(function (key) {
      if (params.input === key) {
        params.inputValidator = params.expectRejections ? defaultInputValidators[key] : Swal.adaptInputValidator(defaultInputValidators[key]);
      }
    });
  } // params.extraParams is @deprecated


  if (params.validationMessage) {
    if (_typeof(params.extraParams) !== 'object') {
      params.extraParams = {};
    }

    params.extraParams.validationMessage = params.validationMessage;
  } // Determine if the custom target element is valid


  if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
    warn('Target parameter is not valid, defaulting to "body"');
    params.target = 'body';
  } // Animation


  if (typeof params.animation === 'function') {
    params.animation = params.animation.call();
  }

  var popup;
  var oldPopup = getPopup();
  var targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target; // If the model target has changed, refresh the popup

  if (oldPopup && targetElement && oldPopup.parentNode !== targetElement.parentNode) {
    popup = init(params);
  } else {
    popup = oldPopup || init(params);
  } // Set popup width


  if (params.width) {
    popup.style.width = typeof params.width === 'number' ? params.width + 'px' : params.width;
  } // Set popup padding


  if (params.padding) {
    popup.style.padding = typeof params.padding === 'number' ? params.padding + 'px' : params.padding;
  } // Set popup background


  if (params.background) {
    popup.style.background = params.background;
  }

  var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
  var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

  for (var i = 0; i < successIconParts.length; i++) {
    successIconParts[i].style.backgroundColor = popupBackgroundColor;
  }

  var container = getContainer();
  var closeButton = getCloseButton();
  var footer = getFooter(); // Title

  renderTitle(params); // Content

  renderContent(params); // Backdrop

  if (typeof params.backdrop === 'string') {
    getContainer().style.background = params.backdrop;
  } else if (!params.backdrop) {
    addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
  }

  if (!params.backdrop && params.allowOutsideClick) {
    warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
  } // Position


  if (params.position in swalClasses) {
    addClass(container, swalClasses[params.position]);
  } else {
    warn('The "position" parameter is not valid, defaulting to "center"');
    addClass(container, swalClasses.center);
  } // Grow


  if (params.grow && typeof params.grow === 'string') {
    var growClass = 'grow-' + params.grow;

    if (growClass in swalClasses) {
      addClass(container, swalClasses[growClass]);
    }
  } // Close button


  if (params.showCloseButton) {
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
    show(closeButton);
  } else {
    hide(closeButton);
  } // Default Class


  popup.className = swalClasses.popup;

  if (params.toast) {
    addClass([document.documentElement, document.body], swalClasses['toast-shown']);
    addClass(popup, swalClasses.toast);
  } else {
    addClass(popup, swalClasses.modal);
  } // Custom Class


  if (params.customClass) {
    addClass(popup, params.customClass);
  }

  if (params.customContainerClass) {
    addClass(container, params.customContainerClass);
  } // Progress steps


  renderProgressSteps(params); // Icon

  renderIcon(params); // Image

  renderImage(params); // Actions (buttons)

  renderActions(params); // Footer

  parseHtmlToContainer(params.footer, footer); // CSS animation

  if (params.animation === true) {
    removeClass(popup, swalClasses.noanimation);
  } else {
    addClass(popup, swalClasses.noanimation);
  } // showLoaderOnConfirm && preConfirm


  if (params.showLoaderOnConfirm && !params.preConfirm) {
    warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
  }
}

/**
 * Open popup, add necessary classes and styles, fix scrollbar
 *
 * @param {Array} params
 */

var openPopup = function openPopup(params) {
  var container = getContainer();
  var popup = getPopup();

  if (params.onBeforeOpen !== null && typeof params.onBeforeOpen === 'function') {
    params.onBeforeOpen(popup);
  }

  if (params.animation) {
    addClass(popup, swalClasses.show);
    addClass(container, swalClasses.fade);
    removeClass(popup, swalClasses.hide);
  } else {
    removeClass(popup, swalClasses.fade);
  }

  show(popup); // scrolling is 'hidden' until animation is done, after that 'auto'

  container.style.overflowY = 'hidden';

  if (animationEndEvent && !hasClass(popup, swalClasses.noanimation)) {
    popup.addEventListener(animationEndEvent, function swalCloseEventFinished() {
      popup.removeEventListener(animationEndEvent, swalCloseEventFinished);
      container.style.overflowY = 'auto';
    });
  } else {
    container.style.overflowY = 'auto';
  }

  addClass([document.documentElement, document.body, container], swalClasses.shown);

  if (params.heightAuto && params.backdrop && !params.toast) {
    addClass([document.documentElement, document.body], swalClasses['height-auto']);
  }

  if (isModal()) {
    fixScrollbar();
    iOSfix();
    IEfix();
    setAriaHidden(); // sweetalert2/issues/1247

    setTimeout(function () {
      container.scrollTop = 0;
    });
  }

  if (!isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement;
  }

  if (params.onOpen !== null && typeof params.onOpen === 'function') {
    setTimeout(function () {
      params.onOpen(popup);
    });
  }
};

function _main(userParams) {
  var _this = this;

  showWarningsForParams(userParams);

  var innerParams = _extends({}, defaultParams, userParams);

  setParameters(innerParams);
  Object.freeze(innerParams);
  privateProps.innerParams.set(this, innerParams); // clear the previous timer

  if (globalState.timeout) {
    globalState.timeout.stop();
    delete globalState.timeout;
  } // clear the restore focus timeout


  clearTimeout(globalState.restoreFocusTimeout);
  var domCache = {
    popup: getPopup(),
    container: getContainer(),
    content: getContent(),
    actions: getActions(),
    confirmButton: getConfirmButton(),
    cancelButton: getCancelButton(),
    closeButton: getCloseButton(),
    validationMessage: getValidationMessage(),
    progressSteps: getProgressSteps()
  };
  privateProps.domCache.set(this, domCache);
  var constructor = this.constructor;
  return new Promise(function (resolve, reject) {
    // functions to handle all resolving/rejecting/settling
    var succeedWith = function succeedWith(value) {
      constructor.closePopup(innerParams.onClose, innerParams.onAfterClose); // TODO: make closePopup an *instance* method

      if (innerParams.useRejections) {
        resolve(value);
      } else {
        resolve({
          value: value
        });
      }
    };

    var dismissWith = function dismissWith(dismiss) {
      constructor.closePopup(innerParams.onClose, innerParams.onAfterClose);

      if (innerParams.useRejections) {
        reject(dismiss);
      } else {
        resolve({
          dismiss: dismiss
        });
      }
    };

    var errorWith = function errorWith(error$$1) {
      constructor.closePopup(innerParams.onClose, innerParams.onAfterClose);
      reject(error$$1);
    }; // Close on timer


    if (innerParams.timer) {
      globalState.timeout = new Timer(function () {
        dismissWith('timer');
        delete globalState.timeout;
      }, innerParams.timer);
    } // Get the value of the popup input


    var getInputValue = function getInputValue() {
      var input = _this.getInput();

      if (!input) {
        return null;
      }

      switch (innerParams.input) {
        case 'checkbox':
          return input.checked ? 1 : 0;

        case 'radio':
          return input.checked ? input.value : null;

        case 'file':
          return input.files.length ? input.files[0] : null;

        default:
          return innerParams.inputAutoTrim ? input.value.trim() : input.value;
      }
    }; // input autofocus


    if (innerParams.input) {
      setTimeout(function () {
        var input = _this.getInput();

        if (input) {
          focusInput(input);
        }
      }, 0);
    }

    var confirm = function confirm(value) {
      if (innerParams.showLoaderOnConfirm) {
        constructor.showLoading(); // TODO: make showLoading an *instance* method
      }

      if (innerParams.preConfirm) {
        _this.resetValidationMessage();

        var preConfirmPromise = Promise.resolve().then(function () {
          return innerParams.preConfirm(value, innerParams.extraParams);
        });

        if (innerParams.expectRejections) {
          preConfirmPromise.then(function (preConfirmValue) {
            return succeedWith(preConfirmValue || value);
          }, function (validationMessage) {
            _this.hideLoading();

            if (validationMessage) {
              _this.showValidationMessage(validationMessage);
            }
          });
        } else {
          preConfirmPromise.then(function (preConfirmValue) {
            if (isVisible(domCache.validationMessage) || preConfirmValue === false) {
              _this.hideLoading();
            } else {
              succeedWith(preConfirmValue || value);
            }
          }, function (error$$1) {
            return errorWith(error$$1);
          });
        }
      } else {
        succeedWith(value);
      }
    }; // Mouse interactions


    var onButtonEvent = function onButtonEvent(e) {
      var target = e.target;
      var confirmButton = domCache.confirmButton,
          cancelButton = domCache.cancelButton;
      var targetedConfirm = confirmButton && (confirmButton === target || confirmButton.contains(target));
      var targetedCancel = cancelButton && (cancelButton === target || cancelButton.contains(target));

      switch (e.type) {
        case 'click':
          // Clicked 'confirm'
          if (targetedConfirm && constructor.isVisible()) {
            _this.disableButtons();

            if (innerParams.input) {
              var inputValue = getInputValue();

              if (innerParams.inputValidator) {
                _this.disableInput();

                var validationPromise = Promise.resolve().then(function () {
                  return innerParams.inputValidator(inputValue, innerParams.extraParams);
                });

                if (innerParams.expectRejections) {
                  validationPromise.then(function () {
                    _this.enableButtons();

                    _this.enableInput();

                    confirm(inputValue);
                  }, function (validationMessage) {
                    _this.enableButtons();

                    _this.enableInput();

                    if (validationMessage) {
                      _this.showValidationMessage(validationMessage);
                    }
                  });
                } else {
                  validationPromise.then(function (validationMessage) {
                    _this.enableButtons();

                    _this.enableInput();

                    if (validationMessage) {
                      _this.showValidationMessage(validationMessage);
                    } else {
                      confirm(inputValue);
                    }
                  }, function (error$$1) {
                    return errorWith(error$$1);
                  });
                }
              } else if (!_this.getInput().checkValidity()) {
                _this.enableButtons();

                _this.showValidationMessage(innerParams.validationMessage);
              } else {
                confirm(inputValue);
              }
            } else {
              confirm(true);
            } // Clicked 'cancel'

          } else if (targetedCancel && constructor.isVisible()) {
            _this.disableButtons();

            dismissWith(constructor.DismissReason.cancel);
          }

          break;

        default:
      }
    };

    var buttons = domCache.popup.querySelectorAll('button');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].onclick = onButtonEvent;
      buttons[i].onmouseover = onButtonEvent;
      buttons[i].onmouseout = onButtonEvent;
      buttons[i].onmousedown = onButtonEvent;
    } // Closing popup by close button


    domCache.closeButton.onclick = function () {
      dismissWith(constructor.DismissReason.close);
    };

    if (innerParams.toast) {
      // Closing popup by internal click
      domCache.popup.onclick = function () {
        if (innerParams.showConfirmButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.input) {
          return;
        }

        dismissWith(constructor.DismissReason.close);
      };
    } else {
      var ignoreOutsideClick = false; // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider

      domCache.popup.onmousedown = function () {
        domCache.container.onmouseup = function (e) {
          domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
          // have any other direct children aside of the popup

          if (e.target === domCache.container) {
            ignoreOutsideClick = true;
          }
        };
      }; // Ignore click events that had mousedown on the container but mouseup on the popup


      domCache.container.onmousedown = function () {
        domCache.popup.onmouseup = function (e) {
          domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

          if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
            ignoreOutsideClick = true;
          }
        };
      };

      domCache.container.onclick = function (e) {
        if (ignoreOutsideClick) {
          ignoreOutsideClick = false;
          return;
        }

        if (e.target !== domCache.container) {
          return;
        }

        if (callIfFunction(innerParams.allowOutsideClick)) {
          dismissWith(constructor.DismissReason.backdrop);
        }
      };
    } // Reverse buttons (Confirm on the right side)


    if (innerParams.reverseButtons) {
      domCache.confirmButton.parentNode.insertBefore(domCache.cancelButton, domCache.confirmButton);
    } else {
      domCache.confirmButton.parentNode.insertBefore(domCache.confirmButton, domCache.cancelButton);
    } // Focus handling


    var setFocus = function setFocus(index, increment) {
      var focusableElements = getFocusableElements(innerParams.focusCancel); // search for visible elements and select the next possible match

      for (var _i = 0; _i < focusableElements.length; _i++) {
        index = index + increment; // rollover to first item

        if (index === focusableElements.length) {
          index = 0; // go to last item
        } else if (index === -1) {
          index = focusableElements.length - 1;
        }

        return focusableElements[index].focus();
      } // no visible focusable elements, focus the popup


      domCache.popup.focus();
    };

    var keydownHandler = function keydownHandler(e, innerParams) {
      if (innerParams.stopKeydownPropagation) {
        e.stopPropagation();
      }

      var arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down' // IE11
      ];

      if (e.key === 'Enter' && !e.isComposing) {
        if (e.target && _this.getInput() && e.target.outerHTML === _this.getInput().outerHTML) {
          if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
            return; // do not submit
          }

          constructor.clickConfirm();
          e.preventDefault();
        } // TAB

      } else if (e.key === 'Tab') {
        var targetElement = e.target;
        var focusableElements = getFocusableElements(innerParams.focusCancel);
        var btnIndex = -1;

        for (var _i2 = 0; _i2 < focusableElements.length; _i2++) {
          if (targetElement === focusableElements[_i2]) {
            btnIndex = _i2;
            break;
          }
        }

        if (!e.shiftKey) {
          // Cycle to the next button
          setFocus(btnIndex, 1);
        } else {
          // Cycle to the prev button
          setFocus(btnIndex, -1);
        }

        e.stopPropagation();
        e.preventDefault(); // ARROWS - switch focus between buttons
      } else if (arrowKeys.indexOf(e.key) !== -1) {
        // focus Cancel button if Confirm button is currently focused
        if (document.activeElement === domCache.confirmButton && isVisible(domCache.cancelButton)) {
          domCache.cancelButton.focus(); // and vice versa
        } else if (document.activeElement === domCache.cancelButton && isVisible(domCache.confirmButton)) {
          domCache.confirmButton.focus();
        } // ESC

      } else if ((e.key === 'Escape' || e.key === 'Esc') && callIfFunction(innerParams.allowEscapeKey) === true) {
        e.preventDefault();
        dismissWith(constructor.DismissReason.esc);
      }
    };

    if (globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (!innerParams.toast) {
      globalState.keydownHandler = function (e) {
        return keydownHandler(e, innerParams);
      };

      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : domCache.popup;
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }

    _this.enableButtons();

    _this.hideLoading();

    _this.resetValidationMessage();

    if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
      addClass(document.body, swalClasses['toast-column']);
    } else {
      removeClass(document.body, swalClasses['toast-column']);
    } // inputs


    var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

    var setInputPlaceholder = function setInputPlaceholder(input) {
      if (!input.placeholder || innerParams.inputPlaceholder) {
        input.placeholder = innerParams.inputPlaceholder;
      }
    };

    var input;

    for (var _i3 = 0; _i3 < inputTypes.length; _i3++) {
      var inputClass = swalClasses[inputTypes[_i3]];
      var inputContainer = getChildByClass(domCache.content, inputClass);
      input = _this.getInput(inputTypes[_i3]); // set attributes

      if (input) {
        for (var j in input.attributes) {
          if (input.attributes.hasOwnProperty(j)) {
            var attrName = input.attributes[j].name;

            if (attrName !== 'type' && attrName !== 'value') {
              input.removeAttribute(attrName);
            }
          }
        }

        for (var attr in innerParams.inputAttributes) {
          // Do not set a placeholder for <input type="range">
          // it'll crash Edge, #1298
          if (inputTypes[_i3] === 'range' && attr === 'placeholder') {
            continue;
          }

          input.setAttribute(attr, innerParams.inputAttributes[attr]);
        }
      } // set class


      inputContainer.className = inputClass;

      if (innerParams.inputClass) {
        addClass(inputContainer, innerParams.inputClass);
      }

      hide(inputContainer);
    }

    var populateInputOptions;

    switch (innerParams.input) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        {
          input = getChildByClass(domCache.content, swalClasses.input);

          if (typeof innerParams.inputValue === 'string' || typeof innerParams.inputValue === 'number') {
            input.value = innerParams.inputValue;
          } else if (!isPromise(innerParams.inputValue)) {
            warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(_typeof(innerParams.inputValue), "\""));
          }

          setInputPlaceholder(input);
          input.type = innerParams.input;
          show(input);
          break;
        }

      case 'file':
        {
          input = getChildByClass(domCache.content, swalClasses.file);
          setInputPlaceholder(input);
          input.type = innerParams.input;
          show(input);
          break;
        }

      case 'range':
        {
          var range = getChildByClass(domCache.content, swalClasses.range);
          var rangeInput = range.querySelector('input');
          var rangeOutput = range.querySelector('output');
          rangeInput.value = innerParams.inputValue;
          rangeInput.type = innerParams.input;
          rangeOutput.value = innerParams.inputValue;
          show(range);
          break;
        }

      case 'select':
        {
          var select = getChildByClass(domCache.content, swalClasses.select);
          select.innerHTML = '';

          if (innerParams.inputPlaceholder) {
            var placeholder = document.createElement('option');
            placeholder.innerHTML = innerParams.inputPlaceholder;
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            select.appendChild(placeholder);
          }

          populateInputOptions = function populateInputOptions(inputOptions) {
            inputOptions.forEach(function (inputOption) {
              var optionValue = inputOption[0];
              var optionLabel = inputOption[1];
              var option = document.createElement('option');
              option.value = optionValue;
              option.innerHTML = optionLabel;

              if (innerParams.inputValue.toString() === optionValue.toString()) {
                option.selected = true;
              }

              select.appendChild(option);
            });
            show(select);
            select.focus();
          };

          break;
        }

      case 'radio':
        {
          var radio = getChildByClass(domCache.content, swalClasses.radio);
          radio.innerHTML = '';

          populateInputOptions = function populateInputOptions(inputOptions) {
            inputOptions.forEach(function (inputOption) {
              var radioValue = inputOption[0];
              var radioLabel = inputOption[1];
              var radioInput = document.createElement('input');
              var radioLabelElement = document.createElement('label');
              radioInput.type = 'radio';
              radioInput.name = swalClasses.radio;
              radioInput.value = radioValue;

              if (innerParams.inputValue.toString() === radioValue.toString()) {
                radioInput.checked = true;
              }

              var label = document.createElement('span');
              label.innerHTML = radioLabel;
              label.className = swalClasses.label;
              radioLabelElement.appendChild(radioInput);
              radioLabelElement.appendChild(label);
              radio.appendChild(radioLabelElement);
            });
            show(radio);
            var radios = radio.querySelectorAll('input');

            if (radios.length) {
              radios[0].focus();
            }
          };

          break;
        }

      case 'checkbox':
        {
          var checkbox = getChildByClass(domCache.content, swalClasses.checkbox);

          var checkboxInput = _this.getInput('checkbox');

          checkboxInput.type = 'checkbox';
          checkboxInput.value = 1;
          checkboxInput.id = swalClasses.checkbox;
          checkboxInput.checked = Boolean(innerParams.inputValue);
          var label = checkbox.querySelector('span');
          label.innerHTML = innerParams.inputPlaceholder;
          show(checkbox);
          break;
        }

      case 'textarea':
        {
          var textarea = getChildByClass(domCache.content, swalClasses.textarea);
          textarea.value = innerParams.inputValue;
          setInputPlaceholder(textarea);
          show(textarea);
          break;
        }

      case null:
        {
          break;
        }

      default:
        error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(innerParams.input, "\""));
        break;
    }

    if (innerParams.input === 'select' || innerParams.input === 'radio') {
      var processInputOptions = function processInputOptions(inputOptions) {
        return populateInputOptions(formatInputOptions(inputOptions));
      };

      if (isPromise(innerParams.inputOptions)) {
        constructor.showLoading();
        innerParams.inputOptions.then(function (inputOptions) {
          _this.hideLoading();

          processInputOptions(inputOptions);
        });
      } else if (_typeof(innerParams.inputOptions) === 'object') {
        processInputOptions(innerParams.inputOptions);
      } else {
        error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(innerParams.inputOptions)));
      }
    } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(innerParams.input) !== -1 && isPromise(innerParams.inputValue)) {
      constructor.showLoading();
      hide(input);
      innerParams.inputValue.then(function (inputValue) {
        input.value = innerParams.input === 'number' ? parseFloat(inputValue) || 0 : inputValue + '';
        show(input);
        input.focus();

        _this.hideLoading();
      }).catch(function (err) {
        error('Error in inputValue promise: ' + err);
        input.value = '';
        show(input);
        input.focus();

        _this.hideLoading();
      });
    }

    openPopup(innerParams);

    if (!innerParams.toast) {
      if (!callIfFunction(innerParams.allowEnterKey)) {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      } else if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
        domCache.cancelButton.focus();
      } else if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
        domCache.confirmButton.focus();
      } else {
        setFocus(-1, 1);
      }
    } // fix scroll


    domCache.container.scrollTop = 0;
  });
}



var instanceMethods = Object.freeze({
	hideLoading: hideLoading,
	disableLoading: hideLoading,
	getInput: getInput,
	enableButtons: enableButtons,
	disableButtons: disableButtons,
	enableConfirmButton: enableConfirmButton,
	disableConfirmButton: disableConfirmButton,
	enableInput: enableInput,
	disableInput: disableInput,
	showValidationMessage: showValidationMessage,
	resetValidationMessage: resetValidationMessage,
	resetValidationError: resetValidationError,
	showValidationError: showValidationError,
	getProgressSteps: getProgressSteps$1,
	setProgressSteps: setProgressSteps,
	showProgressSteps: showProgressSteps,
	hideProgressSteps: hideProgressSteps,
	_main: _main
});

var currentInstance; // SweetAlert constructor

function SweetAlert() {
  // Prevent run in Node env

  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    return;
  } // Check for the existence of Promise

  /* istanbul ignore if */


  if (typeof Promise === 'undefined') {
    error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
  }

  currentInstance = this;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var outerParams = Object.freeze(this.constructor.argsToParams(args));
  Object.defineProperties(this, {
    params: {
      value: outerParams,
      writable: false,
      enumerable: true
    }
  });

  var promise = this._main(this.params);

  privateProps.promise.set(this, promise);
} // `catch` cannot be the name of a module export, so we define our thenable methods here instead


SweetAlert.prototype.then = function (onFulfilled, onRejected) {
  var promise = privateProps.promise.get(this);
  return promise.then(onFulfilled, onRejected);
};

SweetAlert.prototype.catch = function (onRejected) {
  var promise = privateProps.promise.get(this);
  return promise.catch(onRejected);
};

SweetAlert.prototype.finally = function (onFinally) {
  var promise = privateProps.promise.get(this);
  return promise.finally(onFinally);
}; // Assign instance methods from src/instanceMethods/*.js to prototype


_extends(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor


_extends(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility


Object.keys(instanceMethods).forEach(function (key) {
  SweetAlert[key] = function () {
    if (currentInstance) {
      var _currentInstance;

      return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
    }
  };
});
SweetAlert.DismissReason = DismissReason;
/* istanbul ignore next */

SweetAlert.noop = function () {};

var Swal = withNoNewKeyword(withGlobalDefaults(SweetAlert));
Swal.default = Swal;

return Swal;

})));
if (typeof window !== 'undefined' && window.Sweetalert2){  window.Sweetalert2.version = '7.33.1';  window.swal = window.sweetAlert = window.Swal = window.SweetAlert = window.Sweetalert2}

"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,"@-webkit-keyframes swal2-show{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}100%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes swal2-show{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}100%{-webkit-transform:scale(1);transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}100%{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}100%{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}100%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}100%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}50%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}80%{margin-top:-.375em;-webkit-transform:scale(1.15);transform:scale(1.15)}100%{margin-top:0;-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}50%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}80%{margin-top:-.375em;-webkit-transform:scale(1.15);transform:scale(1.15)}100%{margin-top:0;-webkit-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}100%{-webkit-transform:rotateX(0);transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}100%{-webkit-transform:rotateX(0);transform:rotateX(0);opacity:1}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-shown{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;box-shadow:0 0 .625em #d9d9d9;overflow-y:hidden}.swal2-popup.swal2-toast .swal2-header{flex-direction:row}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:initial;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon-text{font-size:2em;font-weight:700;line-height:1em}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{height:auto;margin:0 .3125em}.swal2-popup.swal2-toast .swal2-styled{margin:0 .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 .0625em #fff,0 0 0 .125em rgba(50,100,150,.4)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:2em;height:2.8125em;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.25em;left:-.9375em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:2em 2em;transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;-webkit-transform-origin:0 2em;transform-origin:0 2em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:showSweetToast .5s;animation:showSweetToast .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:hideSweetToast .2s forwards;animation:hideSweetToast .2s forwards}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:animate-toast-success-tip .75s;animation:animate-toast-success-tip .75s}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:animate-toast-success-long .75s;animation:animate-toast-success-long .75s}@-webkit-keyframes showSweetToast{0%{-webkit-transform:translateY(-.625em) rotateZ(2deg);transform:translateY(-.625em) rotateZ(2deg);opacity:0}33%{-webkit-transform:translateY(0) rotateZ(-2deg);transform:translateY(0) rotateZ(-2deg);opacity:.5}66%{-webkit-transform:translateY(.3125em) rotateZ(2deg);transform:translateY(.3125em) rotateZ(2deg);opacity:.7}100%{-webkit-transform:translateY(0) rotateZ(0);transform:translateY(0) rotateZ(0);opacity:1}}@keyframes showSweetToast{0%{-webkit-transform:translateY(-.625em) rotateZ(2deg);transform:translateY(-.625em) rotateZ(2deg);opacity:0}33%{-webkit-transform:translateY(0) rotateZ(-2deg);transform:translateY(0) rotateZ(-2deg);opacity:.5}66%{-webkit-transform:translateY(.3125em) rotateZ(2deg);transform:translateY(.3125em) rotateZ(2deg);opacity:.7}100%{-webkit-transform:translateY(0) rotateZ(0);transform:translateY(0) rotateZ(0);opacity:1}}@-webkit-keyframes hideSweetToast{0%{opacity:1}33%{opacity:.5}100%{-webkit-transform:rotateZ(1deg);transform:rotateZ(1deg);opacity:0}}@keyframes hideSweetToast{0%{opacity:1}33%{opacity:.5}100%{-webkit-transform:rotateZ(1deg);transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes animate-toast-success-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes animate-toast-success-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes animate-toast-success-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes animate-toast-success-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-shown{top:auto;right:auto;bottom:auto;left:auto;background-color:transparent}body.swal2-no-backdrop .swal2-shown>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-shown.swal2-top{top:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-top-left,body.swal2-no-backdrop .swal2-shown.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-top-end,body.swal2-no-backdrop .swal2-shown.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-shown.swal2-center{top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-left,body.swal2-no-backdrop .swal2-shown.swal2-center-start{top:50%;left:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-end,body.swal2-no-backdrop .swal2-shown.swal2-center-right{top:50%;right:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom{bottom:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom-left,body.swal2-no-backdrop .swal2-shown.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-bottom-end,body.swal2-no-backdrop .swal2-shown.swal2-bottom-right{right:0;bottom:0}.swal2-container{display:flex;position:fixed;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:10px;background-color:transparent;z-index:1060;overflow-x:hidden;-webkit-overflow-scrolling:touch}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-container.swal2-fade{transition:background-color .1s}.swal2-container.swal2-shown{background-color:rgba(0,0,0,.4)}.swal2-popup{display:none;position:relative;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border-radius:.3125em;background:#fff;font-family:inherit;font-size:1rem;box-sizing:border-box}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-popup .swal2-header{display:flex;flex-direction:column;align-items:center}.swal2-popup .swal2-title{display:block;position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-popup .swal2-actions{flex-wrap:wrap;align-items:center;justify-content:center;margin:1.25em auto 0;z-index:1}.swal2-popup .swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-popup .swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-popup .swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-popup .swal2-actions.swal2-loading .swal2-styled.swal2-confirm{width:2.5em;height:2.5em;margin:.46875em;padding:0;border:.25em solid transparent;border-radius:100%;border-color:transparent;background-color:transparent!important;color:transparent;cursor:default;box-sizing:border-box;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-popup .swal2-actions.swal2-loading .swal2-styled.swal2-cancel{margin-right:30px;margin-left:30px}.swal2-popup .swal2-actions.swal2-loading :not(.swal2-styled).swal2-confirm::after{display:inline-block;width:15px;height:15px;margin-left:5px;border:3px solid #999;border-radius:50%;border-right-color:transparent;box-shadow:1px 1px 1px #fff;content:'';-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal}.swal2-popup .swal2-styled{margin:.3125em;padding:.625em 2em;font-weight:500;box-shadow:none}.swal2-popup .swal2-styled:not([disabled]){cursor:pointer}.swal2-popup .swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#3085d6;color:#fff;font-size:1.0625em}.swal2-popup .swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#aaa;color:#fff;font-size:1.0625em}.swal2-popup .swal2-styled:focus{outline:0;box-shadow:0 0 0 2px #fff,0 0 0 4px rgba(50,100,150,.4)}.swal2-popup .swal2-styled::-moz-focus-inner{border:0}.swal2-popup .swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-popup .swal2-image{max-width:100%;margin:1.25em auto}.swal2-popup .swal2-close{position:absolute;top:0;right:0;justify-content:center;width:1.2em;height:1.2em;padding:0;transition:color .1s ease-out;border:none;border-radius:0;outline:initial;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer;overflow:hidden}.swal2-popup .swal2-close:hover{-webkit-transform:none;transform:none;color:#f27474}.swal2-popup>.swal2-checkbox,.swal2-popup>.swal2-file,.swal2-popup>.swal2-input,.swal2-popup>.swal2-radio,.swal2-popup>.swal2-select,.swal2-popup>.swal2-textarea{display:none}.swal2-popup .swal2-content{justify-content:center;margin:0;padding:0;color:#545454;font-size:1.125em;font-weight:300;line-height:normal;z-index:1;word-wrap:break-word}.swal2-popup #swal2-content{text-align:center}.swal2-popup .swal2-checkbox,.swal2-popup .swal2-file,.swal2-popup .swal2-input,.swal2-popup .swal2-radio,.swal2-popup .swal2-select,.swal2-popup .swal2-textarea{margin:1em auto}.swal2-popup .swal2-file,.swal2-popup .swal2-input,.swal2-popup .swal2-textarea{width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;font-size:1.125em;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);box-sizing:border-box}.swal2-popup .swal2-file.swal2-inputerror,.swal2-popup .swal2-input.swal2-inputerror,.swal2-popup .swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-popup .swal2-file:focus,.swal2-popup .swal2-input:focus,.swal2-popup .swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 3px #c4e6f5}.swal2-popup .swal2-file::-webkit-input-placeholder,.swal2-popup .swal2-input::-webkit-input-placeholder,.swal2-popup .swal2-textarea::-webkit-input-placeholder{color:#ccc}.swal2-popup .swal2-file:-ms-input-placeholder,.swal2-popup .swal2-input:-ms-input-placeholder,.swal2-popup .swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-popup .swal2-file::-ms-input-placeholder,.swal2-popup .swal2-input::-ms-input-placeholder,.swal2-popup .swal2-textarea::-ms-input-placeholder{color:#ccc}.swal2-popup .swal2-file::placeholder,.swal2-popup .swal2-input::placeholder,.swal2-popup .swal2-textarea::placeholder{color:#ccc}.swal2-popup .swal2-range input{width:80%}.swal2-popup .swal2-range output{width:20%;font-weight:600;text-align:center}.swal2-popup .swal2-range input,.swal2-popup .swal2-range output{height:2.625em;margin:1em auto;padding:0;font-size:1.125em;line-height:2.625em}.swal2-popup .swal2-input{height:2.625em;padding:0 .75em}.swal2-popup .swal2-input[type=number]{max-width:10em}.swal2-popup .swal2-file{font-size:1.125em}.swal2-popup .swal2-textarea{height:6.75em;padding:.75em}.swal2-popup .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;color:#545454;font-size:1.125em}.swal2-popup .swal2-checkbox,.swal2-popup .swal2-radio{align-items:center;justify-content:center}.swal2-popup .swal2-checkbox label,.swal2-popup .swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-popup .swal2-checkbox input,.swal2-popup .swal2-radio input{margin:0 .4em}.swal2-popup .swal2-validation-message{display:none;align-items:center;justify-content:center;padding:.625em;background:#f0f0f0;color:#666;font-size:1em;font-weight:300;overflow:hidden}.swal2-popup .swal2-validation-message::before{display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center;content:'!';zoom:normal}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-moz-document url-prefix(){.swal2-close:focus{outline:2px solid rgba(50,100,150,.4)}}.swal2-icon{position:relative;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;line-height:5em;cursor:default;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;zoom:normal}.swal2-icon-text{font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:3.75em 3.75em;transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 3.75em;transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;top:-.25em;left:-.25em;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%;z-index:2;box-sizing:content-box}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;top:.5em;left:1.625em;width:.4375em;height:5.625em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);z-index:1}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;height:.3125em;border-radius:.125em;background-color:#a5dc86;z-index:2}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.875em;width:1.5625em;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-progresssteps{align-items:center;margin:0 0 1.25em;padding:0;font-weight:600}.swal2-progresssteps li{display:inline-block;position:relative}.swal2-progresssteps .swal2-progresscircle{width:2em;height:2em;border-radius:2em;background:#3085d6;color:#fff;line-height:2em;text-align:center;z-index:20}.swal2-progresssteps .swal2-progresscircle:first-child{margin-left:0}.swal2-progresssteps .swal2-progresscircle:last-child{margin-right:0}.swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep{background:#3085d6}.swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep~.swal2-progresscircle{background:#add8e6}.swal2-progresssteps .swal2-progresscircle.swal2-activeprogressstep~.swal2-progressline{background:#add8e6}.swal2-progresssteps .swal2-progressline{width:2.5em;height:.4em;margin:0 -1px;background:#3085d6;z-index:10}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-show.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-hide.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-animate-success-icon .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-animate-error-icon{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-animate-error-icon .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}@-webkit-keyframes swal2-rotate-loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:initial!important}}");
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.JSEncrypt={})}(this,function(t){"use strict";var e="0123456789abcdefghijklmnopqrstuvwxyz";function a(t){return e.charAt(t)}function i(t,e){return t&e}function u(t,e){return t|e}function r(t,e){return t^e}function n(t,e){return t&~e}function s(t){if(0==t)return-1;var e=0;return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function o(t){for(var e=0;0!=t;)t&=t-1,++e;return e}var h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function c(t){var e,i,r="";for(e=0;e+3<=t.length;e+=3)i=parseInt(t.substring(e,e+3),16),r+=h.charAt(i>>6)+h.charAt(63&i);for(e+1==t.length?(i=parseInt(t.substring(e,e+1),16),r+=h.charAt(i<<2)):e+2==t.length&&(i=parseInt(t.substring(e,e+2),16),r+=h.charAt(i>>2)+h.charAt((3&i)<<4));0<(3&r.length);)r+="=";return r}function f(t){var e,i="",r=0,n=0;for(e=0;e<t.length&&"="!=t.charAt(e);++e){var s=h.indexOf(t.charAt(e));s<0||(0==r?(i+=a(s>>2),n=3&s,r=1):1==r?(i+=a(n<<2|s>>4),n=15&s,r=2):2==r?(i+=a(n),i+=a(s>>2),n=3&s,r=3):(i+=a(n<<2|s>>4),i+=a(15&s),r=0))}return 1==r&&(i+=a(n<<2)),i}var l,p=function(t,e){return(p=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)};var g,d=function(t){var e;if(void 0===l){var i="0123456789ABCDEF",r=" \f\n\r\t \u2028\u2029";for(l={},e=0;e<16;++e)l[i.charAt(e)]=e;for(i=i.toLowerCase(),e=10;e<16;++e)l[i.charAt(e)]=e;for(e=0;e<r.length;++e)l[r.charAt(e)]=-1}var n=[],s=0,o=0;for(e=0;e<t.length;++e){var h=t.charAt(e);if("="==h)break;if(-1!=(h=l[h])){if(void 0===h)throw new Error("Illegal character at offset "+e);s|=h,2<=++o?(n[n.length]=s,o=s=0):s<<=4}}if(o)throw new Error("Hex encoding incomplete: 4 bits missing");return n},v={decode:function(t){var e;if(void 0===g){var i="= \f\n\r\t \u2028\u2029";for(g=Object.create(null),e=0;e<64;++e)g["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)]=e;for(e=0;e<i.length;++e)g[i.charAt(e)]=-1}var r=[],n=0,s=0;for(e=0;e<t.length;++e){var o=t.charAt(e);if("="==o)break;if(-1!=(o=g[o])){if(void 0===o)throw new Error("Illegal character at offset "+e);n|=o,4<=++s?(r[r.length]=n>>16,r[r.length]=n>>8&255,r[r.length]=255&n,s=n=0):n<<=6}}switch(s){case 1:throw new Error("Base64 encoding incomplete: at least 2 bits missing");case 2:r[r.length]=n>>10;break;case 3:r[r.length]=n>>16,r[r.length]=n>>8&255}return r},re:/-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,unarmor:function(t){var e=v.re.exec(t);if(e)if(e[1])t=e[1];else{if(!e[2])throw new Error("RegExp out of sync");t=e[2]}return v.decode(t)}},m=1e13,y=function(){function t(t){this.buf=[+t||0]}return t.prototype.mulAdd=function(t,e){var i,r,n=this.buf,s=n.length;for(i=0;i<s;++i)(r=n[i]*t+e)<m?e=0:r-=(e=0|r/m)*m,n[i]=r;0<e&&(n[i]=e)},t.prototype.sub=function(t){var e,i,r=this.buf,n=r.length;for(e=0;e<n;++e)(i=r[e]-t)<0?(i+=m,t=1):t=0,r[e]=i;for(;0===r[r.length-1];)r.pop()},t.prototype.toString=function(t){if(10!=(t||10))throw new Error("only base 10 is supported");for(var e=this.buf,i=e[e.length-1].toString(),r=e.length-2;0<=r;--r)i+=(m+e[r]).toString().substring(1);return i},t.prototype.valueOf=function(){for(var t=this.buf,e=0,i=t.length-1;0<=i;--i)e=e*m+t[i];return e},t.prototype.simplify=function(){var t=this.buf;return 1==t.length?t[0]:this},t}(),b="…",T=/^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/,S=/^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;function E(t,e){return t.length>e&&(t=t.substring(0,e)+b),t}var w,D=function(){function i(t,e){this.hexDigits="0123456789ABCDEF",t instanceof i?(this.enc=t.enc,this.pos=t.pos):(this.enc=t,this.pos=e)}return i.prototype.get=function(t){if(void 0===t&&(t=this.pos++),t>=this.enc.length)throw new Error("Requesting byte offset "+t+" on a stream of length "+this.enc.length);return"string"==typeof this.enc?this.enc.charCodeAt(t):this.enc[t]},i.prototype.hexByte=function(t){return this.hexDigits.charAt(t>>4&15)+this.hexDigits.charAt(15&t)},i.prototype.hexDump=function(t,e,i){for(var r="",n=t;n<e;++n)if(r+=this.hexByte(this.get(n)),!0!==i)switch(15&n){case 7:r+="  ";break;case 15:r+="\n";break;default:r+=" "}return r},i.prototype.isASCII=function(t,e){for(var i=t;i<e;++i){var r=this.get(i);if(r<32||176<r)return!1}return!0},i.prototype.parseStringISO=function(t,e){for(var i="",r=t;r<e;++r)i+=String.fromCharCode(this.get(r));return i},i.prototype.parseStringUTF=function(t,e){for(var i="",r=t;r<e;){var n=this.get(r++);i+=n<128?String.fromCharCode(n):191<n&&n<224?String.fromCharCode((31&n)<<6|63&this.get(r++)):String.fromCharCode((15&n)<<12|(63&this.get(r++))<<6|63&this.get(r++))}return i},i.prototype.parseStringBMP=function(t,e){for(var i,r,n="",s=t;s<e;)i=this.get(s++),r=this.get(s++),n+=String.fromCharCode(i<<8|r);return n},i.prototype.parseTime=function(t,e,i){var r=this.parseStringISO(t,e),n=(i?T:S).exec(r);return n?(i&&(n[1]=+n[1],n[1]+=+n[1]<70?2e3:1900),r=n[1]+"-"+n[2]+"-"+n[3]+" "+n[4],n[5]&&(r+=":"+n[5],n[6]&&(r+=":"+n[6],n[7]&&(r+="."+n[7]))),n[8]&&(r+=" UTC","Z"!=n[8]&&(r+=n[8],n[9]&&(r+=":"+n[9]))),r):"Unrecognized time: "+r},i.prototype.parseInteger=function(t,e){for(var i,r=this.get(t),n=127<r,s=n?255:0,o="";r==s&&++t<e;)r=this.get(t);if(0===(i=e-t))return n?-1:0;if(4<i){for(o=r,i<<=3;0==(128&(+o^s));)o=+o<<1,--i;o="("+i+" bit)\n"}n&&(r-=256);for(var h=new y(r),a=t+1;a<e;++a)h.mulAdd(256,this.get(a));return o+h.toString()},i.prototype.parseBitString=function(t,e,i){for(var r=this.get(t),n="("+((e-t-1<<3)-r)+" bit)\n",s="",o=t+1;o<e;++o){for(var h=this.get(o),a=o==e-1?r:0,u=7;a<=u;--u)s+=h>>u&1?"1":"0";if(s.length>i)return n+E(s,i)}return n+s},i.prototype.parseOctetString=function(t,e,i){if(this.isASCII(t,e))return E(this.parseStringISO(t,e),i);var r=e-t,n="("+r+" byte)\n";(i/=2)<r&&(e=t+i);for(var s=t;s<e;++s)n+=this.hexByte(this.get(s));return i<r&&(n+=b),n},i.prototype.parseOID=function(t,e,i){for(var r="",n=new y,s=0,o=t;o<e;++o){var h=this.get(o);if(n.mulAdd(128,127&h),s+=7,!(128&h)){if(""===r)if((n=n.simplify())instanceof y)n.sub(80),r="2."+n.toString();else{var a=n<80?n<40?0:1:2;r=a+"."+(n-40*a)}else r+="."+n.toString();if(r.length>i)return E(r,i);n=new y,s=0}}return 0<s&&(r+=".incomplete"),r},i}(),x=function(){function c(t,e,i,r,n){if(!(r instanceof R))throw new Error("Invalid tag value.");this.stream=t,this.header=e,this.length=i,this.tag=r,this.sub=n}return c.prototype.typeName=function(){switch(this.tag.tagClass){case 0:switch(this.tag.tagNumber){case 0:return"EOC";case 1:return"BOOLEAN";case 2:return"INTEGER";case 3:return"BIT_STRING";case 4:return"OCTET_STRING";case 5:return"NULL";case 6:return"OBJECT_IDENTIFIER";case 7:return"ObjectDescriptor";case 8:return"EXTERNAL";case 9:return"REAL";case 10:return"ENUMERATED";case 11:return"EMBEDDED_PDV";case 12:return"UTF8String";case 16:return"SEQUENCE";case 17:return"SET";case 18:return"NumericString";case 19:return"PrintableString";case 20:return"TeletexString";case 21:return"VideotexString";case 22:return"IA5String";case 23:return"UTCTime";case 24:return"GeneralizedTime";case 25:return"GraphicString";case 26:return"VisibleString";case 27:return"GeneralString";case 28:return"UniversalString";case 30:return"BMPString"}return"Universal_"+this.tag.tagNumber.toString();case 1:return"Application_"+this.tag.tagNumber.toString();case 2:return"["+this.tag.tagNumber.toString()+"]";case 3:return"Private_"+this.tag.tagNumber.toString()}},c.prototype.content=function(t){if(void 0===this.tag)return null;void 0===t&&(t=1/0);var e=this.posContent(),i=Math.abs(this.length);if(!this.tag.isUniversal())return null!==this.sub?"("+this.sub.length+" elem)":this.stream.parseOctetString(e,e+i,t);switch(this.tag.tagNumber){case 1:return 0===this.stream.get(e)?"false":"true";case 2:return this.stream.parseInteger(e,e+i);case 3:return this.sub?"("+this.sub.length+" elem)":this.stream.parseBitString(e,e+i,t);case 4:return this.sub?"("+this.sub.length+" elem)":this.stream.parseOctetString(e,e+i,t);case 6:return this.stream.parseOID(e,e+i,t);case 16:case 17:return null!==this.sub?"("+this.sub.length+" elem)":"(no elem)";case 12:return E(this.stream.parseStringUTF(e,e+i),t);case 18:case 19:case 20:case 21:case 22:case 26:return E(this.stream.parseStringISO(e,e+i),t);case 30:return E(this.stream.parseStringBMP(e,e+i),t);case 23:case 24:return this.stream.parseTime(e,e+i,23==this.tag.tagNumber)}return null},c.prototype.toString=function(){return this.typeName()+"@"+this.stream.pos+"[header:"+this.header+",length:"+this.length+",sub:"+(null===this.sub?"null":this.sub.length)+"]"},c.prototype.toPrettyString=function(t){void 0===t&&(t="");var e=t+this.typeName()+" @"+this.stream.pos;if(0<=this.length&&(e+="+"),e+=this.length,this.tag.tagConstructed?e+=" (constructed)":!this.tag.isUniversal()||3!=this.tag.tagNumber&&4!=this.tag.tagNumber||null===this.sub||(e+=" (encapsulates)"),e+="\n",null!==this.sub){t+="  ";for(var i=0,r=this.sub.length;i<r;++i)e+=this.sub[i].toPrettyString(t)}return e},c.prototype.posStart=function(){return this.stream.pos},c.prototype.posContent=function(){return this.stream.pos+this.header},c.prototype.posEnd=function(){return this.stream.pos+this.header+Math.abs(this.length)},c.prototype.toHexString=function(){return this.stream.hexDump(this.posStart(),this.posEnd(),!0)},c.decodeLength=function(t){var e=t.get(),i=127&e;if(i==e)return i;if(6<i)throw new Error("Length over 48 bits not supported at position "+(t.pos-1));if(0===i)return null;for(var r=e=0;r<i;++r)e=256*e+t.get();return e},c.prototype.getHexStringValue=function(){var t=this.toHexString(),e=2*this.header,i=2*this.length;return t.substr(e,i)},c.decode=function(t){var r;r=t instanceof D?t:new D(t,0);var e=new D(r),i=new R(r),n=c.decodeLength(r),s=r.pos,o=s-e.pos,h=null,a=function(){var t=[];if(null!==n){for(var e=s+n;r.pos<e;)t[t.length]=c.decode(r);if(r.pos!=e)throw new Error("Content size is not correct for container starting at offset "+s)}else try{for(;;){var i=c.decode(r);if(i.tag.isEOC())break;t[t.length]=i}n=s-r.pos}catch(t){throw new Error("Exception while decoding undefined length content: "+t)}return t};if(i.tagConstructed)h=a();else if(i.isUniversal()&&(3==i.tagNumber||4==i.tagNumber))try{if(3==i.tagNumber&&0!=r.get())throw new Error("BIT STRINGs with unused bits cannot encapsulate.");h=a();for(var u=0;u<h.length;++u)if(h[u].tag.isEOC())throw new Error("EOC is not supposed to be actual content.")}catch(t){h=null}if(null===h){if(null===n)throw new Error("We can't skip over an invalid tag with undefined length at offset "+s);r.pos=s+Math.abs(n)}return new c(e,o,n,i,h)},c}(),R=function(){function t(t){var e=t.get();if(this.tagClass=e>>6,this.tagConstructed=0!=(32&e),this.tagNumber=31&e,31==this.tagNumber){for(var i=new y;e=t.get(),i.mulAdd(128,127&e),128&e;);this.tagNumber=i.simplify()}}return t.prototype.isUniversal=function(){return 0===this.tagClass},t.prototype.isEOC=function(){return 0===this.tagClass&&0===this.tagNumber},t}(),B=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],A=(1<<26)/B[B.length-1],O=function(){function b(t,e,i){null!=t&&("number"==typeof t?this.fromNumber(t,e,i):null==e&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,e))}return b.prototype.toString=function(t){if(this.s<0)return"-"+this.negate().toString(t);var e;if(16==t)e=4;else if(8==t)e=3;else if(2==t)e=1;else if(32==t)e=5;else{if(4!=t)return this.toRadix(t);e=2}var i,r=(1<<e)-1,n=!1,s="",o=this.t,h=this.DB-o*this.DB%e;if(0<o--)for(h<this.DB&&0<(i=this[o]>>h)&&(n=!0,s=a(i));0<=o;)h<e?(i=(this[o]&(1<<h)-1)<<e-h,i|=this[--o]>>(h+=this.DB-e)):(i=this[o]>>(h-=e)&r,h<=0&&(h+=this.DB,--o)),0<i&&(n=!0),n&&(s+=a(i));return n?s:"0"},b.prototype.negate=function(){var t=M();return b.ZERO.subTo(this,t),t},b.prototype.abs=function(){return this.s<0?this.negate():this},b.prototype.compareTo=function(t){var e=this.s-t.s;if(0!=e)return e;var i=this.t;if(0!=(e=i-t.t))return this.s<0?-e:e;for(;0<=--i;)if(0!=(e=this[i]-t[i]))return e;return 0},b.prototype.bitLength=function(){return this.t<=0?0:this.DB*(this.t-1)+U(this[this.t-1]^this.s&this.DM)},b.prototype.mod=function(t){var e=M();return this.abs().divRemTo(t,null,e),this.s<0&&0<e.compareTo(b.ZERO)&&t.subTo(e,e),e},b.prototype.modPowInt=function(t,e){var i;return i=t<256||e.isEven()?new I(e):new N(e),this.exp(t,i)},b.prototype.clone=function(){var t=M();return this.copyTo(t),t},b.prototype.intValue=function(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]},b.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24},b.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16},b.prototype.signum=function(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1},b.prototype.toByteArray=function(){var t=this.t,e=[];e[0]=this.s;var i,r=this.DB-t*this.DB%8,n=0;if(0<t--)for(r<this.DB&&(i=this[t]>>r)!=(this.s&this.DM)>>r&&(e[n++]=i|this.s<<this.DB-r);0<=t;)r<8?(i=(this[t]&(1<<r)-1)<<8-r,i|=this[--t]>>(r+=this.DB-8)):(i=this[t]>>(r-=8)&255,r<=0&&(r+=this.DB,--t)),0!=(128&i)&&(i|=-256),0==n&&(128&this.s)!=(128&i)&&++n,(0<n||i!=this.s)&&(e[n++]=i);return e},b.prototype.equals=function(t){return 0==this.compareTo(t)},b.prototype.min=function(t){return this.compareTo(t)<0?this:t},b.prototype.max=function(t){return 0<this.compareTo(t)?this:t},b.prototype.and=function(t){var e=M();return this.bitwiseTo(t,i,e),e},b.prototype.or=function(t){var e=M();return this.bitwiseTo(t,u,e),e},b.prototype.xor=function(t){var e=M();return this.bitwiseTo(t,r,e),e},b.prototype.andNot=function(t){var e=M();return this.bitwiseTo(t,n,e),e},b.prototype.not=function(){for(var t=M(),e=0;e<this.t;++e)t[e]=this.DM&~this[e];return t.t=this.t,t.s=~this.s,t},b.prototype.shiftLeft=function(t){var e=M();return t<0?this.rShiftTo(-t,e):this.lShiftTo(t,e),e},b.prototype.shiftRight=function(t){var e=M();return t<0?this.lShiftTo(-t,e):this.rShiftTo(t,e),e},b.prototype.getLowestSetBit=function(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+s(this[t]);return this.s<0?this.t*this.DB:-1},b.prototype.bitCount=function(){for(var t=0,e=this.s&this.DM,i=0;i<this.t;++i)t+=o(this[i]^e);return t},b.prototype.testBit=function(t){var e=Math.floor(t/this.DB);return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)},b.prototype.setBit=function(t){return this.changeBit(t,u)},b.prototype.clearBit=function(t){return this.changeBit(t,n)},b.prototype.flipBit=function(t){return this.changeBit(t,r)},b.prototype.add=function(t){var e=M();return this.addTo(t,e),e},b.prototype.subtract=function(t){var e=M();return this.subTo(t,e),e},b.prototype.multiply=function(t){var e=M();return this.multiplyTo(t,e),e},b.prototype.divide=function(t){var e=M();return this.divRemTo(t,e,null),e},b.prototype.remainder=function(t){var e=M();return this.divRemTo(t,null,e),e},b.prototype.divideAndRemainder=function(t){var e=M(),i=M();return this.divRemTo(t,e,i),[e,i]},b.prototype.modPow=function(t,e){var i,r,n=t.bitLength(),s=F(1);if(n<=0)return s;i=n<18?1:n<48?3:n<144?4:n<768?5:6,r=n<8?new I(e):e.isEven()?new P(e):new N(e);var o=[],h=3,a=i-1,u=(1<<i)-1;if(o[1]=r.convert(this),1<i){var c=M();for(r.sqrTo(o[1],c);h<=u;)o[h]=M(),r.mulTo(c,o[h-2],o[h]),h+=2}var f,l,p=t.t-1,g=!0,d=M();for(n=U(t[p])-1;0<=p;){for(a<=n?f=t[p]>>n-a&u:(f=(t[p]&(1<<n+1)-1)<<a-n,0<p&&(f|=t[p-1]>>this.DB+n-a)),h=i;0==(1&f);)f>>=1,--h;if((n-=h)<0&&(n+=this.DB,--p),g)o[f].copyTo(s),g=!1;else{for(;1<h;)r.sqrTo(s,d),r.sqrTo(d,s),h-=2;0<h?r.sqrTo(s,d):(l=s,s=d,d=l),r.mulTo(d,o[f],s)}for(;0<=p&&0==(t[p]&1<<n);)r.sqrTo(s,d),l=s,s=d,d=l,--n<0&&(n=this.DB-1,--p)}return r.revert(s)},b.prototype.modInverse=function(t){var e=t.isEven();if(this.isEven()&&e||0==t.signum())return b.ZERO;for(var i=t.clone(),r=this.clone(),n=F(1),s=F(0),o=F(0),h=F(1);0!=i.signum();){for(;i.isEven();)i.rShiftTo(1,i),e?(n.isEven()&&s.isEven()||(n.addTo(this,n),s.subTo(t,s)),n.rShiftTo(1,n)):s.isEven()||s.subTo(t,s),s.rShiftTo(1,s);for(;r.isEven();)r.rShiftTo(1,r),e?(o.isEven()&&h.isEven()||(o.addTo(this,o),h.subTo(t,h)),o.rShiftTo(1,o)):h.isEven()||h.subTo(t,h),h.rShiftTo(1,h);0<=i.compareTo(r)?(i.subTo(r,i),e&&n.subTo(o,n),s.subTo(h,s)):(r.subTo(i,r),e&&o.subTo(n,o),h.subTo(s,h))}return 0!=r.compareTo(b.ONE)?b.ZERO:0<=h.compareTo(t)?h.subtract(t):h.signum()<0?(h.addTo(t,h),h.signum()<0?h.add(t):h):h},b.prototype.pow=function(t){return this.exp(t,new V)},b.prototype.gcd=function(t){var e=this.s<0?this.negate():this.clone(),i=t.s<0?t.negate():t.clone();if(e.compareTo(i)<0){var r=e;e=i,i=r}var n=e.getLowestSetBit(),s=i.getLowestSetBit();if(s<0)return e;for(n<s&&(s=n),0<s&&(e.rShiftTo(s,e),i.rShiftTo(s,i));0<e.signum();)0<(n=e.getLowestSetBit())&&e.rShiftTo(n,e),0<(n=i.getLowestSetBit())&&i.rShiftTo(n,i),0<=e.compareTo(i)?(e.subTo(i,e),e.rShiftTo(1,e)):(i.subTo(e,i),i.rShiftTo(1,i));return 0<s&&i.lShiftTo(s,i),i},b.prototype.isProbablePrime=function(t){var e,i=this.abs();if(1==i.t&&i[0]<=B[B.length-1]){for(e=0;e<B.length;++e)if(i[0]==B[e])return!0;return!1}if(i.isEven())return!1;for(e=1;e<B.length;){for(var r=B[e],n=e+1;n<B.length&&r<A;)r*=B[n++];for(r=i.modInt(r);e<n;)if(r%B[e++]==0)return!1}return i.millerRabin(t)},b.prototype.copyTo=function(t){for(var e=this.t-1;0<=e;--e)t[e]=this[e];t.t=this.t,t.s=this.s},b.prototype.fromInt=function(t){this.t=1,this.s=t<0?-1:0,0<t?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0},b.prototype.fromString=function(t,e){var i;if(16==e)i=4;else if(8==e)i=3;else if(256==e)i=8;else if(2==e)i=1;else if(32==e)i=5;else{if(4!=e)return void this.fromRadix(t,e);i=2}this.t=0,this.s=0;for(var r=t.length,n=!1,s=0;0<=--r;){var o=8==i?255&+t[r]:C(t,r);o<0?"-"==t.charAt(r)&&(n=!0):(n=!1,0==s?this[this.t++]=o:s+i>this.DB?(this[this.t-1]|=(o&(1<<this.DB-s)-1)<<s,this[this.t++]=o>>this.DB-s):this[this.t-1]|=o<<s,(s+=i)>=this.DB&&(s-=this.DB))}8==i&&0!=(128&+t[0])&&(this.s=-1,0<s&&(this[this.t-1]|=(1<<this.DB-s)-1<<s)),this.clamp(),n&&b.ZERO.subTo(this,this)},b.prototype.clamp=function(){for(var t=this.s&this.DM;0<this.t&&this[this.t-1]==t;)--this.t},b.prototype.dlShiftTo=function(t,e){var i;for(i=this.t-1;0<=i;--i)e[i+t]=this[i];for(i=t-1;0<=i;--i)e[i]=0;e.t=this.t+t,e.s=this.s},b.prototype.drShiftTo=function(t,e){for(var i=t;i<this.t;++i)e[i-t]=this[i];e.t=Math.max(this.t-t,0),e.s=this.s},b.prototype.lShiftTo=function(t,e){for(var i=t%this.DB,r=this.DB-i,n=(1<<r)-1,s=Math.floor(t/this.DB),o=this.s<<i&this.DM,h=this.t-1;0<=h;--h)e[h+s+1]=this[h]>>r|o,o=(this[h]&n)<<i;for(h=s-1;0<=h;--h)e[h]=0;e[s]=o,e.t=this.t+s+1,e.s=this.s,e.clamp()},b.prototype.rShiftTo=function(t,e){e.s=this.s;var i=Math.floor(t/this.DB);if(i>=this.t)e.t=0;else{var r=t%this.DB,n=this.DB-r,s=(1<<r)-1;e[0]=this[i]>>r;for(var o=i+1;o<this.t;++o)e[o-i-1]|=(this[o]&s)<<n,e[o-i]=this[o]>>r;0<r&&(e[this.t-i-1]|=(this.s&s)<<n),e.t=this.t-i,e.clamp()}},b.prototype.subTo=function(t,e){for(var i=0,r=0,n=Math.min(t.t,this.t);i<n;)r+=this[i]-t[i],e[i++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r-=t.s;i<this.t;)r+=this[i],e[i++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;i<t.t;)r-=t[i],e[i++]=r&this.DM,r>>=this.DB;r-=t.s}e.s=r<0?-1:0,r<-1?e[i++]=this.DV+r:0<r&&(e[i++]=r),e.t=i,e.clamp()},b.prototype.multiplyTo=function(t,e){var i=this.abs(),r=t.abs(),n=i.t;for(e.t=n+r.t;0<=--n;)e[n]=0;for(n=0;n<r.t;++n)e[n+i.t]=i.am(0,r[n],e,n,0,i.t);e.s=0,e.clamp(),this.s!=t.s&&b.ZERO.subTo(e,e)},b.prototype.squareTo=function(t){for(var e=this.abs(),i=t.t=2*e.t;0<=--i;)t[i]=0;for(i=0;i<e.t-1;++i){var r=e.am(i,e[i],t,2*i,0,1);(t[i+e.t]+=e.am(i+1,2*e[i],t,2*i+1,r,e.t-i-1))>=e.DV&&(t[i+e.t]-=e.DV,t[i+e.t+1]=1)}0<t.t&&(t[t.t-1]+=e.am(i,e[i],t,2*i,0,1)),t.s=0,t.clamp()},b.prototype.divRemTo=function(t,e,i){var r=t.abs();if(!(r.t<=0)){var n=this.abs();if(n.t<r.t)return null!=e&&e.fromInt(0),void(null!=i&&this.copyTo(i));null==i&&(i=M());var s=M(),o=this.s,h=t.s,a=this.DB-U(r[r.t-1]);0<a?(r.lShiftTo(a,s),n.lShiftTo(a,i)):(r.copyTo(s),n.copyTo(i));var u=s.t,c=s[u-1];if(0!=c){var f=c*(1<<this.F1)+(1<u?s[u-2]>>this.F2:0),l=this.FV/f,p=(1<<this.F1)/f,g=1<<this.F2,d=i.t,v=d-u,m=null==e?M():e;for(s.dlShiftTo(v,m),0<=i.compareTo(m)&&(i[i.t++]=1,i.subTo(m,i)),b.ONE.dlShiftTo(u,m),m.subTo(s,s);s.t<u;)s[s.t++]=0;for(;0<=--v;){var y=i[--d]==c?this.DM:Math.floor(i[d]*l+(i[d-1]+g)*p);if((i[d]+=s.am(0,y,i,v,0,u))<y)for(s.dlShiftTo(v,m),i.subTo(m,i);i[d]<--y;)i.subTo(m,i)}null!=e&&(i.drShiftTo(u,e),o!=h&&b.ZERO.subTo(e,e)),i.t=u,i.clamp(),0<a&&i.rShiftTo(a,i),o<0&&b.ZERO.subTo(i,i)}}},b.prototype.invDigit=function(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var e=3&t;return 0<(e=(e=(e=(e=e*(2-(15&t)*e)&15)*(2-(255&t)*e)&255)*(2-((65535&t)*e&65535))&65535)*(2-t*e%this.DV)%this.DV)?this.DV-e:-e},b.prototype.isEven=function(){return 0==(0<this.t?1&this[0]:this.s)},b.prototype.exp=function(t,e){if(4294967295<t||t<1)return b.ONE;var i=M(),r=M(),n=e.convert(this),s=U(t)-1;for(n.copyTo(i);0<=--s;)if(e.sqrTo(i,r),0<(t&1<<s))e.mulTo(r,n,i);else{var o=i;i=r,r=o}return e.revert(i)},b.prototype.chunkSize=function(t){return Math.floor(Math.LN2*this.DB/Math.log(t))},b.prototype.toRadix=function(t){if(null==t&&(t=10),0==this.signum()||t<2||36<t)return"0";var e=this.chunkSize(t),i=Math.pow(t,e),r=F(i),n=M(),s=M(),o="";for(this.divRemTo(r,n,s);0<n.signum();)o=(i+s.intValue()).toString(t).substr(1)+o,n.divRemTo(r,n,s);return s.intValue().toString(t)+o},b.prototype.fromRadix=function(t,e){this.fromInt(0),null==e&&(e=10);for(var i=this.chunkSize(e),r=Math.pow(e,i),n=!1,s=0,o=0,h=0;h<t.length;++h){var a=C(t,h);a<0?"-"==t.charAt(h)&&0==this.signum()&&(n=!0):(o=e*o+a,++s>=i&&(this.dMultiply(r),this.dAddOffset(o,0),o=s=0))}0<s&&(this.dMultiply(Math.pow(e,s)),this.dAddOffset(o,0)),n&&b.ZERO.subTo(this,this)},b.prototype.fromNumber=function(t,e,i){if("number"==typeof e)if(t<2)this.fromInt(1);else for(this.fromNumber(t,i),this.testBit(t-1)||this.bitwiseTo(b.ONE.shiftLeft(t-1),u,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(e);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(b.ONE.shiftLeft(t-1),this);else{var r=[],n=7&t;r.length=1+(t>>3),e.nextBytes(r),0<n?r[0]&=(1<<n)-1:r[0]=0,this.fromString(r,256)}},b.prototype.bitwiseTo=function(t,e,i){var r,n,s=Math.min(t.t,this.t);for(r=0;r<s;++r)i[r]=e(this[r],t[r]);if(t.t<this.t){for(n=t.s&this.DM,r=s;r<this.t;++r)i[r]=e(this[r],n);i.t=this.t}else{for(n=this.s&this.DM,r=s;r<t.t;++r)i[r]=e(n,t[r]);i.t=t.t}i.s=e(this.s,t.s),i.clamp()},b.prototype.changeBit=function(t,e){var i=b.ONE.shiftLeft(t);return this.bitwiseTo(i,e,i),i},b.prototype.addTo=function(t,e){for(var i=0,r=0,n=Math.min(t.t,this.t);i<n;)r+=this[i]+t[i],e[i++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r+=t.s;i<this.t;)r+=this[i],e[i++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;i<t.t;)r+=t[i],e[i++]=r&this.DM,r>>=this.DB;r+=t.s}e.s=r<0?-1:0,0<r?e[i++]=r:r<-1&&(e[i++]=this.DV+r),e.t=i,e.clamp()},b.prototype.dMultiply=function(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()},b.prototype.dAddOffset=function(t,e){if(0!=t){for(;this.t<=e;)this[this.t++]=0;for(this[e]+=t;this[e]>=this.DV;)this[e]-=this.DV,++e>=this.t&&(this[this.t++]=0),++this[e]}},b.prototype.multiplyLowerTo=function(t,e,i){var r=Math.min(this.t+t.t,e);for(i.s=0,i.t=r;0<r;)i[--r]=0;for(var n=i.t-this.t;r<n;++r)i[r+this.t]=this.am(0,t[r],i,r,0,this.t);for(n=Math.min(t.t,e);r<n;++r)this.am(0,t[r],i,r,0,e-r);i.clamp()},b.prototype.multiplyUpperTo=function(t,e,i){--e;var r=i.t=this.t+t.t-e;for(i.s=0;0<=--r;)i[r]=0;for(r=Math.max(e-this.t,0);r<t.t;++r)i[this.t+r-e]=this.am(e-r,t[r],i,0,0,this.t+r-e);i.clamp(),i.drShiftTo(1,i)},b.prototype.modInt=function(t){if(t<=0)return 0;var e=this.DV%t,i=this.s<0?t-1:0;if(0<this.t)if(0==e)i=this[0]%t;else for(var r=this.t-1;0<=r;--r)i=(e*i+this[r])%t;return i},b.prototype.millerRabin=function(t){var e=this.subtract(b.ONE),i=e.getLowestSetBit();if(i<=0)return!1;var r=e.shiftRight(i);B.length<(t=t+1>>1)&&(t=B.length);for(var n=M(),s=0;s<t;++s){n.fromInt(B[Math.floor(Math.random()*B.length)]);var o=n.modPow(r,this);if(0!=o.compareTo(b.ONE)&&0!=o.compareTo(e)){for(var h=1;h++<i&&0!=o.compareTo(e);)if(0==(o=o.modPowInt(2,this)).compareTo(b.ONE))return!1;if(0!=o.compareTo(e))return!1}}return!0},b.prototype.square=function(){var t=M();return this.squareTo(t),t},b.prototype.gcda=function(t,e){var i=this.s<0?this.negate():this.clone(),r=t.s<0?t.negate():t.clone();if(i.compareTo(r)<0){var n=i;i=r,r=n}var s=i.getLowestSetBit(),o=r.getLowestSetBit();if(o<0)e(i);else{s<o&&(o=s),0<o&&(i.rShiftTo(o,i),r.rShiftTo(o,r));var h=function(){0<(s=i.getLowestSetBit())&&i.rShiftTo(s,i),0<(s=r.getLowestSetBit())&&r.rShiftTo(s,r),0<=i.compareTo(r)?(i.subTo(r,i),i.rShiftTo(1,i)):(r.subTo(i,r),r.rShiftTo(1,r)),0<i.signum()?setTimeout(h,0):(0<o&&r.lShiftTo(o,r),setTimeout(function(){e(r)},0))};setTimeout(h,10)}},b.prototype.fromNumberAsync=function(t,e,i,r){if("number"==typeof e)if(t<2)this.fromInt(1);else{this.fromNumber(t,i),this.testBit(t-1)||this.bitwiseTo(b.ONE.shiftLeft(t-1),u,this),this.isEven()&&this.dAddOffset(1,0);var n=this,s=function(){n.dAddOffset(2,0),n.bitLength()>t&&n.subTo(b.ONE.shiftLeft(t-1),n),n.isProbablePrime(e)?setTimeout(function(){r()},0):setTimeout(s,0)};setTimeout(s,0)}else{var o=[],h=7&t;o.length=1+(t>>3),e.nextBytes(o),0<h?o[0]&=(1<<h)-1:o[0]=0,this.fromString(o,256)}},b}(),V=function(){function t(){}return t.prototype.convert=function(t){return t},t.prototype.revert=function(t){return t},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i)},t.prototype.sqrTo=function(t,e){t.squareTo(e)},t}(),I=function(){function t(t){this.m=t}return t.prototype.convert=function(t){return t.s<0||0<=t.compareTo(this.m)?t.mod(this.m):t},t.prototype.revert=function(t){return t},t.prototype.reduce=function(t){t.divRemTo(this.m,null,t)},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i),this.reduce(i)},t.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},t}(),N=function(){function t(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}return t.prototype.convert=function(t){var e=M();return t.abs().dlShiftTo(this.m.t,e),e.divRemTo(this.m,null,e),t.s<0&&0<e.compareTo(O.ZERO)&&this.m.subTo(e,e),e},t.prototype.revert=function(t){var e=M();return t.copyTo(e),this.reduce(e),e},t.prototype.reduce=function(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var e=0;e<this.m.t;++e){var i=32767&t[e],r=i*this.mpl+((i*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM;for(t[i=e+this.m.t]+=this.m.am(0,r,t,e,0,this.m.t);t[i]>=t.DV;)t[i]-=t.DV,t[++i]++}t.clamp(),t.drShiftTo(this.m.t,t),0<=t.compareTo(this.m)&&t.subTo(this.m,t)},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i),this.reduce(i)},t.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},t}(),P=function(){function t(t){this.m=t,this.r2=M(),this.q3=M(),O.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t)}return t.prototype.convert=function(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var e=M();return t.copyTo(e),this.reduce(e),e},t.prototype.revert=function(t){return t},t.prototype.reduce=function(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);0<=t.compareTo(this.m);)t.subTo(this.m,t)},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i),this.reduce(i)},t.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},t}();function M(){return new O(null)}function q(t,e){return new O(t,e)}"Microsoft Internet Explorer"==navigator.appName?(O.prototype.am=function(t,e,i,r,n,s){for(var o=32767&e,h=e>>15;0<=--s;){var a=32767&this[t],u=this[t++]>>15,c=h*a+u*o;n=((a=o*a+((32767&c)<<15)+i[r]+(1073741823&n))>>>30)+(c>>>15)+h*u+(n>>>30),i[r++]=1073741823&a}return n},w=30):"Netscape"!=navigator.appName?(O.prototype.am=function(t,e,i,r,n,s){for(;0<=--s;){var o=e*this[t++]+i[r]+n;n=Math.floor(o/67108864),i[r++]=67108863&o}return n},w=26):(O.prototype.am=function(t,e,i,r,n,s){for(var o=16383&e,h=e>>14;0<=--s;){var a=16383&this[t],u=this[t++]>>14,c=h*a+u*o;n=((a=o*a+((16383&c)<<14)+i[r]+n)>>28)+(c>>14)+h*u,i[r++]=268435455&a}return n},w=28),O.prototype.DB=w,O.prototype.DM=(1<<w)-1,O.prototype.DV=1<<w;O.prototype.FV=Math.pow(2,52),O.prototype.F1=52-w,O.prototype.F2=2*w-52;var j,L,H=[];for(j="0".charCodeAt(0),L=0;L<=9;++L)H[j++]=L;for(j="a".charCodeAt(0),L=10;L<36;++L)H[j++]=L;for(j="A".charCodeAt(0),L=10;L<36;++L)H[j++]=L;function C(t,e){var i=H[t.charCodeAt(e)];return null==i?-1:i}function F(t){var e=M();return e.fromInt(t),e}function U(t){var e,i=1;return 0!=(e=t>>>16)&&(t=e,i+=16),0!=(e=t>>8)&&(t=e,i+=8),0!=(e=t>>4)&&(t=e,i+=4),0!=(e=t>>2)&&(t=e,i+=2),0!=(e=t>>1)&&(t=e,i+=1),i}O.ZERO=F(0),O.ONE=F(1);var K=function(){function t(){this.i=0,this.j=0,this.S=[]}return t.prototype.init=function(t){var e,i,r;for(e=0;e<256;++e)this.S[e]=e;for(e=i=0;e<256;++e)i=i+this.S[e]+t[e%t.length]&255,r=this.S[e],this.S[e]=this.S[i],this.S[i]=r;this.i=0,this.j=0},t.prototype.next=function(){var t;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,t=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=t,this.S[t+this.S[this.i]&255]},t}();var k,_,z=256,Z=null;if(null==Z){Z=[];var G=void(_=0);if(window.crypto&&window.crypto.getRandomValues){var $=new Uint32Array(256);for(window.crypto.getRandomValues($),G=0;G<$.length;++G)Z[_++]=255&$[G]}var Y=function(t){if(this.count=this.count||0,256<=this.count||z<=_)window.removeEventListener?window.removeEventListener("mousemove",Y,!1):window.detachEvent&&window.detachEvent("onmousemove",Y);else try{var e=t.x+t.y;Z[_++]=255&e,this.count+=1}catch(t){}};window.addEventListener?window.addEventListener("mousemove",Y,!1):window.attachEvent&&window.attachEvent("onmousemove",Y)}function J(){if(null==k){for(k=new K;_<z;){var t=Math.floor(65536*Math.random());Z[_++]=255&t}for(k.init(Z),_=0;_<Z.length;++_)Z[_]=0;_=0}return k.next()}var X=function(){function t(){}return t.prototype.nextBytes=function(t){for(var e=0;e<t.length;++e)t[e]=J()},t}();var Q=function(){function t(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}return t.prototype.doPublic=function(t){return t.modPowInt(this.e,this.n)},t.prototype.doPrivate=function(t){if(null==this.p||null==this.q)return t.modPow(this.d,this.n);for(var e=t.mod(this.p).modPow(this.dmp1,this.p),i=t.mod(this.q).modPow(this.dmq1,this.q);e.compareTo(i)<0;)e=e.add(this.p);return e.subtract(i).multiply(this.coeff).mod(this.p).multiply(this.q).add(i)},t.prototype.setPublic=function(t,e){null!=t&&null!=e&&0<t.length&&0<e.length?(this.n=q(t,16),this.e=parseInt(e,16)):console.error("Invalid RSA public key")},t.prototype.encrypt=function(t){var e=function(t,e){if(e<t.length+11)return console.error("Message too long for RSA"),null;for(var i=[],r=t.length-1;0<=r&&0<e;){var n=t.charCodeAt(r--);n<128?i[--e]=n:127<n&&n<2048?(i[--e]=63&n|128,i[--e]=n>>6|192):(i[--e]=63&n|128,i[--e]=n>>6&63|128,i[--e]=n>>12|224)}i[--e]=0;for(var s=new X,o=[];2<e;){for(o[0]=0;0==o[0];)s.nextBytes(o);i[--e]=o[0]}return i[--e]=2,i[--e]=0,new O(i)}(t,this.n.bitLength()+7>>3);if(null==e)return null;var i=this.doPublic(e);if(null==i)return null;var r=i.toString(16);return 0==(1&r.length)?r:"0"+r},t.prototype.setPrivate=function(t,e,i){null!=t&&null!=e&&0<t.length&&0<e.length?(this.n=q(t,16),this.e=parseInt(e,16),this.d=q(i,16)):console.error("Invalid RSA private key")},t.prototype.setPrivateEx=function(t,e,i,r,n,s,o,h){null!=t&&null!=e&&0<t.length&&0<e.length?(this.n=q(t,16),this.e=parseInt(e,16),this.d=q(i,16),this.p=q(r,16),this.q=q(n,16),this.dmp1=q(s,16),this.dmq1=q(o,16),this.coeff=q(h,16)):console.error("Invalid RSA private key")},t.prototype.generate=function(t,e){var i=new X,r=t>>1;this.e=parseInt(e,16);for(var n=new O(e,16);;){for(;this.p=new O(t-r,1,i),0!=this.p.subtract(O.ONE).gcd(n).compareTo(O.ONE)||!this.p.isProbablePrime(10););for(;this.q=new O(r,1,i),0!=this.q.subtract(O.ONE).gcd(n).compareTo(O.ONE)||!this.q.isProbablePrime(10););if(this.p.compareTo(this.q)<=0){var s=this.p;this.p=this.q,this.q=s}var o=this.p.subtract(O.ONE),h=this.q.subtract(O.ONE),a=o.multiply(h);if(0==a.gcd(n).compareTo(O.ONE)){this.n=this.p.multiply(this.q),this.d=n.modInverse(a),this.dmp1=this.d.mod(o),this.dmq1=this.d.mod(h),this.coeff=this.q.modInverse(this.p);break}}},t.prototype.decrypt=function(t){var e=q(t,16),i=this.doPrivate(e);return null==i?null:function(t,e){var i=t.toByteArray(),r=0;for(;r<i.length&&0==i[r];)++r;if(i.length-r!=e-1||2!=i[r])return null;++r;for(;0!=i[r];)if(++r>=i.length)return null;var n="";for(;++r<i.length;){var s=255&i[r];s<128?n+=String.fromCharCode(s):191<s&&s<224?(n+=String.fromCharCode((31&s)<<6|63&i[r+1]),++r):(n+=String.fromCharCode((15&s)<<12|(63&i[r+1])<<6|63&i[r+2]),r+=2)}return n}(i,this.n.bitLength()+7>>3)},t.prototype.generateAsync=function(t,e,n){var s=new X,o=t>>1;this.e=parseInt(e,16);var h=new O(e,16),a=this,u=function(){var e=function(){if(a.p.compareTo(a.q)<=0){var t=a.p;a.p=a.q,a.q=t}var e=a.p.subtract(O.ONE),i=a.q.subtract(O.ONE),r=e.multiply(i);0==r.gcd(h).compareTo(O.ONE)?(a.n=a.p.multiply(a.q),a.d=h.modInverse(r),a.dmp1=a.d.mod(e),a.dmq1=a.d.mod(i),a.coeff=a.q.modInverse(a.p),setTimeout(function(){n()},0)):setTimeout(u,0)},i=function(){a.q=M(),a.q.fromNumberAsync(o,1,s,function(){a.q.subtract(O.ONE).gcda(h,function(t){0==t.compareTo(O.ONE)&&a.q.isProbablePrime(10)?setTimeout(e,0):setTimeout(i,0)})})},r=function(){a.p=M(),a.p.fromNumberAsync(t-o,1,s,function(){a.p.subtract(O.ONE).gcda(h,function(t){0==t.compareTo(O.ONE)&&a.p.isProbablePrime(10)?setTimeout(i,0):setTimeout(r,0)})})};setTimeout(r,0)};setTimeout(u,0)},t.prototype.sign=function(t,e,i){var r=function(t,e){if(e<t.length+22)return console.error("Message too long for RSA"),null;for(var i=e-t.length-6,r="",n=0;n<i;n+=2)r+="ff";return q("0001"+r+"00"+t,16)}((W[i]||"")+e(t).toString(),this.n.bitLength()/4);if(null==r)return null;var n=this.doPrivate(r);if(null==n)return null;var s=n.toString(16);return 0==(1&s.length)?s:"0"+s},t.prototype.verify=function(t,e,i){var r=q(e,16),n=this.doPublic(r);return null==n?null:function(t){for(var e in W)if(W.hasOwnProperty(e)){var i=W[e],r=i.length;if(t.substr(0,r)==i)return t.substr(r)}return t}(n.toString(16).replace(/^1f+00/,""))==i(t).toString()},t}();var W={md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",ripemd160:"3021300906052b2403020105000414"};var tt={};tt.lang={extend:function(t,e,i){if(!e||!t)throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");var r=function(){};if(r.prototype=e.prototype,t.prototype=new r,(t.prototype.constructor=t).superclass=e.prototype,e.prototype.constructor==Object.prototype.constructor&&(e.prototype.constructor=e),i){var n;for(n in i)t.prototype[n]=i[n];var s=function(){},o=["toString","valueOf"];try{/MSIE/.test(navigator.userAgent)&&(s=function(t,e){for(n=0;n<o.length;n+=1){var i=o[n],r=e[i];"function"==typeof r&&r!=Object.prototype[i]&&(t[i]=r)}})}catch(t){}s(t.prototype,i)}}};var et={};void 0!==et.asn1&&et.asn1||(et.asn1={}),et.asn1.ASN1Util=new function(){this.integerToByteHex=function(t){var e=t.toString(16);return e.length%2==1&&(e="0"+e),e},this.bigIntToMinTwosComplementsHex=function(t){var e=t.toString(16);if("-"!=e.substr(0,1))e.length%2==1?e="0"+e:e.match(/^[0-7]/)||(e="00"+e);else{var i=e.substr(1).length;i%2==1?i+=1:e.match(/^[0-7]/)||(i+=2);for(var r="",n=0;n<i;n++)r+="f";e=new O(r,16).xor(t).add(O.ONE).toString(16).replace(/^-/,"")}return e},this.getPEMStringFromHex=function(t,e){return hextopem(t,e)},this.newObject=function(t){var e=et.asn1,i=e.DERBoolean,r=e.DERInteger,n=e.DERBitString,s=e.DEROctetString,o=e.DERNull,h=e.DERObjectIdentifier,a=e.DEREnumerated,u=e.DERUTF8String,c=e.DERNumericString,f=e.DERPrintableString,l=e.DERTeletexString,p=e.DERIA5String,g=e.DERUTCTime,d=e.DERGeneralizedTime,v=e.DERSequence,m=e.DERSet,y=e.DERTaggedObject,b=e.ASN1Util.newObject,T=Object.keys(t);if(1!=T.length)throw"key of param shall be only one.";var S=T[0];if(-1==":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":"+S+":"))throw"undefined key: "+S;if("bool"==S)return new i(t[S]);if("int"==S)return new r(t[S]);if("bitstr"==S)return new n(t[S]);if("octstr"==S)return new s(t[S]);if("null"==S)return new o(t[S]);if("oid"==S)return new h(t[S]);if("enum"==S)return new a(t[S]);if("utf8str"==S)return new u(t[S]);if("numstr"==S)return new c(t[S]);if("prnstr"==S)return new f(t[S]);if("telstr"==S)return new l(t[S]);if("ia5str"==S)return new p(t[S]);if("utctime"==S)return new g(t[S]);if("gentime"==S)return new d(t[S]);if("seq"==S){for(var E=t[S],w=[],D=0;D<E.length;D++){var x=b(E[D]);w.push(x)}return new v({array:w})}if("set"==S){for(E=t[S],w=[],D=0;D<E.length;D++){x=b(E[D]);w.push(x)}return new m({array:w})}if("tag"==S){var R=t[S];if("[object Array]"===Object.prototype.toString.call(R)&&3==R.length){var B=b(R[2]);return new y({tag:R[0],explicit:R[1],obj:B})}var A={};if(void 0!==R.explicit&&(A.explicit=R.explicit),void 0!==R.tag&&(A.tag=R.tag),void 0===R.obj)throw"obj shall be specified for 'tag'.";return A.obj=b(R.obj),new y(A)}},this.jsonToASN1HEX=function(t){return this.newObject(t).getEncodedHex()}},et.asn1.ASN1Util.oidHexToInt=function(t){for(var e="",i=parseInt(t.substr(0,2),16),r=(e=Math.floor(i/40)+"."+i%40,""),n=2;n<t.length;n+=2){var s=("00000000"+parseInt(t.substr(n,2),16).toString(2)).slice(-8);if(r+=s.substr(1,7),"0"==s.substr(0,1))e=e+"."+new O(r,2).toString(10),r=""}return e},et.asn1.ASN1Util.oidIntToHex=function(t){var h=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},e=function(t){var e="",i=new O(t,10).toString(2),r=7-i.length%7;7==r&&(r=0);for(var n="",s=0;s<r;s++)n+="0";i=n+i;for(s=0;s<i.length-1;s+=7){var o=i.substr(s,7);s!=i.length-7&&(o="1"+o),e+=h(parseInt(o,2))}return e};if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var i="",r=t.split("."),n=40*parseInt(r[0])+parseInt(r[1]);i+=h(n),r.splice(0,2);for(var s=0;s<r.length;s++)i+=e(r[s]);return i},et.asn1.ASN1Object=function(){this.getLengthHexFromValue=function(){if(void 0===this.hV||null==this.hV)throw"this.hV is null or undefined.";if(this.hV.length%2==1)throw"value hex must be even length: n="+"".length+",v="+this.hV;var t=this.hV.length/2,e=t.toString(16);if(e.length%2==1&&(e="0"+e),t<128)return e;var i=e.length/2;if(15<i)throw"ASN.1 length too long to represent by 8x: n = "+t.toString(16);return(128+i).toString(16)+e},this.getEncodedHex=function(){return(null==this.hTLV||this.isModified)&&(this.hV=this.getFreshValueHex(),this.hL=this.getLengthHexFromValue(),this.hTLV=this.hT+this.hL+this.hV,this.isModified=!1),this.hTLV},this.getValueHex=function(){return this.getEncodedHex(),this.hV},this.getFreshValueHex=function(){return""}},et.asn1.DERAbstractString=function(t){et.asn1.DERAbstractString.superclass.constructor.call(this),this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=stohex(this.s)},this.setStringHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t?this.setString(t):void 0!==t.str?this.setString(t.str):void 0!==t.hex&&this.setStringHex(t.hex))},tt.lang.extend(et.asn1.DERAbstractString,et.asn1.ASN1Object),et.asn1.DERAbstractTime=function(t){et.asn1.DERAbstractTime.superclass.constructor.call(this),this.localDateToUTC=function(t){return utc=t.getTime()+6e4*t.getTimezoneOffset(),new Date(utc)},this.formatDate=function(t,e,i){var r=this.zeroPadding,n=this.localDateToUTC(t),s=String(n.getFullYear());"utc"==e&&(s=s.substr(2,2));var o=s+r(String(n.getMonth()+1),2)+r(String(n.getDate()),2)+r(String(n.getHours()),2)+r(String(n.getMinutes()),2)+r(String(n.getSeconds()),2);if(!0===i){var h=n.getMilliseconds();if(0!=h){var a=r(String(h),3);o=o+"."+(a=a.replace(/[0]+$/,""))}}return o+"Z"},this.zeroPadding=function(t,e){return t.length>=e?t:new Array(e-t.length+1).join("0")+t},this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=stohex(t)},this.setByDateValue=function(t,e,i,r,n,s){var o=new Date(Date.UTC(t,e-1,i,r,n,s,0));this.setByDate(o)},this.getFreshValueHex=function(){return this.hV}},tt.lang.extend(et.asn1.DERAbstractTime,et.asn1.ASN1Object),et.asn1.DERAbstractStructured=function(t){et.asn1.DERAbstractString.superclass.constructor.call(this),this.setByASN1ObjectArray=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array=t},this.appendASN1Object=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array.push(t)},this.asn1Array=new Array,void 0!==t&&void 0!==t.array&&(this.asn1Array=t.array)},tt.lang.extend(et.asn1.DERAbstractStructured,et.asn1.ASN1Object),et.asn1.DERBoolean=function(){et.asn1.DERBoolean.superclass.constructor.call(this),this.hT="01",this.hTLV="0101ff"},tt.lang.extend(et.asn1.DERBoolean,et.asn1.ASN1Object),et.asn1.DERInteger=function(t){et.asn1.DERInteger.superclass.constructor.call(this),this.hT="02",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=et.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new O(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.bigint?this.setByBigInteger(t.bigint):void 0!==t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex))},tt.lang.extend(et.asn1.DERInteger,et.asn1.ASN1Object),et.asn1.DERBitString=function(t){if(void 0!==t&&void 0!==t.obj){var e=et.asn1.ASN1Util.newObject(t.obj);t.hex="00"+e.getEncodedHex()}et.asn1.DERBitString.superclass.constructor.call(this),this.hT="03",this.setHexValueIncludingUnusedBits=function(t){this.hTLV=null,this.isModified=!0,this.hV=t},this.setUnusedBitsAndHexValue=function(t,e){if(t<0||7<t)throw"unused bits shall be from 0 to 7: u = "+t;var i="0"+t;this.hTLV=null,this.isModified=!0,this.hV=i+e},this.setByBinaryString=function(t){var e=8-(t=t.replace(/0+$/,"")).length%8;8==e&&(e=0);for(var i=0;i<=e;i++)t+="0";var r="";for(i=0;i<t.length-1;i+=8){var n=t.substr(i,8),s=parseInt(n,2).toString(16);1==s.length&&(s="0"+s),r+=s}this.hTLV=null,this.isModified=!0,this.hV="0"+e+r},this.setByBooleanArray=function(t){for(var e="",i=0;i<t.length;i++)1==t[i]?e+="1":e+="0";this.setByBinaryString(e)},this.newFalseArray=function(t){for(var e=new Array(t),i=0;i<t;i++)e[i]=!1;return e},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t&&t.toLowerCase().match(/^[0-9a-f]+$/)?this.setHexValueIncludingUnusedBits(t):void 0!==t.hex?this.setHexValueIncludingUnusedBits(t.hex):void 0!==t.bin?this.setByBinaryString(t.bin):void 0!==t.array&&this.setByBooleanArray(t.array))},tt.lang.extend(et.asn1.DERBitString,et.asn1.ASN1Object),et.asn1.DEROctetString=function(t){if(void 0!==t&&void 0!==t.obj){var e=et.asn1.ASN1Util.newObject(t.obj);t.hex=e.getEncodedHex()}et.asn1.DEROctetString.superclass.constructor.call(this,t),this.hT="04"},tt.lang.extend(et.asn1.DEROctetString,et.asn1.DERAbstractString),et.asn1.DERNull=function(){et.asn1.DERNull.superclass.constructor.call(this),this.hT="05",this.hTLV="0500"},tt.lang.extend(et.asn1.DERNull,et.asn1.ASN1Object),et.asn1.DERObjectIdentifier=function(t){var h=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},s=function(t){var e="",i=new O(t,10).toString(2),r=7-i.length%7;7==r&&(r=0);for(var n="",s=0;s<r;s++)n+="0";i=n+i;for(s=0;s<i.length-1;s+=7){var o=i.substr(s,7);s!=i.length-7&&(o="1"+o),e+=h(parseInt(o,2))}return e};et.asn1.DERObjectIdentifier.superclass.constructor.call(this),this.hT="06",this.setValueHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.setValueOidString=function(t){if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var e="",i=t.split("."),r=40*parseInt(i[0])+parseInt(i[1]);e+=h(r),i.splice(0,2);for(var n=0;n<i.length;n++)e+=s(i[n]);this.hTLV=null,this.isModified=!0,this.s=null,this.hV=e},this.setValueName=function(t){var e=et.asn1.x509.OID.name2oid(t);if(""===e)throw"DERObjectIdentifier oidName undefined: "+t;this.setValueOidString(e)},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t?t.match(/^[0-2].[0-9.]+$/)?this.setValueOidString(t):this.setValueName(t):void 0!==t.oid?this.setValueOidString(t.oid):void 0!==t.hex?this.setValueHex(t.hex):void 0!==t.name&&this.setValueName(t.name))},tt.lang.extend(et.asn1.DERObjectIdentifier,et.asn1.ASN1Object),et.asn1.DEREnumerated=function(t){et.asn1.DEREnumerated.superclass.constructor.call(this),this.hT="0a",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=et.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new O(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex))},tt.lang.extend(et.asn1.DEREnumerated,et.asn1.ASN1Object),et.asn1.DERUTF8String=function(t){et.asn1.DERUTF8String.superclass.constructor.call(this,t),this.hT="0c"},tt.lang.extend(et.asn1.DERUTF8String,et.asn1.DERAbstractString),et.asn1.DERNumericString=function(t){et.asn1.DERNumericString.superclass.constructor.call(this,t),this.hT="12"},tt.lang.extend(et.asn1.DERNumericString,et.asn1.DERAbstractString),et.asn1.DERPrintableString=function(t){et.asn1.DERPrintableString.superclass.constructor.call(this,t),this.hT="13"},tt.lang.extend(et.asn1.DERPrintableString,et.asn1.DERAbstractString),et.asn1.DERTeletexString=function(t){et.asn1.DERTeletexString.superclass.constructor.call(this,t),this.hT="14"},tt.lang.extend(et.asn1.DERTeletexString,et.asn1.DERAbstractString),et.asn1.DERIA5String=function(t){et.asn1.DERIA5String.superclass.constructor.call(this,t),this.hT="16"},tt.lang.extend(et.asn1.DERIA5String,et.asn1.DERAbstractString),et.asn1.DERUTCTime=function(t){et.asn1.DERUTCTime.superclass.constructor.call(this,t),this.hT="17",this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"utc"),this.hV=stohex(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"utc"),this.hV=stohex(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{12}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date))},tt.lang.extend(et.asn1.DERUTCTime,et.asn1.DERAbstractTime),et.asn1.DERGeneralizedTime=function(t){et.asn1.DERGeneralizedTime.superclass.constructor.call(this,t),this.hT="18",this.withMillis=!1,this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=stohex(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=stohex(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{14}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date),!0===t.millis&&(this.withMillis=!0))},tt.lang.extend(et.asn1.DERGeneralizedTime,et.asn1.DERAbstractTime),et.asn1.DERSequence=function(t){et.asn1.DERSequence.superclass.constructor.call(this,t),this.hT="30",this.getFreshValueHex=function(){for(var t="",e=0;e<this.asn1Array.length;e++){t+=this.asn1Array[e].getEncodedHex()}return this.hV=t,this.hV}},tt.lang.extend(et.asn1.DERSequence,et.asn1.DERAbstractStructured),et.asn1.DERSet=function(t){et.asn1.DERSet.superclass.constructor.call(this,t),this.hT="31",this.sortFlag=!0,this.getFreshValueHex=function(){for(var t=new Array,e=0;e<this.asn1Array.length;e++){var i=this.asn1Array[e];t.push(i.getEncodedHex())}return 1==this.sortFlag&&t.sort(),this.hV=t.join(""),this.hV},void 0!==t&&void 0!==t.sortflag&&0==t.sortflag&&(this.sortFlag=!1)},tt.lang.extend(et.asn1.DERSet,et.asn1.DERAbstractStructured),et.asn1.DERTaggedObject=function(t){et.asn1.DERTaggedObject.superclass.constructor.call(this),this.hT="a0",this.hV="",this.isExplicit=!0,this.asn1Object=null,this.setASN1Object=function(t,e,i){this.hT=e,this.isExplicit=t,this.asn1Object=i,this.isExplicit?(this.hV=this.asn1Object.getEncodedHex(),this.hTLV=null,this.isModified=!0):(this.hV=null,this.hTLV=i.getEncodedHex(),this.hTLV=this.hTLV.replace(/^../,e),this.isModified=!1)},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.tag&&(this.hT=t.tag),void 0!==t.explicit&&(this.isExplicit=t.explicit),void 0!==t.obj&&(this.asn1Object=t.obj,this.setASN1Object(this.isExplicit,this.hT,this.asn1Object)))},tt.lang.extend(et.asn1.DERTaggedObject,et.asn1.ASN1Object);var it=function(i){function r(t){var e=i.call(this)||this;return t&&("string"==typeof t?e.parseKey(t):(r.hasPrivateKeyProperty(t)||r.hasPublicKeyProperty(t))&&e.parsePropertiesFrom(t)),e}return function(t,e){function i(){this.constructor=t}p(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}(r,i),r.prototype.parseKey=function(t){try{var e=0,i=0,r=/^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(t)?d(t):v.unarmor(t),n=x.decode(r);if(3===n.sub.length&&(n=n.sub[2].sub[0]),9===n.sub.length){e=n.sub[1].getHexStringValue(),this.n=q(e,16),i=n.sub[2].getHexStringValue(),this.e=parseInt(i,16);var s=n.sub[3].getHexStringValue();this.d=q(s,16);var o=n.sub[4].getHexStringValue();this.p=q(o,16);var h=n.sub[5].getHexStringValue();this.q=q(h,16);var a=n.sub[6].getHexStringValue();this.dmp1=q(a,16);var u=n.sub[7].getHexStringValue();this.dmq1=q(u,16);var c=n.sub[8].getHexStringValue();this.coeff=q(c,16)}else{if(2!==n.sub.length)return!1;var f=n.sub[1].sub[0];e=f.sub[0].getHexStringValue(),this.n=q(e,16),i=f.sub[1].getHexStringValue(),this.e=parseInt(i,16)}return!0}catch(t){return!1}},r.prototype.getPrivateBaseKey=function(){var t={array:[new et.asn1.DERInteger({int:0}),new et.asn1.DERInteger({bigint:this.n}),new et.asn1.DERInteger({int:this.e}),new et.asn1.DERInteger({bigint:this.d}),new et.asn1.DERInteger({bigint:this.p}),new et.asn1.DERInteger({bigint:this.q}),new et.asn1.DERInteger({bigint:this.dmp1}),new et.asn1.DERInteger({bigint:this.dmq1}),new et.asn1.DERInteger({bigint:this.coeff})]};return new et.asn1.DERSequence(t).getEncodedHex()},r.prototype.getPrivateBaseKeyB64=function(){return c(this.getPrivateBaseKey())},r.prototype.getPublicBaseKey=function(){var t=new et.asn1.DERSequence({array:[new et.asn1.DERObjectIdentifier({oid:"1.2.840.113549.1.1.1"}),new et.asn1.DERNull]}),e=new et.asn1.DERSequence({array:[new et.asn1.DERInteger({bigint:this.n}),new et.asn1.DERInteger({int:this.e})]}),i=new et.asn1.DERBitString({hex:"00"+e.getEncodedHex()});return new et.asn1.DERSequence({array:[t,i]}).getEncodedHex()},r.prototype.getPublicBaseKeyB64=function(){return c(this.getPublicBaseKey())},r.wordwrap=function(t,e){if(!t)return t;var i="(.{1,"+(e=e||64)+"})( +|$\n?)|(.{1,"+e+"})";return t.match(RegExp(i,"g")).join("\n")},r.prototype.getPrivateKey=function(){var t="-----BEGIN RSA PRIVATE KEY-----\n";return t+=r.wordwrap(this.getPrivateBaseKeyB64())+"\n",t+="-----END RSA PRIVATE KEY-----"},r.prototype.getPublicKey=function(){var t="-----BEGIN PUBLIC KEY-----\n";return t+=r.wordwrap(this.getPublicBaseKeyB64())+"\n",t+="-----END PUBLIC KEY-----"},r.hasPublicKeyProperty=function(t){return(t=t||{}).hasOwnProperty("n")&&t.hasOwnProperty("e")},r.hasPrivateKeyProperty=function(t){return(t=t||{}).hasOwnProperty("n")&&t.hasOwnProperty("e")&&t.hasOwnProperty("d")&&t.hasOwnProperty("p")&&t.hasOwnProperty("q")&&t.hasOwnProperty("dmp1")&&t.hasOwnProperty("dmq1")&&t.hasOwnProperty("coeff")},r.prototype.parsePropertiesFrom=function(t){this.n=t.n,this.e=t.e,t.hasOwnProperty("d")&&(this.d=t.d,this.p=t.p,this.q=t.q,this.dmp1=t.dmp1,this.dmq1=t.dmq1,this.coeff=t.coeff)},r}(Q),rt=function(){function t(t){t=t||{},this.default_key_size=parseInt(t.default_key_size,10)||1024,this.default_public_exponent=t.default_public_exponent||"010001",this.log=t.log||!1,this.key=null}return t.prototype.setKey=function(t){this.log&&this.key&&console.warn("A key was already set, overriding existing."),this.key=new it(t)},t.prototype.setPrivateKey=function(t){this.setKey(t)},t.prototype.setPublicKey=function(t){this.setKey(t)},t.prototype.decrypt=function(t){try{return this.getKey().decrypt(f(t))}catch(t){return!1}},t.prototype.encrypt=function(t){try{return c(this.getKey().encrypt(t))}catch(t){return!1}},t.prototype.sign=function(t,e,i){try{return c(this.getKey().sign(t,e,i))}catch(t){return!1}},t.prototype.verify=function(t,e,i){try{return this.getKey().verify(t,f(e),i)}catch(t){return!1}},t.prototype.getKey=function(t){if(!this.key){if(this.key=new it,t&&"[object Function]"==={}.toString.call(t))return void this.key.generateAsync(this.default_key_size,this.default_public_exponent,t);this.key.generate(this.default_key_size,this.default_public_exponent)}return this.key},t.prototype.getPrivateKey=function(){return this.getKey().getPrivateKey()},t.prototype.getPrivateKeyB64=function(){return this.getKey().getPrivateBaseKeyB64()},t.prototype.getPublicKey=function(){return this.getKey().getPublicKey()},t.prototype.getPublicKeyB64=function(){return this.getKey().getPublicBaseKeyB64()},t.version="3.0.0-rc.1",t}();window.JSEncrypt=rt,t.JSEncrypt=rt,t.default=rt,Object.defineProperty(t,"__esModule",{value:!0})});
// ============ Google Ads ==============
var ads_SuccessCallBack		= null;
var ads_FailCallBack		= null;
var ads_Action				= null;
var ads_Position			= null;
var bAlertPopup				= false;	// 얼렛창 보여줄지 설정

var ads_IsInit = false;

// async function BannerInit() {
// 	//배너 광고 사용한다면 함수 넣을것
// 	await window.CrazyGames.SDK.banner.requestBanner({
// 		id: "banner-container",
// 		width: 728,
// 		height: 90,
// 	});
// }

function adsInit(info, cb) {
	if (ads_IsInit) return;
	console.log("=== adsInit()");
	// if (info.isBanner) {
	// 	BannerInit();
	// }
	ads_IsInit = true;
}

var __isPaused = false;
function __GamePause() {
	if(typeof Phaser != "undefined" && Define.PHASER_3 == undefined){ // 페이저 2.6버젼
		if(MG && MG.game && MG.game.paused != null){
			__isPaused = MG.game.paused;
			MG.game.paused = true;
		}
	}else{
	}
}

function __GameContinue() {
	if(typeof Phaser != "undefined" && Define.PHASER_3 == undefined){ // 페이저 2.6버젼
		if(MG && MG.game && MG.game.paused != null){
			MG.game.paused = __isPaused;
		}
	}else{
	}
}

function ShowAD( _action, _position, scb, fcb, bAlert ) {
	ads_Action = _action;
	ads_Position = _position;
	ads_SuccessCallBack = scb;
	ads_FailCallBack = fcb;
	if(bAlert==undefined)bAlert=true;
	bAlertPopup = bAlert;	// undefine이면 true를 셋팅해준다.

	console.log("ShowAD : "+_action+" : "+_position);
	// var callback = {
	// 	adStarted:function(){
	// 		__GamePause();
	// 	},
	// 	adFinished:function() {
	// 		__GameContinue();
	// 		if(scb)scb();
	// 	},
	// 	adError:function() {
	// 		__GameContinue();
	// 		if(fcb)fcb();
	// 	}
	// }

	// switch(ads_Action){
	// 	case "basic":
	// 		window.CrazyGames.SDK.ad.requestAd("midgame", {
	// 			adStarted:function(){
	// 				__GamePause();
	// 				console.log('Video ad open.');
	// 			},
	// 			adFinished:function() {
	// 				__GameContinue();
	// 				if(scb)scb();
	// 				console.log("== onClose");
	// 			},
	// 			adError:function(e) {
	// 				__GameContinue();
	// 				if(fcb)fcb();
	// 				console.log("== error : ", e);
	// 			}
	// 		});
	//
	// 		break;
	// 	case "reward":
	// 		window.CrazyGames.SDK.ad.requestAd("rewarded", {
	// 			adStarted:function(){
	// 				__GamePause();
	// 				console.log('Video ad open.');
	// 			},
	// 			adFinished:function() {
	// 				__GameContinue();
	// 				if(scb)scb();
	// 				console.log('Rewarded!');
	// 			},
	// 			adError:function(e) {
	// 				ads_FailCallBackAlert(e, fcb);
	// 			}
	// 		});
	// 		break;
	// }

	//------- GameSnacks ------<<
	switch(ads_Action){
		case "basic":
			console.log('GameSnacks.ad.break_basic 호출시도');
			GameSnacks.ad.break({
				type: "next",
				name: "next_placement",
				beforeAd: () => { console.log('beforeAd_interAD');
					__GamePause();
				},
				afterAd:  () => { console.log('afterAd_interAD');
					//__GameContinue();
					//if(typeof scb !== "undefined") scb();
				},
				//beforeReward: e => { console.log('beforeReward_interAD',e);},//보상형
				// adDismissed: () => {//보상형
				// 	console.log('adDismissed_interAD');
				// 	__GameContinue();
				// 	if(fcb)fcb();
				// },
				// adViewed: () => {//보상형
				// 	console.log('adViewed_interAD',e);
				// 	__GameContinue();
				// 	if(scb) scb();
				// },
				adBreakDone: e => { console.log('adBreakDone_interAD',e);
					//e.breakFormat === "interstitial" 일때 진입함
					console.log('breakStatus:',e.breakStatus, '  breakFormat:', e.breakFormat);
					var isok = false;
					if(e.breakStatus === "ignored"){ }//광고없음
					else if(e.breakStatus === "frequencyCapped"){ }//빈도 제한
					else if(e.breakStatus === "viewed") { isok = true; }

					window.focus();
					if(isok) {
						__GameContinue();
						if(scb)scb();
					}else{
						__GameContinue();
						if(fcb)fcb();
					}

					// __GameContinue(); //중복처리이므로, 주석
					// window.focus();
					// if(typeof scb !== "undefined") scb(); //중복처리이므로, 주석
				}
			})
			break;
		case "reward":
			console.log('GameSnacks.ad.break_reward 호출시도');
			GameSnacks.ad.break({
				type: "reward",
				name: "reward_placement",
				//beforeAd: () => {console.log('beforeAd_reward');},
				//afterAd:  () => { console.log('afterAd_reward');},
				beforeReward: showAdFn => { console.log('beforeReward_reward',showAdFn);
					//주석처리 __GamePause();
					showAdFn(); // ✅ 실제 광고 실행
				},
				adDismissed: () => { console.log('adDismissed_reward');
					//ads_FailCallBackAlert(undefined, fcb);
					__GameContinue();
					if(fcb)fcb();
				},
				adViewed: () => { console.log('adViewed_reward');
					// __GamePause();
					//if(scb) scb(); //adBreakDone에서 처리한다
				},
				adBreakDone: e => { console.log('adBreakDone_reward',e);
					//e.breakFormat === "reward"일때 진입함
					console.log('breakStatus:',e.breakStatus, '  breakFormat:', e.breakFormat);
					var isok = false;
					if(e.breakStatus === "ignored"){ }//광고없음
					else if(e.breakStatus === "frequencyCapped"){ }//빈도 제한
					else if(e.breakStatus === "viewed") { isok = true; }

					window.focus();
					if(isok) {
						__GameContinue();
						if(scb)scb();
					}else{
						__GameContinue();
						if(fcb)fcb();
					}

				},
				//--추가<<
				adBreakFailed: e => { console.error('adBreakFailed', e);
					window.focus();
					__GameContinue();
					if(fcb)fcb();
				}
				//--추가>>
			})
			break;
	}
	//------- GameSnacks ------>>

}

// 리워드형광고일경우 광고가 없을경우 적절한 얼렛을 띄워준다.
function ads_FailCallBackAlert(e, fcb){
	if (!(MG && MG.alert)) {
		if(fcb)fcb();
		console.log("== error : ", e);
		__GameContinue();
		return;
	}

	switch(e){
		case "dismissed":	// 광고 시청시 중간에 끊기
			MG.alert("", Define.LANG==Define.tbLang[0]?"리워드를 획득하지 못했습니다.":"Failed to earn rewards.", function(){
				if(fcb)fcb();
				__GameContinue();
			});
			break;
		default:
			MG.alert("", Define.LANG==Define.tbLang[0]?"광고가 소진되었거나,\n광고 불러오기에 실패하였습니다.\n잠시 후 다시 시도해주세요.":"No more available ads to watch,\nor they failed to load.\nPlease try again later.", function(){
				if(fcb)fcb();
				__GameContinue();
			});
			break;
	}

	console.log('Error while open video ad : ', e);
}

//========================================================================================================
// 구글 배너 광고 사이드 좌우측 설정..
var PopconGame = PopconGame || {};
PopconGame.Ads = {
	beforeReward:false,	// 광고 준비 상태.
	TE_Update:undefined,
	iSideWaitCnt:0, // 사이드 배너 카운팅을 잠시 한다.
	TE_UpdateBottom:undefined,
	iWaitCnt:0,	// 하단광고 배너 카운팅을 잠시 한다.

	// 광고 결제용
	info:undefined,			// 광고 관련 정보.
	cbBaseResize:undefined,	// 게임에 있는 원본 리사이즈
};

PopconGame.Ads.Init = function(){
	if(this.info && this.info.isBanner == false) return; // 광고 결제로 인해 광고가 안보여지게 할경우 막는다.
}
var hidden2, visibilityChange2;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
	hidden2 = "hidden";
	visibilityChange2 = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
	hidden2 = "msHidden";
	visibilityChange2 = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden2 = "webkitHidden";
	visibilityChange2 = "webkitvisibilitychange";
}
function handleVisibilityChange2() {
	if(MSSDK == undefined) return;
//	console.log("==== handleVisibilityChange2 : "+document[hidden2]);
	if(document[hidden2]){
		MSSDK.status = "BACKGROUND";
	}else{
		MSSDK.status = "FOREGROUND";
		MSSDK.setFocus();
	}
}
document.addEventListener(visibilityChange2, handleVisibilityChange2, false);

// todo : 없는 함수들 선언해줌.
var PopconGame = PopconGame || {};
PopconGame.Sdk= {};
PopconGame.Sdk.exitGame = function(){};
PopconGame.Sdk.log = function(){};

//====================================================================================
//
function MoviSoftSDK(){
	console.log("=== MoviSoftSDK create (GameSnacks)");
	this.msn = undefined;
	this.status = "FOREGROUND";
	this.tSetTimeout = undefined;
	this.LANG = "ko";//"en";
	// 브라우져 구분..
	this.isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
	};

	// todo : api체크. 라이브될때 빼주자..
	this.interval = setInterval(function(){
		if (typeof MG !== 'undefined') {
			clearInterval(this.interval);
			/*if(MG.UpdateDON == undefined){
				console.error("MG.UpdateDON() 함수가 정의되지 않았습니다.");
			}*/
			if(Define.bLocalHost)
				console.error("로컬에서 테스트중인가요?");
			if(MG.iMSH == undefined)
				console.error("MG.iMSH 가 없습니다.");
			if(Define.DEVICE == undefined)
				console.error("Define.DEVICE 가 없습니다.");
			if(Define.tbLang == undefined)
				console.error("Define.tbLang 가 없습니다.");
		}
	}.bind(this), 1000);

	// ios일때 이어폰 제거 및 블루투스 제거할때 사운드가 안나와서 처리함.
	if(this.isMobile.iOS()){// ios일때만 처리함..
		setInterval(function(){
			try {
				if (typeof Phaser !== 'undefined'){
					if (MG.game.sound.context.state !== "running" && this.tSetTimeout == undefined) {
						this.tSetTimeout = setTimeout(function(){
							this.tSetTimeout = undefined;
						//	console.log("=== : 11 : MG.game.sound.context.state : " + MG.game.sound.context.state);
							if(MG.game.sound.context.state === "suspended")	// 블루투스의 경우 1초가 지난시점에 running으로 상태값이 변경되어 있을수가 있다. 이때 리즘처리를 안해야 스피커쪽으로 소리가 나오지 않는다.
								MG.game.sound.context.resume();
						}.bind(this), 1000);
					}
				}else if(typeof PIXI !== 'undefined' && this.tSetTimeout == undefined){
					if(Howler){
						if (Howler.ctx.state !== "running") {
							this.tSetTimeout = setTimeout(function(){
								this.tSetTimeout = undefined;
								if(Howler.ctx.state === "suspended")	// 블루투스의 경우 1초가 지난시점에 running으로 상태값이 변경되어 있을수가 있다. 이때 리즘처리를 안해야 스피커쪽으로 소리가 나오지 않는다.
									Howler.ctx.resume();
							}, 1000);
						}
					}else{
						console.error("PIXI : Howler을 사용 안함 : API 추가해야함");
					}
				}else if(typeof pc !== 'undefined' && typeof pc.app !== 'undefined' && this.tSetTimeout == undefined){
					if (pc.app.systems.sound.context.state !== "running") {
						this.tSetTimeout = setTimeout(function(){
							this.tSetTimeout = undefined;
							if(pc.app.systems.sound.context.state === "suspended")	// 블루투스의 경우 1초가 지난시점에 running으로 상태값이 변경되어 있을수가 있다. 이때 리즘처리를 안해야 스피커쪽으로 소리가 나오지 않는다.
								pc.app.systems.sound.context.resume();
						}, 1000);
					}
				}
			} catch (err) {
			}
		}, 1000);
	}
}

MoviSoftSDK.prototype = {
	//====================================================================================
	initializeAsync:function(data, cb){	// 초기화를 해준다.
		this.cb = cb;
		console.log("=== GameVer : "+Define.txtVer);

		console.log("=== MoviSoftSDK initializeAsync");

		// 랭귀지 초기화.
		//MSSDK.LANG = this.getParameterByName("lang");
		// if(MSSDK.LANG == null || MSSDK.LANG == undefined || MSSDK.LANG == '')
		// 	MSSDK.LANG = "ko";
		MSSDK.LANG = 'en';

		this.setBackKey();	// 백키 처리.


		// 광고 초기화.
		// 네트웍 초기화
		console.log('MG.NM.init()');
		MG.NM.Init();
		console.log('MSSDK.sdkInit()');
		MSSDK.sdkInit(cb); //cb--> MSSDK.initializeAsync({}, function() {});

		this.firstFrameReady(); //게임스낵 첫프레임
		this.onPause(function (){
			console.log('cb onPause');
		});
		this.onResume(function (){
			console.log('cb onResume');
		});
		//GameSnacks.game.firstFrameReady(); //GameSnacks
		// GameSnacks.game.onPause(function() {}); //GameSnacks
		// GameSnacks.game.onResume(function() {}); //GameSnacks
	},

	sdkInit: function(cb) {
		if(cb) cb();
	},

	getParameterByName:function(name){
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/%20/gi, "+").replace(/%2F/gi, "/"));
	},
	setFocus:function(){	// 포커스가 돌아올때 먼가를 셋팅해준다.
		/*if(MSSDK.bFocusCheck == false){
			MSSDK.bFocusCheck = true;
			if(MG && MG.NM) {	// 화면이 활성화 되면 로그인체크 및 DON조회 한다.
				MG.NM.DosiLogin({type:"login"}, function(){
					MG.NM.GetDON({}, function(data){	// DON 조회..
						MSSDK.bFocusCheck = false;
						if(MG.UpdateDON) MG.UpdateDON();	// 각 게임별 DON 갱신..
					});
				});
			}
		}*/
	},
	setBackKey:function(){	// 기존에 hspopcon.sdk.loader.js에 initialize()안에 있는 코드를 가져왔다.
		//=============================================================================
		// 백키처리.
		/*switch(Define.PID){
			case "100076":	// SK플래닛-OK캐시백
				break;
		//	case "100064":	// 안드로이드
		//		break;
			default:
				if(Define.DEVICE != Enum.DEVICE_STATE.PC){
					if(Define.PID*1 < 200000){
						history.pushState(null, document.title, location.href);
						switch(Define.GAME_CODE){
							case 100:	// 컬러팝
							case 107:	// 에이전트펭귄
							case 137:	// 캔디블라켓(컬러팝)
								window.addEventListener('popstate', function(event) {
									if (Define.PID == "100064"){
										/!*if(typeof(PopconGame) != 'undefined'){
                                            PopconGame.Sdk.drawAppMoreGameList(MG.game, Define.GAME_CODE,function (){
                                            }, true);
                                        }*!/
									}else{
										if(PopconGame.Sdk.getShowExitPopup()) MSSDK.gameExit(false);
									}
								});
								break;
							case 111:	// 라이트라인 (필아웃)
							case 139:	// 필아웃 (라이트라인)
							case 176:	// 달고나
							case 177:	// 머지푸르트
							case 179:	// 퍼즐우도쿠
							case 183:	// 달고나2
								window.addEventListener('popstate', function(event) {
									if (Define.PID == "100064"){
										if(typeof(PopconGame) != 'undefined'){
											PopconGame.Sdk.drawAppMoreGameList(MG.game, Define.GAME_CODE,function (){
											}, true);
										}
									}else{
										if(PopconGame.Sdk.getShowExitPopup()) MSSDK.gameExit(false);
									}
								});
								break;
							default:
								window.addEventListener('popstate', function(event) {
									if(PopconGame.Sdk.getShowExitPopup()) MSSDK.gameExit(false);
								});
								break;
						}
					}
				}
				break;
		}*/
	},
	getBackBotton:function(){
		return this.getBackButton();
	},
	getBackButton:function() {	// 백버튼이 필요한지 체크.
		return false;//구글스낵에서 아이폰 나가기 버튼 숨기기
		switch(Define.PID) {
			case "100003":	// 네오위즈 : 아이돌챔프
			case "100064":	// 안드로이드
			case "100076":	// SK플래닛-OK캐시백
			case "100077":	// SK플래닛-오락앱
				break;
			default:
				if(/iPhone|iPad|iPod/i.test(navigator.userAgent))
					return true;
				break;
		}
		return false;
	},
	gameExit:function(bDirect){	// 게임 종료창 처리.
		if(bDirect) history.back();
		// var strExit = MSSDK.LANG=="ko"?"게임을 종료하시겠습니까?":"Do you want to exit?";
		// MG.confirm("", strExit, "YES", "NO", function () {
		// 	MSSDK.exitGame();
		// }, function () {
		// 	history.pushState(null, document.title, location.href);
		// });
	},
	exitGame:function(){
		switch(Define.PID){
			case "100003":	// 아이돌챔프
				var jsonStr = JSON.stringify({'action':'closeGame', 'item_type':'FINISH'});
				if ( /Android/i.test ( navigator.userAgent ) )
					ichamp.closeGame(jsonStr);
				else if ( /iPhone|iPad|iPod/i.test ( navigator.userAgent ) )
					window.webkit.messageHandlers.ichamp.postMessage(jsonStr);
				break;
			case "100010":	// 캐시닥
				window.location.href = 'cashwalk://back';
				break;
			case "100026":	// 캐시워크
				if(getParameterName('cw_zone') == "1"){
					window.location.href = 'cashwalk://back';
				}else{
					if(getParameterName('movi_zone') == "1")
						history.back(); //뒤로가기 버튼 누름"
					else
						window.location.href = 'cashwalk://back';
				}
				break;
			case "100067":	// 캐시워크 미국
				window.location.href = 'cwusapp://back';
				break;
			case "100048":	// 티니어
				window.location.href = 'fineminigame://endGame';
				break;
			case "100064": case "100065": case "100066":	// 네이티브
				if (/Android/i.test(navigator.userAgent)){
					navigator.app.exitApp();
				}else{
					window.parent.postMessage({
						'from': 'app_exit',
						'type': 'exit'
					}, '*');
				}
				break;
			case "100052":	// 에이스 엔터테이먼트
				var parameter = {};
				if (/Android/i.test(navigator.userAgent)) {
					MoviSoftJSHandler.closeGame(JSON.stringify(parameter));
				}else if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
					window.webkit.messageHandlers.closeGame.postMessage(parameter);
				}
				break;
			default:
				if(Define.DEVICE == Enum.DEVICE_STATE.PC){
					if(history.back.length == 0)	window.close();
					else							history.back();
				}else{
					history.back();
					history.back();
				}
				break;
		}
	},
	ShowLoading:function(){
		if(this.loading == undefined){
			// 출력할 마스크를 설정해준다.
			var cssStr = "#link {color: #E45635;display:block;font: 12px \"Helvetica Neue\", Helvetica, Arial, sans-serif;text-align:center; text-decoration: none;}\n" +
				"#link:hover {color: #ffffff}\n" +
				"\n" +
				"#link, #link:hover {-webkit-transition: color 0.5s ease-out;-moz-transition: color 0.5s ease-out;-ms-transition: color 0.5s ease-out;-o-transition: color 0.5s ease-out;transition: color 0.5s ease-out;}\n" +
				"\n" +
				"/** BEGIN CSS **/\n" +
				"body {background: #333333;}\n" +
				"@keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				"@-moz-keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				"@-webkit-keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				"@-o-keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				"@keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				"@-moz-keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				"@-webkit-keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				"@-o-keyframes rotate-loading {\n" +
				"  0%  {transform: rotate(0deg);-ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); -moz-transform: rotate(0deg);}\n" +
				"  100% {transform: rotate(360deg);-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); -moz-transform: rotate(360deg);}\n" +
				"}\n" +
				"\n" +
				".loading-container,\n" +
				".loading {\n" +
				"  height: 100px;\n" +
				"  position: relative;\n" +
				"  width: 100px;\n" +
				"  border-radius: 100%;\n" +
				"}\n" +
				"\n" +
				".loading-container { margin: 40px auto }\n" +
				"\n" +
				".loading {\n" +
				"  border: 4px solid transparent;\n" +
				"  border-color: transparent #fff transparent #FFF;\n" +
				"  -moz-animation: rotate-loading 1.5s linear 0s infinite normal;\n" +
				"  -moz-transform-origin: 50% 50%;\n" +
				"  -o-animation: rotate-loading 1.5s linear 0s infinite normal;\n" +
				"  -o-transform-origin: 50% 50%;\n" +
				"  -webkit-animation: rotate-loading 1.5s linear 0s infinite normal;\n" +
				"  -webkit-transform-origin: 50% 50%;\n" +
				"  animation: rotate-loading 1.5s linear 0s infinite normal;\n" +
				"  transform-origin: 50% 50%;\n" +
				"}\n" +
				"\n" +
				".loading-container:hover .loading {\n" +
				"  border-color: transparent #E45635 transparent #E45635;\n" +
				"}\n" +
				".loading-container:hover .loading,\n" +
				".loading-container .loading {\n" +
				"  -webkit-transition: all 0.5s ease-in-out;\n" +
				"  -moz-transition: all 0.5s ease-in-out;\n" +
				"  -ms-transition: all 0.5s ease-in-out;\n" +
				"  -o-transition: all 0.5s ease-in-out;\n" +
				"  transition: all 0.5s ease-in-out;\n" +
				"}\n" +
				"\n" +
				"#loading-text {\n" +
				"  color: #ffffff;\n" +
				"  font-family: \"Helvetica Neue, \"Helvetica\", \"\"arial\";\n" +
				"  font-size: 10px;\n" +
				"  font-weight: bold;\n" +
				"  margin-top: 45px;\n" +
				"  opacity: 1;\n" +
				"  position: absolute;\n" +
				"  text-align: center;\n" +
				"  text-transform: uppercase;\n" +
				"  top: 0;\n" +
				"  width: 108px;\n" +
				"}"
			var style = document.createElement("style");
			style.setAttribute("type", "text/css");
			if( style.styleSheet ) { // IE
				style.styleSheet.cssText = cssStr;
			} else { //W3C
				var cssText = document.createTextNode(cssStr);
				style.appendChild(cssText);
			}
			document.getElementsByTagName("head")[0].appendChild(style);

			var mask = '<div id="mask" style="position:absolute;z-index:10;background-color:#ffffff;display:none;left:0;top:0;width:100%;height:100%;opacity:0;"></div>';
			var loading = '<div id="loading" class="loading-container" style="position:absolute;z-index:11;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);">';
			loading += '<div class="loading"></div>';
			loading += '<div id="loading-text">loading</div>';
			loading += '</div>';
			this.loading = loading;
			$('body').append(mask).append(loading);
			$('#mask').show();
			$('#loading').hide();
		}
		if(this.timeID) {
			clearTimeout(this.timeID);
			this.timeID = undefined;
		}
		this.timeID = setTimeout(function () {
			this.timeID = undefined;
			$('#loading').show();
		}.bind(this), 500);
	},
	HideLoading:function(){
		$('#mask').hide();
		$('#loading').hide();
		if(this.timeID)
			clearTimeout(this.timeID);
	},
	/*showResultPopup:function(data, cb){

    },
	uuidv4:function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},*/

	//--------------------------------게임스낵 이벤트----------------------<<
	firstFrameReady:function() {
		console.log('gamesnacks.firstFrameReady');
		GameSnacks.game.firstFrameReady();
	},
	ready:function(){
		console.log('gamesnacks.ready');
		GameSnacks.game.ready();
	},
	gameOver:function(){
		console.log('gamesnacks.gameOver');
		GameSnacks.game.gameOver();
	},
	levelComplete:function(level){
		console.log('gamesnacks.levelComplete', level);
		GameSnacks.game.levelComplete(level);
	},
	scoreUpdate:function(score){
		console.log('gamesnacks.scoreUpdate', score);
		GameSnacks.score.update(score);
	},
	audioSubscribe:function(cb){
		console.log('gamesnacks.audioSubscribe 등록');
		GameSnacks.audio.subscribe(function(val) {
			console.log('gamesnacks.audioSubscribe 실행', val);
			if(cb) cb(val);
		});
	},
	audioIsEnabled:function (cb){
		var val = GameSnacks.audio.isEnabled();
		console.log('gamesnacks.audioIsEnabled', val);
		window.focus(); //GameSnacks//포커스추가
        console.log('1window.focus');
		if(cb) cb(val);
	},
	onPause:function(cb){
		GameSnacks.game.onPause(()=>{ if(cb) cb(); });
	},
	onResume:function (cb) {
		GameSnacks.game.onResume(()=>{ if(cb) cb(); });
	},
	beforeunload:function (cb) {

	},
};
var MSSDK = new MoviSoftSDK();
function NetworkManager(){
	if(Define.GameName == undefined)
		console.error("Define.GameName이 없습니다.");
	if(Define.SAVE_KEY == undefined)
		console.error("Define.SAVE_KEY가 없습니다.");

	this.SERVER_URL;

	this.user_id = "LOCAL_TEST";	// todo : 우선 임시로 넣어놓음.
	this.user_nick = "";
	this.user_token = "";
	this.feed_id = "";
	this.bGameStart = false;
	this.week_info = undefined;

	this.fSaveTime = 0;	// 서버에 저장되는 세이브 타임을 정한다.

	// playTime 체크.
	this.fPlayTime = 0;
	this.interval = setInterval(function(){
		if(MSSDK.status == "FOREGROUND") {
			this.fPlayTime += 2;
		//	console.log("==== interval : " + (new Date()));
		}
	}.bind(this), 2000);
}

NetworkManager.prototype = {
	Init:function(url) {
		this.SERVER_URL = url;
	},
	start:function(data, cb) {
		if (cb) cb();
	},
	end:function(data, cb) {
		if (cb) cb();
	},
	LocalSave:function(cb) {
		if(this.bSaveLoad == undefined) return;	// 로드 되기전에는 세이브가 되지 않게 장치를 해놓는다.
		console.log("11== LocalSave(GameSnacks)");
		kData.saveTime = new Date();

		//localStorage.setItem(Define.SAVE_KEY, JSON.stringify(kData));
		GameSnacks.storage.setItem(Define.SAVE_KEY, JSON.stringify(kData)); //GameSnacks

		if(cb)cb();

		// if(this.SERVER_URL == undefined || Define.bLocalHost == true) {
		// 	if(cb)cb();
		// 	return;
		// }
		//
		// if(new Date() - this.fSaveTime < 60000)	// 1분이 안 지났으면 저장하지 않는다.
		// 	return;
		// this.fSaveTime = new Date();
		//
		// var savedata = MG.STR2BIN(JSON.stringify(kData)); // todo : DB 데이터 타입은 TEXT로 설정 제한용량은 64k이다.
		// var td = {
		// 	user_id:this.user_id,
		// 	game_id:Define.GameName,
		// 	game_data:savedata,
		// };
		// $.ajax({
		// 	url: this.SERVER_URL+"game_data_save.php",
		// 	async: true, // false 일 경우 동기 요청으로 변경
		// 	type: 'POST', // POST, GET, PUT
		// 	data: td,
		// 	dataType: 'text', // xml, json, script, html
		// 	success: function(data){
		// 		console.log("22== LocalSave : ", data);
		// 	//	data = JSON.parse(data);
		// 	}.bind(this),
		// });

		if(typeof cb == "function")	cb();
	},
	LocalLoad:function(cb) {
		console.log("11== LocalLoad : start(GameSnacks))");
		//var tv = localStorage.getItem(Define.SAVE_KEY);
		var tv = GameSnacks.storage.getItem(Define.SAVE_KEY); //GameSnacks
		//if(tv=='undefind')tv=undefined;
		this.bSaveLoad = true;

		if(tv){
			kData = JSON.parse(tv);
		}else{
			this.LocalSave();
		}
		if(cb)cb();



		// 서버url이 없거나, 로컬이거나, 게임코드가 50미만일때(미니게임,하우스게임) 로컬로 호출한다.
		// if(this.SERVER_URL == undefined || Define.bLocalHost == true || Define.GAME_CODE < 50) {
		// 	if(tv)	kData = JSON.parse(tv);
		// 	else	this.LocalSave();
		// 	if(cb)cb();
		// 	return;
		// }

		// var td = {
		// 	user_id:this.user_id,		// 유저 ID (str)
		// 	game_id:Define.GameName,	// 게임 ID (str)
		// 	user_nick:this.user_nick,	// 유저 닉네임(str)
		// };
		// $.ajax({
		// 	url: this.SERVER_URL+"game_login.php",
		// 	async: true, // false 일 경우 동기 요청으로 변경
		// 	type: 'POST', // POST, GET, PUT
		// 	data: td,
		// 	dataType: 'text', // xml, json, script, html
		// 	success: function(data){
		// 		data = JSON.parse(data);
		// 		switch(data.err_no){
		// 			case 0:
		// 			//	MSSDK.LANG = data.setting.language=="ko_KR"?"KR":"EN";
		// 				console.log("22== LocalLoad : end : ", data);
		// 				if(data.game_data) {
		// 					var cloudData = JSON.parse(MG.BIN2STR(data.game_data));
		// 					if(tv) {
		// 						var localData = JSON.parse(tv);
		// 						if(new Date(localData.saveTime)-new Date(cloudData.saveTime) >= 0)
		// 							kData = localData;
		// 						else
		// 							kData = cloudData;
		// 					}else {
		// 						kData = cloudData;
		// 					}
		// 				}else {
		// 					if(tv)	kData = JSON.parse(tv);
		// 					this.LocalSave();
		// 				}
		//
		// 				if(cb)cb(data);
		// 				break;
		// 			default:
		// 				MG.alert(MSSDK.LANG=="ko"?"경고":"Warning", MSSDK.LANG=="ko"?"네트웍 접속이 원활하지 않습니다.\n다시 접속해 주세요.":"Your network connection is unstable.\nPlease try again.");
		// 				break;
		// 		}
		// 	}.bind(this),
		// });
	},

	/*ShowToast:function (msg){
		var per = window.innerWidth/MG.iMSW;
		if(per > 1) per = 1;

		var Toast = Swal.mixin({
			width : 600*per,
			toast: true,
			position: 'bottom',
			showConfirmButton: false,
			timer: 5000,
		});

		Toast.fire({
			title: msg,
		}).then(function(result){
		});
	},*/
	/*Error:function(comment, txtbtn, cb){
		console.log("== Error() : ", comment);
		this.cb = cb;
		this.main_bg = document.createElement('div');
		this.main_bg.setAttribute("class", "error_main");
		this.main_bg.setAttribute("style", "background-color:rgba(255, 255, 255, 1);width:100%;height:100%;position:absolute;");
		document.body.appendChild(this.main_bg);

		this.main = document.createElement('div');
		this.main.setAttribute("class", "error_main");
		this.main.setAttribute("style", "background-color:rgba(255, 255, 255, 1);width:720px;height:1280px;position:absolute;border: none;left:50%;top:50%;transform: translateX(-50%) translateY(-50%);");
		document.body.appendChild(this.main);

		var ww = window.innerWidth;
		var sw = 720;
		var per = (ww>sw?sw:ww)/sw;
		this.main.style.transform = "translateX(-50%) translateY(-50%) scale("+per+")";

		var img = document.createElement('img');
		img.setAttribute("src", Define.CDN_URL+"../lib/img/adot_cha.png");
		img.setAttribute("style", "position:absolute;left:50%;top:40%;transform: translateX(-50%) translateY(-50%)");
		this.main.appendChild(img);

		var span = document.createElement('span');
		span.innerText = comment;//"문제가 발생했어요.\n잠시 후 다시 시도해 주세요.\n"+err;
		span.setAttribute("style", "display:table-cell;vertical-align:middle;color:rgba(9, 24, 64, 1);position:absolute;width:620px;left:50%;top:60%;transform:translateX(-50%) translateY(-50%);font-family:Roboto;text-align:center;font-size:26px;font-weight:600;letter-spacing:0;");
		this.main.appendChild(span);

		var btn = document.createElement('span');
		btn.setAttribute("style", "color:rgba(255, 255, 255, 1);position:absolute;background:url(\""+Define.CDN_URL+"../lib/img/error_button.png\") no-repeat;border:none;width:273px;height:85px;cursor:pointer;left:50%;top:70%;transform:translateX(-50%) translateY(-50%);");
		btn.addEventListener('click', function (event) {
			this.main.style.display = "none";
			this.main.remove();
			this.main = undefined;
			this.main_bg.style.display = "none";
			this.main_bg.remove();
			this.main_bg = undefined;
			if(cb)cb();
		}.bind(this));
		var btnTxt = document.createElement('span');
		btnTxt.innerText = txtbtn;
		btnTxt.setAttribute("style", "width:250px;position:absolute;font-family:Roboto;text-align:center;font-size:28px;font-weight:600;vertical-align:middle;color:#000000;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);");
		btn.appendChild(btnTxt);
		this.main.appendChild(btn);
	},*/
};