YUI.add("graphics-canvas",function(c){function a(){this.initializer.apply(this,arguments);}a.prototype={setSize:function(d,e){if(this.autoSize){if(d>this.node.getAttribute("width")){this.node.style.width=d+"px";this._canvas.style.width=d+"px";this._canvas.width=d;this.node.setAttribute("width",d);}if(e>this.node.getAttribute("height")){this.node.style.height=e+"px";this._canvas.style.height=e+"px";this._canvas.height=e;this.node.setAttribute("height",e);}}},_updatePosition:function(d,e){if(d<=this._left){this._left=d;}else{if(d>=this._right){this._right=d;}}if(e<=this._top){this._top=e;}else{if(e>=this._bottom){this._bottom=e;}}this._width=this._right-this._left;this._height=this._bottom-this._top;},initializer:function(d){this._dummy=this._createDummy();this._canvas=this._createGraphic();this._context=this._canvas.getContext("2d");this._initProps();},_methods:null,_properties:null,_updateDrawingQueue:function(d){if(!this._methods){this._methods=[];}this._methods.push(d);},beginBitmapFill:function(d){var e=this._context,g=d.bitmap,f=d.repeat||"repeat";this._fillWidth=d.width||null;this._fillHeight=d.height||null;this._fillX=!isNaN(d.tx)?d.tx:NaN;this._fillY=!isNaN(d.ty)?d.ty:NaN;this._fillType="bitmap";this._bitmapFill=e.createPattern(g,f);return this;},beginFill:function(d,f){var e=this._context;this._updateDrawingQueue(["beginPath"]);if(d){if(f){d=this._2RGBA(d,f);}else{d=this._2RGB(d);}this._fillColor=d;this._fillType="solid";}return this;},beginGradientFill:function(h){var g,k,j=0,f=h.colors,e=h.alphas||[],d=f.length;this._fillAlphas=e;this._fillColors=f;this._fillType=h.type||"linear";this._fillRatios=h.ratios||[];this._fillRotation=h.rotation||0;this._fillWidth=h.width||null;this._fillHeight=h.height||null;this._fillX=!isNaN(h.tx)?h.tx:NaN;this._fillY=!isNaN(h.ty)?h.ty:NaN;for(;j<d;++j){k=e[j];g=f[j];if(k){g=this._2RGBA(g,k);}else{g=this._2RGB(g);}f[j]=g;}this._updateDrawingQueue(["beginPath"]);return this;},lineStyle:function(k,h,g,j,l,f,d,i){h=h||"#000000";var e=this._context;if(this._stroke){this._updateDrawingQueue(["stroke"]);}this._lineWidth=k;if(k){this._stroke=1;}else{this._stroke=0;}if(h){this._strokeStyle=h;if(g){this._strokeStyle=this._2RGBA(this._strokeStyle,g);}}if(!this._fill){this._updateDrawingQueue(["beginPath"]);}if(f==="butt"){f="none";}if(e.lineCap){}this._drawingComplete=false;return this;},lineTo:function(j,h,f){var e=arguments,g,d;if(typeof j==="string"||typeof j==="number"){e=[[j,h]];}for(g=0,d=e.length;g<d;++g){this._updateDrawingQueue(["lineTo",e[g][0],e[g][1]]);this._lineToMethods[this._lineToMethods.length]=this._methods[this._methods.length-1];this._updateShapeProps.apply(this,e[g]);this._updatePosition(e[g][0],e[g][1]);}this._drawingComplete=false;return this;},moveTo:function(d,e){this._updateDrawingQueue(["moveTo",d,e]);this._updateShapeProps(d,e);this._drawingComplete=false;return this;},clear:function(){this._initProps();this._canvas.width=this._canvas.width;this._canvas.height=this._canvas.height;return this;},curveTo:function(f,e,h,g,d,i){this._updateDrawingQueue(["bezierCurveTo",f,e,h,g,d,i]);this._drawingComplete=false;this._updateShapeProps(d,i);return this;},quadraticCurveTo:function(f,e,d,g){this._updateDrawingQueue(["quadraticCurveTo",f,e,d,g]);this._drawingComplete=false;this._updateShapeProps(d,g);return this;},drawCircle:function(e,i,d){var h=this._context,g=0,f=2*Math.PI;this._shape={x:e-d,y:i-d,w:d*2,h:d*2};this._drawingComplete=false;this._updateDrawingQueue(["beginPath"]);this._updateDrawingQueue(["arc",e,i,d,g,f,false]);this._draw();return this;},drawEllipse:function(r,p,s,A){this._shape={x:r,y:p,w:s,h:A};if(this._stroke&&this._context.lineWidth>0){s-=this._context.lineWidth*2;A-=this._context.lineWidth*2;r+=this._context.lineWidth;p+=this._context.lineWidth;}var e=this._context,u=8,m=-(45/180)*Math.PI,C=0,k,g=s/2,j=A/2,v=0,o=r+g,n=p+j,t,q,B,z,f,d;this._drawingComplete=false;this._trackPos(r,p);this._trackSize(r+s,p+A);this._updateDrawingQueue(["beginPath"]);t=o+Math.cos(0)*g;q=n+Math.sin(0)*j;this._updateDrawingQueue(["moveTo",t,q]);for(;v<u;v++){C+=m;k=C-(m/2);B=o+Math.cos(C)*g;z=n+Math.sin(C)*j;f=o+Math.cos(k)*(g/Math.cos(m/2));d=n+Math.sin(k)*(j/Math.cos(m/2));this._updateDrawingQueue(["quadraticCurveTo",f,d,B,z]);}this._draw();return this;},drawRect:function(d,i,f,g){var e=this._context;this._shape={x:d,y:i,w:f,h:g};this._drawingComplete=false;this._updateDrawingQueue(["beginPath"]);this._updateDrawingQueue(["moveTo",d,i]);this._updateDrawingQueue(["lineTo",d+f,i]);this._updateDrawingQueue(["lineTo",d+f,i+g]);this._updateDrawingQueue(["lineTo",d,i+g]);this._updateDrawingQueue(["lineTo",d,i]);this._trackPos(d,i);this._trackSize(f,g);this._draw();return this;},drawRoundRect:function(d,k,f,i,g,j){this._shape={x:d,y:k,w:f,h:i};var e=this._context;this._drawingComplete=false;this._updateDrawingQueue(["beginPath"]);this._updateDrawingQueue(["moveTo",d,k+j]);this._updateDrawingQueue(["lineTo",d,k+i-j]);this._updateDrawingQueue(["quadraticCurveTo",d,k+i,d+g,k+i]);this._updateDrawingQueue(["lineTo",d+f-g,k+i]);this._updateDrawingQueue(["quadraticCurveTo",d+f,k+i,d+f,k+i-j]);this._updateDrawingQueue(["lineTo",d+f,k+j]);this._updateDrawingQueue(["quadraticCurveTo",d+f,k,d+f-g,k]);this._updateDrawingQueue(["lineTo",d+g,k]);this._updateDrawingQueue(["quadraticCurveTo",d,k,d,k+j]);this._trackPos(d,k);this._trackSize(f,i);this._draw();return this;},drawWedge:function(g){var o=g.x,m=g.y,s=g.startAngle,l=g.arc,f=g.radius,h=g.yRadius,r,q,k,w,j,p,n,v,u,e,d,t=0;this._drawingComplete=false;this._updateRenderQueue(["moveTo",o,m]);h=h||f;if(Math.abs(l)>360){l=360;}r=Math.ceil(Math.abs(l)/45);q=l/r;k=-(q/180)*Math.PI;w=-(s/180)*Math.PI;if(r>0){p=o+Math.cos(s/180*Math.PI)*f;n=m+Math.sin(-s/180*Math.PI)*h;this.lineTo(p,n);for(;t<r;++t){w+=k;j=w-(k/2);v=o+Math.cos(w)*f;u=m+Math.sin(w)*h;e=o+Math.cos(j)*(f/Math.cos(k/2));d=m+Math.sin(j)*(h/Math.cos(k/2));this._updateRenderQueue(["quadraticCurveTo",e,d,v,u]);}this._updateRenderQueue(["lineTo",o,m]);}this._trackPos(o,m);
this._trackSize(f,f);this._draw();},end:function(){this._draw();this._initProps();return this;},_initProps:function(){var d=this._context;d.fillStyle="rgba(0, 0, 0, 1)";d.lineWidth=6;d.lineJoin="miter";d.miterLimit=3;this._strokeStyle="rgba(0, 0, 0, 1)";this._methods=[];this._width=0;this._height=0;this._left=0;this._top=0;this._right=0;this._bottom=0;this._x=0;this._y=0;this._fillType=null;this._stroke=null;this._bitmapFill=null;this._drawingComplete=false;this._lineToMethods=[];},_getFill:function(){var d=this._fillType,e;switch(d){case"linear":e=this._getLinearGradient("fill");break;case"radial":e=this._getRadialGradient("fill");break;case"bitmap":e=this._bitmapFill;break;case"solid":e=this._fillColor;break;}return e;},_getLinearGradient:function(k){var j="_"+k,q=this[j+"Colors"],v=this[j+"Ratios"],s=!isNaN(this._fillX)?this._fillX:this._shape.x,p=!isNaN(this._fillY)?this._fillY:this._shape.y,t=this._fillWidth||(this._shape.w),G=this._fillHeight||(this._shape.h),B=this._context,A=this[j+"Rotation"],E,C,D,o,u,n,H,F,g,e,f=s+t/2,d=p+G/2,m=Math.PI/180,z=parseFloat(parseFloat(Math.tan(A*m)).toFixed(8));if(Math.abs(z)*t/2>=G/2){if(A<180){g=p;e=p+G;}else{g=p+G;e=p;}H=f-((d-g)/z);F=f-((d-e)/z);}else{if(A>90&&A<270){H=s+t;F=s;}else{H=s;F=s+t;}g=((z*(f-H))-d)*-1;e=((z*(f-F))-d)*-1;}n=B.createLinearGradient(H,g,F,e);C=q.length;u=0;for(E=0;E<C;++E){D=q[E];o=v[E]||E/(C-1);n.addColorStop(o,D);u=(E+1)/C;}return n;},_getRadialGradient:function(p){var e="_"+p,d=this[e+"Colors"],m=this[e+"Ratios"],k,g,t=this._fillWidth||this._shape.w,n=this._fillHeight||this._shape.h,r=!isNaN(this._fillX)?this._fillX:this._shape.x,q=!isNaN(this._fillY)?this._fillY:this._shape.y,j,o,f,s,u=this._context;r+=t/2;q+=n/2;s=u.createRadialGradient(r,q,1,r,q,t/2);g=d.length;f=0;for(k=0;k<g;++k){j=d[k];o=m[k]||k/(g-1);s.addColorStop(o,j);}return s;},_draw:function(){if(this._drawingComplete||!this._shape){return;}var n,j,e=this._context,o,f=this._methods,g=0,m=this._lineToMethods,p=m.length,d,l,k=f?f.length:0;n=this._width+this._lineWidth;j=this._height+this._lineWidth;this.node.style.left=this._left+"px";this.node.style.top=this._top+"px";this.node.style.width=this._width+"px";this.node.style.height=this._height+"px";this._canvas.style.width=n+"px";this._canvas.style.height=j+"px";this._canvas.width=n;this._canvas.height=j;if(!k||k<1){return;}for(;g<p;++g){l=m[g];l[1]=l[1]-this._left;l[2]=l[2]-this._top;}for(g=0;g<k;++g){l=f[g];if(l&&l.length>0){d=l.shift();if(d){e[d].apply(e,l);}}}if(this._fillType){o=this._getFill();if(o){e.fillStyle=o;}e.closePath();}if(this._fillType){e.fill();}if(this._stroke){if(this._lineWidth){e.lineWidth=this._lineWidth;}e.strokeStyle=this._strokeStyle;e.stroke();}this._drawingComplete=true;},_drawingComplete:false,_reHex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,_2RGBA:function(e,d){d=(d!==undefined)?d:1;if(this._reHex.exec(e)){e="rgba("+[parseInt(RegExp.$1,16),parseInt(RegExp.$2,16),parseInt(RegExp.$3,16)].join(",")+","+d+")";}return e;},_createDummy:function(){var d=c.config.doc.createElement("div");d.style.height=0;d.style.width=0;d.style.overflow="hidden";c.config.doc.documentElement.appendChild(d);return d;},_createGraphic:function(d){var e=c.config.doc.createElement("canvas");e.width=600;e.height=600;return e;},_2RGB:function(d){this._dummy.style.background=d;return this._dummy.style.backgroundColor;},_trackSize:function(d,e){if(d>this._width){this._width=d;}if(e>this._height){this._height=e;}},_trackPos:function(d,e){if(d>this._x){this._x=d;}if(e>this._y){this._y=e;}},_updateShapeProps:function(d,g){var e,f;if(!this._shape){this._shape={};}if(!this._shape.x){this._shape.x=d;}else{this._shape.x=Math.min(this._shape.x,d);}if(!this._shape.y){this._shape.y=g;}else{this._shape.y=Math.min(this._shape.y,g);}e=Math.abs(d-this._shape.x);if(!this._shape.w){this._shape.w=e;}else{this._shape.w=Math.max(e,this._shape.w);}f=Math.abs(g-this._shape.y);if(!this._shape.h){this._shape.h=f;}else{this._shape.h=Math.max(f,this._shape.h);}},getShape:function(d){d.graphic=this;return new c.Shape(d);}};c.DrawingUtil=a;function b(d){this._dummy=this._createDummy();this._canvas=this._createGraphic();this.node=this._canvas;this._context=this._canvas.getContext("2d");this._initialize(d);this._validate();}c.extend(b,c.DrawingUtil,{type:"shape",autoSize:false,_initialize:function(d){this._canvas.style.position="absolute";if(d.graphic){d.graphic.node.appendChild(this._canvas);}this._setProps(d);},_setProps:function(d){this.autoSize=d.autoSize||this.autoSize;this.width=d.width||this.width;this.height=d.height||this.height;this.border=d.border||this.border;this.graphics=d.graphic||this.graphics;this.fill=d.fill||this.fill;this.type=d.shape||this.type;this.props=d.props||this.props;this.path=d.path||this.path;this.props=d.props||this.props;this.parentNode=this.graphics.node;},_validate:function(){var d=this.width,g=this.height,e=this.border,f=this.type,i=this.fill;this.clear();this.setSize(this.width,this.height);this._canvas.width=this.width;this._canvas.height=this.height;this._canvas.style.top="0px";this._canvas.style.left="0px";this._canvas.style.width=this.width+"px";this._canvas.style.height=this.height+"px";if(e&&e.weight&&e.weight>0){e.color=e.color||"#000";e.alpha=e.alpha||1;this.lineStyle(e.weight,e.color,e.alpha);}if(i.type==="radial"||i.type==="linear"){this.beginGradientFill(i);}else{if(i.type==="bitmap"){this.beginBitmapFill(i);}else{this.beginFill(i.color,i.alpha);}}switch(f){case"circle":this.drawEllipse(0,0,d,g);break;case"rect":this.drawRect(0,0,d,g);break;case"wedge":this.drawWedge(this.props);break;}return this;},update:function(d){this._setProps(d);this._validate();return this;},toggleVisible:function(e){var d=e?"visible":"hidden";if(this.node){this.node.style.visibility=d;}},setPosition:function(d,f){var e=c.one(this.parentNode);e.setStyle("position","absolute");e.setStyle("left",d);e.setStyle("top",f);},addClass:function(d){if(this.node){this.node.style.pointerEvents="painted";this.node.setAttribute("class",d);
}}});c.Shape=b;c.CanvasGraphic=c.Base.create("graphic",c.CanvasDrawingUtil,[],{autoSize:true,_trackSize:function(d,e){if(d>this._width){this._width=d;}if(e>this._height){this._height=e;}this.setSize(d,e);},setPosition:function(d,e){this.node.style.left=d+"px";this.node.style.top=e+"px";},render:function(d){d=d||c.config.doc.body;this.node=document.createElement("div");this.node.style.width=d.offsetWidth+"px";this.node.style.height=d.offsetHeight+"px";this.node.style.display="block";this.node.style.position="absolute";this.node.style.left=d.getStyle("left");this.node.style.top=d.getStyle("top");this.node.style.pointerEvents="none";d.appendChild(this.node);this.node.appendChild(this._canvas);this._canvas.width=d.offsetWidth>0?d.offsetWidth:1;this._canvas.height=d.offsetHeight>0?d.offsetHeight:1;this._canvas.style.position="absolute";return this;},toggleVisible:function(d){this.node.style.visibility=d?"visible":"hidden";},_createGraphicNode:function(d){var e=c.config.doc.createElement("canvas");e.style.pointerEvents=d||"none";if(!this._graphicsList){this._graphicsList=[];}this._graphicsList.push(e);return e;},destroy:function(){this._removeChildren(this.node);if(this.node&&this.node.parentNode){this.node.parentNode.removeChild(this.node);}},_removeChildren:function(d){if(d.hasChildNodes()){var e;while(d.firstChild){e=d.firstChild;this._removeChildren(e);d.removeChild(e);}}},node:null});c.Graphic=c.CanvasGraphic;},"@VERSION@",{skinnable:false,requires:["graphics"]});