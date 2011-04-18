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
