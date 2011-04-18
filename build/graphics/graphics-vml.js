YUI.add('graphics-vml', function(Y) {

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
sheet.addRule(".vmlstroke", "behavior:url(#default#VML)", sheet.rules.length);

function Drawing() {}

Drawing.prototype = {
    /**
     * @private
     */
    _currentX: 0,

    /**
     * @private
     */
    _currentY: 0,

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
        var hiX,
            loX,
            hiY,
            loY;
        x = Math.round(x);
        y = Math.round(y);
        this._path += ' c ' + Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y;
        this._currentX = x;
        this._currentY = y;
        hiX = Math.max(x, Math.max(cp1x, cp2x));
        hiY = Math.max(y, Math.max(cp1y, cp2y));
        loX = Math.min(x, Math.min(cp1x, cp2x));
        loY = Math.min(y, Math.min(cp1y, cp2y));
        this._trackSize(hiX, hiY);
        this._trackSize(loX, loY);
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
    quadraticCurveTo: function(cpx, cpy, x, y) {
        var currentX = this._currentX,
            currentY = this._currentY,
            cp1x = currentX + 0.67*(cpx - currentX),
            cp1y = currentY + 0.67*(cpy - currentY),
            cp2x = cp1x + (x - currentX) * 0.34,
            cp2y = cp1y + (y - currentY) * 0.34;
        this.curveTo(cp1x, cp1y, cp2x, cp2y, x, y);
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
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this._currentX = x;
        this._currentY = y;
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
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        return this;
    },

    /**
     * Draws a wedge.
     * 
     * @param {Number} x			x-coordinate of the wedge's center point
     * @param {Number} y			y-coordinate of the wedge's center point
     * @param {Number} startAngle	starting angle in degrees
     * @param {Number} arc			sweep of the wedge. Negative values draw clockwise.
     * @param {Number} radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param {Number} yRadius		[optional] y radius for wedge.
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        var diameter = radius * 2;
        yRadius = yRadius || radius;
        this._path += this._getWedgePath({x:x, y:y, startAngle:startAngle, arc:arc, radius:radius, yRadius:yRadius});
        this._trackSize(diameter, diameter); 
        this._currentX = x;
        this._currentY = y;
        return this;
    },

    /**
     * Generates a path string for a wedge shape
     *
     * @method _getWedgePath
     * @param {Object} config attributes used to create the path
     * @return String
     * @private
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
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        this._draw();
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
            i,
            len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        if(!this._path)
        {
            this._path = "";
        }
        this._path += ' l ';
        for (i = 0; i < len; ++i) {
            this._path += ' ' + Math.round(args[i][0]) + ', ' + Math.round(args[i][1]);
            this._trackSize.apply(this, args[i]);
            this._currentX = args[i][0];
            this._currentY = args[i][1];
        }
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
        if(!this._path)
        {
            this._path = "";
        }
        this._path += ' m ' + Math.round(x) + ', ' + Math.round(y);
        this._trackSize(x, y);
        this._currentX = x;
        this._currentY = y;
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
        var wid = this._width || 0,
            ht = this._height || 0;
        if (w > wid) {
            this._width = w;
        }
        if (h > ht) {
            this._height = h;
        }
    }
};
Y.Drawing = Drawing;
/**
 * Base class for creating shapes.
 *
 * @class Shape
 */
 Y.Shape = Y.Base.create("shape", Y.Base, [], {
    /**
     * Initializes the shape
     *
     * @private
     * @method _initialize
     */
    initializer: function()
    {
        this.publish("shapeUpdate");
        this._addListeners();
        this._draw();
        this.fire("shapeUpdate");
    },
 
    /**
     * Add a class name to each node.
     *
     * @method addClass
     * @param {String} className the class name to add to the node's class attribute 
     */
    addClass: function(className)
    {
        var node = Y.one(this.get("node"));
        node.addClass(className);
    },
    
    /**
     * Removes a class name from each node.
     *
     * @method removeClass
     * @param {String} className the class name to remove from the node's class attribute
     */
    removeClass: function(className)
    {
        var node = Y.one(this.get("node"));
        node.removeClass(className);
    },

    /**
     * Gets the current position of the node in page coordinates.
     *
     * @method getXY
     * @return Array The XY position of the shape.
     */
    getXY: function()
    {
        var graphic = this.get("graphic"),
            parentXY = graphic.getXY(),
            x = this.get("x"),
            y = this.get("y");
        return [parentXY[0] + x, parentXY[1] + y];
    },

    /**
     * Set the position of the shape in page coordinates, regardless of how the node is positioned.
     *
     * @method setXY
     * @param {Array} Contains X & Y values for new position (coordinates are page-based)
     */
    setXY: function(xy)
    {
        var graphic = this.get("graphic"),
            parentXY = graphic.getXY();
        this.set("x", xy[0] - parentXY[0]);
        this.set("y", xy[1] - parentXY[1]);
    },

    /**
     * Determines whether the node is an ancestor of another HTML element in the DOM hierarchy. 
     *
     * @method contains
     * @param {VMLShape | HTMLElement} needle The possible node or descendent
     * @return Boolean Whether or not this shape is the needle or its ancestor.
     */
    contains: function(needle)
    {
        return needle === this;
    },

    /**
     * Test if the supplied node matches the supplied selector.
     *
     * @method test
     * @param {String} selector The CSS selector to test against.
     * @return Boolean Wheter or not the shape matches the selector.
     */
    test: function(selector)
    {
        return Y.one(this.get("node")).test(selector);
    },

    /**
     * Creates the dom node for the shape.
     *
     * @private
     * @return HTMLElement
     */
    _getNode: function()
    {
        var node = this._createGraphicNode(),
            id = this.get("id");
        node.setAttribute("id", id);
        id = "#" + id;
        Y.one(node).addClass("yui3-" + this.name);
        Y.on('mousedown', Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mouseup',  Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mouseover', Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mousemove',  Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mouseenter',  Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mouseleave',  Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('click',  Y.bind(this._nodeEventDispatcher, this), id);
        return node;
    },

    /**
     * @private
     */
    _nodeEventDispatcher: function(e)
    {
        e.preventDefault();
        this.fire(e.type, e);
    },

    /**
     * Adds change listeners to the shape.
     *
     * @private
     * @method _addListeners
     */
    _addListeners: function()
    {
        this.after("initializedChange", this._updateHandler);
        this.after("transformAdded", this._updateHandler);
        this.after("strokeChange", this._updateHandler);
        this.after("fillChange", this._updateHandler);
        this.after("widthChange", this._updateHandler);
        this.after("heightChange", this._updateHandler);
        this.after("xChange", this._updateHandler);
        this.after("yChange", this._updateHandler);
    },
    
    /**
     * Adds a stroke to the shape node.
     *
     * @method _strokeChangeHandler
     * @private
     */
    _strokeChangeHandler: function(e)
    {
        var node = this.get("node"),
            stroke = this.get("stroke"),
            strokeAlpha,
            dashstyle,
            dash = "",
            val,
            endcap,
            i = 0,
            len,
            linecap = stroke.linecap || "flat",
            linejoin = stroke.linejoin || "round";
        if(stroke && stroke.weight && stroke.weight > 0)
        {
            if(linecap != "round" && linecap != "square")
            {
                linecap = "flat";
            }
            strokeAlpha = stroke.alpha;
            dashstyle = stroke.dashstyle || "none";
            stroke.color = stroke.color || "#000000";
            stroke.weight = stroke.weight || 1;
            stroke.alpha = Y.Lang.isNumber(strokeAlpha) ? strokeAlpha : 1;
            node.stroked = true;
            node.endcap = endcap; 
            node.strokeColor = stroke.color;
            node.strokeWeight = stroke.weight + "px";
            if(!this._strokeNode)
            {
                this._strokeNode = this._createGraphicNode("stroke");
                node.appendChild(this._strokeNode);
            }
            this._strokeNode.endcap = linecap;
            this._strokeNode.opacity = stroke.alpha;
            if(Y.Lang.isArray(dashstyle))
            {
                dash = [];
                len = dashstyle.length;
                for(i = 0; i < len; ++i)
                {
                    val = dashstyle[i];
                    dash[i] = val / stroke.weight;
                }
            }
            if(linejoin == "round" || linejoin == "bevel")
            {
                this._strokeNode.joinstyle = linejoin;
            }
            else
            {
                linejoin = parseInt(linejoin, 10);
                if(Y.Lang.isNumber(linejoin))
                {
                    this._strokeNode.miterlimit = Math.max(linejoin, 1);
                    this._strokeNode.joinstyle = "miter";
                }
            }
            this._strokeNode.dashstyle = dash;
        }
        else
        {
            node.stroked = false;
        }
    },
    
    /**
     * Adds a fill to the shape node.
     *
     * @method _fillChangeHandler
     * @private
     */
    _fillChangeHandler: function(e)
    {
        var node = this.get("node"),
            fill = this.get("fill"),
            fillAlpha,
            filled = false;
        if(fill)
        {
            if(fill.type == "radial" || fill.type == "linear")
            {
                filled = true;
                this._setGradientFill(node, fill);
            }
            else if(fill.color)
            {
                fillAlpha = fill.alpha;
                filled = true;
                if(Y.Lang.isNumber(fillAlpha))
                {
                    fillAlpha = Math.max(Math.min(fillAlpha, 1), 0);
                    this._updateFillNode(node);
                    fill.alpha = fillAlpha;
                    this._fillNode.opacity = fillAlpha;
                    this._fillNode.color = fill.color;
                }
                else
                {
                    if(this._fillNode)
                    {   
                        node.removeChild(this._fillNode);
                        this._fillNode = null;
                    }
                    node.fillColor = fill.color;
                }
            }
        }
        node.filled = filled;
    },

    _updateFillNode: function(node)
    {
        if(!this._fillNode)
        {
            this._fillNode = this._createGraphicNode("fill");
            node.appendChild(this._fillNode);
        }
    },

    _setGradientFill: function(node, fill)
    {
        this._updateFillNode(node);
        var gradientBoxWidth,
            gradientBoxHeight,
            type = fill.type,
            w = this.get("width"),
            h = this.get("height"),
            isNumber = Y.Lang.isNumber,
            stop,
            stops = fill.stops,
            len = stops.length,
            opacity,
            color,
            i = 0,
            oi,
            colorstring = "",
            cx = fill.cx,
            cy = fill.cy,
            fx = fill.fx,
            fy = fill.fy,
            r = fill.r,
            pct,
            rotation = fill.rotation || 0;
        if(type === "linear")
        {
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
            this._fillNode.type = "gradient";//"gradientunscaled";
            this._fillNode.angle = rotation;
        }
        else if(type === "radial")
        {
            gradientBoxWidth = w * (r * 2);
            gradientBoxHeight = h * (r * 2);
            fx = r * 2 * (fx - 0.5);
            fy = r * 2 * (fy - 0.5);
            fx += cx;
            fy += cy;
            this._fillNode.focussize = (gradientBoxWidth/w)/10 + "% " + (gradientBoxHeight/h)/10 + "%";
            //this._fillNode.focusSize = ((r - cx) * 10) + "% " + ((r - cy) * 10) + "%"; 
            this._fillNode.alignshape = false;
            this._fillNode.type = "gradientradial";
            this._fillNode.focus = "100%";
            this._fillNode.focusposition = Math.round(fx * 100) + "% " + Math.round(fy * 100) + "%";
        }
        for(;i < len; ++i) {
            stop = stops[i];
            color = stop.color;
            opacity = stop.opacity;
            opacity = isNumber(opacity) ? opacity : 1;
            pct = stop.offset || i/(len-1);
            pct *= (r * 2);
            if(pct <= 1)
            {
                pct = Math.round(100 * pct) + "%";
                oi = i > 0 ? i + 1 : "";
                this._fillNode["opacity" + oi] = opacity + "";
                colorstring += ", " + pct + " " + color;
            }
        }
        pct = stops[1].offset || 0;
        pct *= 100;
        if(parseInt(pct, 10) < 100)
        {
            colorstring += ", 100% " + color;
        }
        this._fillNode.colors = colorstring.substr(2);
    },

    /**
     * @private
     */
    _addTransform: function(type, args)
    {
        if(!this._transformArgs)
        {
            this._transformArgs = {};
        }
        this._transformArgs[type] = Array.prototype.slice.call(args, 0);
        this.fire("transformAdded");
    },
    
    /**
     * @private
     */
    _updateTransform: function()
    {
        var node = this.get("node"),
            w = this.get("width"),
            h = this.get("height"),
            x,
            y,
            coordSize = node.coordSize,
            transformOrigin,
            tx,
            ty,
            originX,
            originY,
            absRot,
            radCon,
            sinRadians,
            cosRadians,
            x2,
            y2;
        if(this._transformArgs)
        {
            if(this._transformArgs.hasOwnProperty("translate"))
            {
                x = 0 - (coordSize.x/w * this._translateX);
                y = 0 - (coordSize.y/h * this._translateY);
                node.coordOrigin = x + "," + y;
            }
            if(this._transformArgs.hasOwnProperty("rotate"))
            {
                transformOrigin = this.get("transformOrigin");
                tx = transformOrigin[0];
                ty = transformOrigin[1];
                originX = w * (tx - 0.5);
                originY = h * (ty - 0.5);
                absRot = Math.abs(this._rotation);
                radCon = Math.PI/180;
                sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8));
                cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8));
                x2 = (originX * cosRadians) - (originY * sinRadians);
                y2 = (originX * sinRadians) + (originY * cosRadians);
                node.style.rotation = this._rotation;
                node.style.left = (this.get("x") + (originX - x2)) + "px";
                node.style.top = (this.get("y") + (originY - y2)) + "px";
            }
        }
    },

    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The x-coordinate
     * @param {Number} y The y-coordinate
     */
    translate: function(x, y)
    {
        this._translateX = x;
        this._translateY = y;
        this._addTransform("translate", arguments);
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewX: function(x)
     {
        //var node = this.get("node");
     },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewY: function(y)
     {
        //var node = this.get("node");
     },

    /**
     * @private
     */
    _rotation: 0,

     /**
      * Applies a rotation.
      *
      * @method rotate
      * @param
      */
     rotate: function(deg)
     {
        this._rotation = deg;
        this._addTransform("rotate", arguments);
     },
    
    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(val)
    {
        //var node = this.get("node");
    },

    /**
     * Applies a matrix transformation
     *
     * @method matrix
     */
    matrix: function(a, b, c, d, e, f)
    {
        //var node = this.get("node");
    },

    /**
     * @private
     */
    _draw: function()
    {
        var node = this.get("node"),
            x = this.get("x"),
            y = this.get("y"),
            w = this.get("width"),
            h = this.get("height");
        node.style.position = "absolute";
        node.style.left = x + "px";
        node.style.top = y + "px";
        node.style.width = w + "px";
        node.style.height = h + "px";
        this._fillChangeHandler();
        this._strokeChangeHandler();
        this._updateTransform();
    },

    _updateHandler: function(e)
    {
        var node = this.get("node");
        node.style.visible = "hidden";
        this._draw();
        this.fire("shapeUpdate");
        node.style.visible = "visible";
    },

    /**
     * Creates a graphic node
     *
     * @method _createGraphicNode
     * @param {String} type node type to create
     * @param {String} pe specified pointer-events value
     * @return HTMLElement
     * @private
     */
    _createGraphicNode: function(type)
    {
        type = type || this._type;
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
    },
    
    /**
     * Value function for fill attribute
     *
     * @private
     * @method _getDefaultFill
     * @return Object
     */
    _getDefaultFill: function() {
        return {
            type: "solid",
            cx: 0.5,
            cy: 0.5,
            fx: 0.5,
            fy: 0.5,
            r: 0.5
        };
    },

    /**
     * Value function for stroke attribute
     *
     * @private
     * @method _getDefaultStroke
     * @return Object
     */
    _getDefaultStroke: function() 
    {
        return {
            weight: 1,
            dashstyle: "none",
            color: "#000",
            alpha: 1.0
        };
    },

    /**
     * Returns the bounds for a shape.
     *
     * @method getBounds
     * @return Object
     */
    getBounds: function()
    {
        var w = this.get("width"),
            h = this.get("height"),
            stroke = this.get("stroke"),
            x = this.get("x"),
            y = this.get("y"),
            wt = 0,
            bounds = {};
        if(stroke && stroke.weight)
        {
            wt = stroke.weight;
        }
        bounds.left = x - wt;
        bounds.top = y - wt;
        bounds.right = x + w + wt;
        bounds.bottom = y + h + wt;
        return bounds;
    }
 }, {
    ATTRS: {
        /**
         * An array of x, y values which indicates the transformOrigin in which to rotate the shape. Valid values range between 0 and 1 representing a 
         * fraction of the shape's corresponding bounding box dimension. The default value is [0.5, 0.5].
         *
         * @attribute transformOrigin
         * @type Array
         */
        transformOrigin: {
            valueFn: function()
            {
                return [0.5, 0.5];
            }
        },

        /**
         * The rotation (in degrees) of the shape.
         *
         * @attribute rotation
         * @type Number
         */
        rotation: {
            setter: function(val)
            {
                this.rotate(val);
            },

            getter: function()
            {
                return this._rotation;
            }
        },

        /**
         * Indicates the x position of shape.
         *
         * @attribute x
         * @type Number
         */
        x: {
            value: 0
        },

        /**
         * Indicates the y position of shape.
         *
         * @attribute y
         * @type Number
         */
        y: {
            value: 0
        },

        /**
         * Dom node of the shape
         *
         * @attribute node
         * @type HTMLElement
         * @readOnly
         */
        node: {
            readOnly: true,

            valueFn: "_getNode" 
        },

        /**
         * Unique id for class instance.
         *
         * @attribute id
         * @type String
         */
        id: {
            valueFn: function()
            {
                return Y.guid();
            },

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("id", val);
                return val;
            }
        },
        
        /**
         * 
         * @attribute width
         */
        width: {
            value: 0
        },

        /**
         * 
         * @attribute height
         */
        height: {
            value: 0
        },

        /**
         * Indicates whether the shape is visible.
         *
         * @attribute visible
         * @type Boolean
         */
        visible: {
            value: true,

            setter: function(val){
                var visibility = val ? "visible" : "hidden";
                this.get("node").style.visibility = visibility;
                return val;
            }
        },

        /**
         * Contains information about the fill of the shape. 
         *  <dl>
         *      <dt>color</dt><dd>The color of the fill.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the fill. The default value is 1.</dd>
         *  </dl>
         *
         * @attribute fill
         * @type Object 
         */
        fill: {
            valueFn: "_getDefaultFill",
            
            setter: function(val)
            {
                var fill,
                    tmpl = this.get("fill") || this._getDefaultFill();
                fill = (val) ? Y.merge(tmpl, val) : null;
                if(fill && fill.color)
                {
                    if(fill.color === undefined || fill.color == "none")
                    {
                        fill.color = null;
                    }
                }
                return fill;
            }
        },

        /**
         * Contains information about the stroke of the shape.
         *  <dl>
         *      <dt>color</dt><dd>The color of the stroke.</dd>
         *      <dt>weight</dt><dd>Number that indicates the width of the stroke.</dd>
         *      <dt>alpha</dt><dd>Number between 0 and 1 that indicates the opacity of the stroke. The default value is 1.</dd>
         *      <dt>dashstyle</dt>Indicates whether to draw a dashed stroke. When set to "none", a solid stroke is drawn. When set to an array, the first index indicates the
         *      length of the dash. The second index indicates the length of gap.
         *  </dl>
         *
         * @attribute stroke
         * @type Object
         */
        stroke: {
            valueFn: "_getDefaultStroke",
            
            setter: function(val)
            {
                var tmpl = this.get("stroke") || this._getDefaultStroke();
                return (val) ? Y.merge(tmpl, val) : null;
            }
        },
        
        /**
         * Indicates whether or not the instance will size itself based on its contents.
         *
         * @attribute autoSize 
         * @type Boolean
         */
        autoSize: {
            value: false
        },

        /**
         * Determines whether the instance will receive mouse events.
         * 
         * @attribute pointerEvents
         * @type string
         */
        pointerEvents: {
            value: "visiblePainted"
        },

        /**
         * Reference to the container Graphic.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {
            setter: function(val){
                this.after("shapeUpdate", Y.bind(val.updateSize, val));
                return val;
            }
        }
    }
});

/**
 * The Path class creates a graphic object with editable 
 * properties.
 *
 * @class Path
 * @extends Shape
 */
Y.Path = Y.Base.create("path", Y.Shape, [Y.Drawing], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "shape",

    /**
     * Draws the graphic.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var fill = this.get("fill"),
            stroke = this.get("stroke"),
            node = this.get("node"),
            w = this.get("width"),
            h = this.get("height"),
            path = this.get("path"),
            pathEnd = "";
        node.style.visible = "hidden";
        this._fillChangeHandler();
        this._strokeChangeHandler();
        if(path)
        {
            if(fill && fill.color)
            {
                pathEnd += ' x';
            }
            if(stroke)
            {
                pathEnd += ' e';
            }
        }
        if(path)
        {
            node.path = path + pathEnd;
        }
        if(w && h)
        {
            node.coordSize =  w + ', ' + h;
            node.style.position = "absolute";
            node.style.width = w + "px";
            node.style.height = h + "px";
        }
        this.set("path", path);
        this.fire("shapeUpdate");
        node.style.visible = "visible";
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
    },

    /**
     * Clears the path.
     *
     * @method clear
     */
    clear: function()
    {
        this.set("path", "");
    }
}, {
    ATTRS: {
        /**
         * 
         * @attribute width
         */
        width: {
            getter: function()
            {
                return this._width;
            },

            setter: function(val)
            {
                this._width = val;
                return val;
            }
        },

        /**
         * 
         * @attribute height
         */
        height: {
            getter: function()
            {
                return this._height;
            },

            setter: function(val)
            {
                this._height = val;
                return val;
            }
        },
        
        /**
         * Indicates the path used for the node.
         *
         * @attribute path
         * @type String
         */
        path: {
            getter: function()
            {
                return this._path;
            },

            setter: function(val)
            {
                this._path = val;
                return val;
            }
        }
    }
});
/**
 * Draws rectangles
 */
 Y.Rect = Y.Base.create("rect", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "rect"
 });
/**
 * Draws an ellipse
 */
 Y.Ellipse = Y.Base.create("ellipse", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "oval"
 }, {
    ATTRS: {
        /**
         * Horizontal radius for the ellipse.
         *
         * @attribute xRadius
         * @type Number
         */
        xRadius: {
            lazyAdd: false,

            getter: function()
            {
                var val = this.get("width");
                val = Math.round((val/2) * 100)/100;
                return val;
            },
            
            setter: function(val)
            {
                var w = val * 2; 
                this.set("width", w);
                return val;
            }
        },

        /**
         * Vertical radius for the ellipse.
         *
         * @attribute yRadius
         * @type Number
         */
        yRadius: {
            lazyAdd: false,
            
            getter: function()
            {
                var val = this.get("height");
                val = Math.round((val/2) * 100)/100;
                return val;
            },

            setter: function(val)
            {
                var h = val * 2;
                this.set("height", h);
                return val;
            }
        }
    }
 });
/**
 * Draws an circle
 */
 Y.Circle = Y.Base.create("circle", Y.Shape, [], {
    /**
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "oval",
    
    /**
     * Adds change listeners to the shape.
     *
     * @private
     * @method _addListeners
     */
    _addListeners: function()
    {
        this.after("initializedChange", this._updateHandler);
        this.after("transformAdded", this._updateHandler);
        this.after("strokeChange", this._updateHandler);
        this.after("fillChange", this._updateHandler);
        this.after("radiusChange", this._updateHandler);
        this.after("xChange", this._updateHandler);
        this.after("yChange", this._updateHandler);
    }
 }, {
    ATTRS: {
        /**
         * Horizontal radius for the circle.
         *
         * @attribute radius
         * @type Number
         */
        radius: {
            lazyAdd: false,

            value: 0
        },

        /**
         * Width of the circle
         *
         * @attribute width
         * @readOnly
         * @type Number
         */
        width: {
            readOnly: true,

            getter: function()
            {   
                var radius = this.get("radius"),
                val = radius && radius > 0 ? radius * 2 : 0;
                return val;
            }
        },

        /**
         * Width of the circle
         *
         * @attribute width
         * @readOnly
         * @type Number
         */
        height: {
            readOnly: true,

            getter: function()
            {   
                var radius = this.get("radius"),
                val = radius && radius > 0 ? radius * 2 : 0;
                return val;
            }
        }
    }
 });
/**
 * Graphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class Graphic
 * @constructor
 */
var Graphic = function(config) {
    
    this.initializer.apply(this, arguments);
};

Graphic.prototype = {
    getXY: function()
    {
        var node = Y.one(this.node.parentNode),
            xy = node.getXY();
        return xy;
    },

    /**
     * Indicates whether or not the instance will size itself based on its contents.
     *
     * @property autoSize 
     * @type String
     */
    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.id = Y.guid();
        this.node = this._createGraphic();
        this.node.setAttribute("id", this.id);
        this.setSize(w, h);
        this._initProps();
    },

    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        this._path = '';
        this._removeChildren(this.node);
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        this.node.parentNode.removeChild(this.node);
    },

    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param node
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

    /**
     * Shows and and hides a the graphic instance.
     *
     * @method toggleVisible
     * @param val {Boolean} indicates whether the instance should be visible.
     */
    toggleVisible: function(val)
    {
        this._toggleVisible(this.node, val);
    },

    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {HTMLElement} node element to toggle
     * @param {Boolean} val indicates visibilitye
     * @private
     */
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
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
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
   
    /**
     * Sets the positon of the graphics object.
     *
     * @method setPosition
     * @param {Number} x x-coordinate for the object.
     * @param {Number} y y-coordinate for the object.
     */
    setPosition: function(x, y)
    {
        x = Math.round(x);
        y = Math.round(y);
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(parentNode) {
        var w = parseInt(parentNode.getComputedStyle("width"), 10),
            h = parseInt(parentNode.getComputedStyle("height"), 10);
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        this._initProps();
        return this;
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
     * Clears the properties
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        this._fillColor = null;
        this._strokeColor = null;
        this._strokeOpacity = null;
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
        this._dashstyle = null;
    },

    /**
     * Creates a group element
     *
     * @method _createGraphic
     * @private
     */
    _createGraphic: function() {
        var group = this._createGraphicNode("group");
        group.style.display = "block";
        group.style.position = 'absolute';
        return group;
    },

    /**
     * Creates a graphic node
     *
     * @method _createGraphicNode
     * @param {String} type node type to create
     * @param {String} pe specified pointer-events value
     * @return HTMLElement
     * @private
     */
    _createGraphicNode: function(type)
    {
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
    
    },

    /**
     * Adds a shape instance to the graphic instance.
     *
     * @method addShape
     * @param {Shape} shape The shape instance to be added to the graphic.
     */
    addShape: function(shape)
    {
        var node = shape.get("node");
        shape.set("graphic", this);
        this.node.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        if(!this._shapes)
        {
            this._shapes = {};
        }
        this._graphicsList.push(node);
        this._shapes[shape.get("id")] = shape;
    },

    /**
     * Returns a shape based on the id of its dom node.
     *
     * @method getShape
     * @param {String} id Dom id of the shape's node attribute.
     * @return Shape
     */
    getShape: function(id)
    {
        return this._shapes[id];
    },

    /**
     * Adds a child to the <code>node</code>.
     *
     * @method addChild
     * @param {HTMLElement} element to add
     * @private
     */
    addChild: function(child)
    {
        this.node.appendChild(child);
    },

    /**
     * Updates the size of the graphics container and.
     *
     * @method updateSize
     */
    updateSize: function(e)
    {
        var bounds,
            i = 0,
            shape,
            shapes = this._graphicsList,
            len = shapes.length,
            w,
            h;
        this._left = 0;
        this._right = 0;
        this._top = 0;
        this._bottom = 0;
        for(; i < len; ++i)
        {
            shape = this.getShape(shapes[i].getAttribute("id"));
            bounds = shape.getBounds();
            this._left = Math.min(this._left, bounds.left);
            this._top = Math.min(this._top, bounds.top);
            this._right = Math.max(this._right, bounds.right);
            this._bottom = Math.max(this._bottom, bounds.bottom);
        }
        w = this._width = this._right - this._left;
        h = this._height = this._bottom - this._top;
        this.setSize(this._width, this._height);
    },
    
    /**
     * @private
     */
    _left: 0,
    
    /**
     * @private
     */
    _right: 0,
    
    /**
     * @private
     */
    _top: 0,
    
    /**
     * @private
     */
    _bottom: 0
};
Y.Graphic = Graphic;



}, '@VERSION@' ,{requires:['dom', 'event-custom', 'base', 'graphics'], skinnable:false});
