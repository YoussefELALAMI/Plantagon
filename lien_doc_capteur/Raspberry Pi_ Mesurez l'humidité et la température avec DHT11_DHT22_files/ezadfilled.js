try { __ez.fads.adFilled=(__ez.fads.adFilled&&__ez.fads.adFilled.loaded===true)?__ez.fads.adFilled:{loaded:true,log:__ez.fads.log,version:__ez.fads.version,filledTimes:{},filledRates:{},filledData:function(id,cpm,retries,refreshCount,ssid,avgcpm){if(isNaN(avgcpm)){avgcpm=0;}
if(typeof refreshCount=='undefined'){refreshCount=0;}
this.id=id;this.cpm=cpm;this.time=new Date().getTime();this.retries=retries;this.refreshCount=refreshCount;this.ssid=ssid;this.avgcpm=avgcpm/100;},AdFilled:function(id){this.log("ad filled",id);if(__ez.fads.addedDivs.indexOf(id)==-1){this.log("not handling this div",id);return;}
for(var i=0;i<__ez.fads.libraries.length;i++){var name=__ez.fads.libraries[i];if(name=='adFilled'){continue;}
if(typeof __ez.fads[name]!='undefined'&&__ez.fads[name].loaded==true&&typeof __ez.fads[name].adFilled=='function'){__ez.fads[name].adFilled(id);}}
__ez.fads.removeEligibleAdRefresh(id);if(__ez.fads.isFloating(id)){setTimeout(function(){if(!__ez.fads.callLibrary('adFilled','IsFilledInLast',[id,30000])){__ez.fads.RefreshAd(id);}},36000);}else{setTimeout(function(){__ez.fads.addEligibleAdRefresh(id);},30000);}
this.filledTimes[id]=new Date().getTime();if(typeof this.filledRates[id]=='undefined'){this.filledRates[id]=[];}
this.filledRates[id].push(new this.filledData(id,parseInt(this.getGAMKV(id,'br1'))/100,this.getGAMKV(id,'ic'),this.getGAMKV(id,'alc'),__ez.fads.adLoadGAM.GetStatSourceId(id),this.getGAMKV(id,'avc')));this.log("filled rates",this.filledRates[id]);this.log("highest filled rates",this.GetHighestFilledRate(id),this.GetHighestFilledRate());},getGAMKV:function(id,key){return __ez.fads.adLoadGAM.GetTargeting(id,key)[0];},GetMaxFloor:function(id,percent,minLoads){percent=percent||1.0;minLoads=minLoads||2;var highest=this.GetHighestFilledRate();var count=this.GetTotalFillCount();this.log("GetMaxFloor",id,highest,count)
if(count<minLoads){return false;}
return Math.round(highest*percent);},GetTotalFillCount:function(id){if(id){return typeof this.filledRates[id]!=='undefined'?this.filledRates[id].length:0;}else{return Object.keys(this.filledRates).reduce(function(acc,key){return acc+this.GetTotalFillCount(key);}.bind(this),0);}},GetPageTotals:function(){var total=0;var avgcpm=0;var count=0;var avgcpmTotal=0;Object.keys(this.filledRates).forEach(function(key){this.filledRates[key].forEach(function(rate){avgcpm_adjust=1-(rate.refreshCount*.2);if(avgcpm_adjust<.2){avgcpm_adjust=.2;}
total+=rate.cpm;avgcpm+=rate.cpm-(rate.avgcpm*avgcpm_adjust);avgcpmTotal+=(rate.avgcpm*avgcpm_adjust);count++;});},this);avgcpm=count>0?avgcpm/count:0;avgPercentage=avgcpmTotal>0?total/avgcpmTotal:0;return{total:total,avgcpm:avgcpm,count:count,avgcpmPercentage:avgPercentage};},GetHighestFilledRate:function(id){if(typeof id!=='undefined'){return this.filledRates[id]?Math.max.apply(null,this.filledRates[id].map(function(rate){return rate.cpm;})):0;}else{return Math.max.apply(null,Object.keys(this.filledRates).map(function(key){return this.GetHighestFilledRate(key);},this));}},IsFilledInLast:function(id,duration){if(typeof duration==='undefined'){duration=30000;}
return(typeof this.filledTimes[id]!=='undefined'&&this.filledTimes[id]+duration>new Date().getTime());}}} catch(err) {var hREED = function(er) {return function() {reportEzError(er, "/porpoiseant/ezadfilled.js")}}; typeof reportEzError==="function"?hREED(err):window.addEventListener('reportEzErrorDefined',hREED(err), {once: true}); console.error(err);}