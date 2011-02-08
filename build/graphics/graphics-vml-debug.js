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
Y.log('using VML');

function Drawing() {}

Drawing.prototype = {
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
        this._path += ' c ' + Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y;
        this._trackSize(x, y);
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
        var hiX = Math.max(x, cpx),
            hiY = Math.max(y, cpy),
            loX = Math.min(x, cpx),
            loY = Math.min(y, cpy);
        this._path += ' qb ' + cpx + ", " + cpy + ", " + x + ", " + y;
        this._trackSize(hiX, hiY);
        this._trackSize(loX, loY);
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
function Fill(){}

Fill.prototype = {
    /** 
     * Specifies a gradient fill used by subsequent calls to other drawing methods.
     *
     * @method beginGradientFill
     * @param {Object} config
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
            alpha = Y.Lang.isNumber(alpha) ? alpha : 1;
            oi = i > 0 ? i + 1 : "";
            alphas[i] = Math.round(alpha * 100) + "%";
            fill["opacity" + oi] = alpha;
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
     * Returns ths actual fill object to be used in a drawing or shape
     *
     * @method _getFill
     * @private
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
    }
};
Y.Fill = Fill;
/**
 * Base class for creating shapes.
 *
 * @class Shape
 */
 Y.Shape = Y.Base.create("shape", Y.Base, [Y.Fill], {
    /**
     * Initializes the shape
     *
     * @private
     * @method _initialize
     */
    initializer: function()
    {
        this._addListeners();
        this._draw();
    },
   
    /**
     * Creates the dom node for the shape.
     *
     * @private
     * @return HTMLElement
     */
    _getNode: function()
    {
        var node = this._createGraphicNode();
        return node;
    },

    /**
     * Adds change listeners to the shape.
     *
     * @private
     * @method _addListeners
     */
    _addListeners: function()
    {
        this.after("strokeChange", this._strokeChangeHandler);
        this.after("fillChange", this._fillChangeHandler);
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
            i = 0,
            len;
        if(stroke && stroke.weight && stroke.weight > 0)
        {
            strokeAlpha = stroke.alpha;
            dashstyle = stroke.dashstyle || "none";
            stroke.color = stroke.color || "#000000";
            stroke.weight = stroke.weight || 1;
            stroke.alpha = Y.Lang.isNumber(strokeAlpha) ? strokeAlpha : 1;
            node.setAttribute("stroked", true);
            node.setAttribute("strokeColor", stroke.color);
            node.setAttribute("strokeWeight", stroke.weight);
            if(stroke.alpha < 1 || (dashstyle && dashstyle != "none"))
            {
                if(!this._strokeNode)
                {
                    this._strokeNode = this._createGraphicNode("stroke");
                    node.appendChild(this._strokeNode);
                }
                this._strokeNode.setAttribute("opacity", stroke.alpha);
                if(Y.Lang.isArray(dashstyle))
                {
                    len = dashstyle.length;
                    for(; i > len; ++i)
                    {
                        dashstyle[i] = Math.round(dashstyle[i] / stroke.weight);
                    }
                    dashstyle = dashstyle.toString();
                    dashstyle = dashstyle.replace(/, /g, ",").replace(/,/g, " ");
                }
                this._strokeNode.setAttribute("dashstyle", dashstyle);
            }
        }
        else
        {
            node.setAttribute("stroked", false);
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
            fillAlpha;
        if(fill)
        {
            if(fill.type === "linear" || fill.type === "radial")
            {
                this.beginGradientFill(fill);
                //node.appendChild(this._getFill());
            }
            else if(fill.type === "bitmap")
            {
                this.beginBitmapFill(fill);
                //node.appendChild(this._getFill());
            }
            else
            {
                if(!fill.color)
                {
                    node.setAttribute("fill", "none");
                }
                else
                {
                    fillAlpha = fill.alpha; 
                    fill.alpha = Y.Lang.isNumber(fillAlpha) ? fillAlpha : 1;
                    node.setAttribute("fillColor", fill.color);
                    node.setAttribute("opacity", fill.alpha);
                }
            }
        }
        else
        {
            node.setAttribute("fill", "none");
            node.setAttribute("filled", false);
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
        //var node = this.get("node");
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
      * Applies a rotation.
      *
      * @method rotate
      * @param
      */
     rotate: function(deg, translate)
     {
        var node = this.get("node"),
            rot =  deg,
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11 = cosRadians,
            m12 = rot > 0 ? -sinRadians : sinRadians,
            m21 = -m12,
            m22 = m11,
            width = this.get("width"),
            height = this.get("height"),
            leftOffset = width,
            topOffset = 0,
            x = parseInt(node.style.left, 10) || node.getAttribute("x") || 0,    
            y = parseInt(node.style.top, 10) || node.getAttribute("y") || 0,    
            filterString = "";
            node.style.filter = null; 
            if(rot === 0)
            {
                leftOffset = width;
                topOffset -= height * 0.5;
            }
            else if(absRot === 90)
            {
                leftOffset = height;
                topOffset -= width * 0.5;
            }
            else if(rot > 0)
            {
                leftOffset = (cosRadians * width) + (height * rot/90);
                topOffset -= (sinRadians * width) + (cosRadians * (height * 0.5));
            }
            else
            {
                leftOffset = (cosRadians * width) + (absRot/90 * height);
                topOffset -= cosRadians * (height * 0.5);
            }
            node.style.left = (x - leftOffset) + "px";
            node.style.top = (y + topOffset) + "px";
            if(rot !== 0)
            {
                filterString += 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            }
            if(filterString)
            {
                node.style.filter = filterString;
            }
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
        //node.setAttribute("coordSize", w + ', ' + h);
        this._fillChangeHandler();
        this._strokeChangeHandler();
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
    }
 }, {
    ATTRS: {
        /**
         * Indicates the x position of shape.
         *
         * @attribute x
         * @type Number
         */
        x: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.left = val + "px";
                return val;
            }
        },

        /**
         * Indicates the y position of shape.
         *
         * @attribute y
         * @type Number
         */
        y: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.top = val + "px";
                return val;
            }
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
         * 
         * @attribute width
         */
        width: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("width", val);
                node.style.width = val + "px";
                return val;
            }
        },

        /**
         * 
         * @attribute height
         */
        height: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("height", val);
                node.style.height = val + "px";
                return val;
            }
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
         *
         * @attribute fill
         * @type Object
         */
        fill: {
            setter: function(val)
            {
                var tmpl = this.get("fill") || this._getAttrCfg("fill").defaultValue;
                return (val) ? Y.merge(tmpl, val) : null;
            }
        },

        /**
         * Contains information about the stroke of the shape.
         *
         * @attribute stroke
         * @type Object
         */
        stroke: {
            valueFn: function() {
                return {
                    weight: 1,
                    dashstyle: "none",
                    color: "#000",
                    alpha: 1.0
                };
            },
            
            setter: function(val)
            {
                var tmpl = this.get("fill") || this._getAttrCfg("fill").defaultValue;
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
            path = this.get("path");
        if(path)
        {
            if(fill)
            {
                path += ' x';
            }
            if(stroke)
            {
                path += ' e';
            }
        }
        if(path)
        {
            node.setAttribute("path",  path);
        }
        if(w && h)
        {
            node.setAttribute("coordSize", w + ', ' + h);
            node.style.position = "absolute";
            node.style.width = w + "px";
            node.style.height = h + "px";
            node.setAttribute("width", w);
            node.setAttribute("height", h);
        }
        this._fillChangeHandler();
        this._strokeChangeHandler();
        this.set("path", path);
    },

    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function()
    {
        this._draw();
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
        },

        /**
         * The x-coordinate based on the center of the circle.
         *
         * @attribute cx
         * @type Number
         */
        cx: {
            lazyAdd: false,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("cx", val);
                return val;
            }
        },

        /**
         * The y-coordinate based on the center of the circle.
         *
         * @attribute cy
         * @type Number
         */
        cy: {
            lazyAdd: false,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("cy", val);
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
    _type: "oval"
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

            value: 0,

            setter: function(val)
            {
                var node = this.get("node"),
                    size = val * 2;
                node.style.width = size + "px";
                node.style.height = size + "px";
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
        },
        
        /**
         * The x-coordinate based on the center of the circle.
         *
         * @attribute cx
         * @type Number
         */
        cx: {
            lazyAdd: false,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("cx", val);
                return val;
            }
        },

        /**
         * The y-coordinate based on the center of the circle.
         *
         * @attribute cy
         * @type Number
         */
        cy: {
            lazyAdd: false,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("cy", val);
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
        this.node = this._createGraphic();
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
        var w = Math.max(parentNode._node.offsetWidth || 0, this._canvasWidth),
            h = Math.max(parentNode._node.offsetHeight || 0, this._canvasHeight);
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

    addShape: function(shape)
    {
        var node = shape.get("node");
        this.node.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
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
    }
};
Y.Graphic = Graphic;



}, '@VERSION@' ,{skinnable:false, requires:['graphics']});
