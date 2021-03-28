// ==UserScript==
// @name         脚本烤推机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过JS脚本烤推注入的烤推机，未来可能集成至扩展中。拥有友好界面()
// @author       chenxuan
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_log
// @resource     layer https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css
// @resource     bootstrap https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @require      https://cdn.jsdelivr.net/npm/wangeditor@latest/dist/wangEditor.min.js
// @require      https://unpkg.com/vue@2.6.12/dist/vue.js
// ==/UserScript==
/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */

// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_log
window.unsafeWindow = window;
function GM_getValue(key) {
    return localStorage.getItem(key);
}
function GM_setValue(key, value) {
    return localStorage.setItem(key, value);
}
function GM_getResourceText(key){
    return GM_getValue(key);
}
function GM_addStyle(cssstr){
    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    var text = document.createTextNode(cssstr);
    style.appendChild(text);
    document.head.appendChild(style);
    return;
}
function GM_log(...args){
    console.log(...args)
}
function GM_addElement(flag,options){
    let node = document.createElement(flag);
    node.id = options.id;
    node.innerHTML = options.textContent;
    document.head.appendChild(node);
}
// 兼容层初始化
(function () {
    "use strict";
    const resources = {
        "layer":"./vender/layer/3.1.1/css/layer.min.css",
        "bootstrap":"./vender/bootstrap-4.6.0-dist/css/bootstrap.min.css"
    }
    for(let key in resources){
        axios
        .get(resources[key])
        .then(response => (GM_setValue(key,response.data)))
        .catch(function (error) { // 请求失败处理
          console.log("加载样式资源失败！");
        });
        
    }
})();
