YUI.add('graphics-vml', function(Y) {

/**
 * The Shape class creates a graphic object with editable 
 * properties.
 *
 * @class Shape
 * @extends Graphic
 * @constructor
 */
function Shape(cfg)
{
    this._initialize(cfg);
    this._draw();
}

Shape.prototype = {
    /**
     * Indicates the type of shape. 
     *
     * @property type 
     * @type string
     */
    type: "shape",
    
    /**
     * Initializes the graphic instance.
     *
     * @method _initialize
     * @private
     */
    _initialize: function(cfg) 
    {
        if(!cfg.graphic)
        {
            cfg.graphic = new Y.Graphic();
        }
        this._setProps(cfg);
    },

    /**
     * @private
     */
    width: 0,

    /**
     * @private
     */
    height: 0,

    /**
     * Updates properties for the shape.
     *
     * @method _setProps
     * @param {Object} cfg Properties to update.
     * @private
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

    /**
     * Draws the graphic.
     *
     * @method _draw
     * @private
     */
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
            path = this.graphics._getWedgePath(this.props);
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
    
    /**
     * Adds a border to the shape node.
     *
     * @method _addBorder
     * @private
     */
    _addBorder: function()
    {
        if(this.border && this.border.weight && this.border.weight > 0)
        {
            var borderAlpha = this.border.alpha,
                borderWeight = this.borderWeight;
            borderAlpha = Y.Lang.isNumber(borderAlpha) ? borderAlpha : 1;
            borderWeight = Y.Lang.isNumber(borderWeight) ? borderWeight : 1;
            this.node.strokecolor = this.border.color || "#000000";
            this.node.strokeweight = borderWeight;
            if(borderAlpha < 1)
            {
                if(!this._strokeNode)
                {
                    this._strokeNode = this.graphics._createGraphicNode("stroke");
                    this.node.appendChild(this._strokeNode);
                }
                this._strokeNode.opacity = borderAlpha;
            }
            else if(this._strokeNode)
            {
                this._strokeNode.opacity = borderAlpha;
            }
            this.node.stroked = true;
        }
        else
        {
            this.node.stroked = false;
        }
    },

    /**
     * Adds a fill to the shape node.
     *
     * @method _addFill
     * @private
     */
    _addFill: function()
    {
        var fillAlpha;
        this.node.filled = true;
        if(this.fill.type === "linear" || this.fill.type === "radial")
        {
            this.graphics.beginGradientFill(this.fill);
            this.node.appendChild(this.graphics._getFill());
        }
        else if(this.fill.type === "bitmap")
        {
            this.graphics.beginBitmapFill(this.fill);
            this.node.appendChild(this.graphics._getFill());
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
                    this.graphics._removeChildren(this.fillnode);
                }
                fillAlpha = this.fill.alpha;
                fillAlpha = Y.Lang.isNumber(fillAlpha) ? fillAlpha : 1;
                this.fill.alpha = fillAlpha;
                this.fillnode = this.graphics._createGraphicNode("fill");
                this.fillnode.type = "solid";
                this.fillnode.color = this.fill.color;
                this.fillnode.opacity = fillAlpha;
                this.node.appendChild(this.fillnode);
            }
        }
    },
    
    /**
     * Adds a class to the shape's node.
     *
     * @method addClass
     * @param {String} className Name of the class to add.
     */
    addClass: function(val)
    {
        var node = this.node;
        if(node)
        {
            Y.one(node).addClass(val);
        }
    },

    /**
     * Sets the visibility of a shape.
     * 
     * @method toggleVisible
     * @param {Boolean} val indicates whether or not the shape is visible.
     */
    toggleVisible: function(val)
    {
        var visibility = val ? "visible" : "hidden";
        if(this.node)
        {
            Y.one(this.node).setStyle("visibility", visibility);
        }
    },

    /**
     * Positions the parent node of the shape.
     *
     * @method setPosition
     * @param {Number}, x The x-coordinate
     * @param {Number}, y The y-coordinate
     */
    setPosition: function(x, y)
    {
        var pNode = Y.one(this.parentNode);
        pNode.setStyle("position", "absolute");
        pNode.setStyle("left", x);
        pNode.setStyle("top", y);
    },
    
    /**
     * Updates the properties of the shape instance.
     *
     * @method update
     * @param {Object} cfg Object literal containing properties to update.
     */
    update: function(cfg)
    {
        this._setProps(cfg);
        this._draw();
        return this;
    }
};

Y.Shape = Shape;
/**
 * VMLGraphics is a fallback drawing api used for basic drawing operations when SVG is not available.
 *
 * @class VMLGraphics
 * @constructor
 */
var VMLGraphics = function(config) {
    
    this.initializer.apply(this, arguments);
};

VMLGraphics.prototype = {
    /**
     * Indicates whether or not the instance will size itself based on its contents.
     *
     * @property autoSize 
     * @type String
     */
    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.node = this._createGraphics();
        this.setSize(w, h);
        this._initProps();
    },

    /** 
     * Specifies a bitmap fill used by subsequent calls to other drawing methods.
     * 
     * @method beginBitmapFill
     * @param {Object} config
     */
    beginBitmapFill: function(config) {
       
        var fill = {};
        fill.src = config.bitmap.src;
        fill.type = "tile";
        this._fillProps = fill;
        if(!isNaN(config.tx) ||
            !isNaN(config.ty) ||
            !isNaN(config.width) ||
            !isNaN(config.height))
        {
            this._gradientBox = {
                tx:config.tx,
                ty:config.ty,
                width:config.width,
                height:config.height
            };
        }
        else
        {
            this._gradientBox = null;
        }
    },

    /**
     * Specifes a solid fill used by subsequent calls to other drawing methods.
     *
     * @method beginFill
     * @param {String} color Hex color value for the fill.
     * @param {Number} alpha Value between 0 and 1 used to specify the opacity of the fill.
     */
    beginFill: function(color, alpha) {
        if (color) {
            if (Y.Lang.isNumber(alpha)) {
                this._fillProps = {
                    type:"solid",
                    opacity: alpha
                };
            }
            this._fillColor = color;
            this._fill = 1;
        }
        return this;
    },

    /** 
     * Specifies a gradient fill used by subsequent calls to other drawing methods.
     *
     * @method beginGradientFill
     * @param {Object} config
     */
    beginGradientFill: function(config) {
        var type = config.type,
            colors = config.colors,
            alphas = config.alphas || [],
            ratios = config.ratios || [],
            fill = {
                colors:colors,
                ratios:ratios
            },
            len = alphas.length,
            i = 0,
            alpha,
            oi,
            rotation = config.rotation || 0;
    
        for(;i < len; ++i)
        {
            alpha = alphas[i];
            alpha = Y.Lang.isNumber(alpha) ? alpha : 1;
            oi = i > 0 ? i + 1 : "";
            alphas[i] = Math.round(alpha * 100) + "%";
            fill["opacity" + oi] = alpha;
        }
        if(type === "linear")
        {
            if(config)
            {
            }
            if(rotation > 0 && rotation <= 90)
            {
                rotation = 450 - rotation;
            }
            else if(rotation <= 270)
            {
                rotation = 270 - rotation;
            }
            else if(rotation <= 360)
            {
                rotation = 630 - rotation;
            }
            else
            {
                rotation = 270;
            }
            fill.type = "gradientunscaled";
            fill.angle = rotation;
        }
        else if(type === "radial")
        {
            fill.alignshape = false;
            fill.type = "gradientradial";
            fill.focus = "100%";
            fill.focusposition = "50%,50%";
        }
        fill.ratios = ratios || [];
        
        if(!isNaN(config.tx) ||
            !isNaN(config.ty) ||
            !isNaN(config.width) ||
            !isNaN(config.height))
        {
            this._gradientBox = {
                tx:config.tx,
                ty:config.ty,
                width:config.width,
                height:config.height
            };
        }
        else
        {
            this._gradientBox = null;
        }
        this._fillProps = fill;
    },

    /**
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        this._path = '';
        this._removeChildren(this.node);
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        this.node.parentNode.removeChild(this.node);
    },

    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param node
     * @private
     */
    _removeChildren: function(node)
    {
        if(node.hasChildNodes())
        {
            var child;
            while(node.firstChild)
            {
                child = node.firstChild;
                this._removeChildren(child);
                node.removeChild(child);
            }
        }
    },

    /**
     * Shows and and hides a the graphic instance.
     *
     * @method toggleVisible
     * @param val {Boolean} indicates whether the instance should be visible.
     */
    toggleVisible: function(val)
    {
        this._toggleVisible(this.node, val);
    },

    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {HTMLElement} node element to toggle
     * @param {Boolean} val indicates visibilitye
     * @private
     */
    _toggleVisible: function(node, val)
    {
        var children = Y.one(node).get("children"),
            visibility = val ? "visible" : "hidden",
            i = 0,
            len;
        if(children)
        {
            len = children.length;
            for(; i < len; ++i)
            {
                this._toggleVisible(children[i], val);
            }
        }
        node.style.visibility = visibility;
    },

    /**
     * Draws a bezier curve.
     *
     * @method curveTo
     * @param {Number} cp1x x-coordinate for the first control point.
     * @param {Number} cp1y y-coordinate for the first control point.
     * @param {Number} cp2x x-coordinate for the second control point.
     * @param {Number} cp2y y-coordinate for the second control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    curveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._shape = "shape";
        this._path += ' c ' + Math.round(cp1x) + ", " + Math.round(cp1y) + ", " + Math.round(cp2x) + ", " + Math.round(cp2y) + ", " + x + ", " + y;
        this._trackSize(x, y);
    },

    /**
     * Draws a quadratic bezier curve.
     *
     * @method quadraticCurveTo
     * @param {Number} cpx x-coordinate for the control point.
     * @param {Number} cpy y-coordinate for the control point.
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    quadraticCurveTo: function(cpx, cpy, x, y) {
        this._path += ' qb ' + cpx + ", " + cpy + ", " + x + ", " + y;
    },

    /**
     * Draws a circle.
     *
     * @method drawCircle
     * @param {Number} x y-coordinate
     * @param {Number} y x-coordinate
     * @param {Number} r radius
     */
    drawCircle: function(x, y, r) {
        this._width = this._height = r * 2;
        this._x = x - r;
        this._y = y - r;
        this._shape = "oval";
        this._draw();
    },

    /**
     * Draws an ellipse.
     *
     * @method drawEllipse
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
    drawEllipse: function(x, y, w, h) {
        this._width = w;
        this._height = h;
        this._x = x;
        this._y = y;
        this._shape = "oval";
        this._draw();
    },

    /**
     * Draws a rectangle.
     *
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     */
    drawRect: function(x, y, w, h) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this._draw();
    },

    /**
     * Draws a rectangle with rounded corners.
     * 
     * @method drawRect
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @param {Number} w width
     * @param {Number} h height
     * @param {Number} ew width of the ellipse used to draw the rounded corners
     * @param {Number} eh height of the ellipse used to draw the rounded corners
     */
    drawRoundRect: function(x, y, w, h, ew, eh) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this.moveTo(x, y + eh);
        this.lineTo(x, y + h - eh);
        this.quadraticCurveTo(x, y + h, x + ew, y + h);
        this.lineTo(x + w - ew, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - eh);
        this.lineTo(x + w, y + eh);
        this.quadraticCurveTo(x + w, y, x + w - ew, y);
        this.lineTo(x + ew, y);
        this.quadraticCurveTo(x, y, x, y + eh);
        this._draw();
    },

    /**
     * Draws a wedge.
     * 
     * @param {Number} x			x-coordinate of the wedge's center point
     * @param {Number} y			y-coordinate of the wedge's center point
     * @param {Number} startAngle	starting angle in degrees
     * @param {Number} arc			sweep of the wedge. Negative values draw clockwise.
     * @param {Number} radius		radius of wedge. If [optional] yRadius is defined, then radius is the x radius.
     * @param {Number} yRadius		[optional] y radius for wedge.
     */
    drawWedge: function(x, y, startAngle, arc, radius, yRadius)
    {
        this._drawingComplete = false;
        this._width = radius;
        this._height = radius;
        yRadius = yRadius || radius;
        this._path += this._getWedgePath({x:x, y:y, startAngle:startAngle, arc:arc, radius:radius, yRadius:yRadius});
        this._width = radius * 2;
        this._height = this._width;
        this._shape = "shape";
        this._draw();
    },

    /**
     * Generates a path string for a wedge shape
     *
     * @method _getWedgePath
     * @param {Object} config attributes used to create the path
     * @return String
     * @private
     */
    _getWedgePath: function(config)
    {
        var x = config.x,
            y = config.y,
            startAngle = config.startAngle,
            arc = config.arc,
            radius = config.radius,
            yRadius = config.yRadius || radius,
            path;  
        if(Math.abs(arc) > 360)
        {
            arc = 360;
        }
        startAngle *= -65535;
        arc *= 65536;
        path = " m " + x + " " + y + " ae " + x + " " + y + " " + radius + " " + yRadius + " " + startAngle + " " + arc;
        return path;
    },
    
    /**
     * Completes a drawing operation. 
     *
     * @method end
     */
    end: function() {
        if(this._shape)
        {
            this._draw();
        }
        this._initProps();
    },

    /**
     * Specifies a gradient to use for the stroke when drawing lines.
     * Not implemented
     *
     * @method lineGradientStyle
     * @private
     */
    lineGradientStyle: function() {
    },
    
    /**
     * Specifies a line style used for subsequent calls to drawing methods.
     * 
     * @method lineStyle
     * @param {Number} thickness indicates the thickness of the line
     * @param {String} color hex color value for the line
     * @param {Number} alpha Value between 0 and 1 used to specify the opacity of the fill.
     */
    lineStyle: function(thickness, color, alpha, dashstyle, pixelHinting, scaleMode, caps, joints, miterLimit) {
        var i, len;
        this._stroke = 1;
        this._strokeWeight = thickness * 0.7;
        this._strokeColor = color;
        this._strokeOpacity = Y.Lang.isNumber(alpha) ? alpha : 1;
        if(dashstyle)
        {
            len = dashstyle.length;
            for(i = 0; i < len; ++i)
            {
                dashstyle[i] = Math.round(dashstyle[i]/thickness);
            }
            this._dashstyle = dashstyle.toString();
        }
    },

    /**
     * Draws a line segment using the current line style from the current drawing position to the specified x and y coordinates.
     * 
     * @method lineTo
     * @param {Number} point1 x-coordinate for the end point.
     * @param {Number} point2 y-coordinate for the end point.
     */
    lineTo: function(point1, point2, etc) {
        var args = arguments,
            i,
            len;
        if (typeof point1 === 'string' || typeof point1 === 'number') {
            args = [[point1, point2]];
        }
        len = args.length;
        this._shape = "shape";
        this._path += ' l ';
        for (i = 0; i < len; ++i) {
            this._path += ' ' + Math.round(args[i][0]) + ', ' + Math.round(args[i][1]);
            this._trackSize.apply(this, args[i]);
        }
    },

    /**
     * Moves the current drawing position to specified x and y coordinates.
     *
     * @method moveTo
     * @param {Number} x x-coordinate for the end point.
     * @param {Number} y y-coordinate for the end point.
     */
    moveTo: function(x, y) {
        this._path += ' m ' + Math.round(x) + ', ' + Math.round(y);
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        w = Math.round(w);
        h = Math.round(h);
        this.node.style.width = w + 'px';
        this.node.style.height = h + 'px';
        this.node.coordSize = w + ' ' + h;
        this._canvasWidth = w;
        this._canvasHeight = h;
    },
   
    /**
     * Sets the positon of the graphics object.
     *
     * @method setPosition
     * @param {Number} x x-coordinate for the object.
     * @param {Number} y y-coordinate for the object.
     */
    setPosition: function(x, y)
    {
        x = Math.round(x);
        y = Math.round(y);
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(parentNode) {
        var w = Math.max(parentNode.offsetWidth || 0, this._canvasWidth),
            h = Math.max(parentNode.offsetHeight || 0, this._canvasHeight);
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        this._initProps();
        return this;
    },

    /**
     * @private
     */
    _shape: null,

    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._width) {
            this._width = w;
        }
        if (h > this._height) {
            this._height = h;
        }
    },

    /**
     * Clears the properties
     *
     * @method _initProps
     * @private
     */
    _initProps: function() {
        this._fillColor = null;
        this._strokeColor = null;
        this._strokeOpacity = null;
        this._strokeWeight = 0;
        this._fillProps = null;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._fill = null;
        this._stroke = 0;
        this._stroked = false;
        this._dashstyle = null;
    },

    /**
     * Clears path properties
     * 
     * @method _clearPath
     * @private
     */
    _clearPath: function()
    {
        this._shape = null;
        this._path = '';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
    },

    /**
     * Completes a shape
     *
     * @method _draw
     * @private 
     */
    _draw: function()
    {
        var shape = this._createGraphicNode(this._shape),
            w = Math.round(this._width),
            h = Math.round(this._height),
            strokeNode,
            fillProps = this._fillProps;
            this.setSize(w, h);
        if(this._path)
        {
            if(this._fill || this._fillProps)
            {
                this._path += ' x';
            }
            if(this._stroke)
            {
                this._path += ' e';
            }
            shape.path = this._path;
            shape.coordSize = w + ', ' + h;
        }
        else
        {
            shape.style.display = "block";
            shape.style.position = "absolute";
            shape.style.left = this._x + "px";
            shape.style.top = this._y + "px";
        }
        
        if (this._fill) {
            shape.fillColor = this._fillColor;
        }
        else
        {
            shape.filled = false;
        }
        if (this._stroke && this._strokeWeight > 0) {
            shape.strokeColor = this._strokeColor;
            shape.strokeWeight = this._strokeWeight;
            if(Y.Lang.isNumber(this._strokeOpacity) && this._strokeOpacity < 1)
            {    
                strokeNode = this._createGraphicNode("stroke");
                shape.appendChild(strokeNode);
                strokeNode.opacity = this._strokeOpacity;
            }
            if(this._dashstyle)
            {
                if(!strokeNode)
                {
                    strokeNode = this._createGraphicNode("stroke");
                    shape.appendChild(strokeNode);
                }
                strokeNode.dashstyle = this._dashstyle;
            }
        } else {
            shape.stroked = false;
        }
        shape.style.width = w + 'px';
        shape.style.height = h + 'px';
        if (fillProps) {
            shape.filled = true;
            shape.appendChild(this._getFill());
        }
        this.node.appendChild(shape);
        this._clearPath();
    },

    /**
     * Returns ths actual fill object to be used in a drawing or shape
     *
     * @method _getFill
     * @private
     */
    _getFill: function() {
        var fill = this._createGraphicNode("fill"),
            w = this._width,
            h = this._height,
            fillProps = this._fillProps,
            prop,
            pct,
            i = 0,
            colors,
            colorstring = "",
            len,
            ratios,
            hyp = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)),
            cx = 50,
            cy = 50;
        if(this._gradientBox)
        {
            cx= Math.round( (this._gradientBox.width/2 - ((this._x - this._gradientBox.tx) * hyp/w))/(w * w/hyp) * 100);
            cy = Math.round( (this._gradientBox.height/2 - ((this._y - this._gradientBox.ty) * hyp/h))/(h * h/hyp) * 100);
            fillProps.focussize = (this._gradientBox.width/w)/10 + " " + (this._gradientBox.height/h)/10;
        }
        if(fillProps.colors)
        {
            colors = fillProps.colors.concat();
            ratios = fillProps.ratios.concat();
            len = colors.length;
            for(;i < len; ++i) {
                pct = ratios[i] || i/(len-1);
                pct = Math.round(100 * pct) + "%";
                colorstring += ", " + pct + " " + colors[i];
            }
            if(parseInt(pct, 10) < 100)
            {
                colorstring += ", 100% " + colors[len-1];
            }
        }
        for (prop in fillProps) {
            if(fillProps.hasOwnProperty(prop)) {
                fill.setAttribute(prop, fillProps[prop]);
           }
        }
        fill.colors = colorstring.substr(2);
        if(fillProps.type === "gradientradial")
        {
            fill.focusposition = cx + "%," + cy + "%";
        }
        return fill;
    },

    /**
     * Creates a group element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        var group = this._createGraphicNode("group");
        group.style.display = "block";
        group.style.position = 'absolute';
        return group;
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
        return document.createElement('<' + type + ' xmlns="urn:schemas-microsft.com:vml" class="vml' + type + '"/>');
    
    },
    
    /**
     * Converts a shape type to the appropriate vml node type.
     *
     * @method _getNodeShapeType
     * @param {String} type The shape to convert.
     * @return String
     * @private
     */
    _getNodeShapeType: function(type)
    {
        var shape = "shape";
        if(this._typeConversionHash.hasOwnProperty(type))
        {
            shape = this._typeConversionHash[type];
        }
        return shape;
    },

    /**
     * Used to convert certain shape types to the appropriate vml node type.
     *
     * @property _typeConversionHash
     * @type Object
     * @private
     */
    _typeConversionHash: {
        circle: "oval",
        ellipse: "oval",
        rect: "rect"
    },
    
    /**
     * Creates a Shape instance and adds it to the graphics object.
     *
     * @method getShape
     * @param {Object} config Object literal of properties used to construct a Shape.
     * @return Shape
     */
    getShape: function(config) {
        config.graphic = this;
        return new Y.Shape(config); 
    },

    /**
     * Adds a child to the <code>node</code>.
     *
     * @method addChild
     * @param {HTMLElement} element to add
     * @private
     */
    addChild: function(child)
    {
        this.node.appendChild(child);
    }
};

var sheet = document.createStyleSheet();
sheet.addRule(".vmlgroup", "behavior:url(#default#VML)", sheet.rules.length);
sheet.addRule(".vmlgroup", "display:inline-block", sheet.rules.length);
sheet.addRule(".vmlgroup", "zoom:1", sheet.rules.length);
sheet.addRule(".vmlshape", "behavior:url(#default#VML)", sheet.rules.length);
sheet.addRule(".vmlshape", "display:inline-block", sheet.rules.length);
sheet.addRule(".vmloval", "behavior:url(#default#VML)", sheet.rules.length);
sheet.addRule(".vmloval", "display:inline-block", sheet.rules.length);
sheet.addRule(".vmlrect", "behavior:url(#default#VML)", sheet.rules.length);
sheet.addRule(".vmlrect", "display:block", sheet.rules.length);
sheet.addRule(".vmlfill", "behavior:url(#default#VML)", sheet.rules.length);
sheet.addRule(".vmlstroke", "behavior:url(#default#VML)", sheet.rules.length);
Y.Graphic = VMLGraphics;



}, '@VERSION@' ,{skinnable:false, requires:['graphics']});
