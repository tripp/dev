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
    },
   
    /**
     * Add a class name to each node.
     *
     * @method addClass
     * @param {String} className the class name to add to the node's class attribute 
     */
    addClass: function(className)
    {
        var node = this.get("node");
        node.className.baseVal = Y.Lang.trim([node.className.baseVal, className].join(' '));
    },

    /**
     * Removes a class name from each node.
     *
     * @method removeClass
     * @param {String} className the class name to remove from the node's class attribute
     */
    removeClass: function(className)
    {
        var node = this.get("node"),
            classString = node.className.baseVal;
        classString = classString.replace(new RegExp(className + ' '), className).replace(new RegExp(className), '');
        node.className.baseVal = classString;
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
     * @param {SVGShape | HTMLElement} needle The possible node or descendent
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
     * Creates the dom node for the shape.
     *
     * @private
     * @return HTMLElement
     */
    _getNode: function()
    {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
            v = this.get("pointerEvents") || "none",
            id = this.get("id");
        node.setAttribute("pointer-events", v);
        node.setAttribute("class", "yui3-" + this.name);
        node.setAttribute("id", id);
        id = "#" + id;
        Y.on('mousedown', Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mouseup',  Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mouseover', Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mousemove',  Y.bind(this._nodeEventDispatcher, this), id);
        Y.on('mouseout', Y.bind(this._nodeEventDispatcher, this), id);
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
        this.after("graphicChange", this._updateHandler);
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
            dash,
            linejoin = stroke.linejoin || "round";
        if(stroke && stroke.weight && stroke.weight > 0)
        {
            strokeAlpha = stroke.alpha;
            dashstyle = stroke.dashstyle || "none";
            dash = Y.Lang.isArray(dashstyle) ? dashstyle.toString() : dashstyle;
            stroke.color = stroke.color || "#000000";
            stroke.weight = stroke.weight || 1;
            stroke.alpha = Y.Lang.isNumber(strokeAlpha) ? strokeAlpha : 1;
            stroke.linecap = stroke.linecap || "butt";
            node.setAttribute("stroke-dasharray", dash);
            node.setAttribute("stroke", stroke.color);
            node.setAttribute("stroke-linecap", stroke.linecap);
            node.setAttribute("stroke-width",  stroke.weight);
            node.setAttribute("stroke-opacity", stroke.alpha);
            if(linejoin == "round" || linejoin == "bevel")
            {
                node.setAttribute("stroke-linejoin", linejoin);
            }
            else
            {
                linejoin = parseInt(linejoin, 10);
                if(Y.Lang.isNumber(linejoin))
                {
                    node.setAttribute("stroke-miterlimit",  Math.max(linejoin, 1));
                    node.setAttribute("stroke-linejoin", "miter");
                }
            }
        }
        else
        {
            node.setAttribute("stroke", "none");
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
            type = fill.type;
        if(fill)
        {
            if(type == "linear" || type == "radial")
            {
                this._setGradientFill(fill);
                node.setAttribute("fill", "url(#grad" + this.get("id") + ")");
            }
            else if(!fill.color)
            {
                node.setAttribute("fill", "none");
            }
            else
            {
                fillAlpha = fill.alpha; 
                fill.alpha = Y.Lang.isNumber(fillAlpha) ? fillAlpha : 1;
                node.setAttribute("fill", fill.color);
                node.setAttribute("fill-opacity", fillAlpha);
            }
        }
        else
        {
            node.setAttribute("fill", "none");
        }
    },


    /**
     * Returns a linear gradient fill
     *
     * @method _getLinearGradient
     * @param {String} type gradient type
     * @private
     */
    _setGradientFill: function(fill) {
        if(!this.get("graphic")) return;
        var offset,
            opacity,
            color,
            stopNode,
            isNumber = Y.Lang.isNumber,
            graphic = this.get("graphic"),
            type = fill.type, 
            gradientNode = graphic.getGradientNode("grad" + this.get("id"), type),
            stops = fill.stops,
            w = this.get("width"),
            h = this.get("height"),
            rotation = fill.rotation,
            i,
            len,
            def,
            stop,
            x1 = "0%", 
            x2 = "100%", 
            y1 = "50%", 
            y2 = "50%",
            cx = fill.cx,
            cy = fill.cy,
            fx = fill.fx,
            fy = fill.fy,
            r = fill.r;
        if(type == "linear")
        {
            gradientNode.setAttribute("gradientTransform", "rotate(" + rotation + "," + (w/2) + ", " + (h/2) + ")");
            gradientNode.setAttribute("width", w);
            gradientNode.setAttribute("height", h);
            gradientNode.setAttribute("x1", x1);
            gradientNode.setAttribute("y1", y1);
            gradientNode.setAttribute("x2", x2);
            gradientNode.setAttribute("y2", y2);
            gradientNode.setAttribute("gradientUnits", "userSpaceOnUse");
        }
        else
        {
            gradientNode.setAttribute("cx", (cx * 100) + "%");
            gradientNode.setAttribute("cy", (cy * 100) + "%");
            gradientNode.setAttribute("fx", (fx * 100) + "%");
            gradientNode.setAttribute("fy", (fy * 100) + "%");
            gradientNode.setAttribute("r", (r * 100) + "%");
        }
        
        len = stops.length;
        def = 0;
        for(i = 0; i < len; ++i)
        {
            stop = stops[i];
            opacity = stop.opacity;
            color = stop.color;
            offset = stop.offset || i/(len - 1);
            offset = Math.round(offset * 100) + "%";
            opacity = isNumber(opacity) ? opacity : 1;
            opacity = Math.max(0, Math.min(1, opacity));
            def = (i + 1) / len;
            stopNode = graphic._createGraphicNode("stop");
            stopNode.setAttribute("offset", offset);
            stopNode.setAttribute("stop-color", color);
            stopNode.setAttribute("stop-opacity", opacity);
            gradientNode.appendChild(stopNode);
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
        this._translate.apply(this, arguments);
    },

    /**
     * Applies translate transformation.
     *
     * @method translate
     * @param {Number} x The x-coordinate
     * @param {Number} y The y-coordinate
     * @protected
     */
    _translate: function(x, y)
    {
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
        this._addTransform("skewX", arguments);
     },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewY: function(y)
     {
        this._addTransform("skewY", arguments);
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
        this._addTransform("scale", arguments);
    },

    /**
     * Applies a matrix transformation
     *
     * @method matrix
     */
    matrix: function(a, b, c, d, e, f)
    {
        this._addTransform("matrix", arguments);
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
            key,
            args,
            val,
            transform = node.getAttribute("transform"),
            test,
            transformOrigin;
        if(this._transformArgs)
        {
            if(this._transformArgs.hasOwnProperty("rotate"))
            {
                transformOrigin = this.get("transformOrigin");
                args = this._transformArgs.rotate;
                args[1] = this.get("x") + (this.get("width") * transformOrigin[0]);
                args[2] = this.get("y") + (this.get("height") * transformOrigin[1]);
            }
        }
        for(key in this._transformArgs)
        {
            if(key && this._transformArgs.hasOwnProperty(key))
            {
                val = key + "(" + this._transformArgs[key].toString() + ")";
                if(transform && transform.length > 0)
                {
                    test = new RegExp(key + '(.*)');
                    if(transform.indexOf(key) > -1)
                    {
                        transform = transform.replace(test, val);
                    }
                    else
                    {
                        transform += " " + val;
                    }
                }
                else
                {
                    transform = val;
                }
            }
        }
        if(transform)
        {
            node.setAttribute("transform", transform);
        }
    },

    /**
     * Updates the shape.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var node = this.get("node");
        node.setAttribute("width", this.get("width"));
        node.setAttribute("height", this.get("height"));
        node.setAttribute("x", this.get("x"));
        node.setAttribute("y", this.get("y"));
        node.style.left = this.get("x") + "px";
        node.style.top = this.get("y") + "px";
        this._fillChangeHandler();
        this._strokeChangeHandler();
        this._updateTransform();
    },

    /**
     * Change event listener
     *
     * @private
     * @method _updateHandler
     */
    _updateHandler: function(e)
    {
        this._draw();
        this.fire("shapeUpdate");
    },
    
    /**
     * Storage for translateX
     *
     * @private
     */
    _translateX: 0,

    /**
     * Storage for translateY
     *
     * @private
     */
    _translateY: 0,

    /**
     * Returns the bounds for a shape.
     *
     * @method getBounds
     * @return Object
     */
    getBounds: function()
    {
        var rotation = this.get("rotation"),
            absRot = Math.abs(rotation),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            w = this.get("width"),
            h = this.get("height"),
            stroke = this.get("stroke"),
            x = this.get("x"),
            y = this.get("y"),
            wt = 0,
            tx = this.get("translateX"),
            ty = this.get("translateY"),
            bounds = {},
            transformOrigin = this.get("transformOrigin"),
            originalWidth,
            originalHeight,
            tox = transformOrigin[0],
            toy = transformOrigin[1];
        if(rotation !== 0)
        {
            originalWidth = w;
            originalHeight = h;
            w = (cosRadians * h) + (sinRadians * w);
            h = (cosRadians * h) + (sinRadians * w);
            x = (x + originalWidth * tox) - (sinRadians * (originalHeight * (1 - toy))) - (cosRadians * (originalWidth * tox));
            y = (y + originalHeight * toy) - (sinRadians * (originalWidth * tox)) - (cosRadians * originalHeight * toy);
        }
        if(stroke && stroke.weight)
        {
            wt = stroke.weight;
        }
        bounds.left = x - wt + tx;
        bounds.top = y - wt + ty;
        bounds.right = x + w + wt + tx;
        bounds.bottom = y + h + wt + ty;
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
         * 
         * @attribute width
         */
        width: {},

        /**
         * 
         * @attribute height
         */
        height: {},

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
         *      <dt>type</dt><dd>Type of fill.
         *          <dl>
         *              <dt>solid</dt><dd>Solid single color fill. (default)</dd>
         *              <dt>linear</dt><dd>Linear gradient fill.</dd>
         *              <dt>radial</dt><dd>Radial gradient fill.</dd>
         *          </dl>
         *      </dd>
         *  </dl>
         *
         *  <p>If a gradient (linear or radial) is specified as the fill type. The following properties are used:
         *  <dl>
         *      <dt>stops</dt><dd>An array of objects containing the following properties:
         *          <dl>
         *              <dt>color</dt><dd></dd>
         *              <dt>opacity</dt><dd></dd>
         *              <dt>offset</dt><dd>Number between 0 and 1 indicating where the color stop is positioned.</dd> 
         *          </dl>
         *      </dd>
         *      <dt></dt><dd></dd>
         *      <dt></dt><dd></dd>
         *      <dt></dt><dd></dd>
         *  </dl>
         *  </p>
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
         * Performs a translate on the x-coordinate. When translating x and y coordinates,
         * use the <code>translate</code> method.
         *
         * @attribute translateX
         * @type Number
         */
        translateX: {
            getter: function()
            {
                return this._translateX;
            },

            setter: function(val)
            {
                this._translateX = val;
                this._transform(val, this._translateY);
                return val;
            }
        },
        
        /**
         * Performs a translate on the y-coordinate. When translating x and y coordinates,
         * use the <code>translate</code> method.
         *
         * @attribute translateX
         * @type Number
         */
        translateY: {
            getter: function()
            {
                return this._translateY;
            },

            setter: function(val)
            {
                this._translateY = val;
                this._transform(this._translateX, val);
                return val;
            }
        },

        /**
         * The node used for gradient fills.
         *
         * @attribute gradientNode
         * @type HTMLElement
         */
        gradientNode: {
            setter: function(val)
            {
                if(Y.Lang.isString(val))
                {
                    val = this.get("graphic").getGradientNode("linear", val);
                }
                return val;
            }
        },

        /**
         * Reference to the container Graphic.
         *
         * @attribute graphic
         * @type Graphic
         */
        graphic: {
            writeOnce: true,
            setter: function(val){
                this.after("shapeUpdate", Y.bind(val.updateCoordSpace, val));
                return val;
            }
        }
    }
});

