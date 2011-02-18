YUI.add("graphics-vml",function(D){var B=document.createStyleSheet();B.addRule(".vmlgroup","behavior:url(#default#VML)",B.rules.length);B.addRule(".vmlgroup","display:inline-block",B.rules.length);B.addRule(".vmlgroup","zoom:1",B.rules.length);B.addRule(".vmlshape","behavior:url(#default#VML)",B.rules.length);B.addRule(".vmlshape","display:inline-block",B.rules.length);B.addRule(".vmloval","behavior:url(#default#VML)",B.rules.length);B.addRule(".vmloval","display:inline-block",B.rules.length);B.addRule(".vmlrect","behavior:url(#default#VML)",B.rules.length);B.addRule(".vmlrect","display:block",B.rules.length);B.addRule(".vmlfill","behavior:url(#default#VML)",B.rules.length);B.addRule(".vmlstroke","behavior:url(#default#VML)",B.rules.length);function A(){}A.prototype={curveTo:function(G,F,I,H,E,J){this._path+=" c "+Math.round(G)+", "+Math.round(F)+", "+Math.round(I)+", "+Math.round(H)+", "+E+", "+J;this._trackSize(E,J);},quadraticCurveTo:function(I,H,E,L){var G=Math.max(E,I),F=Math.max(L,H),K=Math.min(E,I),J=Math.min(L,H);this._path+=" qb "+I+", "+H+", "+E+", "+L;this._trackSize(G,F);this._trackSize(K,J);},drawRect:function(E,H,F,G){this.moveTo(E,H);this.lineTo(E+F,H);this.lineTo(E+F,H+G);this.lineTo(E,H+G);this.lineTo(E,H);},drawRoundRect:function(E,J,F,H,G,I){this.moveTo(E,J+I);this.lineTo(E,J+H-I);this.quadraticCurveTo(E,J+H,E+G,J+H);this.lineTo(E+F-G,J+H);this.quadraticCurveTo(E+F,J+H,E+F,J+H-I);this.lineTo(E+F,J+I);this.quadraticCurveTo(E+F,J,E+F-G,J);this.lineTo(E+G,J);this.quadraticCurveTo(E,J,E,J+I);},drawWedge:function(G,K,I,H,F,E){var J=F*2;E=E||F;this._path+=this._getWedgePath({x:G,y:K,startAngle:I,arc:H,radius:F,yRadius:E});this._trackSize(J,J);},_getWedgePath:function(H){var G=H.x,L=H.y,J=H.startAngle,I=H.arc,F=H.radius,E=H.yRadius||F,K;if(Math.abs(I)>360){I=360;}J*=-65535;I*=65536;K=" m "+G+" "+L+" ae "+G+" "+L+" "+F+" "+E+" "+J+" "+I;return K;},end:function(){this._draw();},lineTo:function(J,I,G){var F=arguments,H,E;if(typeof J==="string"||typeof J==="number"){F=[[J,I]];}E=F.length;if(!this._path){this._path="";}this._path+=" l ";for(H=0;H<E;++H){this._path+=" "+Math.round(F[H][0])+", "+Math.round(F[H][1]);this._trackSize.apply(this,F[H]);}var K=this._path;return this;},moveTo:function(E,F){if(!this._path){this._path="";}this._path+=" m "+Math.round(E)+", "+Math.round(F);this._trackSize(E,F);},_trackSize:function(E,G){var H=this._width||0,F=this._height||0;if(E>H){this._width=E;}if(G>F){this._height=G;}}};D.Drawing=A;D.Shape=D.Base.create("shape",D.Base,[],{initializer:function(){this._addListeners();this._draw();},_getNode:function(){var E=this._createGraphicNode();E.setAttribute("id",this.get("id"));D.one(E).addClass("yui3-"+this.name);return E;},_addListeners:function(){this.after("strokeChange",this._strokeChangeHandler);this.after("fillChange",this._fillChangeHandler);},_strokeChangeHandler:function(L){var G=this.get("node"),M=this.get("stroke"),N,F,J="",E,H,I=0,K;if(M&&M.weight&&M.weight>0){N=M.alpha;F=M.dashstyle||"none";H=M.endcap||"flat";M.color=M.color||"#000000";M.weight=M.weight||1;M.alpha=D.Lang.isNumber(N)?N:1;G.stroked=true;G.endcap=H;G.strokeColor=M.color;G.strokeWeight=M.weight+"px";if(!this._strokeNode){this._strokeNode=this._createGraphicNode("stroke");G.appendChild(this._strokeNode);}this._strokeNode.opacity=M.alpha;if(D.Lang.isArray(F)){J=[];K=F.length;for(I=0;I<K;++I){E=F[I];J[I]=E/M.weight;}}this._strokeNode.dashstyle=J;}else{G.stroked=false;}},_fillChangeHandler:function(I){var G=this.get("node"),H=this.get("fill"),E,F;if(H){F=H.alpha;if(!H.color){G.filled=false;}else{if(D.Lang.isNumber(F)){F=Math.max(Math.min(F,1),0);if(!this._fillNode){this._fillNode=this._createGraphicNode("fill");G.appendChild(this._fillNode);}H.alpha=F;this._fillNode.opacity=F;this._fillNode.color=H.color;}else{if(this._fillNode){G.removeChild(this._fillNode);this._fillNode=null;}G.fillColor=H.color;}}}else{G.filled=false;}},translate:function(E,J){var I=this.get("node"),G=this.get("width"),H=this.get("height"),F=I.coordSize;E=0-(F.x/G*E);J=0-(F.y/H*J);I.coordOrigin=E+","+J;},skewX:function(E){},skewY:function(E){},rotate:function(F,G){var E=this.get("node");E.style.rotation=F;},scale:function(E){},matrix:function(F,E,J,I,H,G){},_draw:function(){var H=this.get("node"),E=this.get("x"),I=this.get("y"),F=this.get("width"),G=this.get("height");H.style.position="absolute";H.style.left=E+"px";H.style.top=I+"px";H.style.width=F+"px";H.style.height=G+"px";this._fillChangeHandler();this._strokeChangeHandler();},_createGraphicNode:function(E){E=E||this._type;return document.createElement("<"+E+' xmlns="urn:schemas-microsft.com:vml" class="vml'+E+'"/>');}},{ATTRS:{x:{value:0,setter:function(F){var E=this.get("node");E.style.left=F+"px";return F;}},y:{value:0,setter:function(F){var E=this.get("node");E.style.top=F+"px";return F;}},node:{readOnly:true,valueFn:"_getNode"},id:{valueFn:function(){return D.guid();},setter:function(F){var E=this.get("node");E.setAttribute("id",F);return F;}},width:{value:0,setter:function(F){var E=this.get("node");E.setAttribute("width",F);E.style.width=F+"px";return F;}},height:{value:0,setter:function(F){var E=this.get("node");E.setAttribute("height",F);E.style.height=F+"px";return F;}},visible:{value:true,setter:function(F){var E=F?"visible":"hidden";this.get("node").style.visibility=E;return F;}},fill:{setter:function(F){var E=this.get("fill")||this._getAttrCfg("fill").defaultValue;return(F)?D.merge(E,F):null;}},stroke:{valueFn:function(){return{weight:1,dashstyle:"none",color:"#000",alpha:1};},setter:function(F){var E=this.get("stroke")||this._getAttrCfg("stroke").defaultValue;return(F)?D.merge(E,F):null;}},autoSize:{value:false},pointerEvents:{value:"visiblePainted"}}});D.Path=D.Base.create("path",D.Shape,[D.Drawing],{_type:"shape",_draw:function(){var J=this.get("fill"),I=this.get("stroke"),G=this.get("node"),E=this.get("width"),F=this.get("height"),H=this.get("path");this._fillChangeHandler();this._strokeChangeHandler();if(H){if(J&&J.color){H+=" x";}if(I){H+=" e";
}}if(H){G.path=H;}if(E&&F){G.coordSize=E+", "+F;G.style.position="absolute";G.style.width=E+"px";G.style.height=F+"px";}this.set("path",H);},end:function(){this._draw();},clear:function(){this.set("path","");}},{ATTRS:{width:{getter:function(){return this._width;},setter:function(E){this._width=E;return E;}},height:{getter:function(){return this._height;},setter:function(E){this._height=E;return E;}},path:{getter:function(){return this._path;},setter:function(E){this._path=E;return E;}}}});D.Rect=D.Base.create("rect",D.Shape,[],{_type:"rect"});D.Ellipse=D.Base.create("ellipse",D.Shape,[],{_type:"oval"},{ATTRS:{xRadius:{lazyAdd:false,getter:function(){var E=this.get("width");E=Math.round((E/2)*100)/100;return E;},setter:function(F){var E=F*2;this.set("width",E);return F;}},yRadius:{lazyAdd:false,getter:function(){var E=this.get("height");E=Math.round((E/2)*100)/100;return E;},setter:function(F){var E=F*2;this.set("height",E);return F;}}}});D.Circle=D.Base.create("circle",D.Shape,[],{_type:"oval"},{ATTRS:{radius:{lazyAdd:false,value:0,setter:function(G){var F=this.get("node"),E=G*2;F.style.width=E+"px";F.style.height=E+"px";return G;}},width:{readOnly:true,getter:function(){var E=this.get("radius"),F=E&&E>0?E*2:0;return F;}},height:{readOnly:true,getter:function(){var E=this.get("radius"),F=E&&E>0?E*2:0;return F;}}}});var C=function(E){this.initializer.apply(this,arguments);};C.prototype={initializer:function(F){F=F||{};var E=F.width||0,G=F.height||0;this.id=D.guid();this.node=this._createGraphic();this.node.setAttribute("id",this.id);this.setSize(E,G);this._initProps();},clear:function(){this._path="";this._removeChildren(this.node);},destroy:function(){this._removeChildren(this.node);this.node.parentNode.removeChild(this.node);},_removeChildren:function(E){if(E.hasChildNodes()){var F;while(E.firstChild){F=E.firstChild;this._removeChildren(F);E.removeChild(F);}}},toggleVisible:function(E){this._toggleVisible(this.node,E);},_toggleVisible:function(I,J){var H=D.one(I).get("children"),F=J?"visible":"hidden",G=0,E;if(H){E=H.length;for(;G<E;++G){this._toggleVisible(H[G],J);}}I.style.visibility=F;},setSize:function(E,F){E=Math.round(E);F=Math.round(F);this.node.style.width=E+"px";this.node.style.height=F+"px";this.node.coordSize=E+" "+F;this._canvasWidth=E;this._canvasHeight=F;},setPosition:function(E,F){E=Math.round(E);F=Math.round(F);this.node.style.left=E+"px";this.node.style.top=F+"px";},render:function(E){var F=parseInt(E.getComputedStyle("width"),10),G=parseInt(E.getComputedStyle("height"),10);E=E||D.config.doc.body;E.appendChild(this.node);this.setSize(F,G);this._initProps();return this;},_trackSize:function(E,F){if(E>this._width){this._width=E;}if(F>this._height){this._height=F;}},_initProps:function(){this._fillColor=null;this._strokeColor=null;this._strokeOpacity=null;this._strokeWeight=0;this._fillProps=null;this._path="";this._width=0;this._height=0;this._x=0;this._y=0;this._fill=null;this._stroke=0;this._stroked=false;this._dashstyle=null;},_createGraphic:function(){var E=this._createGraphicNode("group");E.style.display="block";E.style.position="absolute";return E;},_createGraphicNode:function(E){return document.createElement("<"+E+' xmlns="urn:schemas-microsft.com:vml" class="vml'+E+'"/>');},addShape:function(E){var F=E.get("node");this.node.appendChild(F);if(!this._graphicsList){this._graphicsList=[];}if(!this._shapes){this._shapes={};}this._graphicsList.push(F);this._shapes[E.get("id")]=E;},getShape:function(E){return this._shapes[E];},addChild:function(E){this.node.appendChild(E);}};D.Graphic=C;},"@VERSION@",{requires:["graphics"],skinnable:false});