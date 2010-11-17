function Shape(cfg)
{
    this._initialize(cfg);
    this._draw();
}

Y.extend(Shape, Y.Graphic, {
    type: "path",

    autoSize: false,

    width: 0,

    height: 0,

    pointerEvents: "visiblePainted", 

    _initialize: function(cfg) 
    {
        if(!cfg.graphic)
        {
            cfg.graphic = new Y.Graphic();
        }
        this._setProps(cfg);
    },
  
    _setProps: function(cfg)
    {
        this.autoSize = cfg.autoSize || this.autoSize; 
        this.pointerEvents = cfg.pointerEvents || this.pointerEvents;
        this.width = cfg.width || this.width;
        this.height = cfg.height || this.height;
        this.border = cfg.border || this.border;
        this.graphics = cfg.graphic || this.graphics;
        this.canvas = this.graphics;
        this.parentNode = this.graphics.node;
        this.fill = cfg.fill || this.fill;
        this.type = cfg.shape || this.type;
        this.nodetype = this._getNodeShapeType(this.type); 
        this.props = cfg.props || this.props;
        this.path = cfg.path || this.path;
    },

    _draw: function()
    {
        var cx,
            cy,
            rx,
            ry,
            parentNode = this.parentNode,
            borderWeight = 0,
            fillWidth = this.width || 0,
            fillHeight = this.height || 0;
        if(!this.node)
        {
            this.node = this._createGraphicNode(this.nodetype, this.pointerEvents);
            parentNode.appendChild(this.node);
        }
        if(this.nodetype == "path")
        {
            if(this.type == "wedge")
            {
                this.path = this._getWedgePath(this.props);
                this._setPath();
            }
        }
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            borderWeight = this.border.weight;
            fillWidth -= borderWeight * 2;
            fillHeight -= borderWeight * 2;
        }
        this._addBorder();
        if(this.nodetype === "ellipse")
        {
            rx = cx = this.width/2;
            ry = cy = this.height/2;
            rx -= borderWeight;
            ry -= borderWeight;
            this.node.setAttribute("cx", cx);
            this.node.setAttribute("cy", cy);
            this.node.setAttribute("rx", rx);
            this.node.setAttribute("ry", ry);
        }
        else
        {
            this.node.setAttribute("width", fillWidth);
            this.node.setAttribute("height", fillHeight);
            this.node.style.width = fillWidth + "px";
            this.node.style.height = fillHeight + "px";
        }
        this._addFill();
        parentNode.style.width = this.width + "px";
        parentNode.style.height = this.height + "px";
        parentNode.setAttribute("width", this.width);
        parentNode.setAttribute("height", this.height);
        this.node.style.visibility = "visible";
        this.node.setAttribute("x", borderWeight); 
        this.node.setAttribute("y", borderWeight); 
        return this;       
    },

    _setPath: function()
    {
        if(this.path)
        {
            this.path += " Z";
            this.node.setAttribute("d", this.path);
        }
    },

    _addBorder: function()
    {
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            this.border.color = this.border.color || "#000000";
            this.border.weight = this.border.weight || 1;
            this.border.alpha = this.border.alpha || 1;
            this.border.linecap = this.border.linecap || "square";
            this.node.setAttribute("stroke", this.border.color);
            this.node.setAttribute("stroke-linecap", this.border.linecap);
            this.node.setAttribute("stroke-width",  this.border.weight);
            this.node.setAttribute("stroke-opacity", this.border.alpha);
        }
        else
        {
            this.node.setAttribute("stroke", "none");
        }
    },

    _addFill: function()
    {
        if(this.fill)
        {
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
                    this.node.setAttribute("fill", "none");
                }
                else
                {
                    this.fill.alpha = this.fill.alpha !== undefined ? this.fill.alpha : 1;
                    this.node.setAttribute("fill", this.fill.color);
                    this.node.setAttribute("fill-opacity", this.fill.alpha);
                }
            }
        }
        else
        {
            this.node.setAttribute("fill", "none");
        }
    },

    end: function()
    {
        if(this.path)
        {
            this.node.setAttribute("d", this.path);
        }
        if(this._stroke)
        {
            this.node.setAttribute("stroke-width", this._strokeWeight);
            if(this._strokeColor)
            {
                this.node.setAttribute("stroke", this._strokeColor);
            }
            if(this._strokeAlpha)
            {
                this.node.setAttribute("stroke-opacity", this._strokeAlpha);
            }
        }
    },

    toggleVisible: function(val)
    {
        var visibility = val ? "visible" : "hidden";
        if(this.node)
        {
            Y.one(this.node).setStyle("visibility", visibility);
        }
    },

    clearPath: function()
    {
        this.path = "";
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
                node.setAttribute("stroke-weight", strokeWeight);
            }   
            if(strokeColor && strokeColor != this._strokeColor)
            {
                this._strokeColor = strokeColor;
                node.setAttribute("stroke", strokeColor);
            }
            if(strokeAlpha && strokeAlpha !== this._strokeAlpha)
            {
                this._strokeAlpha = strokeAlpha;
                node.setAttribute("stroke-opacity", strokeAlpha);
            }
        }
    },
    
    update: function(cfg)
    {
        this._setProps(cfg);
        this._draw();
        return this;
    },
    
    _getNodeShapeType: function(type)
    {
        if(this._typeConversionHash.hasOwnProperty(type))
        {
            type = this._typeConversionHash[type];
        }
        return type;
    },

    _trackSize: function(w, h)
    {
        if(w > this.width)
        {
            this.node.setAttribute("width", w);
            this.node.style.width = w + "px";
        }
        if(h > this.height)
        {
            this.node.setAttribute("height", h);
            this.node.style.height = h + "px";
        }
        this.graphics._trackSize.apply(this.graphics, arguments);
    },

    _typeConversionHash: {
        circle: "ellipse",
        wedge: "path"
    }
});

Y.Shape = Shape;
