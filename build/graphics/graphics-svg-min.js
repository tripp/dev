YUI.add("graphics-svg",function(c){function a(){}a.prototype={curveTo:function(i,g,n,m,l,k){var e,j,h,d,f,o;if(this._pathType!=="C"){this._pathType="C";j=["C"];this._pathArray.push(j);}else{j=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!j){j=[];this._pathArray.push(j);}}e=this._pathArray.length-1;this._pathArray[e]=this._pathArray[e].concat([Math.round(i),Math.round(g),Math.round(n),Math.round(m),l,k]);h=Math.max(l,Math.max(i,n));f=Math.max(k,Math.max(g,m));d=Math.min(l,Math.min(i,n));o=Math.min(k,Math.min(g,m));this._trackSize(h,f);this._trackSize(d,o);},quadraticCurveTo:function(i,h,l,k){var e,j,g,d,f,m;if(this._pathType!=="Q"){this._pathType="Q";j=["Q"];this._pathArray.push(j);}else{j=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!j){j=[];this._pathArray.push(j);}}e=this._pathArray.length-1;this._pathArray[e]=this._pathArray[e].concat([Math.round(i),Math.round(h),Math.round(l),Math.round(k)]);g=Math.max(l,i);f=Math.max(k,h);d=Math.min(l,i);m=Math.min(k,h);this._trackSize(g,f);this._trackSize(d,m);},drawRect:function(d,g,e,f){this.moveTo(d,g);this.lineTo(d+e,g);this.lineTo(d+e,g+f);this.lineTo(d,g+f);this.lineTo(d,g);},drawRoundRect:function(d,j,e,g,f,i){this.moveTo(d,j+i);this.lineTo(d,j+g-i);this.quadraticCurveTo(d,j+g,d+f,j+g);this.lineTo(d+e-f,j+g);this.quadraticCurveTo(d+e,j+g,d+e,j+g-i);this.lineTo(d+e,j+i);this.quadraticCurveTo(d+e,j,d+e-f,j);this.lineTo(d+f,j);this.quadraticCurveTo(d,j,d,j+i);},drawWedge:function(f,i,h,g,e,d){this._drawingComplete=false;this.path=this._getWedgePath({x:f,y:i,startAngle:h,arc:g,radius:e,yRadius:d});},_getWedgePath:function(A){var o=A.x,l=A.y,t=A.startAngle,k=A.arc,f=A.radius,g=A.yRadius||f,s,q,j,z,h,p,n,w,v,e,d,u=0,m=f*2,r=" M"+o+", "+l;if(Math.abs(k)>360){k=360;}s=Math.ceil(Math.abs(k)/45);q=k/s;j=-(q/180)*Math.PI;z=(t/180)*Math.PI;if(s>0){p=o+Math.cos(t/180*Math.PI)*f;n=l+Math.sin(t/180*Math.PI)*g;r+=" L"+Math.round(p)+", "+Math.round(n);r+=" Q";for(;u<s;++u){z+=j;h=z-(j/2);w=o+Math.cos(z)*f;v=l+Math.sin(z)*g;e=o+Math.cos(h)*(f/Math.cos(j/2));d=l+Math.sin(h)*(g/Math.cos(j/2));r+=Math.round(e)+" "+Math.round(d)+" "+Math.round(w)+" "+Math.round(v)+" ";}r+=" L"+o+", "+l;}this._trackSize(m,m);return r;},lineTo:function(j,h,f){var e=arguments,g,d,l,k;this._pathArray=this._pathArray||[];if(typeof j==="string"||typeof j==="number"){e=[[j,h]];}d=e.length;this._shapeType="path";if(this._pathType!=="L"){this._pathType="L";k=["L"];this._pathArray.push(k);}else{k=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!k){k=[];this._pathArray.push(k);}}l=this._pathArray.length-1;for(g=0;g<d;++g){this._pathArray[l]=this._pathArray[l].concat([e[g][0],e[g][1]]);this._trackSize.apply(this,e[g]);}},moveTo:function(d,g){var f,e;this._pathArray=this._pathArray||[];if(this._pathType!="M"){this._pathType="M";e=["M"];this._pathArray.push(e);}else{e=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!e){e=[];this._pathArray.push(e);}}f=this._pathArray.length-1;this._pathArray[f]=this._pathArray[f].concat([d,g]);this._trackSize(d,g);},end:function(){this._draw();},setSize:function(d,e){var f;if(this.get("autoSize")){f=this.get("node");if(d>f.getAttribute("width")){f.setAttribute("width",d);}if(e>f.getAttribute("height")){f.setAttribute("height",e);}}},_trackSize:function(d,e){var f=this.get("node");if(d>this._right){this._right=d;}if(d<this._left){this._left=d;}if(e<this._top){this._top=e;}if(e>this._bottom){this._bottom=e;}this._width=this._right-this._left;this._height=this._bottom-this._top;f.style.left=this._left+"px";f.style.top=this._top+"px";this.setSize(this._width,this._height);}};c.Drawing=a;c.Shape=c.Base.create("shape",c.Base,[],{initializer:function(){this.publish("shapeUpdate");this._addListeners();},addClass:function(d){var e=this.get("node");e.className.baseVal=c.Lang.trim([e.className.baseVal,d].join(" "));},removeClass:function(d){var e=this.get("node"),f=e.className.baseVal;f=f.replace(new RegExp(d+" "),d).replace(new RegExp(d),"");e.className.baseVal=f;},getXY:function(){var g=this.get("graphic"),e=g.getXY(),d=this.get("x"),f=this.get("y");return[e[0]+d,e[1]+f];},setXY:function(e){var f=this.get("graphic"),d=f.getXY();this.set("x",e[0]-d[0]);this.set("y",e[1]-d[1]);},contains:function(d){return d===this;},test:function(d){return c.one(this.get("node")).test(d);},_getDefaultFill:function(){return{type:"solid",cx:0.5,cy:0.5,fx:0.5,fy:0.5,r:0.5};},_getDefaultStroke:function(){return{weight:1,dashstyle:"none",color:"#000",alpha:1};},_getNode:function(){var e=document.createElementNS("http://www.w3.org/2000/svg","svg:"+this._type),d=this.get("pointerEvents")||"none",f=this.get("id");e.setAttribute("pointer-events",d);e.setAttribute("class","yui3-"+this.name);e.setAttribute("id",f);f="#"+f;c.on("mousedown",c.bind(this._nodeEventDispatcher,this),f);c.on("mouseup",c.bind(this._nodeEventDispatcher,this),f);c.on("mouseover",c.bind(this._nodeEventDispatcher,this),f);c.on("mousemove",c.bind(this._nodeEventDispatcher,this),f);c.on("mouseout",c.bind(this._nodeEventDispatcher,this),f);c.on("mouseenter",c.bind(this._nodeEventDispatcher,this),f);c.on("mouseleave",c.bind(this._nodeEventDispatcher,this),f);c.on("click",c.bind(this._nodeEventDispatcher,this),f);return e;},_nodeEventDispatcher:function(d){d.preventDefault();this.fire(d.type,d);},_addListeners:function(){this.after("initializedChange",this._updateHandler);this.after("transformAdded",this._updateHandler);this.after("strokeChange",this._updateHandler);this.after("fillChange",this._updateHandler);this.after("widthChange",this._updateHandler);this.after("heightChange",this._updateHandler);this.after("xChange",this._updateHandler);this.after("yChange",this._updateHandler);this.after("graphicChange",this._updateHandler);},_strokeChangeHandler:function(j){var h=this.get("node"),i=this.get("stroke"),f,d,k,g=i.linejoin||"round";if(i&&i.weight&&i.weight>0){f=i.alpha;d=i.dashstyle||"none";k=c.Lang.isArray(d)?d.toString():d;i.color=i.color||"#000000";i.weight=i.weight||1;i.alpha=c.Lang.isNumber(f)?f:1;
i.linecap=i.linecap||"butt";h.setAttribute("stroke-dasharray",k);h.setAttribute("stroke",i.color);h.setAttribute("stroke-linecap",i.linecap);h.setAttribute("stroke-width",i.weight);h.setAttribute("stroke-opacity",i.alpha);if(g=="round"||g=="bevel"){h.setAttribute("stroke-linejoin",g);}else{g=parseInt(g,10);if(c.Lang.isNumber(g)){h.setAttribute("stroke-miterlimit",Math.max(g,1));h.setAttribute("stroke-linejoin","miter");}}}else{h.setAttribute("stroke","none");}},_fillChangeHandler:function(i){var g=this.get("node"),h=this.get("fill"),f,d=h.type;if(h){if(d=="linear"||d=="radial"){this._setGradientFill(h);g.setAttribute("fill","url(#grad"+this.get("id")+")");}else{if(!h.color){g.setAttribute("fill","none");}else{f=h.alpha;h.alpha=c.Lang.isNumber(f)?f:1;g.setAttribute("fill",h.color);g.setAttribute("fill-opacity",f);}}}else{g.setAttribute("fill","none");}},_setGradientFill:function(B){if(!this.get("graphic")){return;}var n,l,A,v,t=c.Lang.isNumber,s=this.get("graphic"),m=B.type,y=s.getGradientNode("grad"+this.get("id"),m),o=B.stops,p=this.get("width"),F=this.get("height"),x=B.rotation,C,E,q,z,G="0%",D="100%",j="50%",e="50%",g=B.cx,d=B.cy,k=B.fx,f=B.fy,u=B.r;if(m=="linear"){y.setAttribute("gradientTransform","rotate("+x+","+(p/2)+", "+(F/2)+")");y.setAttribute("width",p);y.setAttribute("height",F);y.setAttribute("x1",G);y.setAttribute("y1",j);y.setAttribute("x2",D);y.setAttribute("y2",e);y.setAttribute("gradientUnits","userSpaceOnUse");}else{y.setAttribute("cx",(g*100)+"%");y.setAttribute("cy",(d*100)+"%");y.setAttribute("fx",(k*100)+"%");y.setAttribute("fy",(f*100)+"%");y.setAttribute("r",(u*100)+"%");}E=o.length;q=0;for(C=0;C<E;++C){z=o[C];l=z.opacity;A=z.color;n=z.offset||C/(E-1);n=Math.round(n*100)+"%";l=t(l)?l:1;l=Math.max(0,Math.min(1,l));q=(C+1)/E;v=s._createGraphicNode("stop");v.setAttribute("offset",n);v.setAttribute("stop-color",A);v.setAttribute("stop-opacity",l);y.appendChild(v);}},translate:function(d,e){this._translateX=d;this._translateY=e;this._translate.apply(this,arguments);},_translate:function(d,e){this._addTransform("translate",arguments);},skewX:function(d){this._addTransform("skewX",arguments);},skewY:function(d){this._addTransform("skewY",arguments);},_rotation:0,rotate:function(d){this._rotation=d;this._addTransform("rotate",arguments);},scale:function(d){this._addTransform("scale",arguments);},matrix:function(h,g,l,k,j,i){this._addTransform("matrix",arguments);},_addTransform:function(e,d){if(!this._transformArgs){this._transformArgs={};}this._transformArgs[e]=Array.prototype.slice.call(d,0);this.fire("transformAdded");},_updateTransform:function(){var h=this.get("node"),g,f,i,e=h.getAttribute("transform"),j,d;if(this._transformArgs){if(this._transformArgs.hasOwnProperty("rotate")){d=this.get("transformOrigin");f=this._transformArgs.rotate;f[1]=this.get("x")+(this.get("width")*d[0]);f[2]=this.get("y")+(this.get("height")*d[1]);}}for(g in this._transformArgs){if(g&&this._transformArgs.hasOwnProperty(g)){i=g+"("+this._transformArgs[g].toString()+")";if(e&&e.length>0){j=new RegExp(g+"(.*)");if(e.indexOf(g)>-1){e=e.replace(j,i);}else{e+=" "+i;}}else{e=i;}}}if(e){h.setAttribute("transform",e);}},_draw:function(){var d=this.get("node");d.setAttribute("width",this.get("width"));d.setAttribute("height",this.get("height"));d.setAttribute("x",this.get("x"));d.setAttribute("y",this.get("y"));d.style.left=this.get("x")+"px";d.style.top=this.get("y")+"px";this._fillChangeHandler();this._strokeChangeHandler();this._updateTransform();},_updateHandler:function(d){this._draw();this.fire("shapeUpdate");},_translateX:0,_translateY:0,getBounds:function(){var s=this.get("rotation"),e=Math.abs(s),f=Math.PI/180,p=parseFloat(parseFloat(Math.sin(e*f)).toFixed(8)),i=parseFloat(parseFloat(Math.cos(e*f)).toFixed(8)),o=this.get("width"),t=this.get("height"),j=this.get("stroke"),n=this.get("x"),m=this.get("y"),d=0,z=this.get("translateX"),u=this.get("translateY"),g={},q=this.get("transformOrigin"),v,r,l=q[0],k=q[1];if(s!==0){v=o;r=t;o=(i*t)+(p*o);t=(i*t)+(p*o);n=(n+v*l)-(p*(r*(1-k)))-(i*(v*l));m=(m+r*k)-(p*(v*l))-(i*r*k);}if(j&&j.weight){d=j.weight;}g.left=n-d+z;g.top=m-d+u;g.right=n+o+d+z;g.bottom=m+t+d+u;return g;}},{ATTRS:{transformOrigin:{valueFn:function(){return[0.5,0.5];}},rotation:{setter:function(d){this.rotate(d);},getter:function(){return this._rotation;}},node:{readOnly:true,valueFn:"_getNode"},id:{valueFn:function(){return c.guid();},setter:function(e){var d=this.get("node");d.setAttribute("id",e);return e;}},x:{value:0},y:{value:0},width:{},height:{},visible:{value:true,setter:function(e){var d=e?"visible":"hidden";this.get("node").style.visibility=d;return e;}},fill:{valueFn:"_getDefaultFill",setter:function(f){var e,d=this.get("fill")||this._getDefaultFill();e=(f)?c.merge(d,f):null;if(e&&e.color){if(e.color===undefined||e.color=="none"){e.color=null;}}return e;}},stroke:{valueFn:"_getDefaultStroke",setter:function(e){var d=this.get("stroke")||this._getDefaultStroke();return(e)?c.merge(d,e):null;}},autoSize:{value:false},pointerEvents:{value:"visiblePainted"},translateX:{getter:function(){return this._translateX;},setter:function(d){this._translateX=d;this._transform(d,this._translateY);return d;}},translateY:{getter:function(){return this._translateY;},setter:function(d){this._translateY=d;this._transform(this._translateX,d);return d;}},gradientNode:{setter:function(d){if(c.Lang.isString(d)){d=this.get("graphic").getGradientNode("linear",d);}return d;}},graphic:{writeOnce:true,setter:function(d){this.after("shapeUpdate",c.bind(d.updateCoordSpace,d));return d;}}}});c.Path=c.Base.create("path",c.Shape,[c.Drawing],{_left:0,_right:0,_top:0,_bottom:0,_type:"path",_draw:function(){var e,l,d,o,f,n,m,r="",h=this.get("node"),k=this.get("translateX"),j=this.get("translateY"),g=this._left,p=this._top,q=this.get("fill");if(this._pathArray){e=this._pathArray.concat();while(e&&e.length>0){l=e.shift();o=l.length;d=l[0];r+=" "+d+(l[1]-g);switch(d){case"L":case"M":case"Q":for(m=2;m<o;++m){f=(m%2===0)?p:g;
f=l[m]-f;r+=", "+f;}break;case"C":for(m=2;m<o;++m){f=(m%2===0)?p:g;n=l[m];n-=f;r+=" "+n;}break;}}if(q&&q.color){r+="z";}if(r){h.setAttribute("d",r);}this._transformArgs=this._transformArgs||{};this._transformArgs.translate=[g+k,p+j];this.set("path",r);this._fillChangeHandler();this._strokeChangeHandler();this._updateTransform();}},translate:function(d,e){d=parseInt(d,10);e=parseInt(e,10);this._translateX=d;this._translateY=e;this._translate(this._left+d,this._top+e);},end:function(){this._draw();this.fire("shapeUpdate");},clear:function(){this._left=0;this._right=0;this._top=0;this._bottom=0;this._pathArray=[];this.set("path","");},getBounds:function(){var e=0,g={},h=this.get("stroke"),f=this.get("translateX"),d=this.get("translateY");if(h&&h.weight){e=h.weight;}g.left=this._left-e+f;g.top=this._top-e+d;g.right=(this._right-this._left)+e+f;g.bottom=(this._bottom-this._top)+e+d;return g;}},{ATTRS:{path:{value:""},width:{getter:function(){var d=Math.max(this._right-this._left,0);return d;}},height:{getter:function(){return Math.max(this._bottom-this._top,0);}}}});c.Rect=c.Base.create("rect",c.Shape,[],{_type:"rect"});c.Ellipse=c.Base.create("ellipse",c.Shape,[],{_type:"ellipse",_draw:function(){var d=this.get("node"),m=this.get("width"),g=this.get("height"),l=this.get("x"),j=this.get("y"),k=m*0.5,i=g*0.5,f=l+k,e=j+i;d.setAttribute("rx",k);d.setAttribute("ry",i);d.setAttribute("cx",f);d.setAttribute("cy",e);this._fillChangeHandler();this._strokeChangeHandler();this._updateTransform();}},{ATTRS:{xRadius:{readOnly:true,getter:function(){var d=this.get("width");if(d){d*=0.5;}return d;}},yRadius:{readOnly:true,getter:function(){var d=this.get("height");if(d){d*=0.5;}return d;}},x:{lazyAdd:false,value:0},y:{lazyAdd:false}}});c.Circle=c.Base.create("circle",c.Shape,[],{_type:"circle",_addListeners:function(){c.Circle.superclass._addListeners.apply(this);this.after("radiusChange",this._updateHandler);},_draw:function(){var g=this.get("node"),f=this.get("x"),i=this.get("y"),e=this.get("radius"),d=f+e,h=i+e;g.setAttribute("r",e);g.setAttribute("cx",d);g.setAttribute("cy",h);this._fillChangeHandler();this._strokeChangeHandler();this._updateTransform();}},{ATTRS:{width:{readOnly:true,getter:function(){return this.get("radius")*2;}},height:{readOnly:true,getter:function(){return this.get("radius")*2;}},radius:{value:0}}});function b(d){this.initializer.apply(this,arguments);}b.prototype={getXY:function(){var d=c.one(this.node.parentNode),e=d.getXY();return e;},autoSize:true,initializer:function(e){e=e||{};var d=e.width||0,f=e.height||0;this._gradients={};this.id=c.guid();this.node=c.config.doc.createElement("div");this.node.style.position="absolute";this.group=this._createGraphics();this.group.setAttribute("id",this.id);this.node.appendChild(this.group);this.setSize(d,f);if(e.render){this.render(e.render);}},destroy:function(){this._removeChildren(this.node);if(this.node&&this.node.parentNode){this.node.parentNode.removeChild(this.node);}},_removeChildren:function(d){if(d.hasChildNodes()){var e;while(d.firstChild){e=d.firstChild;this._removeChildren(e);d.removeChild(e);}}},toggleVisible:function(d){this._toggleVisible(this.node,d);},_toggleVisible:function(h,j){var g=c.Selector.query(">/*",h),e=j?"visible":"hidden",f=0,d;if(g){d=g.length;for(;f<d;++f){this._toggleVisible(g[f],j);}}h.style.visibility=e;},clear:function(){if(this._graphicsList){while(this._graphicsList.length>0){this.group.removeChild(this._graphicsList.shift());}}},setSize:function(d,e){if(this.autoSize){if(d>this.node.getAttribute("width")){this.group.setAttribute("width",d);}if(e>this.group.getAttribute("height")){this.group.setAttribute("height",e);}}},_trackSize:function(d,e){if(d>this._right){this._right=d;}if(d<this._left){this._left=d;}if(e<this._top){this._top=e;}if(e>this._bottom){this._bottom=e;}this._width=this._right-this._left;this._height=this._bottom-this._top;this.node.style.left=this._left+"px";this.node.style.top=this._top+"px";this.setSize(this._width,this._height);},render:function(g){var d=c.one(g),e=parseInt(d.getComputedStyle("width"),10),f=parseInt(d.getComputedStyle("height"),10);d=d||c.config.doc.body;d.appendChild(this.node);this.setSize(e,f);return this;},_createGraphics:function(){var d=this._createGraphicNode("svg");this._styleGroup(d);return d;},_styleGroup:function(d){d.style.position="absolute";d.style.top="0px";d.style.left="0px";d.style.overflow="auto";d.setAttribute("overflow","auto");d.setAttribute("pointer-events","none");},_createGraphicNode:function(f,d){var g=document.createElementNS("http://www.w3.org/2000/svg","svg:"+f),e=d||"none";if(f!=="defs"&&f!=="stop"&&f!=="linearGradient"&&f!="radialGradient"){g.setAttribute("pointer-events",e);}return g;},addShape:function(d){var e=d.get("node");this.group.appendChild(e);if(!this._graphicsList){this._graphicsList=[];}if(!this._shapes){this._shapes={};}this._graphicsList.push(e);this._shapes[d.get("id")]=d;d.set("graphic",this);this.updateCoordSpace();},getShape:function(d){return this._shapes[d];},updateCoordSpace:function(k){var j,h=0,g,f=this._graphicsList,d=f.length;this._left=0;this._right=0;this._top=0;this._bottom=0;for(;h<d;++h){g=this.getShape(f[h].getAttribute("id"));j=g.getBounds();this._left=Math.min(this._left,j.left);this._top=Math.min(this._top,j.top);this._right=Math.max(this._right,j.right);this._bottom=Math.max(this._bottom,j.bottom);}this._width=this._right-this._left;this._height=this._bottom-this._top;this.node.style.width=this._width+"px";this.node.style.height=this._height+"px";this.node.style.left=this._left+"px";this.node.style.top=this._top+"px";this.group.setAttribute("width",this._width);this.group.setAttribute("height",this._height);this.group.style.width=this._width+"px";this.group.style.height=this._height+"px";this.group.setAttribute("viewBox",""+this._left+" "+this._top+" "+this._width+" "+this._height+"");},_left:0,_right:0,_top:0,_bottom:0,getGradientNode:function(f,g){var d=this._gradients,h,e=g+"Gradient";if(d.hasOwnProperty(f)&&d[f].tagName.indexOf(g)>-1){h=this._gradients[f];
}else{h=this._createGraphicNode(e);if(!this._defs){this._defs=this._createGraphicNode("defs");this.group.appendChild(this._defs);}this._defs.appendChild(h);f=f||"gradient"+Math.round(100000*Math.random());h.setAttribute("id",f);if(d.hasOwnProperty(f)){this._defs.removeChild(d[f]);}d[f]=h;}return h;}};c.Graphic=b;},"@VERSION@",{requires:["dom","event-custom","base","graphics"],skinnable:false});