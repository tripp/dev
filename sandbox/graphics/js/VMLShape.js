function VMLShape(cfg)
{
    this._initialize(cfg);
    this._draw();
}

Y.extend(VMLShape, Y.Graphic, {  
//VMLShape.prototype = {
    /**
     * Type of shape
     */
    type: "shape",
    
    _initialize: function(cfg) 
    {
        if(!cfg.graphic)
        {
            cfg.graphic = new Y.Graphic();
        }
        this._setProps(cfg);
    },

    width: 0,

    height: 0,

    /**
     * Returns a shape.
     */
    _setProps: function(cfg) {
        this.width = cfg.width && cfg.width >= 0 ? cfg.width : this.width;
        this.height = cfg.height && cfg.height >= 0 ? cfg.height : this.height;
        this.border = cfg.border || this.border;
        this.graphics = cfg.graphic || this.graphics;
        this.canvas = this.graphics;
        this.parentNode = this.graphics.node;
        this.fill = cfg.fill || this.fill;
        this.type = cfg.shape || this.type;
        this.props = cfg.props || this.props;
    },

    _draw: function()
    {
        var path,
            borderWeight = 0,
            fillWidth = this.width || 0,
            fillHeight = this.height || 0;
        this.graphics.setSize(fillWidth, fillHeight);
        if(this.node)
        {
            this.node.style.visible = "hidden";
        }
        else if(!this.node)
        {
            this.node = this.graphics._createGraphicNode(this.graphics._getNodeShapeType(this.type));
            this.graphics.node.appendChild(this.node);
        }
        if(this.type === "wedge")
        {
            path = this._getWedgePath(this.props);
            if(this.fill)
            {
                path += ' x';
            }
            if(this.border)
            {
                path += ' e';
            }
            this.node.path = path;
        }
        this._addBorder();
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            borderWeight = this.border.weight;
            fillWidth -= borderWeight;
            fillHeight -= borderWeight;
        }
        this.node.style.width = Math.max(fillWidth, 0) + "px";
        this.node.style.height = Math.max(fillHeight, 0) + "px";
        this._addFill();
        return this;
    },
    
    _addBorder: function()
    {
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            this.node.strokecolor = this.border.color || "#000000";
            this.node.strokeweight = this.border.weight || 1;
            this.node.stroked = true;
        }
        else
        {
            this.node.stroked = false;
        }
    },

    _addFill: function()
    {
        if(this.fill)
        {
            this.node.filled = true;
            if(this.fill.type === "linear" || this.fill.type === "radial")
            {
                this.beginGradientFill(this.fill);
                this.node.appendChild(this._getFill());
            }
            else if(this.fill.type === "bitmap")
            {
                this.beginBitmapFill(this.fill);
                this.node.appendChild(this._getFill());
            }
            else
            {
                if(!this.fill.color)
                {
                    this.node.filled = false;
                }
                else
                {
                    if(this.fillnode)
                    {
                        this._removeChildren.apply(this.graphics, [this.fillnode]);
                    }
                    this.fillnode = this._createGraphicNode("fill");
                    this.fillnode.type = "solid";
                    this.fillnode.color = this.fill.color;
                    this.fillnode.opacity = this.fill.alpha || 1;
                    this.node.appendChild(this.fillnode);
                }
            }
        }
        else
        {
            this.node.filled = false;
        }
    },

    end: function()
    {
        this._strokeWeight = Math.round(this._strokeWeight);
        if (this._stroke && this._strokeWeight > 0) {
            //this.node.setAttribute("strokeColor", this._strokeColor);
            //this.node.setAttribute("strokeWeight", this._strokeWeight);
            this.node.strokeColor = this._strokeColor;
            this.node.strokeWeight = this._strokeWeight;
            this.node.stroked = true;
        } else {
            this.node.stroked = false;
            //this.node.setAttribute("stroked", false);
        }
        if(this._path)
        {
            if(this._stroke)
            {
                this._path += " e";
            }
            this.node.path = this._path;
            this.node.setAttribute("path", this._path);
        }
        this.node.coordSize = this.width + " " + this.height;
        this.node.style.visible = "visible";
    },

    clearPath: function()
    {
        this._path = "";
    },

    setStroke: function(stroke)
    {   
        if(stroke)
        {
            var strokeWeight = stroke.weight,
                strokeColor = stroke.color,
                strokeAlpha = stroke.alpha,
                node = this.node;
            if(strokeWeight && strokeWeight !== this._strokeWeight)
            {
                this._strokeWeight = strokeWeight;
                node.strokeWeight =  strokeWeight;
            }   
            if(strokeColor && strokeColor != this._strokeColor)
            {
                this._strokeColor = strokeColor;
                node.strokeColor = strokeColor;
            }
            if(strokeAlpha && strokeAlpha !== this._strokeAlpha)
            {
                this._strokeAlpha = strokeAlpha;
                node.strokeOpacity = strokeAlpha;
            }
        }
    },
    _trackSize: function(w, h)
    {
        if(w > this.width)
        {
            this.width = w;
       //     this.node.setAttribute("width", w);
            this.node.style.width = w + "px";
        }
        if(h > this.height)
        {
            this.height = h;
         //   this.node.setAttribute("height", h);
            this.node.style.height = h + "px";
        }
        this.graphics._trackSize.apply(this.graphics, arguments);
        this.graphics.setSize.apply(this.graphics, [this.graphics._width, this.graphics._height]);
    },

    toggleVisible: function(val)
    {
        var visibility = val ? "visible" : "hidden";
        if(this.node)
        {
            Y.one(this.node).setStyle("visibility", visibility);
        }
    },

    update: function(cfg)
    {
        this._setProps(cfg);
        this._draw();
        return this;
    }
});

Y.VMLShape = VMLShape;

if (Y.UA.ie) {
    Y.Shape = VMLShape;
}
