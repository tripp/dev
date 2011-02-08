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
    _type: "ellipse",

    _draw: function()
    {
        var node = this.get("node"),
            w = this.get("width"),
            h = this.get("height"),
            x = this.get("x"),
            y = this.get("y"),
            xRadius = w * 0.5,
            yRadius = h * 0.5,
            cx = x + xRadius,
            cy = y + yRadius;
        node.setAttribute("rx", xRadius);
        node.setAttribute("ry", yRadius);
        node.setAttribute("cx", cx);
        node.setAttribute("cy", cy);
        this._fillChangeHandler();
        this._strokeChangeHandler();
    }
 }, {
    ATTRS: {
        /**
         * Horizontal radius for the ellipse.
         *
         * @attribute xRadius
         * @type Number
         */
        xRadius: {
            readOnly: true,

            getter: function()
            {
                var val = this.get("width");
                if(val) 
                {
                    val *= 0.5;
                }
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
            readOnly: true,

            getter: function()
            {
                var val = this.get("height");
                if(val) 
                {
                    val *= 0.5;
                }
                return val;
            }
        },

        /**
         * The x-coordinate based on the center of the circle.
         *
         * @attribute cx
         * @type Number
         */
        x: {
            lazyAdd: false,
            
            value: 0
            /*,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("cx", val);
                return val;
            }*/
        },

        /**
         * The y-coordinate based on the center of the circle.
         *
         * @attribute cy
         * @type Number
         */
        y: {
            lazyAdd: false
            /*,

            value: 0,

            setter: function(val)
            {
                var node = this.get("node");
                node.setAttribute("cy", val);
                return val;
            }*/
        }
    }
 });
