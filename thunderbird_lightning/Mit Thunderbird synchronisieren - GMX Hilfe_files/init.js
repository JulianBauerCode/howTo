try{for(var lastpass_iter=0;lastpass_iter<document.forms.length;lastpass_iter++){var lastpass_f=document.forms[lastpass_iter];"undefined"==typeof lastpass_f.lpsubmitorig&&"function"==typeof lastpass_f.submit&&(lastpass_f.lpsubmitorig=lastpass_f.submit,lastpass_f.submit=function(){try{if(document.documentElement&&"createEvent"in document)for(var b=document.getElementsByTagName("form"),a=0;a<b.length;++a)if(b[a]==this){var c=document.createElement("lpformsubmitdataelement");c.setAttribute("formnum",
a);c.setAttribute("from","submithook");document.documentElement.appendChild(c);var d=document.createEvent("Events");d.initEvent("lpformsubmit",!0,!1);c.dispatchEvent(d);break}}catch(e){}try{this.lpsubmitorig()}catch(e){}})}}catch(b){}function stringStartsWith(b,a){return b.slice(0,a.length)==a}function endsWith(b,a){return-1!==b.indexOf(a,b.length-a.length)}
function anonymizeUserDetails(b){var a=document.createElement("a");a.href=b;a=a.hostname;return"search.mail.com"==a||"suche.web.de"==a||"suche.gmx.net"==a||"suche.gmx.at"==a||"suche.gmx.ch"==a||"suche.1und1.de"==a||"suche.1und1.de"==a||stringStartsWith(a,"search.gmx.")||stringStartsWith(a,"www.google.")||stringStartsWith(a,"www.bing.")||-1<a.indexOf("search.yahoo")?b:b.split("?")[0]}
function detectmob(){return navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)?"mobile":"desktop"}
function getAnchor(){anchor=window.location.hash;idx=anchor.indexOf("#");idget=anchor.indexOf("?");var b=-1!=idx?anchor.substring(idx+1):"";return 0<b.length&&0<idget?anchor.substring(idx+1,idget):b}function getClickPos(){for(var b=window.location.search.substring(1).split("&"),a=0;a<b.length;a++){var c=b[a].split("=");if("pos"===c[0])return c[1]}return""}function IsJson(b){return"object"==typeof b?!0:!1}
function getStatus(){var b=["good","bad","error"];b=statusurl.replace("%%STATUS%%",b[Math.floor(Math.random()*b.length)]);$.get(b,function(a){obj=a;!IsJson(obj)||"warning"!=obj.status.toLowerCase()&&"error"!=obj.status.toLowerCase()&&"info"!=obj.status.toLowerCase()?$(".statusMessage").hide():("error"==obj.status.toLowerCase()&&(obj.status="warning"),$(".statusTitle").html(obj.title),$(".statusContent").html(obj.content),$(".statusIcon").removeClass("info"),$(".statusIcon").removeClass("warning"),
$(".statusMessage").removeClass("info"),$(".statusMessage").removeClass("warning"),$(".statusIcon").addClass(obj.status.toLowerCase()),$(".statusMessage").addClass(obj.status.toLowerCase()),"undefined"===typeof Cookies.get("status")&&$(".statusMessage").css("visibility","visible"),"[object Array]"===Object.prototype.toString.call(obj.contactsList)&&"[object Object]"===Object.prototype.toString.call(obj.contactsList[0])&&obj.contactsList[0].text.length&&(a=obj.contactsList[0],$(".contactDescription").html(a.text),
"[object Array]"===Object.prototype.toString.call(a.phoneNumbers)&&$(".contactPhoneDe").html(a.phoneNumbers[0].description+" <br> "+a.phoneNumbers[0].phoneNumber)))},"json").fail(function(){$(".statusMessage").hide()})}$(document).ready(function(){$(".searchbox").show();$("nav.navigation li.active").parents().addClass("active");"undefined"===typeof Cookies.get("status")?($(".statusMessage").addClass("block"),getStatus()):(22==isTopic&&getStatus(),$(".statusMessage").hide())});