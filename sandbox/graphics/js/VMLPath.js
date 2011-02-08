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
