/*
 * 一堆解析模板的方法,tmpl的核心算法
 * */

//运行环境是否在浏览器
import inBrowser from '../in_browser';
//常用的方法
import utils from '../../utils';
//include
import replaceInclude from './include';
//extend
import replaceBlock from './block';

//模板正则配置
import {
  FILTER_TRANFORM,
  QUEST,
  BLOCK,
  EXTEND
} from './compile-regexp';

//由于模块接口中都是只读的，不能放在配置中；
let SCRIPT_REGEXP,
  /*原生script*/
  NATIVE_SCRIPT,
  /*输出script*/
  ECHO_SCRIPT_REGEXP,
  //转义输出
  ECHO_ESCAPE_REGEXP,
  /*替换输出script*/
  REPLACE_ECHO_SCRIPT_OPEN_TAG,
  //转义的开头表达式
  ECHO_ESCAPE_REGEXP_OPEN_TAG,
  /*起始*/
  OPEN_TAG_REGEXP,
  /*闭合*/
  CLOSE_TAG_REGEXP;

//设置正则
export function setRegExp() {

  const open_tag = utils.initRegExp(this.$opts.config.open_tag),
    close_tag = utils.initRegExp(this.$opts.config.close_tag);
  //解析所有的表达式
  SCRIPT_REGEXP = new RegExp(open_tag + '[^=-][\\\s\\\S]*?' + close_tag + '|' + open_tag + '=[\\\s\\\S]*?' + close_tag + '|' + open_tag + '-[\\\s\\\S]*?' + close_tag, 'g');
  //原生的script
  NATIVE_SCRIPT = new RegExp(open_tag + '[^=-][\\\s\\\S]*?' + close_tag, 'g');
  //解析输出的表达式
  ECHO_SCRIPT_REGEXP = new RegExp(open_tag + '=([\\\s\\\S]*?)' + close_tag, 'g');
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
export function compile() {
  //node中使用block
  if (!inBrowser) {
    replaceBlock.call(this);
    /*清除遗留的block块*/
    clearBlock.call(this);
  }
  /*重新检查依赖里面有没有引入的数据*/
  replaceAlias.call(this);
  /*替换include中的内容*/
  replaceInclude.call(this);
  /*解析script*/
  let script = this.$template.match(SCRIPT_REGEXP) || [];
  //设置占位
  const replaceScript = setSeize.call(this),
    echoString = replaceScript.split(/___SCRIPT___|___ECHO_SCRIPT___/), //拆分占位
    domString = [],
    longString = echoString.length > script.length ? echoString : script;

  //排除了运算和赋值表达式，处理直接输出的字符串
  utils.each(echoString, (_echoString, index) => {
    echoString[index] = "___.push(\"" + filterTransferredMeaning(_echoString) + "\");";
  });

  //这里是处理所有表达式内容
  utils.each(script, (_string, index) => {
    //恢复正则的索引位置
    ECHO_SCRIPT_REGEXP.lastIndex = 0;
    NATIVE_SCRIPT.lastIndex = 0;
    ECHO_ESCAPE_REGEXP.lastIndex = 0;
    //处理对应表达式
    if (ECHO_SCRIPT_REGEXP.test(_string)) {
      script[index] = _string
        .replace(REPLACE_ECHO_SCRIPT_OPEN_TAG, "___.push(")
        .replace(CLOSE_TAG_REGEXP, ");");
    } else if (NATIVE_SCRIPT.test(_string)) {
      script[index] = _string
        .replace(OPEN_TAG_REGEXP, '')
        .replace(CLOSE_TAG_REGEXP, '');
    } else if (ECHO_ESCAPE_REGEXP.test(_string)) {
      script[index] = _string
        .replace(ECHO_ESCAPE_REGEXP_OPEN_TAG, "___.push(_this_.escape(")
        .replace(CLOSE_TAG_REGEXP, "));");
    }
  });

  utils.each(longString, (_longString, index) => {
    //直接输出的dom结构
    if (utils.isStr(echoString[index])) {
      domString.push(echoString[index]);
    }
    //js的源码
    if (utils.isStr(script[index])) {
      domString.push(script[index].replace(FILTER_TRANFORM, ""));
    }
  });

  this.vTmpl = 'with(this){try{var _this_ = tmpl,___ = [];' + domString.join('') + 'return ___.join("");}catch(e){console.warn(e);return "";}}';

};

/*替换别名的常量*/
export function replaceAlias() {
  const constructor = this.constructor;
  utils.each(constructor.alias, (replaceAlias, alias) => {
    this.$template = this.$template.replace(new RegExp(utils.initRegExp(alias), 'g'), replaceAlias);
  });
}

/*清除多余的block块*/
function clearBlock() {
  this.$template = this.$template
    .replace(EXTEND, '')
    .replace(BLOCK, '');
}

//设置占位
function setSeize() {
  const replaceScript = this.$template
    .replace(ECHO_SCRIPT_REGEXP, '___ECHO_SCRIPT___')
    .replace(SCRIPT_REGEXP, '___SCRIPT___');
  return replaceScript;
}

//过滤string中的引号
function filterTransferredMeaning(string) {
  //检查script的标签
  return string.replace(FILTER_TRANFORM, '')
    .replace(/\n/g, '\\n')
    .replace(QUEST, '\\\"');
}