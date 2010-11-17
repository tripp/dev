YUI.add('graphics', function(Y) {

var Graphic = function(config) {
    
    this.initializer.apply(this, arguments);
};

Graphic.prototype = {
    autoSize: true,

    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        if(config.node)
        {
            this.node = config.node;
            this._styleGroup(this.node);
        }
        else
        {
            this.node = this._createGraphics();
            this.setSize(w, h);
        }
        this._initProps();
    },

    /** 
     *Specifies a bitmap fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginBitmapFill: function(config) {
       
        var fill = {};
        fill.src = config.bitmap.src;
        fill.type = "tile";
        this._fillProps = fill;
        if(!isNaN(config.tx) ||
            !isNaN(config.ty) ||
            !isNaN(config.width) ||
            !isNaN(config.height))
        {
            this._gradientBox = {
                tx:config.tx,
                ty:config.ty,
                width:config.width,
                height:config.height
            };
        }
        else
        {
            this._gradientBox = null;
        }
    },

    /**
     * Specifes a solid fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginFill: function(color, alpha) {
        if (color) {
            this._fillAlpha = alpha || 1;
            this._fillColor = color;
            this._fillType = 'solid';
            this._fill = 1;
        }
        return this;
    },
    
    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(config) {
        var alphas = config.alphas || [];
        if(!this._defs)
        {
            this._defs = this._createGraphicNode("defs");
            this.node.appendChild(this._defs);
        }
        this._fillAlphas = alphas;
        this._fillColors = config.colors;
        this._fillType =  config.type || "linear";
        this._fillRatios = config.ratios || [];
        this._fillRotation = config.rotation || 0;
        this._fillWidth = config.width || null;
        this._fillHeight = config.height || null;
        this._fillX = !isNaN(config.tx) ? config.tx : NaN;
        this._fillY = !isNaN(config.ty) ? config.ty : NaN;
        this._gradientId = "lg" + Math.round(100000 * Math.random());
        return this;
    },

    /**
     * Removes all nodes
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        this.node.parentNode.removeChild(this.node);
    },
    
    /**
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },

    toggleVisible: function(val)
    {
        this._toggleVisible(this.node, val);
    },

    _toggleVisible: function(node, val)
    {
        var children = Y.one(node).get("children"),
            visibility = val ? "visible" : "hidden",
            i = 0,
            len;
        if(children)
        {
            len = children.length;
            for(; i < len; ++i)
            {
                this._toggleVisible(children[i], val);
            }
        }
        node.style.visibility = visibility;
    },

    /**
     * Clears the graphics object.
     */
    clear: function() {
        if(this._graphicsList)
        {
            while(this._graphicsList.length > 0)
            {
                this.node.removeChild(this._graphicsList.shift());
            }
        }
        this.path = '';
    },

    /**
     * Draws a bezier curve
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._shapeType = "path";
        if(this.path.indexOf("C") < 0 || this._pathType !== "C")
        {
            this._pathType = "C";
            this.path += ' C';
        }
        this.path += Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y + " ";
        this._trackSize(x, y);
    },

    /**
     * Draws a quadratic bezier curve
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        if(this.path.indexOf("Q") < 0 || this._pathType !== "Q")
        {
            this._pathType = "Q";
            this.path += " Q";
        }
        this.path +=  Math.round(cpx) + " " + Math.round(cpy) + " " + Math.round(x) + " " + Math.round(y);
    },

    /**
     * Draws a circle
     */
	drawCircle: function(x, y, r) {
        this._shape = {
            x:x - r,
            y:y - r,
            w:r * 2,
            h:r * 2
        };
        this._attributes = {cx:x, cy:y, r:r};
        this._width = this._height = r * 2;
        this._x = x - r;
        this._y = y - r;
        this._shapeType = "circle";
        this._draw();
	},

    /**
     * Draws an ellipse
     */
    drawEllipse: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._width = w;
        this._height = h;
        this._x = x;
        this._y = y;
        this._shapeType = "ellipse";
        this._draw();
    },

    /**
     * Draws a rectangle
     */
    drawRect: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this._draw();
    },

    /**
     * Draws a rectangle with rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        this._draw();
	},

    /**
     * @private
     * Draws a wedge.
     * 
     * @param x				x component of the wedge's center point
     * @param y				y component of the wedge's center point
     * @param startAngle	starting angle in degrees
     * @param arc			sweep of the wedge. Negative values draw clockwise.
     * @param radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param yRadius		[optional] y radius for wedge.
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        this._drawingComplete = false;
        this.path = this._getWedgePath({x:x, y:y, startAngle:startAngle, arc:arc, radius:radius, yRadius:yRadius});
        this._width = radius * 2;
        this._height = this._width;
        this._shapeType = "path";
        this._draw();

    },

    end: function() {
        if(this._shapeType)
        {
            this._draw();
        }
        this._initProps();
    },

    /**
     * @private
     * Not implemented
     * Specifies a gradient to use for the stroke when drawing lines.
     */
    lineGradientStyle: function() {
    },
     
    /**
     * Specifies a line style used for subsequent calls to drawing methods
     */
    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        this._stroke = 1;
        this._strokeWeight = thickness;
        if (color) {
            this._strokeColor = color;
        }
        this._strokeAlpha = alpha || 1;
    },
    
    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments,
            i,
            len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        this._shapeType = "path";
        if(!this.path.length)
        {
            this.path = "";
        }
        if(this.path.indexOf("L") < 0 || this._pathType !== "L")
        {
            this._pathType = "L";
            this.path += ' L';
        }
        for (i = 0; i < len; ++i) {
            this.path += args[i][0] + ', ' + args[i][1] + " ";

            this._trackSize.apply(this, args[i]);
        }
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     */
    moveTo: function(x, y) {
        this._pathType = "M";
        if(!this.path)
        {
            this.path = "";
        }
        this.path += ' M' + x + ', ' + y;
    },

    /**
     * @private
     * @description Generates a path string for a wedge shape
     */
    _getWedgePath: function(config)
    {
        var x = config.x,
            y = config.y,
            startAngle = config.startAngle,
            arc = config.arc,
            radius = config.radius,
            yRadius = config.yRadius || radius,
            segs,
            segAngle,
            theta,
            angle,
            angleMid,
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            i = 0,
            path = ' M' + x + ', ' + y;  
        
        // limit sweep to reasonable numbers
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        
        // First we calculate how many segments are needed
        // for a smooth arc.
        segs = Math.ceil(Math.abs(arc) / 45);
        
        // Now calculate the sweep of each segment.
        segAngle = arc / segs;
        
        // The math requires radians rather than degrees. To convert from degrees
        // use the formula (degrees/180)*Math.PI to get radians.
        theta = -(segAngle / 180) * Math.PI;
        
        // convert angle startAngle to radians
        angle = (startAngle / 180) * Math.PI;
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(startAngle / 180 * Math.PI) * yRadius;
            path += " L" + Math.round(ax) + ", " +  Math.round(ay);
            path += " Q";
            for(; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                path +=  Math.round(cx) + " " + Math.round(cy) + " " + Math.round(bx) + " " + Math.round(by) + " ";
            }
            path += ' L' + x + ", " + y;
        }
        return path;
    },

    /**
     * Sets the size of the graphics object
     */
    setSize: function(w, h) {
        if(this.autoSize)
        {
            var oldWidth = this.node.getAttribute("width");
            var oldHeight = this.node.getAttribute("height");
            if(w > this.node.getAttribute("width") || !this.node.getAttribute("width"))
            {
                this.node.setAttribute("width",  w);
                this.node.style.width = w + "px";
            }
            if(h > this.node.getAttribute("height") || !this.node.getAttribute("height"))
            {
                this.node.setAttribute("height", h);
                this.node.style.height = h + "px";
            }
        }
    },

    /**
     * @private
     * Updates the size of the graphics object
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
        this.setSize(w, h);
    },

    setPosition: function(x, y)
    {
        this.node.setAttribute("x", x);
        this.node.setAttribute("y", y);
    },

    /**
     * @private
     */
    render: function(parentNode) {
        var w = parentNode.get("width") || parentNode.get("offsetWidth"),
            h = parentNode.get("height") || parentNode.get("offsetHeight");
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        this._initProps();
        return this;
    },

    /**
     * @private
     * Clears the properties
     */
    _initProps: function() {
        this._shape = null;
        this._fillColor = null;
        this._strokeColor = null;
        this._strokeWeight = 0;
        this._fillProps = null;
        this._fillAlphas = null;
        this._fillColors = null;
        this._fillType =  null;
        this._fillRatios = null;
        this._fillRotation = null;
        this._fillWidth = null;
        this._fillHeight = null;
        this._fillX = NaN;
        this._fillY = NaN;
        this.path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._fill = null;
        this._stroke = 0;
        this._stroked = false;
        this._pathType = null;
        this._attributes = {};
    },

    /**
     * @private
     * Clears path properties
     */
    _clearPath: function()
    {
        this._shape = null;
        this._shapeType = null;
        this.path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._pathType = null;
        this._attributes = {};
    },

    /**
     * @private 
     * Completes a vml shape
     */
    _draw: function()
    {
        var shape = this._createGraphicNode(this._shapeType, "visiblePainted"),
            i,
            gradFill;
        if(this.path)
        {
            if(this._fill)
            {
                this.path += 'z';
            }
            shape.setAttribute("d", this.path);
        }
        else
        {
            for(i in this._attributes)
            {
                if(this._attributes.hasOwnProperty(i))
                {
                    shape.setAttribute(i, this._attributes[i]);
                }
            }
        }
        shape.setAttribute("stroke-width",  this._strokeWeight);
        if(this._strokeColor)
        {
            shape.setAttribute("stroke", this._strokeColor);
            shape.setAttribute("stroke-opacity", this._strokeAlpha);
        }
        if(!this._fillType || this._fillType === "solid")
        {
            if(this._fillColor)
            {
               shape.setAttribute("fill", this._fillColor);
               shape.setAttribute("fill-opacity", this._fillAlpha);
            }
            else
            {
                shape.setAttribute("fill", "none");
            }
        }
        else if(this._fillType === "linear")
        {
            gradFill = this._getFill();
            gradFill.setAttribute("id", this._gradientId);
            this._defs.appendChild(gradFill);
            shape.setAttribute("fill", "url(#" + this._gradientId + ")");

        }
        this.node.appendChild(shape);
        this._clearPath();
    },

    /**
     * @private
     * Returns ths actual fill object to be used in a drawing or shape
     */
    _getFill: function() {
        var type = this._fillType,
            fill;

        switch (type) {
            case 'linear': 
                fill = this._getLinearGradient('fill');
                break;
            case 'radial': 
                //fill = this._getRadialGradient('fill');
                break;
            case 'bitmap':
                //fill = this._bitmapFill;
                break;
        }
        return fill;
    },

    /**
     * @private
     * Returns a linear gradient fill
     */
    _getLinearGradient: function(type) {
        var fill = this._createGraphicNode("linearGradient"),
            prop = '_' + type,
            colors = this[prop + 'Colors'],
            ratios = this[prop + 'Ratios'],
            alphas = this[prop + 'Alphas'],
            w = this._fillWidth || (this._shape.w),
            h = this._fillHeight || (this._shape.h),
            r = this[prop + 'Rotation'],
            i,
            l,
            color,
            ratio,
            alpha,
            def,
            stop,
            x1, x2, y1, y2,
            cx = w/2,
            cy = h/2,
            radCon,
            tanRadians;
        /*
        if(r > 0 && r < 90)
        {
            r *= h/w;
        }
        else if(r > 90 && r < 180)
        {

            r =  90 + ((r-90) * w/h);
        }
*/
        radCon = Math.PI/180;
        tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));
        if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            if(r < 180)
            {
                y1 = 0;
                y2 = h;
            }
            else
            {
                y1 = h;
                y2 = 0;
            }
            x1 = cx - ((cy - y1)/tanRadians);
            x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            if(r > 90 && r < 270)
            {
                x1 = w;
                x2 = 0;
            }
            else
            {
                x1 = 0;
                x2 = w;
            }
            y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        /*
        fill.setAttribute("spreadMethod", "pad");
        
        fill.setAttribute("x1", Math.round(100 * x1/w) + "%");
        fill.setAttribute("y1", Math.round(100 * y1/h) + "%");
        fill.setAttribute("x2", Math.round(100 * x2/w) + "%");
        fill.setAttribute("y2", Math.round(100 * y2/h) + "%");
        */
        fill.setAttribute("gradientTransform", "rotate(" + r + ")");//," + (w/2) + ", " + (h/2) + ")");
        fill.setAttribute("width", w);
        fill.setAttribute("height", h);
        fill.setAttribute("gradientUnits", "userSpaceOnUse");
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i)
        {
            color = colors[i];
            ratio = ratios[i] || i/(l - 1);
            ratio = Math.round(ratio * 100) + "%";
            alpha = alphas[i] || "1";
            def = (i + 1) / l;
            stop = this._createGraphicNode("stop");
            stop.setAttribute("offset", ratio);
            stop.setAttribute("stop-color", color);
            stop.setAttribute("stop-opacity", alpha);
            fill.appendChild(stop);
        }
        return fill;
    },

    /**
     * @private
     * Creates a group element
     */
    _createGraphics: function() {
        var group = this._createGraphicNode("svg");
        this._styleGroup(group);
        return group;
    },

    _styleGroup: function(group)
    {
        group.style.position = "absolute";
        group.style.top = "0px";
        group.style.overflow = "visible";
        group.style.left = "0px";
        group.setAttribute("pointer-events", "none");
    },

    /**
     * @private
     * Creates a vml node.
     */
    _createGraphicNode: function(type, pe)
    {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        if(type !== "defs" && type !== "stop" && type !== "linearGradient")
        {
            node.setAttribute("pointer-events", v);
        }
        if(type != "svg")
        {
            if(!this._graphicsList)
            {
                this._graphicsList = [];
            }
            this._graphicsList.push(node);
        }
        return node;
    },

    /**
     * Returns a shape.
     */
    getShape: function(config) {
        if(!config)
        {
            config = {};
        }
        config.graphic = this;
        return new Y.Shape(config); 
    }

};
Y.Graphic = Graphic;

var VMLGraphics = function(config) {
    
    this.initializer.apply(this, arguments);
};

VMLGraphics.prototype = {
    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.node = this._createGraphics();
        this.setSize(w, h);
        this._initProps();
    },

    /** 
     *Specifies a bitmap fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginBitmapFill: function(config) {
       
        var fill = {};
        fill.src = config.bitmap.src;
        fill.type = "tile";
        this._fillProps = fill;
        if(!isNaN(config.tx) ||
            !isNaN(config.ty) ||
            !isNaN(config.width) ||
            !isNaN(config.height))
        {
            this._gradientBox = {
                tx:config.tx,
                ty:config.ty,
                width:config.width,
                height:config.height
            };
        }
        else
        {
            this._gradientBox = null;
        }
    },

    /**
     * Specifes a solid fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginFill: function(color, alpha) {
        if (color) {
            if (alpha) {
                this._fillProps = {
                    type:"solid",
                    opacity: alpha
                };
            }
            this._fillColor = color;
            this._fill = 1;
        }
        return this;
    },

    /** 
     *Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
     */
    beginGradientFill: function(config) {
        var type = config.type,
            colors = config.colors,
            alphas = config.alphas || [],
            ratios = config.ratios || [],
            fill = {
                colors:colors,
                ratios:ratios
            },
            len = alphas.length,
            i = 0,
            alpha,
            oi,
            rotation = config.rotation || 0;
    
        for(;i < len; ++i)
        {
            alpha = alphas[i];
            oi = i > 0 ? i + 1 : "";
            alphas[i] = Math.round(alpha * 100) + "%";
            fill["opacity" + oi] = alphas[i];
        }
        if(type === "linear")
        {
            if(config)
            {
            }
            if(rotation > 0 && rotation <= 90)
            {
                rotation = 450 - rotation;
            }
            else if(rotation <= 270)
            {
                rotation = 270 - rotation;
            }
            else if(rotation <= 360)
            {
                rotation = 630 - rotation;
            }
            else
            {
                rotation = 270;
            }
            fill.type = "gradientunscaled";
            fill.angle = rotation;
        }
        else if(type === "radial")
        {
            fill.alignshape = false;
            fill.type = "gradientradial";
            fill.focus = "100%";
            fill.focusposition = "50%,50%";
        }
        fill.ratios = ratios || [];
        
        if(!isNaN(config.tx) ||
            !isNaN(config.ty) ||
            !isNaN(config.width) ||
            !isNaN(config.height))
        {
            this._gradientBox = {
                tx:config.tx,
                ty:config.ty,
                width:config.width,
                height:config.height
            };
        }
        else
        {
            this._gradientBox = null;
        }
        this._fillProps = fill;
    },

    /**
     * Clears the graphics object.
     */
    clear: function() {
        this._path = '';
        this._removeChildren(this.node);
    },

    /**
     * Removes all nodes
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        this.node.parentNode.removeChild(this.node);
    },

    /**
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },

    toggleVisible: function(val)
    {
        this._toggleVisible(this.node, val);
    },

    _toggleVisible: function(node, val)
    {
        var children = Y.one(node).get("children"),
            visibility = val ? "visible" : "hidden",
            i = 0,
            len;
        if(children)
        {
            len = children.length;
            for(; i < len; ++i)
            {
                this._toggleVisible(children[i], val);
            }
        }
        node.style.visibility = visibility;
    },

    /**
     * Draws a bezier curve
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._shape = "shape";
        this._path += ' c ' + Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y;
        this._trackSize(x, y);
    },

    /**
     * Draws a quadratic bezier curve
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        this._path += ' qb ' + cpx + ", " + cpy + ", " + x + ", " + y;
    },

    /**
     * Draws a circle
     */
	drawCircle: function(x, y, r) {
        this._width = this._height = r * 2;
        this._x = x - r;
        this._y = y - r;
        this._shape = "oval";
        //this._path += ' ar ' + this._x + ", " + this._y + ", " + (this._x + this._width) + ", " + (this._y + this._height) + ", " + this._x + " " + this._y + ", " + this._x + " " + this._y;
        this._draw();
	},

    /**
     * Draws an ellipse
     */
    drawEllipse: function(x, y, w, h) {
        this._width = w;
        this._height = h;
        this._x = x;
        this._y = y;
        this._shape = "oval";
        //this._path += ' ar ' + this._x + ", " + this._y + ", " + (this._x + this._width) + ", " + (this._y + this._height) + ", " + this._x + " " + this._y + ", " + this._x + " " + this._y;
        this._draw();
    },

    /**
     * Draws a rectangle
     */
    drawRect: function(x, y, w, h) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this._draw();
    },

    /**
     * Draws a rectangle with rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        this._draw();
	},

    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        this._drawingComplete = false;
        this._width = radius;
        this._height = radius;
        yRadius = yRadius || radius;
        this._path += this._getWedgePath({x:x, y:y, startAngle:startAngle, arc:arc, radius:radius, yRadius:yRadius});
        this._width = radius * 2;
        this._height = this._width;
        this._shape = "shape";
        this._draw();
    },

    /**
     * @private
     * @description Generates a path string for a wedge shape
     */
    _getWedgePath: function(config)
    {
        var x = config.x,
            y = config.y,
            startAngle = config.startAngle,
            arc = config.arc,
            radius = config.radius,
            yRadius = config.yRadius || radius,
            path;  
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        startAngle *= -65535;
        arc *= 65536;
        path = " m " + x + " " + y + " ae " + x + " " + y + " " + radius + " " + yRadius + " " + startAngle + " " + arc;
        return path;
    },
    
    end: function() {
        if(this._shape)
        {
            this._draw();
        }
        this._initProps();
    },

    /**
     * @private
     * Not implemented
     * Specifies a gradient to use for the stroke when drawing lines.
     */
    lineGradientStyle: function() {
    },
    
    /**
     * Specifies a line style used for subsequent calls to drawing methods
     */
    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        this._stroke = 1;
        this._strokeWeight = thickness * 0.7;
        this._strokeColor = color;
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments,
            i,
            len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        this._shape = "shape";
        this._path += ' l ';
        for (i = 0; i < len; ++i) {
            this._path += ' ' + Math.round(args[i][0]) + ', ' + Math.round(args[i][1]);
            this._trackSize.apply(this, args[i]);
        }
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     */
    moveTo: function(x, y) {
        if(!this._path)
        {
            this._path = "";
        }
        this._path += ' m ' + Math.round(x) + ', ' + Math.round(y);
    },

    /**
     * Sets the size of the graphics object
     */
    setSize: function(w, h) {
        w = Math.round(w);
        h = Math.round(h);
        this.node.style.width = w + 'px';
        this.node.style.height = h + 'px';
        this.node.coordSize = w + ' ' + h;
        this._canvasWidth = w;
        this._canvasHeight = h;
    },
   
    setPosition: function(x, y)
    {
        x = Math.round(x);
        y = Math.round(y);
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /**
     * @private
     */
    render: function(parentNode) {
        var w = Math.max(parentNode.offsetWidth || 0, this._canvasWidth),
            h = Math.max(parentNode.offsetHeight || 0, this._canvasHeight);
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        this._initProps();
        return this;
    },

    /**
     * @private
     * Reference to current vml shape
     */
    _shape: null,

    /**
     * @private
     * Updates the size of the graphics object
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
    },

    /**
     * @private
     * Clears the properties
     */
    _initProps: function() {
        this._fillColor = null;
        this._strokeColor = null;
        this._strokeWeight = 0;
        this._fillProps = null;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._fill = null;
        this._stroke = 0;
        this._stroked = false;
    },

    /**
     * @private
     * Clears path properties
     */
    _clearPath: function()
    {
        this._shape = null;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
    },

    /**
     * @private 
     * Completes a vml shape
     */
    _draw: function()
    {
        var shape = this._createGraphicNode(this._shape),
            w = Math.round(this._width),
            h = Math.round(this._height),
            fillProps = this._fillProps;
            this.setSize(w, h);
        if(this._path)
        {
            if(this._fill || this._fillProps)
            {
                this._path += ' x';
            }
            if(this._stroke)
            {
                this._path += ' e';
            }
            //shape.path = this._path;
            shape.setAttribute("path", this._path);
            shape.coordSize = w + ', ' + h;
        }
        else
        {
            shape.style.display = "block";
            shape.style.position = "absolute";
            shape.style.left = this._x + "px";
            shape.style.top = this._y + "px";
        }
        
        if (this._fill) {
            shape.fillColor = this._fillColor;
        }
        else
        {
            shape.filled = false;
        }
        if (this._stroke && this._strokeWeight > 0) {
      //      shape.strokeColor = this._strokeColor;
        //    shape.strokeWeight = this._strokeWeight;
                shape.setAttribute("strokeColor", this._strokeColor);
                shape.setAttribute("strokeWeight", this._strokeWeight);
        } else {
            shape.stroked = false;
        }
        shape.style.width = w + 'px';
        shape.style.height = h + 'px';
        if (fillProps) {
            shape.filled = true;
            shape.appendChild(this._getFill());
        }
        this.node.appendChild(shape);
        this._clearPath();
    },

    /**
     * @private
     * Returns ths actual fill object to be used in a drawing or shape
     */
    _getFill: function() {
        var fill = this._createGraphicNode("fill"),
            w = this._width,
            h = this._height,
            fillProps = this._fillProps,
            prop,
            pct,
            i = 0,
            colors,
            colorstring = "",
            len,
            ratios,
            hyp = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)),
            cx = 50,
            cy = 50;
        if(this._gradientBox)
        {
            cx= Math.round( (this._gradientBox.width/2 - ((this._x - this._gradientBox.tx) * hyp/w))/(w * w/hyp) * 100);
            cy = Math.round( (this._gradientBox.height/2 - ((this._y - this._gradientBox.ty) * hyp/h))/(h * h/hyp) * 100);
            fillProps.focussize = (this._gradientBox.width/w)/10 + " " + (this._gradientBox.height/h)/10;
        }
        if(fillProps.colors)
        {
            colors = fillProps.colors.concat();
            ratios = fillProps.ratios.concat();
            len = colors.length;
            for(;i < len; ++i) {
                pct = ratios[i] || i/(len-1);
                pct = Math.round(100 * pct) + "%";
                colorstring += ", " + pct + " " + colors[i];
            }
            if(parseInt(pct, 10) < 100)
            {
                colorstring += ", 100% " + colors[len-1];
            }
        }
        for (prop in fillProps) {
            if(fillProps.hasOwnProperty(prop)) {
                fill.setAttribute(prop, fillProps[prop]);
           }
        }
        fill.colors = colorstring.substr(2);
        if(fillProps.type === "gradientradial")
        {
            fill.focusposition = cx + "%," + cy + "%";
        }
        return fill;
    },

    /**
     * @private
     * Creates a group element
     */
    _createGraphics: function() {
        var group = this._createGraphicNode("group");
        group.style.display = "inline-block";
        group.style.position = 'absolute';
        return group;
    },

    /**
     * @private
     * Creates a vml node.
     */
    _createGraphicNode: function(type)
    {
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
    
    },
    
    _getNodeShapeType: function(type)
    {
        var shape = "shape";
        if(this._typeConversionHash.hasOwnProperty(type))
        {
            shape = this._typeConversionHash[type];
        }
        return shape;
    },

    _typeConversionHash: {
        circle: "oval",
        ellipse: "oval",
        rect: "rect"
    },
    
    /**
     * Returns a shape.
     */
    getShape: function(config) {
        if(!config)
        {
            config = {};
        }
        config.graphic = this;
        return new Y.Shape(config); 
    },

    addChild: function(child)
    {
        this.node.appendChild(child);
    }
};

if (Y.UA.ie) {
    var sheet = document.createStyleSheet();
    sheet.addRule(".vmlgroup", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmlgroup", "display:inline-block", sheet.rules.length);
    sheet.addRule(".vmlgroup", "zoom:1", sheet.rules.length);
    sheet.addRule(".vmlshape", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmlshape", "display:inline-block", sheet.rules.length);
    sheet.addRule(".vmloval", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmloval", "display:inline-block", sheet.rules.length);
    sheet.addRule(".vmlrect", "behavior:url(#default#VML)", sheet.rules.length);
    sheet.addRule(".vmlrect", "display:block", sheet.rules.length);
    sheet.addRule(".vmlfill", "behavior:url(#default#VML)", sheet.rules.length);
    Y.Graphic = VMLGraphics;
}
else
{
    var UID = '_yuid',
        NODE_NAME = 'nodeName',
        _addClass = Y.Node.prototype.addClass,
        node_toString = Y.Node.prototype.toString,
        nodeList_toString = Y.NodeList.prototype.toString;
    Y.Node.prototype.addClass = function(className) {
       var node = this._node;
       if(node.tagName.indexOf("svg") > -1)
       {    
            if(node.className && node.className.baseVal)
            {
                node.className.baseVal = Y.Lang.trim([node.className.baseVal, className].join(' '));
            }
            else
            {
                node.setAttribute("class", className);
            }
        }
        else
        {
            _addClass.apply(this, arguments);
        }
        return this;
    };

    Y.Node.prototype.toString = function() {
        var node = this._node,
            str;
        if(node && node.className && node.className.baseVal)
        {
            if(typeof node.className.baseVal == "string")
            {
                str = node[NODE_NAME] + "." + node.className.baseVal.replace(' ', '.');
            }
            else
            {
                str = this[UID] + ': not bound to any nodes';
            }
        }
        else
        {
            str = node_toString.apply(this, arguments);
        }
        return str;
    };

    Y.NodeList.prototype.toString = function() {
        var nodes = this._nodes,
            node,
            str;
        if (nodes && nodes[0]) {
            node = nodes[0];
        }    
        if(node && node.className && node.className.baseVal)
        {
            if(typeof node.className.baseVal == "string")
            {
                str = node[NODE_NAME];
                if(node.id)
                {
                    str += "#" + node.id;
                }
                str += "." + node.className.baseVal.replace(' ', '.');
            }
            else
            {
                str = this[UID] + ': not bound to any nodes';
            }
        }
        else
        {
            str = nodeList_toString.apply(this, arguments);
        }
        return str;
    };

    Y.NodeList.importMethod(Y.Node.prototype, ['addClass']);
}

function Shape(cfg)
{
    this._initialize(cfg);
    this._draw();
}

Y.extend(Shape, Y.Graphic, {
    type: "path",

    autoSize: false,

    width: 0,

    height: 0,

    pointerEvents: "visiblePainted", 

    _initialize: function(cfg) 
    {
        if(!cfg.graphic)
        {
            cfg.graphic = new Y.Graphic();
        }
        this._setProps(cfg);
    },
  
    _setProps: function(cfg)
    {
        this.autoSize = cfg.autoSize || this.autoSize; 
        this.pointerEvents = cfg.pointerEvents || this.pointerEvents;
        this.width = cfg.width || this.width;
        this.height = cfg.height || this.height;
        this.border = cfg.border || this.border;
        this.graphics = cfg.graphic || this.graphics;
        this.canvas = this.graphics;
        this.parentNode = this.graphics.node;
        this.fill = cfg.fill || this.fill;
        this.type = cfg.shape || this.type;
        this.nodetype = this._getNodeShapeType(this.type); 
        this.props = cfg.props || this.props;
        this.path = cfg.path || this.path;
    },

    _draw: function()
    {
        var cx,
            cy,
            rx,
            ry,
            parentNode = this.parentNode,
            borderWeight = 0,
            fillWidth = this.width || 0,
            fillHeight = this.height || 0;
        if(!this.node)
        {
            this.node = this._createGraphicNode(this.nodetype, this.pointerEvents);
            parentNode.appendChild(this.node);
        }
        if(this.nodetype == "path")
        {
            if(this.type == "wedge")
            {
                this.path = this._getWedgePath(this.props);
                this._setPath();
            }
        }
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            borderWeight = this.border.weight;
            fillWidth -= borderWeight * 2;
            fillHeight -= borderWeight * 2;
        }
        this._addBorder();
        if(this.nodetype === "ellipse")
        {
            rx = cx = this.width/2;
            ry = cy = this.height/2;
            rx -= borderWeight;
            ry -= borderWeight;
            this.node.setAttribute("cx", cx);
            this.node.setAttribute("cy", cy);
            this.node.setAttribute("rx", rx);
            this.node.setAttribute("ry", ry);
        }
        else
        {
            this.node.setAttribute("width", fillWidth);
            this.node.setAttribute("height", fillHeight);
            this.node.style.width = fillWidth + "px";
            this.node.style.height = fillHeight + "px";
        }
        this._addFill();
        parentNode.style.width = this.width + "px";
        parentNode.style.height = this.height + "px";
        parentNode.setAttribute("width", this.width);
        parentNode.setAttribute("height", this.height);
        this.node.style.visibility = "visible";
        this.node.setAttribute("x", borderWeight); 
        this.node.setAttribute("y", borderWeight); 
        return this;       
    },

    _setPath: function()
    {
        if(this.path)
        {
            this.path += " Z";
            this.node.setAttribute("d", this.path);
        }
    },

    _addBorder: function()
    {
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            this.border.color = this.border.color || "#000000";
            this.border.weight = this.border.weight || 1;
            this.border.alpha = this.border.alpha || 1;
            this.border.linecap = this.border.linecap || "square";
            this.node.setAttribute("stroke", this.border.color);
            this.node.setAttribute("stroke-linecap", this.border.linecap);
            this.node.setAttribute("stroke-width",  this.border.weight);
            this.node.setAttribute("stroke-opacity", this.border.alpha);
        }
        else
        {
            this.node.setAttribute("stroke", "none");
        }
    },

    _addFill: function()
    {
        if(this.fill)
        {
            if(this.fill.type === "linear" || this.fill.type === "radial")
            {
                this.beginGradientFill(this.fill);
                this.node.appendChild(this._getFill());
            }
            else if(this.fill.type === "bitmap")
            {
                this.beginBitmapFill(this.fill);
                this.node.appendChild(this._getFill());
            }
            else
            {
                if(!this.fill.color)
                {
                    this.node.setAttribute("fill", "none");
                }
                else
                {
                    this.fill.alpha = this.fill.alpha !== undefined ? this.fill.alpha : 1;
                    this.node.setAttribute("fill", this.fill.color);
                    this.node.setAttribute("fill-opacity", this.fill.alpha);
                }
            }
        }
        else
        {
            this.node.setAttribute("fill", "none");
        }
    },

    end: function()
    {
        if(this.path)
        {
            this.node.setAttribute("d", this.path);
        }
        if(this._stroke)
        {
            this.node.setAttribute("stroke-width", this._strokeWeight);
            if(this._strokeColor)
            {
                this.node.setAttribute("stroke", this._strokeColor);
            }
            if(this._strokeAlpha)
            {
                this.node.setAttribute("stroke-opacity", this._strokeAlpha);
            }
        }
    },

    toggleVisible: function(val)
    {
        var visibility = val ? "visible" : "hidden";
        if(this.node)
        {
            Y.one(this.node).setStyle("visibility", visibility);
        }
    },

    clearPath: function()
    {
        this.path = "";
    },

    setStroke: function(stroke)
    {   
        if(stroke)
        {
            var strokeWeight = stroke.weight,
                strokeColor = stroke.color,
                strokeAlpha = stroke.alpha,
                node = this.node;
            if(strokeWeight && strokeWeight !== this._strokeWeight)
            {
                this._strokeWeight = strokeWeight;
                node.setAttribute("stroke-weight", strokeWeight);
            }   
            if(strokeColor && strokeColor != this._strokeColor)
            {
                this._strokeColor = strokeColor;
                node.setAttribute("stroke", strokeColor);
            }
            if(strokeAlpha && strokeAlpha !== this._strokeAlpha)
            {
                this._strokeAlpha = strokeAlpha;
                node.setAttribute("stroke-opacity", strokeAlpha);
            }
        }
    },
    
    update: function(cfg)
    {
        this._setProps(cfg);
        this._draw();
        return this;
    },
    
    _getNodeShapeType: function(type)
    {
        if(this._typeConversionHash.hasOwnProperty(type))
        {
            type = this._typeConversionHash[type];
        }
        return type;
    },

    _trackSize: function(w, h)
    {
        if(w > this.width)
        {
            this.node.setAttribute("width", w);
            this.node.style.width = w + "px";
        }
        if(h > this.height)
        {
            this.node.setAttribute("height", h);
            this.node.style.height = h + "px";
        }
        this.graphics._trackSize.apply(this.graphics, arguments);
    },

    _typeConversionHash: {
        circle: "ellipse",
        wedge: "path"
    }
});

Y.Shape = Shape;
function VMLShape(cfg)
{
    this._initialize(cfg);
    this._draw();
}

Y.extend(VMLShape, Y.Graphic, {  
//VMLShape.prototype = {
    /**
     * Type of shape
     */
    type: "shape",
    
    _initialize: function(cfg) 
    {
        if(!cfg.graphic)
        {
            cfg.graphic = new Y.Graphic();
        }
        this._setProps(cfg);
    },

    width: 0,

    height: 0,

    /**
     * Returns a shape.
     */
    _setProps: function(cfg) {
        this.width = cfg.width && cfg.width >= 0 ? cfg.width : this.width;
        this.height = cfg.height && cfg.height >= 0 ? cfg.height : this.height;
        this.border = cfg.border || this.border;
        this.graphics = cfg.graphic || this.graphics;
        this.canvas = this.graphics;
        this.parentNode = this.graphics.node;
        this.fill = cfg.fill || this.fill;
        this.type = cfg.shape || this.type;
        this.props = cfg.props || this.props;
    },

    _draw: function()
    {
        var path,
            borderWeight = 0,
            fillWidth = this.width || 0,
            fillHeight = this.height || 0;
        this.graphics.setSize(fillWidth, fillHeight);
        if(this.node)
        {
            this.node.style.visible = "hidden";
        }
        else if(!this.node)
        {
            this.node = this.graphics._createGraphicNode(this.graphics._getNodeShapeType(this.type));
            this.graphics.node.appendChild(this.node);
        }
        if(this.type === "wedge")
        {
            path = this._getWedgePath(this.props);
            if(this.fill)
            {
                path += ' x';
            }
            if(this.border)
            {
                path += ' e';
            }
            this.node.path = path;
        }
        this._addBorder();
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            borderWeight = this.border.weight;
            fillWidth -= borderWeight;
            fillHeight -= borderWeight;
        }
        this.node.style.width = Math.max(fillWidth, 0) + "px";
        this.node.style.height = Math.max(fillHeight, 0) + "px";
        this._addFill();
        return this;
    },
    
    _addBorder: function()
    {
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            this.node.strokecolor = this.border.color || "#000000";
            this.node.strokeweight = this.border.weight || 1;
            this.node.stroked = true;
        }
        else
        {
            this.node.stroked = false;
        }
    },

    _addFill: function()
    {
        if(this.fill)
        {
            this.node.filled = true;
            if(this.fill.type === "linear" || this.fill.type === "radial")
            {
                this.beginGradientFill(this.fill);
                this.node.appendChild(this._getFill());
            }
            else if(this.fill.type === "bitmap")
            {
                this.beginBitmapFill(this.fill);
                this.node.appendChild(this._getFill());
            }
            else
            {
                if(!this.fill.color)
                {
                    this.node.filled = false;
                }
                else
                {
                    if(this.fillnode)
                    {
                        this._removeChildren.apply(this.graphics, [this.fillnode]);
                    }
                    this.fillnode = this._createGraphicNode("fill");
                    this.fillnode.type = "solid";
                    this.fillnode.color = this.fill.color;
                    this.fillnode.opacity = this.fill.alpha || 1;
                    this.node.appendChild(this.fillnode);
                }
            }
        }
        else
        {
            this.node.filled = false;
        }
    },

    end: function()
    {
        this._strokeWeight = Math.round(this._strokeWeight);
        if (this._stroke && this._strokeWeight > 0) {
            //this.node.setAttribute("strokeColor", this._strokeColor);
            //this.node.setAttribute("strokeWeight", this._strokeWeight);
            this.node.strokeColor = this._strokeColor;
            this.node.strokeWeight = this._strokeWeight;
            this.node.stroked = true;
        } else {
            this.node.stroked = false;
            //this.node.setAttribute("stroked", false);
        }
        if(this._path)
        {
            if(this._stroke)
            {
                this._path += " e";
            }
            this.node.path = this._path;
            this.node.setAttribute("path", this._path);
        }
        this.node.coordSize = this.width + " " + this.height;
        this.node.style.visible = "visible";
    },

    clearPath: function()
    {
        this._path = "";
    },

    setStroke: function(stroke)
    {   
        if(stroke)
        {
            var strokeWeight = stroke.weight,
                strokeColor = stroke.color,
                strokeAlpha = stroke.alpha,
                node = this.node;
            if(strokeWeight && strokeWeight !== this._strokeWeight)
            {
                this._strokeWeight = strokeWeight;
                node.strokeWeight =  strokeWeight;
            }   
            if(strokeColor && strokeColor != this._strokeColor)
            {
                this._strokeColor = strokeColor;
                node.strokeColor = strokeColor;
            }
            if(strokeAlpha && strokeAlpha !== this._strokeAlpha)
            {
                this._strokeAlpha = strokeAlpha;
                node.strokeOpacity = strokeAlpha;
            }
        }
    },
    _trackSize: function(w, h)
    {
        if(w > this.width)
        {
            this.width = w;
       //     this.node.setAttribute("width", w);
            this.node.style.width = w + "px";
        }
        if(h > this.height)
        {
            this.height = h;
         //   this.node.setAttribute("height", h);
            this.node.style.height = h + "px";
        }
        this.graphics._trackSize.apply(this.graphics, arguments);
        this.graphics.setSize.apply(this.graphics, [this.graphics._width, this.graphics._height]);
    },

    toggleVisible: function(val)
    {
        var visibility = val ? "visible" : "hidden";
        if(this.node)
        {
            Y.one(this.node).setStyle("visibility", visibility);
        }
    },

    update: function(cfg)
    {
        this._setProps(cfg);
        this._draw();
        return this;
    }
});

Y.VMLShape = VMLShape;

if (Y.UA.ie) {
    Y.Shape = VMLShape;
}


}, '@VERSION@' ,{requires:['dom', 'event-custom', 'event-mouseenter', 'node']});
