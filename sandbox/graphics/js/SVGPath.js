/**
 * The Path class creates a graphic object with editable 
 * properties.
 *
 * @class Path
 * @extends Shape
 */
Y.Path = Y.Base.create("path", Y.Shape, [Y.Drawing], {
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
     * Indicates the type of shape
     *
     * @property _type
     * @readOnly
     * @type String
     */
    _type: "path",

    /**
     * Draws the graphic.
     *
     * @method _draw
     * @private
     */
    _draw: function()
    {
        var pathArray = this._pathArray,
            segmentArray,
            pathType,
            len,
            val,
            val2,
            i,
            path = "",
            node = this.get("node"),
            left = this._left + this.get("translateX"),
            top = this._top + this._translateY;
        while(pathArray && pathArray.length > 0)
        {
            segmentArray = pathArray.shift();
            len = segmentArray.length;
            pathType = segmentArray[0];
            path += " " + pathType + (segmentArray[1] - left);
            switch(pathType)
            {
                case "L" :
                case "M" :
                    for(i = 2; i < len; ++i)
                    {
                        val = (i % 2 === 0) ? top : left;
                        val = segmentArray[i] - val;
                        path += ", " + val;
                    }
                break;
                case "Q" :
                case "C" :
                    for(i = 2; i < len; ++i)
                    {
                        val = (i % 2 === 0) ? top : left;
                        val2 = segmentArray[i];
                        val2 -= val;
                        path += " " + val2;
                    }
                break;

            }
        }
        if(this._fill)
        {
            path += 'z';
        }
        node.setAttribute("d", path);
        this._translate(left, top);
        this.set("path", path);
        this._fillChangeHandler();
        this._strokeChangeHandler();
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
        var node = this.get("node");
        this._translateX = x;
        this._translateY = y;
        this._translate(this._left + x, this._top + y);
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
        path: {}
    }
});
