try { window.ezoChar=function(e,t){if(2001==e.getTargeting("al")[0])return!0;var i=t.style.minHeight.slice(0,-2),n=t.style.minWidth.slice(0,-2),o=window.ezoCharSize(i,n),d=_ezaq.country||"US",a=_ezaq.state;if("0"==o||""==d)return!1;var r=new XMLHttpRequest,s="//go.ezodn.com/ads/charity/fetch?country="+d+"&size="+o;return void 0!==a&&""!=a&&(s+="&state="+a),r.onreadystatechange=function(e,t){return function(){if(4==this.readyState&&200==this.status&&""!=this.responseText&&void 0!==e&&void 0!==t){var i,n,o=JSON.parse(this.responseText),d="",a=_ezaq.page_view_id,r=_ezaq.domain_id,s=__ez.dot.getSlotIID(e),l=_ezaq.form_factor_id,c=_ezaq.country;if(!(o.hasOwnProperty("ads")&&null!=o.ads&&o.ads.length>0))return;var h=Math.floor(Math.random()*o.ads.length);i=o.ads[h].img,n=o.ads[h].id,d=o.ads[h].url,d="//go.ezodn.com/ads/charity/proxy?p_id="+a+"&d_id="+r+"&imp_id="+s+"&c_id="+n+"&l_id=10016&url="+encodeURIComponent(d)+"&ffid="+l+"&co="+c;var p=document.createElement("div");p.id=t.id+"_charity";for(var _=t.childNodes[0],u=0;u<t.childNodes.length;u++)"div"==t.childNodes[u].tagName.toLowerCase()?_=t.childNodes[u]:"ins"==t.childNodes[u].tagName.toLowerCase()&&(t.childNodes[u].style.display="none");if(window.ezoCharIsEmpty(e,_))return;var m=document.createElement("a");m.href=d,m.setAttribute("rel","nofollow");var y=document.createElement("div");y.style.position="relative",y.style.zIndex=500,y.style.height=t.style.minHeight.slice(0,-2)+"px",y.style.width=t.style.minWidth.slice(0,-2)+"px";var f=document.createElement("iframe");f.height=t.style.minHeight.slice(0,-2),f.width=t.style.minWidth.slice(0,-2),f.overflowX="hidden",f.overflowY="hidden",f.scrolling="no",f.frameBorder="0",f.src=i,f.setAttribute("rel","nofollow");var z=document.createElement("span");z.innerHTML="&times;",z.style.position="absolute",z.style.top="5px",z.style.right="5px",z.style.fontSize="20px",z.style.fontWeight="bold",z.style.cursor="pointer",z.style.zIndex=501,z.onclick=function(e){e.preventDefault(),e.stopPropagation(),y.innerHTML=""},y.appendChild(f),y.appendChild(z),m.appendChild(y),p.appendChild(m),_.appendChild(p);var g=e.Targeting.br1[0];return g="undefined"!=g?Math.floor(g/1e3):0,__ez.pel.Add(e,[new __ezDotData("stat_source_id",11303)],0,0,0,g,11303),__ez.pel.Add(e,[new __ezDotData("creative_id",n)]),__ez.pel.Add(e,[new __ezDotData("lineitem_id",10016)]),void __ez.pel.Add(e,[new __ezDotData("loaded",1)],0,0,0,g,11303)}}}(e,t),r.open("GET",s),r.send(),!0},window.ezoCharIsEmpty=function(e,t){return 0==e.isEmpty||void 0===t||""!==t.innerHTML},window.ezoCharSize=function(e,t){return t>=728?e>=600?"300x600":"728x90":t>=300?e>=600?"300x600":e>=250?"300x250":e>=50?"320x50":"0":t>=234?e>=60?"234x60":"0":t>=160?e>=90?"160x90":"0":t>=100?e>=480?"100x480":e>=240?"100x240":"0":"0"};} catch(err) {var hREED = function(er) {return function() {reportEzError(er, "/detroitchicago/augusta.js")}}; typeof reportEzError==="function"?hREED(err):window.addEventListener('reportEzErrorDefined',hREED(err), {once: true}); console.error(err);}