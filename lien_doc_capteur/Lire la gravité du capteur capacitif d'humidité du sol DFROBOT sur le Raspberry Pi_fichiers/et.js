(function(){function getEzErrorURL(){var defaultDomain='//g.ezoic.net';var path='/detroitchicago/erjs';if(typeof __ez.dot!=='undefined'&&__ez.dot.hasOwnProperty('getURL')){return __ez.dot.getURL(path);}
return defaultDomain+path;}
function sendErrorMessage(errorMessage){var dataTxt=JSON.stringify(errorMessage);if(dataTxt.length>0){var url=getEzErrorURL();var logXHR=new XMLHttpRequest();logXHR.open('POST',url,true);logXHR.setRequestHeader('Content-Type','application/json');logXHR.send(dataTxt);}}
window.reportEzError=function(err,sn){if(typeof _ezaq==='undefined'){return;}
var re=/\(?([^\s)]+):(\d+):(\d+)\)?/;var scriptUrl,line,column;var stack=err.stack.split('\n');if(stack.length>1){var source=stack[1];var groups=re.exec(source);if(groups!==null&&groups.length>=4){scriptUrl=groups[1];line=groups[2];column=groups[3];}}
var errorMessage={message:err.message,line:parseInt(line),column:parseInt(column),error_type:err.name,script_url:scriptUrl,url:_ezaq.url,domain_id:_ezaq.domain_id,pageview_id:_ezaq.page_view_id,form_factor_id:_ezaq.form_factor_id,script_name:sn};sendErrorMessage(errorMessage);}
window.reportEzReqError=function(scriptUrl,sn){if(typeof _ezaq==='undefined'){return;}
var errorMessage={message:"",line:-1,column:-1,error_type:"error",script_url:scriptUrl,url:_ezaq.url,domain_id:_ezaq.domain_id,pageview_id:_ezaq.page_view_id,form_factor_id:_ezaq.form_factor_id,script_name:sn};sendErrorMessage(errorMessage);}})();window.dispatchEvent(new Event('reportEzErrorDefined'));