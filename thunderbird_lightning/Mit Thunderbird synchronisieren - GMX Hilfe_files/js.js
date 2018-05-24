/*
 JavaScript Cookie v2.1.2
 https://github.com/js-cookie/js-cookie

 Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 Released under the MIT license
*/
(function(h){if("function"===typeof define&&define.amd)define(h);else if("object"===typeof exports)module.exports=h();else{var g=window.Cookies,c=window.Cookies=h();c.noConflict=function(){window.Cookies=g;return c}}})(function(){function h(){for(var c=0,b={};c<arguments.length;c++){var a=arguments[c],f;for(f in a)b[f]=a[f]}return b}function g(c){function b(a,f,d){if("undefined"!==typeof document){if(1<arguments.length){d=h({path:"/"},b.defaults,d);if("number"===typeof d.expires){var k=new Date;k.setMilliseconds(k.getMilliseconds()+
864E5*d.expires);d.expires=k}try{var l=JSON.stringify(f);/^[\{\[]/.test(l)&&(f=l)}catch(p){}f=c.write?c.write(f,a):encodeURIComponent(String(f)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent);a=encodeURIComponent(String(a));a=a.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);a=a.replace(/[\(\)]/g,escape);return document.cookie=[a,"=",f,d.expires?"; expires="+d.expires.toUTCString():"",d.path?"; path="+d.path:"",d.domain?"; domain="+d.domain:"",d.secure?
"; secure":""].join("")}a||(l={});k=document.cookie?document.cookie.split("; "):[];for(var g=/(%[0-9A-Z]{2})+/g,n=0;n<k.length;n++){var q=k[n].split("="),e=q.slice(1).join("=");'"'===e.charAt(0)&&(e=e.slice(1,-1));try{var m=q[0].replace(g,decodeURIComponent);e=c.read?c.read(e,m):c(e,m)||e.replace(g,decodeURIComponent);if(this.json)try{e=JSON.parse(e)}catch(p){}if(a===m){l=e;break}a||(l[m]=e)}catch(p){}}return l}}b.set=b;b.get=function(a){return b(a)};b.getJSON=function(){return b.apply({json:!0},
[].slice.call(arguments))};b.defaults={};b.remove=function(a,c){b(a,"",h(c,{expires:-1}))};b.withConverter=g;return b}return g(function(){})});
