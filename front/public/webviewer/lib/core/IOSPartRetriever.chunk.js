/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see legal.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[7],{335:function(ha,da,f){f.r(da);var aa=f(3),ea=f(184);ha=f(327);var fa=f(29);f=f(280);var ba={},z=function(f){function x(w,r){var n=f.call(this,w,r)||this;n.url=w;n.range=r;n.status=ea.a.NOT_STARTED;return n}Object(aa.c)(x,f);x.prototype.start=function(f){var r=this;ba[this.range.start]={Dp:function(e){var n=atob(e),h,w=n.length;e=new Uint8Array(w);for(h=0;h<w;++h)e[h]=n.charCodeAt(h);n=e.length;h="";var x=0;if(Object(fa.l)())for(;x<
n;)w=e.subarray(x,x+1024),x+=1024,h+=String.fromCharCode.apply(null,w);else for(w=Array(1024);x<n;){for(var y=0,z=Math.min(x+1024,n);x<z;y++,x++)w[y]=e[x];h+=String.fromCharCode.apply(null,1024>y?w.slice(0,y):w)}r.Dp(h,f)},UH:function(){r.status=ea.a.ERROR;f({code:r.status})}};var n=document.createElement("IFRAME");n.setAttribute("src",this.url);document.documentElement.appendChild(n);n.parentNode.removeChild(n);n=null;this.status=ea.a.STARTED;r.Vv()};return x}(ha.ByteRangeRequest);ha=function(f){function x(w,
r,n,e){w=f.call(this,w,r,n,e)||this;w.As=z;return w}Object(aa.c)(x,f);x.prototype.Nq=function(f,r){return f+"#"+r.start+"&"+(r.stop?r.stop:"")};x.r4=function(f,r){var n=ba[r];delete ba[r];n.Dp(f)};x.q4=function(f,r){f=ba[r];delete ba[r];f.UH()};return x}(ha["default"]);Object(f.a)(ha);Object(f.b)(ha);da["default"]=ha}}]);}).call(this || window)
