/**
*
*
* tmpl-router.js v1.0.0
* (c) 2016-2017 Blue
* https://github.com/azhanging/tmpl
* Released under the MIT License.
*
*
**/
!function(t,e){"function"==typeof _require?_require.defineId("tmpl-router",e):"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("tmpl-router",[],e):t?t.TmplRouter=e():{}}("undefined"!=typeof window?window:this,function(){function t(t){return window.hasTmplRouter?{}:void this.init(t)}function e(){var t=this;this.routerStatus=!0;var e=g.getEls(this.config.routerLink);g.each(e,function(e,r){g.on(e,"click",function(e){t.routerStatus||e.preventDefault()})})}function r(){v.on(document,this.config.routerAnchor,"click",function(t,e){var r=v.attr(e,"tmpl-anchor"),i=v.attr(e,"tmpl-anchor-top");i=g.isNum(i)?Number(i):0;var o=g.getEl(r);g.isEl(o)&&v.animate(document,{scrollTop:v.offset(o).top+i},1e3)})}function i(t,e){var r=this,o=e?e:"";g.each(t,function(t,e){g.isObj(t.modules)&&i.apply(r,[t.modules,o+e]),r.router[o+e]=t,delete t.modules})}function o(t,e,r){var i=this,o=null,n=this.getHash(e);i.getTmpl(n),w&&s.call(i,w),w=n,c.apply(i,[n,r]),g.each(t,function(t,e){var r=v.attr(t,"href"),c=i.getHash(r);i.search(r);c===n?(i.currentRouter=c,o=t,v.addClass(t,i.config.routerLinkActive),i.config.keepLive&&i.router[c].keepLive?u.call(this,i.router[c].scrollTop):u.call(this,0)):(i.router[c]&&s.call(i,c),v.removeClass(t,i.config.routerLinkActive)),o||(i.currentRouter=n)}),g.run(this.config.routerEntered,this,[e,r,o])}function n(){var t=this;this.config.keepLive&&g.on(window,"scroll",function(e){t.router[t.currentRouter]&&t.router[t.currentRouter].keepLive&&(t.router[t.currentRouter].scrollTop=document.body.scrollTop||document.documentElement.scrollTop)})}function u(t){if(!g.isNum(t))return 0;try{document.body.scrollTop=parseFloat(t)}catch(e){document.documentElement.scrollTop=parseFloat(t)}}function s(t){var e=this;g.each(e.router[t].view,function(r,i){e.router[t].temp.appendChild(r)}),this.router[t].view=[]}function c(t,e){var r=this;e.appendChild(this.router[t].temp),g.each(v.children(e),function(e,i){r.router[t].view.push(e)})}function a(t,e,r){var i=this.getHash(t),o=this.alias[i];return this.router[i]&&(g.run(this.config.routerEnter,this,[t,e,r]),void 0!==this.router[i].routerStatus&&(this.routerStatus=!0),g.run(this.config.routerEntered,this,[t,e,r])),this.alias[o]?a.apply(this,[o,e,r]):o}function h(t){g.each(t.childNodes,function(t,e){3===t.nodeType&&""===t.textContent.trim()&&v.remove(t)})}function l(t){var e=this;this.alias={},g.each(t,function(t,r){var i=t.alias;e.router[r].view=[],e.config.keepLive&&void 0===e.router[r].keepLive&&(e.router[r].keepLive=!0),e.router[r].temp=document.createDocumentFragment(),i&&(e.alias[i]=r)})}function p(){var t=this;window.hasTmplRouter||(g.on(window,"hashchange",function(e){window.location.hash;t.hashChange(),v.preventDefault(e)}),window.hasTmplRouter=!0)}function f(t){var e=this,r=this.config[t];g.isObj(r)&&g.each(r,function(t,r){e[r]=t})}var d={routerLink:"tmpl-router",routerLinkActive:"tmpl-router-active",routerView:"tmpl-router-view",routerAnchor:"tmpl-router-anchor",data:{},methods:{}},m=null,v=null,g=null,w=null;return t.install=function(e){return this.installed?t:(this.installed=!0,m=e,v=new m({}),void(g=v.fn))},window.Tmpl&&t.install(Tmpl),t.prototype.init=function(t){this.router={},this.config=g.extend(g.copy(d),t),i.call(this,this.config.router?this.config.router:{}),this.tmpl=v,f.call(this,"methods"),f.call(this,"data"),e.call(this),r.call(this),n.call(this),l.call(this,this.router),p.call(this),g.run(this.config.created,this),this.hashChange(),g.run(this.config.mounted,this)},t.prototype.set=function(t){var e=this;return g.isObj(t)&&g.each(t,function(t,r){e.router[r]=t}),l.call(this,t),this},t.prototype.hashChange=function(){var t=window.location.hash.replace("#",""),e=this.getHash(t),r=(this.search(t),g.getEls(this.config.routerLink)),i=g.getEl(this.config.routerView),n=!1;return""===e&&(e="/"),this.alias[e]&&(n=!0,e=a.apply(this,["/"===e?e:t,i,null])),0===r.length?this:this.alias[e]||this.router[e]?(g.run(this.config.routerEnter,this,[t,i]),void 0!==this.router[e].routerStatus&&(this.routerStatus=!0),void o.apply(this,[r,n?e:t,i])):void g.run(this.config.error,this)},t.prototype.go=function(t){g.isNum(t)&&history.go(t)},t.prototype.redirect=function(t){t=t.replace("#","");var e=location.href.split("#");"/"===t?location.href=e[0]:(e[1]=t,location.href=e.join("#"))},t.prototype.getTmpl=function(t){var e=this;if(!(!this.router[t]||this.router[t].temp.childNodes.length>0||this.router[t].view.length>0)){var r=this.router[t].tmplUrl,i=this.router[t].tmplId;if(r)v.fn.ajax({async:!1,url:r,success:function(r){e.router[t].temp.appendChild(v.create(r.tmpl)),h.call(this,e.router[t].temp),e.routerStatus=!1},error:function(t){e.routerStatus=!0}});else if(i){try{e.router[t].temp.appendChild(v.create(v.html(g.getEl(i))))}catch(o){e.router[t].temp.appendChild(v.create(""))}e.routerStatus=!0}}},t.prototype.query=function(t){if(!g.isStr(r))return{};var e={},r=t.split("&");return g.each(r,function(t,r){var i=t.split("=");if(1!==i.length){var o=i[0],n=i[1];e[o]=n}}),e},t.prototype.search=function(t,e){try{var r=v.attr(t,"href").split("?")}catch(i){var r=t.split("?")}return e?(g.isObj(e)&&(e=g.serialize(e)),r[1]=e,v.attr(t,{href:r.join("?")}),void 0):r[1]},t.prototype.getHash=function(t){var e="";return e=t.replace("#","").split("?"),e[0]},t.version="v1.0.1",t});