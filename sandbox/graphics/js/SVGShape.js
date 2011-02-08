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
        var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + this._type),
            v = this.get("pointerEvents") || "none";
        node.setAttribute("pointer-events", v);
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
        this.after("strokeChange", this._updateHandler);
        this.after("fillChange", this._updateHandler);
        this.after("widthChange", this._updateHandler);
        this.after("heightChange", this._updateHandler);
        this.after("x", this._updateHandler);
        this.after("y", this._updateHandler);
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
            dashstyle;
        if(stroke && stroke.weight && stroke.weight > 0)
        {
            strokeAlpha = stroke.alpha;
            dashstyle = stroke.dashstyle || "none";
            stroke.color = stroke.color || "#000000";
            stroke.weight = stroke.weight || 1;
            stroke.alpha = Y.Lang.isNumber(strokeAlpha) ? strokeAlpha : 1;
            stroke.linecap = stroke.linecap || "square";
            node.setAttribute("stroke-dasharray", dashstyle);
            node.setAttribute("stroke", stroke.color);
            node.setAttribute("stroke-linecap", stroke.linecap);
            node.setAttribute("stroke-width",  stroke.weight);
            node.setAttribute("stroke-opacity", stroke.alpha);
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
                    node.setAttribute("fill", fill.color);
                    node.setAttribute("fill-opacity", fillAlpha);
                }
            }
        }
        else
        {
            node.setAttribute("fill", "none");
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
        var node = this.get("node"),
            translate = "translate(" + x + ", " + y + ")",
            transform = node.getAttribute("transform");
        //this._updateTransform("translate", /translate\(.*\)/, translate);
        if(transform && transform.length > 0)
        {
            if(transform.indexOf("translate") > -1)
            {
                transform = transform.replace(/translate\(.*\)/, translate);
            }
            else
            {
                transform += " " + translate;
            }
        }
        else
        {
            transform = translate;
        }
        node.setAttribute("transform", transform);
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewX: function(x)
     {
        var skewX= "skewX(" + x + ")";
        this._updateTransform("skewX", /skewX\(.*\)/, skewX);
     },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewY: function(y)
     {
        var skewY = "skewY(" + y + ")";
        this._updateTransform("skewY", /skewY\(.*\)/, skewY);
     },

     /**
      * Applies a rotation.
      *
      * @method rotate
      * @param
      */
     rotate: function(deg, translate)
     {
        var rotate = "rotate(" + deg + ")";
        this._updateTransform("rotate", /rotate\(.*\)/, rotate);
     },

    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(val)
    {
        var scale = "scale(" + val + ")";
        this._updateTransform("scale", /scale\(.*\)/, scale);
    },

    /**
     * Applies a matrix transformation
     *
     * @method matrix
     */
    matrix: function(a, b, c, d, e, f)
    {
        var matrix = "matrix(" + a + ", " + b + ", " + c + ", " + d + ", " + e + ", " + f + ")";
        this._updateTransform("matrix", /matrix\(.*\)/, matrix);
    },

    /**
     * @private
     */
    _updateTransform: function(type, test, val)
    {
        var node = this.get("node"),
            transform = node.getAttribute("transform");
        if(transform && transform.length > 0)
        {
            if(transform.indexOf(type) > -1)
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
        node.setAttribute("transform", transform);
    },

    /**
     * @private
     */
    _draw: function()
    {
        var node = this.get("node");
        node.setAttribute("width", this.get("width"));
        node.setAttribute("height", this.get("height"));
        this._fillChangeHandler();
        this._strokeChangeHandler();
    },

    _updateHandler: function(e)
    {
        this._draw();
    }
 }, {
    ATTRS: {
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

        x: {},

        y: {},

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
                    dashstyle: null,
                    color: "#000",
                    alpha: 1.0
                };
            },

            setter: function(val)
            {
                var tmpl = this.get("stroke") || this._getAttrCfg("stroke").defaultValue;
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

