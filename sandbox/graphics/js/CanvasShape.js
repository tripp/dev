/**
 * Base class for creating shapes.
 *
 * @class Shape
 */
 Y.Shape = Y.Base.create("shape", Y.Base, [Y.Drawing], {
    /**
     * Left edge of the path
     *
     * @private
     */
    _left: 0,

    /**
     * Right edge of the path
     *
     * @private
     */
    _right: 0,
    
    /**
     * Top edge of the path
     *
     * @private
     */
    _top: 0, 
    
    /**
     * Bottom edge of the path
     *
     * @private
     */
    _bottom: 0,

    /**
     * Initializes the shape
     *
     * @private
     * @method _initialize
     */
    initializer: function()
    {
        this._xcoords = [0];
        this._ycoords = [0];
        this.get("stroke");
        this.get("fill");
        this._addListeners();
        var node = this.get("node");
        node.setAttribute("width", this.get("width"));
        node.setAttribute("height", this.get("height"));
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
        var node = Y.config.doc.createElement('canvas');
        this._context = node.getContext('2d');
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
    },
    
    /**
     * Adds a stroke to the shape node.
     *
     * @method _strokeChangeHandler
     * @private
     */
    _setStrokeProps: function(stroke)
    {
        var color = stroke.color,
            weight = stroke.weight,
            alpha = stroke.alpha,
            dashstyle = stroke.dashstyle;
        this._dashstyle = (dashstyle && Y.Lang.isArray(dashstyle) && dashstyle.length > 1) ? dashstyle : null;
        this._strokeWeight = weight;

        if (weight) 
        {
            this._stroke = 1;
        } 
        else 
        {
            this._stroke = 0;
        }
        if (alpha) {
            this._strokeStyle = this._2RGBA(color, alpha);
        }
        else
        {
            this._strokeStyle = color;
        }
    },
    
    /**
     * Adds a fill to the shape node.
     *
     * @method _fillChangeHandler
     * @private
     */
    _setFillProps: function(fill)
    {
        var color = fill.color,
            alpha = fill.alpha;
        if (alpha) 
        {
           color = this._2RGBA(color, alpha);
        } 
        else 
        {
            color = this._2RGB(color);
        }

        this._fillColor = color;
        this._fillType = 'solid';
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
        var ctx = this._context;
        ctx.save();
        ctx.translate(x, y);
        ctx.restore();
    },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewX: function(x)
     {
     },

    /**
     * Applies a skew to the x-coordinate
     *
     * @method skewX:q
     * @param {Number} x x-coordinate
     */
     skewY: function(y)
     {
     },

     /**
      * Applies a rotation.
      *
      * @method rotate
      * @param
      */
     rotate: function(deg, translate)
     {
        var node = this.get("node");
        node.style.MozTransformOrigin =  "0 0";
        node.style.MozTransform = "rotate(" + deg + "deg)";
        node.style.webkitTransformOrigin = "0 0";
        node.style.webkitTransform = "rotate(" + deg + "deg)";
        node.style.msTransformOrigin =  "0 0";
        node.style.msTransform = "rotate(" + deg + "deg)";
        node.style.OTransformOrigin =  "0 0";
        node.style.OTransform = "rotate(" + deg + "deg)";
     },

    /**
     * Applies a scale transform
     *
     * @method scale
     * @param {Number} val
     */
    scale: function(val)
    {
    },

    /**
     * Applies a matrix transformation
     *
     * @method matrix
     */
    matrix: function(a, b, c, d, e, f)
    {
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        this._draw();
    },
    
    /**
     * @private
     */
    _draw: function()
    {
        this._paint();
    },

    /**
     * Completes a shape or drawing
     *
     * @method _paint
     * @private
     */
    _paint: function()
    {
        if(!this._methods)
        {
            return;
        }
        var node = this.get("node"),
            w = this.get("width") || this._width,
            h = this.get("height") || this._height,
            context = this._context,
            fill,
            methods = this._methods,
            i = 0,
            lineToMethods = this._lineToMethods,
            lineToLen = lineToMethods ? lineToMethods.length : 0,
            method,
            args,
            len = methods ? methods.length : 0;
        node.setAttribute("width", w);
        node.setAttribute("height", h);
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
        context.beginPath();
        for(i = 0; i < len; ++i)
        {
            args = methods[i];
            if(args && args.length > 0)
            {
                method = args.shift();
                if(method)
                {
                    if(method && method == "lineTo" && this._dashstyle)
                    {
                        args.unshift(this._xcoords[i] - this._left, this._ycoords[i] - this._top);
                        this._drawDashedLine.apply(this, args);
                    }
                    else
                    {
                        context[method].apply(context, args); 
                    }
                }
            }
        }


        if (this._fillType) {
            context.fillStyle = this._fillColor;
            context.closePath();
        }

        if (this._fillType) {
            context.fill();
        }

        if (this._stroke) {
            if(this._strokeWeight)
            {
                context.lineWidth = this._strokeWeight;
            }
            context.strokeStyle = this._strokeStyle;
            context.stroke();
        }
        this._drawingComplete = true;
        this._clearAndUpdateCoords();
        this._updateNodePosition();
    },

    /**
     * Draws a dashed line between two points.
     * 
     * @method _drawDashedLine
     * @param {Number} xStart	The x position of the start of the line
     * @param {Number} yStart	The y position of the start of the line
     * @param {Number} xEnd		The x position of the end of the line
     * @param {Number} yEnd		The y position of the end of the line
     * @private
     */
    _drawDashedLine: function(xStart, yStart, xEnd, yEnd)
    {
        var context = this._context,
            dashsize = this._dashstyle[0],
            gapsize = this._dashstyle[1],
            segmentLength = dashsize + gapsize,
            xDelta = xEnd - xStart,
            yDelta = yEnd - yStart,
            delta = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2)),
            segmentCount = Math.floor(Math.abs(delta / segmentLength)),
            radians = Math.atan2(yDelta, xDelta),
            xCurrent = xStart,
            yCurrent = yStart,
            i;
        xDelta = Math.cos(radians) * segmentLength;
        yDelta = Math.sin(radians) * segmentLength;
        
        for(i = 0; i < segmentCount; ++i)
        {
            context.moveTo(xCurrent, yCurrent);
            context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
            xCurrent += xDelta;
            yCurrent += yDelta;
        }
        
        context.moveTo(xCurrent, yCurrent);
        delta = Math.sqrt((xEnd - xCurrent) * (xEnd - xCurrent) + (yEnd - yCurrent) * (yEnd - yCurrent));
        
        if(delta > dashsize)
        {
            context.lineTo(xCurrent + Math.cos(radians) * dashsize, yCurrent + Math.sin(radians) * dashsize);
        }
        else if(delta > 0)
        {
            context.lineTo(xCurrent + Math.cos(radians) * delta, yCurrent + Math.sin(radians) * delta);
        }
        
        context.moveTo(xEnd, yEnd);
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
         * The x-coordinate for the shape.
         */
        x: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.left = (val + this._left) + "px";
                return val;
            }
        },

        /**
         * The x-coordinate for the shape.
         */
        y: {
            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.style.top = (val + this._top) + "px";
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
                val = (val) ? Y.merge(tmpl, val) : null;
                this._setFillProps(val);
                return val;
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
                val = (val) ? Y.merge(tmpl, val) : null;
                this._setStrokeProps(val);
                return val;
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

