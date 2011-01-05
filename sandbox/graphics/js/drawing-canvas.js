/**
 * Set of drawing apis for canvas based classes.
 *
 * @class CanvasDrawingUtil
 * @constructor
 */
function CanvasDrawingUtil()
{
    this.initializer.apply(this, arguments);
}

CanvasDrawingUtil.prototype = {
    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        if(this.autoSize)
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.style.width = w + "px";
                this._canvas.style.width = w + "px";
                this._canvas.width = w;
                this.node.setAttribute("width", w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.style.height = h + "px";
                this._canvas.style.height = h + "px";
                this._canvas.height = h;
                this.node.setAttribute("height", h);
            }
        }
    },

    _updatePosition: function(x, y)
    {
        if(x <= this._left)
        {
            this._left = x;
        }
        else if(x >= this._right)
        {
            this._right = x;
        }
        if(y <= this._top)
        {
            this._top = y;
        }
        else if(y >= this._bottom)
        {
            this._bottom = y;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
    },

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        this._dummy = this._createDummy();
        this._canvas = this._createGraphic();
        this._context = this._canvas.getContext('2d');
        this._initProps();
    },
    
    /**
     * Holds queue of methods for the target canvas.
     * 
     * @property _methods
     * @type Object
     * @private
     */
    _methods: null,

    /**
     * Holds queue of properties for the target canvas.
     *
     * @property _properties
     * @type Object
     * @private
     */
    _properties: null,
    
    /**
     * Adds a method to the drawing queue
     */
    _updateDrawingQueue: function(val)
    {
        if(!this._methods)
        {
            this._methods = [];
        }
        this._methods.push(val);
    },
 
    /** 
     * Specifies a bitmap fill used by subsequent calls to other drawing methods.
     * 
     * @method beginBitmapFill
     * @param {Object} config
     */
    beginBitmapFill: function(config) {
        var context = this._context,
            bitmap = config.bitmap,
            repeat = config.repeat || 'repeat';
        this._fillWidth = config.width || null;
        this._fillHeight = config.height || null;
        this._fillX = !isNaN(config.tx) ? config.tx : NaN;
        this._fillY = !isNaN(config.ty) ? config.ty : NaN;
        this._fillType =  'bitmap';
        this._bitmapFill = context.createPattern(bitmap, repeat);
        return this;
    },

    /**
     * Specifes a solid fill used by subsequent calls to other drawing methods.
     *
     * @method beginFill
     * @param {String} color Hex color value for the fill.
     * @param {Number} alpha Value between 0 and 1 used to specify the opacity of the fill.
     */
    beginFill: function(color, alpha) {
        var context = this._context;
        this._updateDrawingQueue(["beginPath"]);
        if (color) {
            if (alpha) {
               color = this._2RGBA(color, alpha);
            } else {
                color = this._2RGB(color);
            }

            this._fillColor = color;
            this._fillType = 'solid';
        }
        return this;
    },

    /** 
     * Specifies a gradient fill used by subsequent calls to other drawing methods.
     *
     * @method beginGradientFill
     * @param {Object} config
     */
    beginGradientFill: function(config) {
        var color,
            alpha,
            i = 0,
            colors = config.colors,
            alphas = config.alphas || [],
            len = colors.length;
        this._fillAlphas = alphas;
        this._fillColors = colors;
        this._fillType =  config.type || "linear";
        this._fillRatios = config.ratios || [];
        this._fillRotation = config.rotation || 0;
        this._fillWidth = config.width || null;
        this._fillHeight = config.height || null;
        this._fillX = !isNaN(config.tx) ? config.tx : NaN;
        this._fillY = !isNaN(config.ty) ? config.ty : NaN;
        for(;i < len; ++i)
        {
            alpha = alphas[i];
            color = colors[i];
            if (alpha) {
               color = this._2RGBA(color, alpha);
            } else {
                color = this._2RGB(color);
            }
            colors[i] = color;
        }
        this._updateDrawingQueue(["beginPath"]);
        return this;
    },
    
    /**
     * Specifies a line style used for subsequent calls to drawing methods.
     * 
     * @method lineStyle
     * @param {Number} thickness indicates the thickness of the line
     * @param {String} color hex color value for the line
     * @param {Number} alpha Value between 0 and 1 used to specify the opacity of the fill.
     */
    lineStyle: function(thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        color = color || '#000000';
        var context = this._context;
        if(this._stroke)
        {
            this._updateDrawingQueue(["stroke"]);
        }
        this._lineWidth = thickness;

        if (thickness) {
            this._stroke = 1;
        } else {
            this._stroke = 0;
        }

        if (color) {
            this._strokeStyle = color;
            if (alpha) {
                this._strokeStyle = this._2RGBA(this._strokeStyle, alpha);
            }
        }
        
        if(!this._fill)
        {
            this._updateDrawingQueue(["beginPath"]);
        }

        if (caps === 'butt') {
            caps = 'none';
        }
        
        if (context.lineCap) { // FF errors when trying to set
            //context.lineCap = caps;
        }
        this._drawingComplete = false;
        return this;
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments, 
            i, len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }

        for (i = 0, len = args.length; i < len; ++i) {
            this._updateDrawingQueue(["lineTo", args[i][0], args[i][1]]);
            this._lineToMethods[this._lineToMethods.length] = this._methods[this._methods.length - 1];
            this._updateShapeProps.apply(this, args[i]);
            this._updatePosition(args[i][0], args[i][1]);
        }
        this._drawingComplete = false;
        return this;
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function(x, y) {
        this._updateDrawingQueue(["moveTo", x, y]);
        this._updateShapeProps(x, y);
        this._drawingComplete = false;
        return this;
    },
    
    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        this._initProps();
        this._canvas.width = this._canvas.width;
        this._canvas.height = this._canvas.height;
        return this;
    },
    
    /**
     * Draws a bezier curve.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._updateDrawingQueue(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
        this._drawingComplete = false;
        this._updateShapeProps(x, y);
        return this;
    },

    /**
     * Draws a quadratic bezier curve.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    quadraticCurveTo: function(controlX, controlY, anchorX, anchorY) {
        this._updateDrawingQueue(["quadraticCurveTo", controlX, controlY, anchorX, anchorY]);
        this._drawingComplete = false;
        this._updateShapeProps(anchorX, anchorY);
        return this;
    },

    /**
     * Draws a circle.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     */
	drawCircle: function(x, y, radius) {
        var context = this._context,
            startAngle = 0,
            endAngle = 2 * Math.PI;
        this._shape = {
            x:x - radius,
            y:y - radius,
            w:radius * 2,
            h:radius * 2
        };
        this._drawingComplete = false;
        this._updateDrawingQueue(["beginPath"]);
        this._updateDrawingQueue(["arc", x, y, radius, startAngle, endAngle, false]);
        this._draw();
        return this;
    },

    /**
     * Draws an ellipse.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
	drawEllipse: function(x, y, w, h) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        if(this._stroke && this._context.lineWidth > 0)
        {
            w -= this._context.lineWidth * 2;
            h -= this._context.lineWidth * 2;
            x += this._context.lineWidth;
            y += this._context.lineWidth;
        }
        var context = this._context,
            l = 8,
            theta = -(45/180) * Math.PI,
            angle = 0,
            angleMid,
            radius = w/2,
            yRadius = h/2,
            i = 0,
            centerX = x + radius,
            centerY = y + yRadius,
            ax, ay, bx, by, cx, cy;
        this._drawingComplete = false;
        this._trackPos(x, y);
        this._trackSize(x + w, y + h);

        this._updateDrawingQueue(["beginPath"]);
        ax = centerX + Math.cos(0) * radius;
        ay = centerY + Math.sin(0) * yRadius;
        this._updateDrawingQueue(["moveTo", ax, ay]);        
        for(; i < l; i++)
        {
            angle += theta;
            angleMid = angle - (theta / 2);
            bx = centerX + Math.cos(angle) * radius;
            by = centerY + Math.sin(angle) * yRadius;
            cx = centerX + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
            cy = centerY + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
            this._updateDrawingQueue(["quadraticCurveTo", cx, cy, bx, by]);
        }
        this._draw();
        return this;
    },

    /**
     * Draws a rectangle.
     *
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
    drawRect: function(x, y, w, h) {
        var ctx = this._context;
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        this._drawingComplete = false;
        this._updateDrawingQueue(["beginPath"]);
        this._updateDrawingQueue(["moveTo", x, y]);
        this._updateDrawingQueue(["lineTo", x + w, y]);
        this._updateDrawingQueue(["lineTo", x + w, y + h]);
        this._updateDrawingQueue(["lineTo", x, y + h]);
        this._updateDrawingQueue(["lineTo", x, y]);
        this._trackPos(x, y);
        this._trackSize(w, h);
        this._draw();
        return this;
    },

    /**
     * Draws a rectangle with rounded corners.
     * 
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} ew width of the ellipse used to draw the rounded corners
     * @param {Number} eh height of the ellipse used to draw the rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._shape = {
            x:x,
            y:y,
            w:w,
            h:h
        };
        var ctx = this._context;
        this._drawingComplete = false;
        this._updateDrawingQueue(["beginPath"]);
        this._updateDrawingQueue(["moveTo", x, y + eh]);
        this._updateDrawingQueue(["lineTo", x, y + h - eh]);
        this._updateDrawingQueue(["quadraticCurveTo", x, y + h, x + ew, y + h]);
        this._updateDrawingQueue(["lineTo", x + w - ew, y + h]);
        this._updateDrawingQueue(["quadraticCurveTo", x + w, y + h, x + w, y + h - eh]);
        this._updateDrawingQueue(["lineTo", x + w, y + eh]);
        this._updateDrawingQueue(["quadraticCurveTo", x + w, y, x + w - ew, y]);
        this._updateDrawingQueue(["lineTo", x + ew, y]);
        this._updateDrawingQueue(["quadraticCurveTo", x, y, x, y + eh]);
        this._trackPos(x, y);
        this._trackSize(w, h);
        this._draw();
        return this;
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
    drawWedge: function(cfg)
    {
        var x = cfg.x,
            y = cfg.y,
            startAngle = cfg.startAngle,
            arc = cfg.arc,
            radius = cfg.radius,
            yRadius = cfg.yRadius,
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
            i = 0;

        this._drawingComplete = false;
        // move to x,y position
        this._updateRenderQueue(["moveTo", x, y]);
        
        yRadius = yRadius || radius;
        
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
        angle = -(startAngle / 180) * Math.PI;
        
        // draw the curve in segments no larger than 45 degrees.
        if(segs > 0)
        {
            // draw a line from the center to the start of the curve
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius;
            ay = y + Math.sin(-startAngle / 180 * Math.PI) * yRadius;
            this.lineTo(ax, ay);
            // Loop for drawing curve segments
            for(; i < segs; ++i)
            {
                angle += theta;
                angleMid = angle - (theta / 2);
                bx = x + Math.cos(angle) * radius;
                by = y + Math.sin(angle) * yRadius;
                cx = x + Math.cos(angleMid) * (radius / Math.cos(theta / 2));
                cy = y + Math.sin(angleMid) * (yRadius / Math.cos(theta / 2));
                this._updateRenderQueue(["quadraticCurveTo", cx, cy, bx, by]);
            }
            // close the wedge by drawing a line to the center
            this._updateRenderQueue(["lineTo", x, y]);
        }
        this._trackPos(x, y);
        this._trackSize(radius, radius);
        this._draw();
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        this._draw();
        this._initProps();
        return this;
    },

    /**
     * Clears all values
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        var context = this._context;
        
        context.fillStyle = 'rgba(0, 0, 0, 1)'; // use transparent when no fill
        context.lineWidth = 6;
        //context.lineCap = 'butt';
        context.lineJoin = 'miter';
        context.miterLimit = 3;
        this._strokeStyle = 'rgba(0, 0, 0, 1)';
        this._methods = [];
        this._width = 0;
        this._height = 0;
        this._left = 0;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
        //this._shape = null;
        this._x = 0;
        this._y = 0;
        this._fillType = null;
        this._stroke = null;
        this._bitmapFill = null;
        this._drawingComplete = false;
        this._lineToMethods = [];
    },

    /**
     * Returns ths actual fill object to be used in a drawing or shape
     *
     * @method _getFill
     * @private
     */
    _getFill: function() {
        var type = this._fillType,
            fill;

        switch (type) {
            case 'linear': 
                fill = this._getLinearGradient('fill');
                break;

            case 'radial': 
                fill = this._getRadialGradient('fill');
                break;
            case 'bitmap':
                fill = this._bitmapFill;
                break;
            case 'solid': 
                fill = this._fillColor;
                break;
        }
        return fill;
    },

    /**
     * Returns a linear gradient fill
     *
     * @method _getLinearGradient
     * @private
     */
    _getLinearGradient: function(type) {
        var prop = '_' + type,
            colors = this[prop + 'Colors'],
            ratios = this[prop + 'Ratios'],
            x = !isNaN(this._fillX) ? this._fillX : this._shape.x,
            y = !isNaN(this._fillY) ? this._fillY : this._shape.y,
            w = this._fillWidth || (this._shape.w),
            h = this._fillHeight || (this._shape.h),
            ctx = this._context,
            r = this[prop + 'Rotation'],
            i,
            l,
            color,
            ratio,
            def,
            grad,
            x1, x2, y1, y2,
            cx = x + w/2,
            cy = y + h/2,
            radCon = Math.PI/180,
            tanRadians = parseFloat(parseFloat(Math.tan(r * radCon)).toFixed(8));
        if(Math.abs(tanRadians) * w/2 >= h/2)
        {
            if(r < 180)
            {
                y1 = y;
                y2 = y + h;
            }
            else
            {
                y1 = y + h;
                y2 = y;
            }
            x1 = cx - ((cy - y1)/tanRadians);
            x2 = cx - ((cy - y2)/tanRadians); 
        }
        else
        {
            if(r > 90 && r < 270)
            {
                x1 = x + w;
                x2 = x;
            }
            else
            {
                x1 = x;
                x2 = x + w;
            }
            y1 = ((tanRadians * (cx - x1)) - cy) * -1;
            y2 = ((tanRadians * (cx - x2)) - cy) * -1;
        }
        grad = ctx.createLinearGradient(x1, y1, x2, y2);
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i)
        {
            color = colors[i];
            ratio = ratios[i] || i/(l - 1);
            grad.addColorStop(ratio, color);
            def = (i + 1) / l;
        }
        
        return grad;
    },

    /**
     * Returns a radial gradient fill
     *
     * @method _getRadialGradient
     * @private
     */
    _getRadialGradient: function(type) {
        var prop = '_' + type,
            colors = this[prop + "Colors"],
            ratios = this[prop + "Ratios"],
            i,
            l,
            w = this._fillWidth || this._shape.w,
            h = this._fillHeight || this._shape.h,
            x = !isNaN(this._fillX) ? this._fillX : this._shape.x,
            y = !isNaN(this._fillY) ? this._fillY : this._shape.y,
            color,
            ratio,
            def,
            grad,
            ctx = this._context;
            x += w/2;
            y += h/2;
        grad = ctx.createRadialGradient(x, y, 1, x, y, w/2);
        l = colors.length;
        def = 0;
        for(i = 0; i < l; ++i) {
            color = colors[i];
            ratio = ratios[i] || i/(l - 1);
            grad.addColorStop(ratio, color);
        }
        return grad;
    },
   
    /**
     * Completes a shape or drawing
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        if(this._drawingComplete || !this._shape)
        {
            return;
        }
        var w,
            h,
            context = this._context,
            fill,
            methods = this._methods,
            i = 0,
            lineToMethods = this._lineToMethods,
            lineToLen = lineToMethods.length,
            method,
            args,
            len = methods ? methods.length : 0;
        w = this._width + this._lineWidth;
        h = this._height + this._lineWidth;
        this.node.style.left = this._left + "px";
        this.node.style.top = this._top + "px";
        this.node.style.width = this._width + "px";
        this.node.style.height = this._height + "px";
        this._canvas.style.width = w + "px";
        this._canvas.style.height = h + "px";
        this._canvas.width = w;
        this._canvas.height = h;
        if(!len || len < 1)
        {
            return;
        }
        for(; i < lineToLen; ++i)
        {
            args = lineToMethods[i];
            args[1] = args[1] - this._left;
            args[2] = args[2] - this._top;
        }
        for(i = 0; i < len; ++i)
        {
            args = methods[i];
            if(args && args.length > 0)
            {
                method = args.shift();
                if(method)
                {
                    context[method].apply(context, args); 
                }
            }
        }


        if (this._fillType) {
            fill = this._getFill();
            if (fill) {
                context.fillStyle = fill;
            }
            context.closePath();
        }

        if (this._fillType) {
            context.fill();
        }

        if (this._stroke) {
            if(this._lineWidth)
            {
                context.lineWidth = this._lineWidth;
            }
            context.strokeStyle = this._strokeStyle;
            context.stroke();
        }
        this._drawingComplete = true;
        //this.setSize(this._width, this._height);
    },
    
    /**
     * @private
     */
    _drawingComplete: false,

    /**
     * Regex expression used for converting hex strings to rgb
     *
     * @property _reHex
     * @private
     */
    _reHex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,

    /**
     * Parses hex color string and alpha value to rgba
     *
     * @method _2RGBA
     * @private
     */
    _2RGBA: function(val, alpha) {
        alpha = (alpha !== undefined) ? alpha : 1;
        if (this._reHex.exec(val)) {
            val = 'rgba(' + [
                parseInt(RegExp.$1, 16),
                parseInt(RegExp.$2, 16),
                parseInt(RegExp.$3, 16)
            ].join(',') + ',' + alpha + ')';
        }
        return val;
    },

    /**
     * Creates dom element used for converting color string to rgb
     *
     * @method _createDummy
     * @private
     */
    _createDummy: function() {
        var dummy = Y.config.doc.createElement('div');
        dummy.style.height = 0;
        dummy.style.width = 0;
        dummy.style.overflow = 'hidden';
        Y.config.doc.documentElement.appendChild(dummy);
        return dummy;
    },

    /**
     * Creates canvas element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function(config) {
        var graphic = Y.config.doc.createElement('canvas');
        // no size until drawn on
        graphic.width = 600;
        graphic.height = 600;
        return graphic;
    },

    /**
     * Converts color to rgb format
     *
     * @method _2RGB
     * @private 
     */
    _2RGB: function(val) {
        this._dummy.style.background = val;
        return this._dummy.style.backgroundColor;
    },
    
    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
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
     * Updates the position of the current drawing
     *
     * @method _trackPos
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @private
     */
    _trackPos: function(x, y) {
        if (x > this._x) {
            this._x = x;
        }
        if (y > this._y) {
            this._y = y;
        }
    },

    /**
     * Updates the position and size of the current drawing
     *
     * @method _updateShapeProps
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @private
     */
    _updateShapeProps: function(x, y)
    {
        var w,h;
        if(!this._shape)
        {
            this._shape = {};
        }
        if(!this._shape.x)
        {
            this._shape.x = x;
        }
        else
        {
            this._shape.x = Math.min(this._shape.x, x);
        }
        if(!this._shape.y)
        {
            this._shape.y = y;
        }
        else
        {
            this._shape.y = Math.min(this._shape.y, y);
        }
        w = Math.abs(x - this._shape.x);
        if(!this._shape.w)
        {
            this._shape.w = w;
        }
        else
        {
            this._shape.w = Math.max(w, this._shape.w);
        }
        h = Math.abs(y - this._shape.y);
        if(!this._shape.h)
        {
            this._shape.h = h;
        }
        else
        {
            this._shape.h = Math.max(h, this._shape.h);
        }
    },
    
    /**
     * Creates a Shape instance and adds it to the graphics object.
     *
     * @method getShape
     * @param {Object} config Object literal of properties used to construct a Shape.
     * @return Shape
     */
    getShape: function(config) {
        config.graphic = this;
        return new Y.Shape(config); 
    }
};

Y.CanvasDrawingUtil = CanvasDrawingUtil;
