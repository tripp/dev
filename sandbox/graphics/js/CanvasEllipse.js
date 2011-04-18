/**
 * Draws ellipses
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

    /**
     * @private
     */
    _draw: function()
    {
        var w = this.get("width"),
            h = this.get("height");
        this.drawEllipse(0, 0, w, h);
        this._paint();
    }
 });
