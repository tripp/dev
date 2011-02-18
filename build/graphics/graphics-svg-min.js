YUI.add("graphics-svg",function(C){function A(){}A.prototype={curveTo:function(I,G,N,M,L,K){var E,J,H,D,F,O;if(this._pathType!=="C"){this._pathType="C";J=["C"];this._pathArray.push(J);}else{J=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!J){J=[];this._pathArray.push(J);}}E=this._pathArray.length-1;this._pathArray[E]=this._pathArray[E].concat([Math.round(I),Math.round(G),Math.round(N),Math.round(M),L,K]);H=Math.max(L,Math.max(I,N));F=Math.max(K,Math.max(G,M));D=Math.min(L,Math.min(I,N));O=Math.min(K,Math.min(G,M));this._trackSize(H,F);this._trackSize(D,O);},quadraticCurveTo:function(I,H,L,K){var E,J,G,D,F,M;if(this._pathType!=="Q"){this._pathType="Q";J=["Q"];this._pathArray.push(J);}else{J=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!J){J=[];this._pathArray.push(J);}}E=this._pathArray.length-1;this._pathArray[E]=this._pathArray[E].concat([Math.round(I),Math.round(H),Math.round(L),Math.round(K)]);G=Math.max(L,I);F=Math.max(K,H);D=Math.min(L,I);M=Math.min(K,H);this._trackSize(G,F);this._trackSize(D,M);},drawRect:function(D,G,E,F){this.moveTo(D,G);this.lineTo(D+E,G);this.lineTo(D+E,G+F);this.lineTo(D,G+F);this.lineTo(D,G);},drawRoundRect:function(D,I,E,G,F,H){this.moveTo(D,I+H);this.lineTo(D,I+G-H);this.quadraticCurveTo(D,I+G,D+F,I+G);this.lineTo(D+E-F,I+G);this.quadraticCurveTo(D+E,I+G,D+E,I+G-H);this.lineTo(D+E,I+H);this.quadraticCurveTo(D+E,I,D+E-F,I);this.lineTo(D+F,I);this.quadraticCurveTo(D,I,D,I+H);},drawWedge:function(F,I,H,G,E,D){this._drawingComplete=false;this.path=this._getWedgePath({x:F,y:I,startAngle:H,arc:G,radius:E,yRadius:D});},_getWedgePath:function(X){var N=X.x,K=X.y,S=X.startAngle,J=X.arc,F=X.radius,G=X.yRadius||F,R,P,I,W,H,O,M,V,U,E,D,T=0,L=F*2,Q=" M"+N+", "+K;if(Math.abs(J)>360){J=360;}R=Math.ceil(Math.abs(J)/45);P=J/R;I=-(P/180)*Math.PI;W=(S/180)*Math.PI;if(R>0){O=N+Math.cos(S/180*Math.PI)*F;M=K+Math.sin(S/180*Math.PI)*G;Q+=" L"+Math.round(O)+", "+Math.round(M);Q+=" Q";for(;T<R;++T){W+=I;H=W-(I/2);V=N+Math.cos(W)*F;U=K+Math.sin(W)*G;E=N+Math.cos(H)*(F/Math.cos(I/2));D=K+Math.sin(H)*(G/Math.cos(I/2));Q+=Math.round(E)+" "+Math.round(D)+" "+Math.round(V)+" "+Math.round(U)+" ";}Q+=" L"+N+", "+K;}this._trackSize(L,L);return Q;},lineTo:function(I,H,F){var E=arguments,G,D,K,J;this._pathArray=this._pathArray||[];if(typeof I==="string"||typeof I==="number"){E=[[I,H]];}D=E.length;this._shapeType="path";if(this._pathType!=="L"){this._pathType="L";J=["L"];this._pathArray.push(J);}else{J=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!J){J=[];this._pathArray.push(J);}}K=this._pathArray.length-1;for(G=0;G<D;++G){this._pathArray[K]=this._pathArray[K].concat([E[G][0],E[G][1]]);this._trackSize.apply(this,E[G]);}},moveTo:function(D,G){var F,E;this._pathArray=this._pathArray||[];if(this._pathType!="M"){this._pathType="M";E=["M"];this._pathArray.push(E);}else{E=this._pathArray[Math.max(0,this._pathArray.length-1)];if(!E){E=[];this._pathArray.push(E);}}F=this._pathArray.length-1;this._pathArray[F]=this._pathArray[F].concat([D,G]);this._trackSize(D,G);},end:function(){this._draw();},setSize:function(D,E){var F;if(this.get("autoSize")){F=this.get("node");if(D>F.getAttribute("width")){F.setAttribute("width",D);}if(E>F.getAttribute("height")){F.setAttribute("height",E);}}},_trackSize:function(D,E){var F=this.get("node");if(D>this._right){this._right=D;}if(D<this._left){this._left=D;}if(E<this._top){this._top=E;}if(E>this._bottom){this._bottom=E;}this._width=this._right-this._left;this._height=this._bottom-this._top;F.style.left=this._left+"px";F.style.top=this._top+"px";this.setSize(this._width,this._height);}};C.Drawing=A;C.Shape=C.Base.create("shape",C.Base,[],{initializer:function(){this.publish("shapeUpdate");this._addListeners();},_getNode:function(){var E=document.createElementNS("http://www.w3.org/2000/svg","svg:"+this._type),D=this.get("pointerEvents")||"none";E.setAttribute("pointer-events",D);E.setAttribute("class","yui3-"+this.name);E.setAttribute("id",this.get("id"));return E;},_addListeners:function(){this.after("initializedChange",this._updateHandler);this.after("strokeChange",this._updateHandler);this.after("fillChange",this._updateHandler);this.after("widthChange",this._updateHandler);this.after("heightChange",this._updateHandler);this.after("xChange",this._updateHandler);this.after("yChange",this._updateHandler);},_strokeChangeHandler:function(J){var F=this.get("node"),K=this.get("stroke"),L,E,H,G,I,D;if(K&&K.weight&&K.weight>0){L=K.alpha;E=K.dashstyle||"none";H=C.Lang.isArray(E)?E.toString():E;K.color=K.color||"#000000";K.weight=K.weight||1;K.alpha=C.Lang.isNumber(L)?L:1;K.linecap=K.linecap||"butt";F.setAttribute("stroke-dasharray",H);F.setAttribute("stroke",K.color);F.setAttribute("stroke-linecap",K.linecap);F.setAttribute("stroke-width",K.weight);F.setAttribute("stroke-opacity",K.alpha);}else{F.setAttribute("stroke","none");}},_fillChangeHandler:function(G){var E=this.get("node"),F=this.get("fill"),D;if(F){if(F.type==="linear"||F.type==="radial"){this.beginGradientFill(F);}else{if(F.type==="bitmap"){this.beginBitmapFill(F);}else{if(!F.color){E.setAttribute("fill","none");}else{D=F.alpha;F.alpha=C.Lang.isNumber(D)?D:1;E.setAttribute("fill",F.color);E.setAttribute("fill-opacity",D);}}}}else{E.setAttribute("fill","none");}},translate:function(D,E){this._translateX=D;this._translateY=E;this._translate.apply(this,arguments);},_translate:function(D,H){var F=this.get("node"),G="translate("+D+", "+H+")",E=F.getAttribute("transform");this._updateTransform("translate",/translate\(.*\)/,G);},skewX:function(D){var E="skewX("+D+")";this._updateTransform("skewX",/skewX\(.*\)/,E);},skewY:function(E){var D="skewY("+E+")";this._updateTransform("skewY",/skewY\(.*\)/,D);},rotate:function(G,H){var D=this.get("width")*0.5,F=this.get("height")*0.5;H=H||D+","+F;var E="rotate("+G+","+H+")";this._updateTransform("rotate",/rotate\(.*\)/,E);},scale:function(E){var D="scale("+E+")";this._updateTransform("scale",/scale\(.*\)/,D);},matrix:function(E,D,J,I,H,G){var F="matrix("+E+", "+D+", "+J+", "+I+", "+H+", "+G+")";
this._updateTransform("matrix",/matrix\(.*\)/,F);},_updateTransform:function(E,H,G){var F=this.get("node"),D=F.getAttribute("transform");if(D&&D.length>0){if(D.indexOf(E)>-1){D=D.replace(H,G);}else{D+=" "+G;}}else{D=G;}F.setAttribute("transform",D);this.fire("shapeUpdate");},_draw:function(){var D=this.get("node");D.setAttribute("width",this.get("width"));D.setAttribute("height",this.get("height"));D.style.left=this.get("x")+"px";D.style.top=this.get("y")+"px";this._fillChangeHandler();this._strokeChangeHandler();},_updateHandler:function(D){this._draw();this.fire("shapeUpdate");},_translateX:0,_translateY:0,getBounds:function(){var K=this.get("width"),G=this.get("height"),L=this.get("stroke"),J=this.get("x"),I=this.get("y"),H=0,F=this.get("translateX"),E=this.get("translateY"),D={};if(L&&L.weight){H=L.weight;}D.left=J-H+F;D.top=I-H+E;D.right=J+K+H+F;D.bottom=I+G+H+E;return D;}},{ATTRS:{node:{readOnly:true,valueFn:"_getNode"},id:{valueFn:function(){return C.guid();},setter:function(E){var D=this.get("node");D.setAttribute("id",E);return E;}},x:{value:0},y:{value:0},width:{},height:{},visible:{value:true,setter:function(E){var D=E?"visible":"hidden";this.get("node").style.visibility=D;return E;}},fill:{setter:function(E){var D=this.get("fill")||this._getAttrCfg("fill").defaultValue;return(E)?C.merge(D,E):null;}},stroke:{valueFn:function(){return{weight:1,dashstyle:null,color:"#000",alpha:1};},setter:function(E){var D=this.get("stroke")||this._getAttrCfg("stroke").defaultValue;return(E)?C.merge(D,E):null;}},autoSize:{value:false},pointerEvents:{value:"visiblePainted"},translateX:{getter:function(){return this._translateX;},setter:function(D){this._translateX=D;this._transform(D,this._translateY);return D;}},translateY:{getter:function(){return this._translateY;},setter:function(D){this._translateY=D;this._transform(this._translateX,D);return D;}},graphic:{setter:function(D){this.after("shapeUpdate",C.bind(D.updateCoordSpace,D));return D;}}}});C.Path=C.Base.create("path",C.Shape,[C.Drawing],{_left:0,_right:0,_top:0,_bottom:0,_type:"path",_draw:function(){var E=this._pathArray,K,D,N,F,M,L,P=this.get("path"),H=this.get("node"),J=this.get("translateX"),I=this.get("translateY"),G=this._left,O=this._top;while(E&&E.length>0){K=E.shift();N=K.length;D=K[0];P+=" "+D+(K[1]-G);switch(D){case"L":case"M":for(L=2;L<N;++L){F=(L%2===0)?O:G;F=K[L]-F;P+=", "+F;}break;case"Q":case"C":for(L=2;L<N;++L){F=(L%2===0)?O:G;M=K[L];M-=F;P+=" "+M;}break;}}if(this._fill){P+="z";}H.setAttribute("d",P);this._translate(G+J,O+I);this.set("path",P);this._fillChangeHandler();this._strokeChangeHandler();},translate:function(D,F){var E=this.get("node");this._translateX=D;this._translateY=F;this._translate(D,F);this._translate(this._left+D,this._top+F);},end:function(){this._draw();this.fire("shapeUpdate");},clear:function(){this._left=0;this._right=0;this._top=0;this._bottom=0;this.set("path","");},getBounds:function(){var E=0,G={},H=this.get("stroke"),F=this.get("translateX"),D=this.get("translateY");if(H&&H.weight){E=H.weight;}G.left=this._left-E-F;G.top=this._top-E-D;G.right=(this._right-this._left)+E-F;G.bottom=(this._bottom-this._top)+E-D;return G;}},{ATTRS:{path:{value:""},width:{getter:function(){var D=this._right,E=this._left,F=Math.max(this._right-this._left,0);return F;}},height:{getter:function(){return Math.max(this._bottom-this._top,0);}}}});C.Rect=C.Base.create("rect",C.Shape,[],{_type:"rect"});C.Ellipse=C.Base.create("ellipse",C.Shape,[],{_type:"ellipse",_draw:function(){var D=this.get("node"),L=this.get("width"),G=this.get("height"),K=this.get("x"),I=this.get("y"),J=L*0.5,H=G*0.5,F=K+J,E=I+H;D.setAttribute("rx",J);D.setAttribute("ry",H);D.setAttribute("cx",F);D.setAttribute("cy",E);this._fillChangeHandler();this._strokeChangeHandler();}},{ATTRS:{xRadius:{readOnly:true,getter:function(){var D=this.get("width");if(D){D*=0.5;}return D;}},yRadius:{readOnly:true,getter:function(){var D=this.get("height");if(D){D*=0.5;}return D;}},x:{lazyAdd:false,value:0},y:{lazyAdd:false}}});C.Circle=C.Base.create("circle",C.Shape,[],{_type:"circle",_addListeners:function(){C.Circle.superclass._addListeners.apply(this);this.after("radiusChange",this._updateHandler);},_draw:function(){var G=this.get("node"),F=this.get("x"),I=this.get("y"),E=this.get("radius"),D=F+E,H=I+E;G.setAttribute("r",E);G.setAttribute("cx",D);G.setAttribute("cy",H);this._fillChangeHandler();this._strokeChangeHandler();}},{ATTRS:{width:{readOnly:true,getter:function(){return this.get("radius")*2;}},height:{readOnly:true,getter:function(){return this.get("radius")*2;}},radius:{value:0}}});function B(D){this.initializer.apply(this,arguments);}B.prototype={autoSize:true,initializer:function(E){E=E||{};var D=E.width||0,F=E.height||0;this.id=C.guid();this.node=this._createGraphics();this.node.setAttribute("id",this.id);this.setSize(D,F);if(E.render){this.render(E.render);}},destroy:function(){this._removeChildren(this.node);if(this.node&&this.node.parentNode){this.node.parentNode.removeChild(this.node);}},_removeChildren:function(D){if(D.hasChildNodes()){var E;while(D.firstChild){E=D.firstChild;this._removeChildren(E);D.removeChild(E);}}},toggleVisible:function(D){this._toggleVisible(this.node,D);},_toggleVisible:function(H,I){var G=C.Selector.query(">/*",H),E=I?"visible":"hidden",F=0,D;if(G){D=G.length;for(;F<D;++F){this._toggleVisible(G[F],I);}}H.style.visibility=E;},clear:function(){if(this._graphicsList){while(this._graphicsList.length>0){this.node.removeChild(this._graphicsList.shift());}}},setSize:function(D,E){if(this.autoSize){if(D>this.node.getAttribute("width")){this.node.setAttribute("width",D);}if(E>this.node.getAttribute("height")){this.node.setAttribute("height",E);}}},_trackSize:function(D,E){if(D>this._right){this._right=D;}if(D<this._left){this._left=D;}if(E<this._top){this._top=E;}if(E>this._bottom){this._bottom=E;}this._width=this._right-this._left;this._height=this._bottom-this._top;this.node.style.left=this._left+"px";this.node.style.top=this._top+"px";
this.setSize(this._width,this._height);},render:function(G){var D=C.one(G),E=parseInt(D.getComputedStyle("width"),10),F=parseInt(D.getComputedStyle("height"),10);D=D||C.config.doc.body;D.appendChild(this.node);this.setSize(E,F);return this;},_createGraphics:function(){var D=this._createGraphicNode("svg");this._styleGroup(D);return D;},_styleGroup:function(D){D.style.position="absolute";D.style.top="0px";D.style.left="0px";D.style.overflow="auto";D.setAttribute("overflow","auto");D.setAttribute("pointer-events","none");},_createGraphicNode:function(F,D){var G=document.createElementNS("http://www.w3.org/2000/svg","svg:"+F),E=D||"none";if(F!=="defs"&&F!=="stop"&&F!=="linearGradient"){G.setAttribute("pointer-events",E);}return G;},addShape:function(D){var E=D.get("node");D.set("graphic",this);this.node.appendChild(E);if(!this._graphicsList){this._graphicsList=[];}if(!this._shapes){this._shapes={};}this._graphicsList.push(E);this._shapes[D.get("id")]=D;this.updateCoordSpace();},getShape:function(D){return this._shapes[D];},updateCoordSpace:function(I){var H,G=0,F,E=this._graphicsList,D=E.length;for(;G<D;++G){F=this.getShape(E[G].getAttribute("id"));H=F.getBounds();this._left=Math.min(this._left,H.left);this._top=Math.min(this._top,H.top);this._right=Math.max(this._right,H.right);this._bottom=Math.max(this._bottom,H.bottom);}this._width=this._right-this._left;this._height=this._bottom-this._top;this.node.setAttribute("width",this._width);this.node.setAttribute("height",this._height);this.node.style.width=this._width+"px";this.node.style.height=this._height+"px";this.node.style.left=this._left+"px";this.node.style.top=this._top+"px";this.node.setAttribute("viewBox",""+this._left+" "+this._top+" "+this._width+" "+this._height+"");},_left:0,_right:0,_top:0,_bottom:0};C.Graphic=B;},"@VERSION@",{requires:["graphics"],skinnable:false});