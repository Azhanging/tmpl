/*!
 * 
 * 			tmpl.js v1.0.4
 * 			(c) 2016-2017 Blue
 * 			Released under the MIT License.
 * 		
 */

(function(global, factory) {
	if(typeof _require === 'function') {
		_require.defineId('tmpl', factory);
	} else if(typeof exports === 'object' && typeof module === 'object') {
		module.exports = factory();
	} else if(typeof define === 'function' && define.amd) {
		define("tmpl", [], factory);
	} else {
		(global ? (global.Tmpl = factory()) : {});
	}
})(typeof window !== 'undefined' ? window : this, function() {

	var inBrowser = typeof window !== 'undefined';

	if(!inBrowser) var fs = require('fs');

	/*Array indexof方法*/
	//兼容性IE8
	(function() {
		//兼容IE8中 的indexOf
		if(!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(val) {
				for(var index = 0, len = this.length; index < len; index++) {
					if(this[index] === val) {
						return index;
					}
				}
				return -1;
			}
		}

		/*只在浏览器环境使用*/
		if(inBrowser && !document.getElementsByClassName) {
			document.getElementsByClassName = function(className, el) {
				var children = (el || document).getElementsByTagName('*');
				var elements = new Array();
				for(var i = 0; i < children.length; i++) {
					var child = children[i];
					var classNames = child.className.split(' ');
					for(var j = 0; j < classNames.length; j++) {
						if(classNames[j] == className) {
							elements.push(child);
							break;
						}
					}
				}
				return elements;
			};
		}
	})();

	/*配置信息*/
	var config = {
		open_tag: "<%", //OPEN_TAG
		close_tag: "%>", //CLOSE_TAG,
		template: "",
		data: {},
		methods: {}
	};

	function Fn() {}

	/*常用的方法*/
	Fn.prototype.isArr = function(array) {
		return array instanceof Array || !!(array && array.length);
	};

	Fn.prototype.isObj = function(obj) {
		return obj instanceof Object && !(obj instanceof Array) && obj !== null;
	};

	Fn.prototype.isFn = function(fn) {
		return typeof fn === 'function';
	};

	Fn.prototype.isStr = function(string) {
		return typeof string === 'string';
	};

	Fn.prototype.isNum = function(num) {
		return typeof num === 'number' || !isNaN(num);
	};

	Fn.prototype.isEl = function(el) {
		return !!(el && el.nodeType);
	};

	//设置事件
	Fn.prototype.on = (function() {
		if(!inBrowser) return;
		if(typeof document.addEventListener === 'function') {
			return function(el, type, cb) {
				el.addEventListener(type, cb, false);
			}
		} else {
			return function(el, type, cb) {
				el.attachEvent('on' + type, cb);
			};
		}
	})();
	//移除事件
	Fn.prototype.off = (function() {
		if(!inBrowser) return;
		if(typeof document.removeEventListener === 'function') {
			return function(el, type, cb) {
				el.addEventListener(type, cb, false);
			}
		} else {
			return function(el, type, cb) {
				el.detachEvent('on' + type, cb);
			};
		}
	})();

	//遍历
	Fn.prototype.each = function(obj, cb) {
		var i = 0,
			len = obj.length;
		if(this.isArr(obj)) {
			for(; i < len; i++) {
				cb(obj[i], i);
			}
		} else {
			for(i in obj) {
				if(obj.hasOwnProperty(i)) cb(obj[i], i);
			}
		}
	};
	//获取节点
	Fn.prototype.getEl = function(exp) {
		if(!exp) return null;
		if(!this.isFn(document.querySelector))
			return document.getElementById(exp);
		var getEl = document.querySelector(exp);
		var el = document.getElementById(exp);
		return getEl !== null ? getEl : (el ? el : null);
	};
	//获取多个节点
	Fn.prototype.getEls = function(exp) {
		if(!exp) return null;
		if(!this.isFn(document.querySelectorAll))
			return document.getElementsByClassName(exp);
		var getEls = document.querySelectorAll(exp);
		var el = document.getElementsByClassName(exp);
		return getEls.length > 0 ? getEls : (el ? el : []);
	};
	//合并
	Fn.prototype.extend = function(obj, options) {
		this.each(options, function(option, key) {
			obj[key] = option;
		});
		return obj;
	};
	//回调
	Fn.prototype.cb = function(cb, context, args) {
		args = args ? args : [];
		this.isFn(cb) ? (cb.apply(context, args)) : null;
	};
	//执行函数
	Fn.prototype.run = function(cb, context, args) {
		this.cb(cb, context, args);
	};

	/*去重*/
	Fn.prototype.unique = function(arr) {
		if(!this.isArr(arr)) return [];
		var newArray = [];
		this.each(arr, function(item, index) {
			if(newArray.indexOf(item) === -1) {
				newArray.push(item);
			}
		});
		return newArray;
	};

	/*清空数组中空的值*/
	Fn.prototype.trimArr = function(arr) { //trimArr
		var newArr = [];
		this.each(arr, function(item, index) {
			if(item !== '') {
				newArr.push(item);
			}
		});
		return newArr;
	};

	/*深拷贝*/
	Fn.prototype.copy = function(obj) {
		if(this.isObj(obj) || this.isArr(obj))
			return JSON.parse(JSON.stringify(obj));
		return null;
	};

	Fn.prototype.ajax = function(options) {
		var _this = this;
		//创建xhr
		var xhr = new XMLHttpRequest();
		//连接类型
		options.type = (options.type ? options.type.toUpperCase() : 'GET');
		//超时
		xhr.timeout = options.timeout && options.async !== false ? options.timeout : 0;

		if(options.type === "GET") {
			xhr.open(options.type, (function() {
				return options.url.indexOf('?') ?
					options.url + _this.serialize(options.data) :
					options.url + '?' + _this.serialize(options.data);
			})(), options.async);
		} else if(options.type === "POST") {
			xhr.open(options.type, options.url, options.async);
		}
		xhr.setRequestHeader('Content-Type', options.contentType ?
			options.contentType :
			'application/x-www-form-urlencoded; charset=UTF-8');
		//响应事件
		xhr.addEventListener('readystatechange', function() {
			try {
				var data = JSON.parse(xhr.responseText);
			} catch(e) {
				var data = xhr.responseText;
			}
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					_this.cb(options.success, _this, [data]);
				} else if(xhr.status >= 400) {
					_this.cb(options.error, _this, [data]);
				}
			}
		}, false);

		//send指令
		if(options.type === "GET") {
			xhr.send();
		} else if(options.type === "POST") {
			xhr.send(this.serialize(options.data));
		}
	};
	//初始化数据
	Fn.prototype.serialize = function(data) {
		var result = '';
		if(!this.isObj(data) || !this.isArr(data)) return '';
		this.each(data, function(val, key) {
			result = result + key + '=' + encodeURIComponent(val) + '&';
		});
		return result.substring(0, result.length - 1);
	};

	/*整个Tmpl实例的fn方法*/
	var fn = new Fn();

	/*
	 *	Render代理实例
	 * */
	/*针对tmpl中的数据流*/
	function Render(options) {
		this.init(options);
	}

	//初始化
	Render.prototype.init = function(options) {
		this.tmpl = options.tmpl;
		this.data = options.data;
		this.dom = new Function('data', this.tmpl.dom).apply(this.tmpl, [this.data]);
		this.fragment = this.tmpl.create(this.dom);
	};

	//在父节点中插入解析后的模板
	Render.prototype.appendTo = function(el, cb) {
		var fn = this.tmpl.fn;

		if(el.nodeType === 1) el.appendChild(this.fragment);
		else fn.getEl(el).appendChild(this.fragment);

		fn.cb(cb, this.tmpl);
		return this.tmpl;
	};

	//在el子节点ex中插入解析后的模板
	Render.prototype.insertBefore = function(el, ex) {
		var fn = this.tmpl.fn;
		fn.getEl(el).insertBefore(this.fragment, ex);
		fn.cb(cb, this.tmpl);
		return this.tmpl;
	};

	/*
	 *	Tmpl构造
	 * */
	function Tmpl(opts) {
		this.config = fn.extend(fn.copy(config), opts);
		this.init();
	}

	//安装插件
	Tmpl.install = function(constructor) {
		constructor.install(this);
	}

	//设置路径别名常量
	Tmpl.alias = {};

	//初始化构造
	Tmpl.prototype.init = function() {
		var _this = this;
		//构建开始的钩子
		fn.run(this.config.created, this);
		//初始配置信息
		this.el = (function() {
			if(inBrowser) {
				return fn.getEl(_this.config.el)
			} else {
				return _this.config.el;
			}
		})();

		//初始化方法
		setInstance.call(this, 'methods');
		//初始化数据
		setInstance.call(this, 'data');
		//初始化路由
		setRouter.call(this);
		//查找模板
		if(this.el) {
			this.template = (function() {
				if(inBrowser) {
					_this.config.template = _this.el.innerHTML;
					return _this.el.innerHTML;
				} else {
					_this.config.template = _this.el;
					return _this.el;
				}
			})();
			setRegExp.call(this);
			//转化为js执行
			setDom.call(this);
		}
		//初始化事件
		setEvent.call(this);
		//所有完毕后的钩子
		fn.run(this.config.mounted, this);
		//设置事件
		fn.run(this.config.events, this);
	};

	//解析模板
	Tmpl.prototype.render = function(data) {
		var _this = this;
		return new Render({
			tmpl: _this,
			data: data
		});
	};

	//添加数据更新模板
	Tmpl.prototype.update = function() {
		this.template = this.config.template;
		setDom.call(this);
	};

	//绑定事件
	Tmpl.prototype.on = function(elContext, exp, type, cb) {
		if(arguments.length === 4) {
			if(this.eventType.indexOf(type) == -1) setEntrust.apply(this, [elContext, type, cb]);
			//查找现在的节点是否存在事件
			if(!this.events[type]) this.events[type] = {};
			//当前的事件是否有设置
			if(!this.events[type][exp]) this.events[type][exp] = [];
			this.events[type][exp].push(cb);
			return this;
		} else if(arguments.length === 3) {
			var _this = this;
			cb = type;
			type = exp;
			fn.on(elContext, type, function(event) {
				cb.call(_this, event);
			});
			return this;
		}
	};

	//取消绑定事件
	Tmpl.prototype.off = function(elContext, exp, type, cb) {
		if(arguments.length === 4) {
			var eventIndex = this.events[type][exp].indexOf(cb);
			if(eventIndex != -1) this.events[type][exp].splice(eventIndex, 1);
		} else if(arguments.length === 3) {
			/*删除事件*/
			fn.off(elContext, type, cb);
		}
		return this;
	};

	Tmpl.prototype.fn = fn;

	//设置事件委托的class
	Tmpl.prototype.bind = function(el, bind) {
		bindFn.apply(this, [el, bind, 'bind']);
		return this;
	};

	//取消方法绑定
	Tmpl.prototype.unbind = function(el, bind) {
		bindFn.apply(this, [el, bind, 'unbind']);
		return this;
	};

	//替换绑定
	Tmpl.prototype.replaceBind = function(el, bind) {
		bindFn.apply(this, [el, bind, 'replaceBind']);
		return this;
	}

	Tmpl.prototype.addClass = function(el, className) {
		bindFn.apply(this, [el, className, 'addClass']);
		return this;
	};

	//删除class
	Tmpl.prototype.removeClass = function(el, className) {
		bindFn.apply(this, [el, className, 'removeClass']);
		return this;
	};

	//替换className
	Tmpl.prototype.replaceClass = function(el, className) {
		bindFn.apply(this, [el, className, 'replaceClass']);
		return this;
	};

	//是否存在class
	Tmpl.prototype.hasClass = function(el, className) {
		try {
			//节点中存在的className
			var _className = el.className.split(' ');
			//是否存在的className
			var hasClassName = className.split(' ');
			var hasLen = 0;

			for(var index = 0; index < hasClassName.length; index++) {
				if(_className.indexOf(hasClassName[index]) !== -1) ++hasLen;
			}
			if(hasLen === hasClassName.length) return true;
			return false;
		} catch(e) {
			return false;
		}
	};

	//获取属性
	Tmpl.prototype.attr = function(el, attr) {
		var _this = this;
		if(fn.isObj(attr)) {
			fn.each(attr, function(_attr, key) {
				if(typeof _attr === 'boolean') {
					el[key] = _attr;
					el.setAttribute(key, _attr);
				} else if(_attr === '') {
					el.removeAttribute(key);
				} else {
					el.setAttribute(key, _attr);
				}
			});
			return this;
		} else {
			if(attr instanceof Array) {
				var attrs = [];
				fn.each(attr, function(_attr, index) {
					attrs.push(_this.attr(el, _attr));
				});
				return attrs;
			} else if(/^bind-\S*/.test(attr)) {
				return new Function('return ' + el.getAttribute(attr) + ';')
					.apply(this);
			} else {
				return el.getAttribute(attr);
			}
		}
	};

	//获取、设置prop属性
	Tmpl.prototype.prop = function(el, prop) {
		//设置节点属性
		if(fn.isObj(prop)) {
			fn.each(prop, function(_prop, key) {
				el[key] = _prop;
			});
			return this;
		} else if(fn.isStr(prop)) { //获得节点属性
			if(/^bind-\S*/.test(prop)) return new Function('return ' + el[prop] + ';')
				.apply(this);
			return el[prop];
		}
	};

	//获取、设置html
	Tmpl.prototype.html = function(el, html) {
		if(html === undefined) return el.innerHTML;
		el.innerHTML = html;
		return this;
	};

	//获取、设置value
	Tmpl.prototype.val = function(el, val) {
		if(val === undefined) return el.value;
		el.value = val;
		return this;
	};

	//获取、设置textContent
	Tmpl.prototype.text = function(el, text) {
		if(text === undefined) return el.textContent;
		el.textContent = text;
		return this;
	};

	//查找符合的一个父级节点
	Tmpl.prototype.parent = function(el, hasClassName) {

		var parent = el.parentNode;

		if(parent === document || parent === null) return null;

		if(!hasClassName) return parent;

		if(this.hasClass(parent, hasClassName)) return parent;

		return this.parent(parent, hasClassName);

	};

	//超找所有符合的父元素
	Tmpl.prototype.parents = function(el, hasClassName, hasClassParent) {

		var parent = el.parentNode;

		hasClassParent = (hasClassParent ? hasClassParent : []);

		if(parent === document || parent === null) return null;

		if(this.hasClass(parent, hasClassName)) hasClassParent.push(parent);

		this.parents(parent, hasClassName, hasClassParent);

		return hasClassParent;
	};

	//获取直接的当个子节点
	Tmpl.prototype.children = function(el) {
		var els = [];
		fn.each(el.childNodes, function(child) {
			if(child.nodeType === 1) {
				els.push(child);
			}
		});
		return els;
	};

	//查找对应的class存在的节点
	Tmpl.prototype.childrens = function(el, className, hasClassChild) {
		var i = 0;
		hasClassChild = (hasClassChild ? hasClassChild : []);
		for(; i < el.children.length; i++) {
			if(this.hasClass(el.children[i], className)) hasClassChild.push(el.children[i]);
			this.childrens(el.children[i], className, hasClassChild);
		}
		return hasClassChild;
	};

	//下一个节点
	Tmpl.prototype.next = function(el) {
		var nextEl = el.nextSibling;
		if(nextEl === null) return null;
		if(nextEl.nodeType !== 1) return this.next(nextEl);
		return nextEl;
	};

	//获取当前元素同级前的节点
	Tmpl.prototype.nextAll = function(el) {
		return this.siblings(el, 'nextAll');
	};

	//获取当前元素同级后的节点
	Tmpl.prototype.prevAll = function(el) {
		return this.siblings(el, 'prevAll');
	};

	//上一个节点
	Tmpl.prototype.prev = function(el) {
		var prevEl = el.previousSibling;
		if(prevEl === null) return null;
		if(prevEl.nodeType !== 1) return this.prev(prevEl);
		return prevEl;
	};

	//获取同级的兄弟节点
	Tmpl.prototype.siblings = function(el, type) {
		var parent = this.parent(el);
		if(parent === null) return null;
		var child = parent.children;
		var siblings = [];
		var i = 0;
		if(type === 'nextAll') i = Array.prototype.indexOf.call(child, el);
		for(; i < child.length; i++) {
			if(child[i] !== el) siblings.push(child[i]);
			if(type === 'prevAll' && child[i] === el) return siblings;
		}
		return siblings;
	};

	//显示
	Tmpl.prototype.hide = function(el, time) {

		var opacity = this.css(el, 'opacity');

		el.opacity = opacity ? opacity : 1;

		fn.isNum(time) ? (this.animate(el, {
			opacity: 0
		}, time, function() {
			el.style.display = 'none';
		})) : el.style.display = 'none';

		return this;
	};

	//隐藏
	Tmpl.prototype.show = function(el, time) {

		var opactiy = el.opactiy ? el.opactiy : 100;

		if(fn.isNum(time)) {

			this.css(el, {
				opacity: 0
			});

			el.style.display = '';

			this.animate(el, {
				opacity: opactiy
			}, time);

		} else {
			el.style.display = '';
		}
		return this;
	};

	/*切换显示状态*/
	Tmpl.prototype.toggle = function(el, time) {
		var _this = this;
		if(el.style.display === '') _this.hide(el, time);
		else _this.show(el, time);
	};

	/*动画*/
	Tmpl.prototype.animate = function(el, animate, time, cb) {

		var _this = this;

		if(!el) return;

		el.timer = setInterval(function() {

			var animateStatus = true;

			fn.each(animate, function(val, type) {

				var speed = 0;

				var cssVal = 0;

				if(type === 'opacity') {

					cssVal = Number(_this.css(el, 'opacity')) * 100;

				} else if(type === 'scrollTop') {

					cssVal = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop);

					var maxScrollTop = Math.ceil(document.body.scrollHeight - window.innerHeight);

					if(val > maxScrollTop) {
						val = maxScrollTop;
						animate['scrollTop'] = maxScrollTop;
					}

				} else {
					cssVal = parseInt(_this.css(el, type));
				}

				speed = (val - cssVal) / 8;

				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

				var setVal = {};

				if(type === 'opacity') {
					setVal['opacity'] = (cssVal + speed) / 100;
					_this.css(el, setVal);
				} else if(type === 'scrollTop') {
					_this.setScrollTop(cssVal + speed);
				} else {
					setVal[type] = cssVal + speed + 'px';
					_this.css(el, setVal);
				}

				if(parseInt(val) !== cssVal) {
					animateStatus = false;
				}
			});

			if(animateStatus) {
				clearInterval(el.timer);
				fn.cb(cb, _this);
			}

		}, time / 60);
	};

	/*操作css*/
	Tmpl.prototype.css = function(el, css) {
		//获取css
		if(fn.isStr(css)) {
			return this.curCss(el, css);
		} else if(fn.isObj(css)) {
			//设置style
			this.setStyle(el, css);
			return this;
		}
	};

	/*处理驼峰和非驼峰*/
	Tmpl.prototype.camelCase = function(text, isCameCase) {
		var camelCases;
		var AZ = /[A-Z]/g;
		var _AZ = /-[a-z]/g;
		if(!fn.isStr(text)) return text;
		camelCases = isCameCase ? text.match(_AZ) : text.match(AZ);
		camelCases = camelCases ? camelCases : [];
		fn.each(camelCases, function(str, index) {
			if(isCameCase) text = text.replace(str, str.replace(/-/g, '').toUpperCase());
			else text = text.replace(str, '-' + str.toLowerCase());
		});
		return text;
	};

	/*获取计算好的值*/
	Tmpl.prototype.curCss = function(el, css) {
		if(window.getComputedStyle) {
			var _css = this.camelCase(css, true);
			return window.getComputedStyle(el, null)[_css];
		} else if(document.documentElement.currentStyle) {
			var _css = this.camelCase(css, false);
			return document.documentElement.currentStyle[_css];
		}
	};

	/*设置css*/
	Tmpl.prototype.setStyle = function(el, css) {
		fn.each(css, function(style, cssName) {
			el.style[cssName] = style;
		});
	};

	/*删除节点*/
	Tmpl.prototype.remove = function(el) {
		try {
			el.remove();
		} catch(e) {
			var parent = this.parent(el);
			parent !== null ? parent.removeChild(el) : (console.warn('element remove error!'));
		}
		return this;
	};

	/*创建元素*/
	Tmpl.prototype.create = function(dom) {
		var fragment = dom;
		if(inBrowser) {
			fragment = document.createDocumentFragment();
			var tempEl = document.createElement('div');
			tempEl.innerHTML = dom;
			while(tempEl.childNodes.length !== 0) {
				var child = tempEl.childNodes[0];
				var childHtml = child.innerHTML;
				if(child.tagName === 'SCRIPT') {
					var newScript = document.createElement('script');
					newScript.innerHTML = childHtml;
					fn.each(child.attributes, function(attr) {
						if(!attr) true;
						newScript.setAttribute(attr.name, attr.value);
					});
					this.remove(child);
					child = newScript;
				}
				fragment.appendChild(child);
			}
		}
		return fragment;
	};

	/*插入节点*/
	Tmpl.prototype.append = function(el, child) {
		if(el.nodeType === 1) el.appendChild(child);
		else fn.getEl(el)
			.appendChild(child);
		return this;
	};

	/*回调*/
	Tmpl.prototype.cb = function(cb) {
		fn.cb(cb, this);
		return this;
	};

	//取消冒泡
	Tmpl.prototype.preventDefault = function(event) {
		var ev = event || window.event;
		ev.stopPropagation();
		ev.cancelBubble = true;
	};

	//offset
	Tmpl.prototype.offset = function(el) {
		var box = el.getBoundingClientRect();
		var docElem = document.documentElement,
			body = document.body,
			win = window;

		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		var scrollTop = win.pageYOffset || docElem.scrollTop;
		var scrollLeft = win.pageXOffset || docElem.scrollLeft;
		return {
			top: box.top + scrollTop - clientTop,
			left: box.left + scrollLeft - clientLeft
		};
	};

	/*设置滚动条高度*/
	Tmpl.prototype.setScrollTop = function(top, animate) {
		document.body.scrollTop = top;
		document.documentElement.scrollTop = top;
	}

	/*转义*/
	Tmpl.prototype.escape = function(escapeVal) {
		fn.each(escapeCode, function(item, key) {
			escapeVal = escapeVal.replace(new RegExp(key, 'g'), item);
		});
		return escapeVal;
	}

	//绑定相关函数
	function bindFn(el, className, type) {
		var _className = el.className.split(' ');
		//替换
		if(fn.isObj(className) && (type == 'replaceBind' || type == 'replaceClass')) {
			fn.each(className, function(__className, key) {
				var findIndex = _className.indexOf(key);
				if(findIndex != -1) _className[findIndex] = __className;
			});
		} else {
			//获得el中的className{type:string}
			var className = className.split(' ');
			for(var index = 0; index < className.length; index++) {
				var findIndex = _className.indexOf(className[index]);
				if(type == 'bind' || type == 'addClass') {
					if(findIndex == -1) _className.push(className[index]);
				} else if(type == 'unbind' || type == 'removeClass') {
					if(findIndex != -1) _className.splice(findIndex, 1);
				}
			}
		}

		el.className = _className.join(' ');

		return this;
	}

	//设置主的委托事件
	function setEntrust(elContext, type, cb) {
		var _this = this;
		fn.on(elContext, type, function(event) {
			var ev = event || window.event;
			var el = ev.target || ev.srcElement;
			var eventType = _this.events[type];
			fn.each(eventType, function(_eventType, bind) {
				if(!_this.hasClass(el, bind)) return;
				fn.each(_eventType, function(cb, index) {
					cb.apply(_this, [ev, el]);
				});
			});
		});

		//添加委托事件
		this.eventType.push(type);
	}

	//把路由实例挂靠到模板中
	function setRouter() {
		if(fn.isObj(this.config.router))
			this.constructor.router = this.config.router;
	}

	//初始化时间中的参数
	function setEvent() {
		//初始化事件
		this.events = {};
		//设置事件类型
		this.eventType = [];
	}

	//设置实例
	function setInstance(type) {
		var _this = this;
		var get = this.config[type];

		if(!fn.isObj(get)) {
			return;
		}

		fn.each(get, function(_get, key) {
			_this[key] = _get;
		});
	}

	//处理正则数据
	function initRegExp(expr) {
		var tm = '\\/*.?+$^[](){}|\'\"';
		fn.each(tm, function(tmItem, index) {
			expr = expr.replace(new RegExp('\\' + tmItem, 'g'), '\\' + tmItem);
		});
		return expr;
	}

	var SCRIPT_REGEXP,
		/*原生script*/
		NATIVE_SCRIPT,
		/*输出script*/
		ECHO_SCRIPT_REGEXP,
		//转义输出
		ECHO_ESCAPE_REGEXP,
		/*替换输出script*/
		REPLACE_ECHO_SCRIPT_OPEN_TAG,
		/*起始*/
		OPEN_TAG_REGEXP,
		/*闭合*/
		CLOSE_TAG_REGEXP,
		//过滤转义字符
		FILTER_TRANFORM = /[\b\t\r\f\n]/g,
		//转义双引号
		QUEST = /"/g,
		//引入模板
		INCLUDE_ID = /<tmpl-include .*?name=(\'|\")(\S*?)\1.*?\/>/g,
		//引入模板
		INCLUDE_FILE = /<tmpl-include .*?file=(\'|\")(\S*?)\1.*?\/>/g,
		//空模板
		INCLUDE_NULL = /<tmpl-include\s*?\/>/g,
		//嵌入block块
		BLOCK = /<tmpl-block .*?name=(\'|\")(\S*?)\1.*?>([\s\S]*?)<\/tmpl-block>/g,
		//append_block
		BLOCK_APPEND = /^append:/,
		//inser_block
		BLOCK_INSETR = /^insert:/,
		//base路径解析
		EXTENDS = /<tmpl-extend .*?file=(\'|\")(\S*?)\1.*?\/>/g;

	// html转义
	var escapeCode = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#x27;",
		"`": "&#x60;"
	}

	//设置正则
	function setRegExp() {
		var open_tag = initRegExp.call(this, this.config.open_tag);
		var close_tag = initRegExp.call(this, this.config.close_tag);
		//解析所有的表达式
		SCRIPT_REGEXP = new RegExp(open_tag + '[^=-][\\\s\\\S]*?' + close_tag + '|' + open_tag + '=[\\\s\\\S]*?' + close_tag + '|' + open_tag + '-[\\\s\\\S]*?' + close_tag, 'g');
		//原生的script
		NATIVE_SCRIPT = new RegExp(open_tag + '[^=-][\\\s\\\S]*?' + close_tag, 'g');
		//解析输出的表达式
		ECHO_SCRIPT_REGEXP = new RegExp(open_tag + '=[\\\s\\\S]*?' + close_tag, 'g');
		//转义输出
		ECHO_ESCAPE_REGEXP = new RegExp(open_tag + '-([\\\s\\\S]*?)' + close_tag, 'g');
		//替换输出的开头表达式
		REPLACE_ECHO_SCRIPT_OPEN_TAG = new RegExp(open_tag + '=', 'g');
		//转义的开头表达式
		ECHO_ESCAPE_REGEXP_OPEN_TAG = new RegExp(open_tag + '-', 'g');
		//替换输出的开始表达式
		OPEN_TAG_REGEXP = new RegExp(open_tag, 'g');
		//替换输出的结束表达式
		CLOSE_TAG_REGEXP = new RegExp(close_tag, 'g');
	}

	//初始化dom生成
	function setDom() {
        var _this = this;
		//node中使用block
		if(!inBrowser) {
			replaceBlock.call(this);
		}
		/*重新检查依赖里面有没有引入的数据*/
		replaceAlias.call(this);
		/*清除遗留的block块*/
		clearBlock.call(this);
		/*替换include中的内容*/
		replaceInclude.call(this);
		/*解析script*/
		var script = this.template.match(SCRIPT_REGEXP);
		var replaceScript = setSeize.call(this);
		var echoString = replaceScript
			.split(/___SCRIPT___|___ECHO_SCRIPT___/);
		var domString = [];

		if(!script) script = [];

		var longString = echoString.length > script.length ? echoString : script;

		fn.each(echoString, function(_echoString, index) {
			echoString[index] = "___.push(\"" + filterTransferredMeaning(_echoString) + "\");";
		});

		fn.each(script, function(_string, index) {
			/*恢复正则的索引位置*/
			ECHO_SCRIPT_REGEXP.lastIndex = 0;
			NATIVE_SCRIPT.lastIndex = 0;
			ECHO_ESCAPE_REGEXP.lastIndex = 0;
            
            /*处理对应表达式*/
			if(ECHO_SCRIPT_REGEXP.test(_string)) {
				script[index] = _string.replace(REPLACE_ECHO_SCRIPT_OPEN_TAG, "___.push(").replace(CLOSE_TAG_REGEXP, ");");
			} else if(NATIVE_SCRIPT.test(_string)) {
				script[index] = _string.replace(OPEN_TAG_REGEXP, '').replace(CLOSE_TAG_REGEXP, '');
			} else if(ECHO_ESCAPE_REGEXP.test(_string)) {
			    script[index] = _string.replace(ECHO_ESCAPE_REGEXP_OPEN_TAG, "___.push(_this_.escape(").replace(CLOSE_TAG_REGEXP, "));");
				
			}
		});

		fn.each(longString, function(_longString, index) {
			if(typeof echoString[index] === 'string') domString.push(echoString[index]);
			if(typeof script[index] === 'string') domString.push(script[index].replace(FILTER_TRANFORM, "")); 
		});

		this.dom = 'var _this_ = this,___ = [];' + domString.join('') + 'return ___.join("");';

	};

	/*替换include引入的模板*/
	function replaceInclude() {
		var include = (function(_this) {
			if(inBrowser) {
				//在浏览器环境清空include[file]
				_this.template = _this.template.replace(INCLUDE_FILE, '');
				return INCLUDE_ID;
			} else {
				//在node环境清空include[name]
				_this.template = _this.template.replace(INCLUDE_ID, '');
				return INCLUDE_FILE;
			}
		})(this);

		var _this = this;

		var includeTmpl, includeId;

		//清空空的引入模块
		this.template = this.template.replace(INCLUDE_NULL, '');

		//去重
		includeTmpl = fn.unique(this.template.match(include));
		includeId = includeTmpl.toString()
			.replace(include, "$2")
			.split(',');

		//找不到include//查找的id和include匹配的数量必须相同
		if(includeTmpl.length === 0 || fn.trimArr(includeId)
			.length === 0 ||
			!(includeTmpl.length > 0 &&
				includeId.length > 0 &&
				includeId.length === includeTmpl.length
			)) return;

		fn.each(includeId, function(id, index) {
			var replaceInclude = new RegExp(initRegExp.call(_this, includeTmpl[index]), 'g');
			/*浏览器环境下执行*/
			if(inBrowser) {
				var el = fn.getEl(id);
				if(el) _this.template = _this.template.replace(replaceInclude, _this.html(el));
				//找不到就清空原来的内容
				else _this.template = _this.template.replace(replaceInclude, '');
			} else {
				/*node环境下执行*/
				try {
					var tmpl = fs.readFileSync(id, {
						encoding: 'UTF8'
					});
					_this.template = _this.template.replace(replaceInclude, tmpl);
				} catch(e) {
					//找不到就清空原来的内容
					_this.template = _this.template.replace(replaceInclude, '');
				}
			}
		});

		includeTmpl = fn.unique(this.template.match(include));

		if(includeTmpl.length > 0) replaceInclude.call(this);
	}

	/*替换Block块内容*/
	function replaceBlock() {

		var _this = this;

		//先设置获取include的引入模板
		replaceAlias.call(this);

		var baseFile = fn.unique(this.template.match(EXTENDS));
		/*只获取第一个base的名字*/
		var baseFileName = baseFile.toString()
			.replace(EXTENDS, "$2")
			.split(',')[0];

		/*如果不存在block的内容，直接跳出*/
		if(baseFileName === '') return;

		var blockTmpl = fn.unique(this.template.match(BLOCK));

		var tmpl = fs.readFileSync(baseFileName, {
			encoding: 'UTF8'
		});

		var baseTmpl = tmpl.match(BLOCK);

		var baseBlockName = baseTmpl.toString()
			.replace(BLOCK, "$2")
			.split(',');

		fn.each(baseBlockName, function(name, index) {
			var replaceBlock = new RegExp(initRegExp.call(_this, baseTmpl[index]), 'g');
			var hasBlock = false;

			fn.each(blockTmpl, function(blocktmpl, _index) {
				BLOCK.test(blocktmpl);
				var _name = RegExp.$2;
				var blockContent = RegExp.$3;
				//匹配到name的
				if(name === _name) {
					tmpl = tmpl.replace(replaceBlock, blockContent);
					hasBlock = true;
				} else if(BLOCK_APPEND.test(_name) && name === _name.replace(BLOCK_APPEND, '')) {
					tmpl = tmpl.replace(replaceBlock, baseTmpl[index].replace(BLOCK, "$3") + blockContent);
					hasBlock = true;
				} else if(BLOCK_INSETR.test(_name) && name === _name.replace(BLOCK_INSETR, '')) {
					tmpl = tmpl.replace(replaceBlock, blockContent + baseTmpl[index].replace(BLOCK, "$3"));
					hasBlock = true;
				}
				BLOCK.lastIndex = 0;
			});

			/*如果当前的block是在extends的模板中不存在，则显示默认里面的*/
			if(!hasBlock) {
				tmpl = tmpl.replace(replaceBlock, baseTmpl[index].replace(BLOCK, '$3'));
			}
		});

		_this.template = tmpl;
	}

	/*替换别名的常量*/
	function replaceAlias() {
		var _this = this;
		var constructor = this.constructor;
		fn.each(constructor.alias, function(replaceAlias, alias) {
			_this.template = _this.template
				.replace(new RegExp(initRegExp.call(_this, alias), 'g'), replaceAlias);
		});
	}

	/*清除多余的block块*/
	function clearBlock() {
		this.template = this.template.replace(EXTENDS, '').replace(BLOCK, '');
	}

	//设置占位
	function setSeize() {
		var replaceScript = this.template
			.replace(ECHO_SCRIPT_REGEXP, '___ECHO_SCRIPT___')
			.replace(SCRIPT_REGEXP, '___SCRIPT___');
		return replaceScript;
	}

	//过滤string中的引号
	function filterTransferredMeaning(string) {
		return string.replace(FILTER_TRANFORM, "")
			.replace(QUEST, '\\\"');
	}

	Tmpl.version = "v1.0.4";

	return Tmpl;
});