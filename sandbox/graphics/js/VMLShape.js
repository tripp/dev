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

