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

