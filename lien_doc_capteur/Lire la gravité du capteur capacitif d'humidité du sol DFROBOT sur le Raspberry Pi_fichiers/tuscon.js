try { class InMemoryCacheStore{bidStore={};getItem(key){return this.bidStore[key];}
setItem(key,value){this.bidStore[key]=value;}}
class HbCachedBid{constructor(bidEvent){this.bidEvent=this.slimDownBidEvent(bidEvent);}
slimDownBidEvent(bidEvent){if(typeof bidEvent!=='undefined'&&bidEvent&&typeof bidEvent.ad!=='undefined'){delete bidEvent.ad;}
return bidEvent;}
hasTimedOut(){return this.bidEvent.ttl>0&&(Date.now()-this.bidEvent.responseTimestamp>1000*this.bidEvent.ttl)}
getComparisonMetric(){if(this.hasTimedOut()){return 0;}
let metric=this.bidEvent.cpm;if(typeof metric!=='undefined'){return metric;}
return 0;}
isBetterBidThan(cachedBid){if(cachedBid!==null&&typeof cachedBid==='object'&&typeof cachedBid.getComparisonMetric==='function'){return this.getComparisonMetric()>cachedBid.getComparisonMetric();}
return(this.getComparisonMetric()>0);}}
class PrebidBidCache{defaultCachedBidTTL=60*10;sessionStorageKey="epbjs_cache";debugMode=false;testFeatures=[];constructor(bidStore=window.sessionStorage,testFeatures,debugMode=false){this.bidStore=bidStore;this.getBidsFromStore();this.testFeatures=testFeatures;this.debugMode=debugMode;}
log(message){if(this.debugMode){console.log("::pbc::"+message);}}
getBidsFromStore(){this.log("fetched bids from store");this.bids={};let rawBids=this.bidStore.getItem(this.sessionStorageKey);if(typeof rawBids==='undefined'||rawBids===null){return;}
let bidsFromCache=JSON.parse(rawBids);if(typeof bidsFromCache==='undefined'||bidsFromCache===null){return;}
for(let cacheKey in bidsFromCache){let bidderBids=bidsFromCache[cacheKey];for(let bidder in bidderBids){this.saveBid(Object.assign(new HbCachedBid,bidderBids[bidder]));}}
this.saveBidsToStore();}
saveBidsToStore(){this.log("saved bids to store");if(typeof this.bids==="undefined"||!this.bids){this.bids={};}
this.bidStore.setItem(this.sessionStorageKey,JSON.stringify(this.bids));}
getTopBidEventForAdUnit(adunit){this.log("fetching top bid for "+JSON.stringify(adunit));let topBid=null;let bidderBids=this.getAllBidsForAdUnit(adunit);for(let bidder in bidderBids){if(bidderBids[bidder].isBetterBidThan(topBid)){topBid=bidderBids[bidder];}}
if(typeof topBid==='undefined'||topBid===null){return null;}
return topBid.bidEvent;}
hasBidForAdUnit(adunit,bidder){let allBids=this.getAllBidsForAdUnit(adunit);return(typeof allBids!=='undefined'&&typeof allBids[bidder]!=='undefined')}
hasAnyBids(adunit){return Object.keys(this.getAllBidsForAdUnit(adunit)).length>0;}
getAllBidsForAdUnit(adunit){this.log("fetching all bids for "+adunit);let cacheKey=this.getCacheKeyForAdUnit(adunit);let allBids={};if(Array.isArray(cacheKey)){cacheKey.forEach(key=>{for(let bidder in this.bids[key]){let nextBid=this.bids[key][bidder];if(typeof allBids[bidder]==='undefined'||nextBid.isBetterBidThan(allBids[bidder])){allBids[bidder]=nextBid;}}});}else if(this.bids[cacheKey]!=='undefined'){allBids=this.bids[cacheKey];}
return allBids;}
getCacheKeyForAdUnit(adunit){if(String(adunit).startsWith('/')){return adunit;}
let cacheKey=window.location.pathname+adunit;let pageIndex=this.getPageIndexOfAdUnit(adunit);if(pageIndex>=0){let ezAdUnit=window.epbjs.ezAdUnits.filter(a=>a.code===adunit)[0];if(typeof ezAdUnit!=='undefined'){if(ezAdUnit.mediaTypes&&ezAdUnit.mediaTypes.banner&&ezAdUnit.mediaTypes.banner.sizes){cacheKey=ezAdUnit.mediaTypes.banner.sizes.map(sizeArr=>this.getCacheKeyForIndexSize(pageIndex,sizeArr))}}}
return cacheKey;}
getCacheKeyForIndexSize(pageIndex,adSizeArr){return window.location.pathname+"|"+pageIndex+"|"+adSizeArr.join('x');}
getPageIndexOfAdUnit(adunitName){let adunitElement=document.getElementById(adunitName);if(adunitElement){let pxFromTop=window.pageYOffset+adunitElement.getBoundingClientRect().top;let numViewportsFromTop=Math.floor(pxFromTop/window.innerHeight);let pageIndex=numViewportsFromTop;if(numViewportsFromTop>3){pageIndex=4}
return pageIndex;}
return-1;}
getCachedBiddersForAdUnit(adunit){let biddersObj=this.getAllBidsForAdUnit(adunit)||{};return Object.keys(biddersObj);}
clearBidForUnit(adunit,bidder){this.log("clearing bids for "+JSON.stringify(adunit)+" for "+JSON.stringify(bidder));let allBids=this.getAllBidsForAdUnit(adunit);if(this.hasBidForAdUnit(adunit,bidder)){delete allBids[bidder];this.saveBidsToStore();}}
saveBid(bidEvent){if(bidEvent===null){return;}
let bidToSave=bidEvent;if(typeof bidToSave.isBetterBidThan!=='function'){bidEvent=JSON.parse(JSON.stringify(bidEvent))
if(typeof bidEvent.ttl==='undefined'){bidEvent.ttl=this.defaultCachedBidTTL;}else{bidEvent.ttl=bidEvent.ttl||this.defaultCachedBidTTL;}
bidToSave=new HbCachedBid(bidEvent);}
let adunit=bidToSave.bidEvent.adUnitCode;let bidder=bidToSave.bidEvent.adapterCode;this.log("setting bid for "+JSON.stringify(adunit)+" for "+JSON.stringify(bidder));if(bidToSave.hasTimedOut()){return;}
let cacheKey=this.getCacheKeyForIndexSize(this.getPageIndexOfAdUnit(adunit),[bidToSave.bidEvent.width,bidToSave.bidEvent.height]);if(this.testFeatures.includes('one-cache')){cacheKey=window.location.pathname+"|"+[bidToSave.bidEvent.width,bidToSave.bidEvent.height].join("x");}
this.bids[cacheKey]=this.bids[cacheKey]||{};this.bids[cacheKey][bidder]=bidToSave;this.saveBidsToStore();}
getBestBidForAdUnitBidder(adunit,bidder){let allBids=this.getAllBidsForAdUnit(adunit)[bidder];if(!Array.isArray(allBids)){return allBids;}
let bestBid=allBids[0];for(bid in allBids){if(typeof bid.isBetterBid==='function'&&bid.isBetterBidThan(bestBid)){bestBid=bid;}}}
setHigherBidForAdUnit(bidEvent){if(bidEvent===null){return;}
let bidToCheck=bidEvent;if(typeof bidEvent.isBetterBidThan!=='function'){bidEvent=JSON.parse(JSON.stringify(bidEvent));if(typeof bidEvent.ttl==='undefined'){bidEvent.ttl=this.defaultCachedBidTTL;}else{bidEvent.ttl=bidEvent.ttl||this.defaultCachedBidTTL;}
bidToCheck=new HbCachedBid(bidEvent);}
let adunit=bidToCheck.bidEvent.adUnitCode
let bidder=bidToCheck.bidEvent.adapterCode;this.log("Attempting to set higher bid for adunit "+JSON.stringify(adunit)+" for "+JSON.stringify(bidder));let isBetterBid=true;if(this.hasBidForAdUnit(adunit,bidder)){let currentBest=this.getBestBidForAdUnitBidder(adunit,bidder);isBetterBid=bidToCheck.isBetterBidThan(currentBest);}
if(isBetterBid){this.saveBid(bidToCheck);}}}
window.epbjs=window.epbjs||{};window.epbjs.que=window.epbjs.que||[];epbjs.que.push(function(){let cacheStore=new InMemoryCacheStore();if(typeof cacheStore==='undefined'||!cacheStore){cacheStore=window.sessionStorage;}
let testFeatures=epbjs.testFeatures;if(typeof testFeatures==='undefined'){testFeatures=[];}
let debug=window.location.search.includes("ezbc_debug=true");if(typeof cacheStore!=='undefined'&&cacheStore){epbjs.ezBidCache=new PrebidBidCache(cacheStore,testFeatures,debug);}});} catch(err) {var hREED = function(er) {return function() {reportEzError(er, "/detroitchicago/tuscon.js")}}; typeof reportEzError==="function"?hREED(err):window.addEventListener('reportEzErrorDefined',hREED(err), {once: true}); console.error(err);}