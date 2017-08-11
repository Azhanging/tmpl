/**
*
*
* tmpl.js v1.0.3
* (c) 2016-2017 Blue
* https://github.com/azhanging/tmpl
* Released under the MIT License.
*
*
**/
!function(t,e){"function"==typeof _require?_require.defineId("tmpl",e):"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("tmpl",[],e):t?t.Tmpl=e():{}}("undefined"!=typeof window?window:this,function(){function t(){}function e(t){this.init(t)}function n(t){this.config=q.extend(q.copy(I),t),this.init()}function r(t,e,n){var r=t.className.split(" ");if(!q.isObj(e)||"replaceBind"!=n&&"replaceClass"!=n)for(var e=e.split(" "),i=0;i<e.length;i++){var o=r.indexOf(e[i]);"bind"==n||"addClass"==n?o==-1&&r.push(e[i]):"unbind"!=n&&"removeClass"!=n||o!=-1&&r.splice(o,1)}else q.each(e,function(t,e){var n=r.indexOf(e);n!=-1&&(r[n]=t)});return t.className=r.join(" "),this}function i(t,e,n){var r=this;q.on(t,e,function(t){var n=t||window.event,i=n.target||n.srcElement,o=r.events[e];q.each(o,function(t,e){r.hasClass(i,e)&&q.each(t,function(t,e){t.apply(r,[n,i])})})}),this.eventType.push(e)}function o(){q.isObj(this.config.router)&&(this.router=this.config.router)}function s(){this.events={},this.eventType=[]}function l(t){var e=this,n=this.config[t];q.isObj(n)&&q.each(n,function(t,n){e[n]=t})}function a(t){var e="\\/*.?+$^[](){}|'\"";return q.each(e,function(e,n){t=t.replace(new RegExp("\\"+e,"g"),"\\"+e)}),t}function p(){var t=a.call(this,this.config.open_tag),e=a.call(this,this.config.close_tag);g=new RegExp(t+"[^=][\\s\\S]*?"+e+"|"+t+"=[\\s\\S]*?"+I.close_tag,"g"),v=new RegExp(t+"=[\\s\\S]*?"+e,"g"),b=new RegExp(t+"=","g"),T=new RegExp(t,"g"),S=new RegExp(e,"g")}function c(){L||h.call(this),f.call(this),d.call(this),u.call(this);var t=this.template.match(g),e=this.template.match(v),n=y.call(this),r=n.split(/___SCRIPT___|___ECHO_SCRIPT___/),i=[];t||(t=[]),e||(e=[]);var o=r.length>t.length?r:t;q.each(r,function(t,e){r[e]='___.push("'+m(t)+'");'}),q.each(t,function(e,n){v.lastIndex=0,v.test(e)?t[n]=e.replace(b,"___.push(").replace(S,");"):t[n]=e.replace(T,"").replace(S,"")}),q.each(o,function(e,n){"string"==typeof r[n]&&i.push(r[n]),"string"==typeof t[n]&&i.push(t[n].replace(E,""))}),this.dom="var _this_ = this,___ = [];"+i.join("")+'return ___.join("");'}function u(){var t,e,n=function(){return L?C:x}(),r=this;this.template=this.template.replace(w,""),t=q.unique(this.template.match(n)),e=t.toString().replace(n,"$2").split(","),0!==t.length&&0!==q.trimArr(e).length&&t.length>0&&e.length>0&&e.length===t.length&&(q.each(e,function(e,i){var o=new RegExp(a.call(r,t[i]),"g");if(L){var s=q.getEl(e);s?r.template=r.template.replace(o,r.html(s)):r.template=r.template.replace(o,t[i].replace(n,"$3"))}else try{var l=j.readFileSync(e,{encoding:"UTF8"});r.template=r.template.replace(o,l)}catch(p){r.template=r.template.replace(o,t[i].replace(n,"$3"))}}),t=q.unique(this.template.match(n)),t.length>0&&u.call(this))}function h(){var t=this;f.call(this);var e=q.unique(this.template.match(R)),n=e.toString().replace(R,"$2").split(",")[0];if(""!==n){var r=q.unique(this.template.match(O)),i=j.readFileSync(n,{encoding:"UTF8"}),o=i.match(O),s=o.toString().replace(O,"$2").split(",");q.each(s,function(e,n){var s=new RegExp(a.call(t,o[n]),"g"),l=!1;q.each(r,function(t,r){O.test(t);var a=RegExp.$2,p=RegExp.$3;e===a?(i=i.replace(s,p),l=!0):A.test(a)&&e===a.replace(A,"")?(i=i.replace(s,o[n].replace(O,"$3")+p),l=!0):N.test(a)&&e===a.replace(N,"")&&(i=i.replace(s,p+o[n].replace(O,"$3")),l=!0),O.lastIndex=0}),l||(i=i.replace(s,o[n].replace(O,"$3")))}),t.template=i}}function f(){var t=this,e=this.constructor;q.each(e.alias,function(e,n){t.template=t.template.replace(new RegExp(a.call(t,n),"g"),e)})}function d(){this.template=this.template.replace(R,"").replace(O,"")}function y(){var t=this.template.replace(v,"___ECHO_SCRIPT___").replace(g,"___SCRIPT___");return t}function m(t){return t.replace(E,"").replace(_,'\\"')}var g,v,b,T,S,E=/[\\\b\\\t\\\r\\\f\\\n]/g,_=/"/g,C=/<tmpl-include .*?name=(\'|\")(\S*?)\1.*?>([\s\S]*?)<\/tmpl-include>/g,x=/<tmpl-include .*?file=(\'|\")(\S*?)\1.*?>([\s\S]*?)<\/tmpl-include>/g,w=/<tmpl-include\s*?>[\s\S]*?<\/tmpl-include>/g,O=/<tmpl-block .*?name=(\'|\")(\S*?)\1.*?>([\s\S]*?)<\/tmpl-block>/g,A=/^append:/,N=/^insert:/,R=/<tmpl-extends .*?file=(\'|\")(\S*?)\1.*?>[\s\S]*?<\/tmpl-extends>/g,L="undefined"!=typeof window;if(!L)var j=require("fs");!function(){Array.prototype.indexOf||(Array.prototype.indexOf=function(t){for(var e=0,n=this.length;e<n;e++)if(this[e]===t)return e;return-1}),L&&!document.getElementsByClassName&&(document.getElementsByClassName=function(t,e){for(var n=(e||document).getElementsByTagName("*"),r=new Array,i=0;i<n.length;i++)for(var o=n[i],s=o.className.split(" "),l=0;l<s.length;l++)if(s[l]==t){r.push(o);break}return r})}();var I={open_tag:"<%",close_tag:"%>",template:"",data:{},methods:{}};t.prototype.isArr=function(t){return t instanceof Array},t.prototype.isObj=function(t){return t instanceof Object&&!(t instanceof Array)&&null!==t},t.prototype.isFn=function(t){return"function"==typeof t},t.prototype.isStr=function(t){return"string"==typeof t},t.prototype.isNum=function(t){return"number"==typeof t||!isNaN(t)},t.prototype.isEl=function(t){return!(!t||!t.nodeType)},t.prototype.on=function(){if(L)return"function"==typeof document.addEventListener?function(t,e,n){t.addEventListener(e,n,!1)}:function(t,e,n){t.attachEvent("on"+e,n)}}(),t.prototype.off=function(){if(L)return"function"==typeof document.removeEventListener?function(t,e,n){t.addEventListener(e,n,!1)}:function(t,e,n){t.detachEvent("on"+e,n)}}(),t.prototype.each=function(t,e){var n=0,r=t.length;if(this.isArr(t))for(;n<r;n++)e(t[n],n);else for(n in t)t.hasOwnProperty(n)&&e(t[n],n)},t.prototype.getEl=function(t){if(!t)return null;if(!this.isFn(document.querySelector))return document.getElementById(t);var e=document.querySelector(t),n=document.getElementById(t);return null!==e?e:n?n:null},t.prototype.getEls=function(t){if(!t)return null;if(!this.isFn(document.querySelectorAll))return document.getElementsByClassName(t);var e=document.querySelectorAll(t),n=document.getElementsByClassName(t);return e.length>0?e:n?n:[]},t.prototype.extend=function(t,e){return this.each(e,function(e,n){t[n]=e}),t},t.prototype.cb=function(t,e,n){n=n?n:[],this.isFn(t)?t.apply(e,n):null},t.prototype.run=function(t,e,n){this.cb(t,e,n)},t.prototype.unique=function(t){if(!this.isArr(t))return[];var e=[];return this.each(t,function(t,n){e.indexOf(t)===-1&&e.push(t)}),e},t.prototype.trimArr=function(t){var e=[];return this.each(t,function(t,n){""!==t&&e.push(t)}),e},t.prototype.copy=function(t){return this.isObj(t)||this.isArr(t)?JSON.parse(JSON.stringify(t)):null},t.prototype.ajax=function(t){var e=this,n=new XMLHttpRequest;t.type=t.type?t.type.toUpperCase():"GET",n.timeout=t.timeout&&t.async!==!1?t.timeout:0,"GET"===t.type?n.open(t.type,function(){return t.url.indexOf("?")?t.url+e.serialize(t.data):t.url+"?"+e.serialize(t.data)}(),t.async):"POST"===t.type&&n.open(t.type,t.url,t.async),n.setRequestHeader("Content-Type",t.contentType?t.contentType:"application/x-www-form-urlencoded; charset=UTF-8"),n.addEventListener("readystatechange",function(){try{var r=JSON.parse(n.responseText)}catch(i){var r=n.responseText}4==n.readyState&&(200==n.status?e.cb(t.success,e,[r]):n.status>=400&&e.cb(t.error,e,[r]))},!1),"GET"===t.type?n.send():"POST"===t.type&&n.send(this.serialize(t.data))},t.prototype.serialize=function(t){var e="";return this.isObj(t)&&this.isArr(t)?(this.each(t,function(t,n){e=e+n+"="+encodeURIComponent(t)+"&"}),e.substring(0,e.length-1)):""};var q=new t;return e.prototype.init=function(t){this.tmpl=t.tmpl,this.data=t.data,this.dom=new Function("data",this.tmpl.dom).apply(this.tmpl,[this.data]),this.fragment=this.setDom()},e.prototype.setDom=function(){return this.tmpl.create(this.dom)},e.prototype.appendTo=function(t,e){var n=this.tmpl.fn;return 1===t.nodeType?t.appendChild(this.fragment):n.getEl(t).appendChild(this.fragment),n.cb(e,this.tmpl),this.tmpl},e.prototype.insertBefore=function(t,e){var n=this.tmpl.fn;return n.getEl(t).insertBefore(this.fragment,e),n.cb(cb,this.tmpl),this.tmpl},n.install=function(t){t.install(this)},n.alias={},n.prototype.init=function(){var t=this;q.run(this.config.created,this),this.el=function(){return L?q.getEl(t.config.el):t.config.el}(),l.call(this,"methods"),l.call(this,"data"),o.call(this),this.el&&(this.template=function(){return L?(t.config.template=t.el.innerHTML,t.el.innerHTML):(t.config.template=t.el,t.el)}(),p.call(this),c.call(this)),s.call(this),q.run(this.config.mounted,this),q.run(this.config.events,this)},n.prototype.render=function(t){var n=this;return new e({tmpl:n,data:t})},n.prototype.update=function(){this.template=this.config.template,c.call(this)},n.prototype.on=function(t,e,n,r){if(4===arguments.length)return this.eventType.indexOf(n)==-1&&i.apply(this,[t,n,r]),this.events[n]||(this.events[n]={}),this.events[n][e]||(this.events[n][e]=[]),this.events[n][e].push(r),this;if(3===arguments.length){var o=this;return r=n,n=e,q.on(t,n,function(t){r.call(o,t)}),this}},n.prototype.off=function(t,e,n,r){if(4===arguments.length){var i=this.events[n][e].indexOf(r);i!=-1&&this.events[n][e].splice(i,1)}else 3===arguments.length&&q.off(t,n,r);return this},n.prototype.fn=q,n.prototype.bind=function(t,e){return r.apply(this,[t,e,"bind"]),this},n.prototype.unbind=function(t,e){return r.apply(this,[t,e,"unbind"]),this},n.prototype.replaceBind=function(t,e){return r.apply(this,[t,e,"replaceBind"]),this},n.prototype.addClass=function(t,e){return r.apply(this,[t,e,"addClass"]),this},n.prototype.removeClass=function(t,e){return r.apply(this,[t,e,"removeClass"]),this},n.prototype.replaceClass=function(t,e){return r.apply(this,[t,e,"replaceClass"]),this},n.prototype.hasClass=function(t,e){try{for(var n=t.className.split(" "),r=e.split(" "),i=0,o=0;o<r.length;o++)n.indexOf(r[o])!==-1&&++i;return i===r.length}catch(s){return!1}},n.prototype.attr=function(t,e){var n=this;if(q.isObj(e))return q.each(e,function(e,n){"boolean"==typeof e?(t[n]=e,t.setAttribute(n,e)):""===e?t.removeAttribute(n):t.setAttribute(n,e)}),this;if(e instanceof Array){var r=[];return q.each(e,function(e,i){r.push(n.attr(t,e))}),r}return/^bind-\S*/.test(e)?new Function("return "+t.getAttribute(e)+";").apply(this):t.getAttribute(e)},n.prototype.prop=function(t,e){return q.isObj(e)?(q.each(e,function(e,n){t[n]=e}),this):q.isStr(e)?/^bind-\S*/.test(e)?new Function("return "+t[e]+";").apply(this):t[e]:void 0},n.prototype.html=function(t,e){return void 0===e?t.innerHTML:(t.innerHTML=e,this)},n.prototype.val=function(t,e){return void 0===e?t.value:(t.value=e,this)},n.prototype.text=function(t,e){return void 0===e?t.textContent:(t.textContent=e,this)},n.prototype.parent=function(t,e){var n=t.parentNode;return n===document||null===n?null:e?this.hasClass(n,e)?n:this.parent(n,e):n},n.prototype.parents=function(t,e,n){var r=t.parentNode;return n=n?n:[],r===document||null===r?null:(this.hasClass(r,e)&&n.push(r),this.parents(r,e,n),n)},n.prototype.children=function(t){var e=[];return q.each(t.childNodes,function(t){1===t.nodeType&&e.push(t)}),e},n.prototype.childrens=function(t,e,n){var r=0;for(n=n?n:[];r<t.children.length;r++)this.hasClass(t.children[r],e)&&n.push(t.children[r]),this.childrens(t.children[r],e,n);return n},n.prototype.next=function(t){var e=t.nextSibling;return null===e?null:1!==e.nodeType?this.next(e):e},n.prototype.nextAll=function(t){return this.siblings(t,"nextAll")},n.prototype.prevAll=function(t){return this.siblings(t,"prevAll")},n.prototype.prev=function(t){var e=t.previousSibling;return null===e?null:1!==e.nodeType?this.prev(e):e},n.prototype.siblings=function(t,e){var n=this.parent(t);if(null===n)return null;var r=n.children,i=[],o=0;for("nextAll"===e&&(o=Array.prototype.indexOf.call(r,t));o<r.length;o++)if(r[o]!==t&&i.push(r[o]),"prevAll"===e&&r[o]===t)return i;return i},n.prototype.hide=function(t,e){var n=this.css(t,"opacity");return t.opacity=n?n:1,q.isNum(e)?this.animate(t,{opacity:0},e,function(){t.style.display="none"}):t.style.display="none",this},n.prototype.show=function(t,e){var n=t.opactiy?t.opactiy:100;return q.isNum(e)?(this.css(t,{opacity:0}),t.style.display="",this.animate(t,{opacity:n},e)):t.style.display="",this},n.prototype.toggle=function(t,e){var n=this;""===t.style.display?n.hide(t,e):n.show(t,e)},n.prototype.animate=function(t,e,n,r){var i=this;t&&(t.timer=setInterval(function(){var n=!0;q.each(e,function(r,o){var s=0,l=0;if("opacity"===o)l=100*Number(i.css(t,"opacity"));else if("scrollTop"===o){l=Math.ceil(document.documentElement.scrollTop||document.body.scrollTop);var a=Math.ceil(document.body.scrollHeight-window.innerHeight);r>a&&(r=a,e.scrollTop=a)}else l=parseInt(i.css(t,o));s=(r-l)/8,s=s>0?Math.ceil(s):Math.floor(s);var p={};"opacity"===o?(p.opacity=(l+s)/100,i.css(t,p)):"scrollTop"===o?i.setScrollTop(l+s):(p[o]=l+s+"px",i.css(t,p)),parseInt(r)!==l&&(n=!1)}),n&&(clearInterval(t.timer),q.cb(r,i))},n/60))},n.prototype.css=function(t,e){return q.isStr(e)?this.curCss(t,e):q.isObj(e)?(this.setStyle(t,e),this):void 0},n.prototype.camelCase=function(t,e){var n,r=/[A-Z]/g,i=/-[a-z]/g;return q.isStr(t)?(n=e?t.match(i):t.match(r),n=n?n:[],q.each(n,function(n,r){t=e?t.replace(n,n.replace(/-/g,"").toUpperCase()):t.replace(n,"-"+n.toLowerCase())}),t):t},n.prototype.curCss=function(t,e){if(window.getComputedStyle){var n=this.camelCase(e,!0);return window.getComputedStyle(t,null)[n]}if(document.documentElement.currentStyle){var n=this.camelCase(e,!1);return document.documentElement.currentStyle[n]}},n.prototype.setStyle=function(t,e){q.each(e,function(e,n){t.style[n]=e})},n.prototype.remove=function(t){try{t.remove()}catch(e){var n=this.parent(t);null!==n?n.removeChild(t):console.warn("element remove error!")}return this},n.prototype.create=function(t){var e=t;if(L){e=document.createDocumentFragment();var n=document.createElement("div");for(n.innerHTML=t;0!==n.childNodes.length;){var r=n.childNodes[0],i=r.innerHTML;if("SCRIPT"===r.tagName){var o=document.createElement("script");o.innerHTML=i,q.each(r.attributes,function(t){o.setAttribute(t.name,t.value)}),this.remove(r),r=o}e.appendChild(r)}}return e},n.prototype.append=function(t,e){return 1===t.nodeType?t.appendChild(e):q.getEl(t).appendChild(e),this},n.prototype.cb=function(t){return q.cb(t,this),this},n.prototype.preventDefault=function(t){var e=t||window.event;e.stopPropagation(),e.cancelBubble=!0},n.prototype.offset=function(t){var e=t.getBoundingClientRect(),n=document.documentElement,r=document.body,i=window,o=n.clientTop||r.clientTop||0,s=n.clientLeft||r.clientLeft||0,l=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft;return{top:e.top+l-o,left:e.left+a-s}},n.prototype.setScrollTop=function(t,e){document.body.scrollTop=t,document.documentElement.scrollTop=t},n.prototype.htmlEncode=function(t){return t.replace(/</g,"&lt;").replace(/>/g,"&gt;")},n.version="v1.0.3",n});