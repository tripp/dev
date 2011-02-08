/**
 * Graphic is a simple drawing api that allows for basic drawing operations.
 *
 * @class Graphic
 * @constructor
 */
function Graphic(config) {
    
    this.initializer.apply(this, arguments);
}

Graphic.prototype = {
    /**
     * Indicates whether or not the instance will size itself based on its contents.
     *
     * @property autoSize 
     * @type String
     */
    autoSize: true,

    /**
     * Initializes the class.
     *
     * @method initializer
     * @private
     */
    initializer: function(config) {
        config = config || {};
        var w = config.width || 0,
            h = config.height || 0;
        this.node = this._createGraphics();
        this.setSize(w, h);
        if(config.render)
        {
            this.render(config.render);
        }
    },

    /**
     * Removes all nodes.
     *
     * @method destroy
     */
    destroy: function()
    {
        this._removeChildren(this.node);
        if(this.node && this.node.parentNode)
        {
            this.node.parentNode.removeChild(this.node);
        }
    },
    
    /**
     * Removes all child nodes.
     *
     * @method _removeChildren
     * @param {HTMLElement} node
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
        var children = Y.Selector.query(">/*", node),
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
     * Clears the graphics object.
     *
     * @method clear
     */
    clear: function() {
        if(this._graphicsList)
        {
            while(this._graphicsList.length > 0)
            {
                this.node.removeChild(this._graphicsList.shift());
            }
        }
    },

    /**
     * Sets the size of the graphics object.
     * 
     * @method setSize
     * @param w {Number} width to set for the instance.
     * @param h {Number} height to set for the instance.
     */
    setSize: function(w, h) {
        if(this.autoSize)
        {
            if(w > this.node.getAttribute("width"))
            {
                this.node.setAttribute("width",  w);
            }
            if(h > this.node.getAttribute("height"))
            {
                this.node.setAttribute("height", h);
            }
        }
    },

    /**
     * Updates the size of the graphics object
     *
     * @method _trackSize
     * @param {Number} w width
     * @param {Number} h height
     * @private
     */
    _trackSize: function(w, h) {
        if (w > this._right) {
            this._right = w;
        }
        if(w < this._left)
        {
            this._left = w;    
        }
        if (h < this._top)
        {
            this._top = h;
        }
        if (h > this._bottom) 
        {
            this._bottom = h;
        }
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        this.node.style.left = this._left + "px";
        this.node.style.top = this._top + "px";
        this.setSize(this._width, this._height);
    },

    /**
     * Adds the graphics node to the dom.
     * 
     * @method render
     * @param {HTMLElement} parentNode node in which to render the graphics node into.
     */
    render: function(render) {
        var parentNode = Y.one(render),
            w = parentNode.get("width") || parentNode.get("offsetWidth"),
            h = parentNode.get("height") || parentNode.get("offsetHeight");
        parentNode = parentNode || Y.config.doc.body;
        parentNode.appendChild(this.node);
        this.setSize(w, h);
        return this;
    },

    /**
     * Creates a group element
     *
     * @method _createGraphics
     * @private
     */
    _createGraphics: function() {
        var group = this._createGraphicNode("svg");
        this._styleGroup(group);
        return group;
    },

    /**
     * Styles a group element
     *
     * @method _styleGroup
     * @private
     */
    _styleGroup: function(group)
    {
        group.style.position = "absolute";
        group.style.top = "0px";
        group.style.left = "0px";
        group.style.overflow = "auto";
        group.setAttribute("overflow", "auto");
        group.setAttribute("pointer-events", "none");
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
    _createGraphicNode: function(type, pe)
    {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
            v = pe || "none";
        if(type !== "defs" && type !== "stop" && type !== "linearGradient")
        {
            node.setAttribute("pointer-events", v);
        }
        return node;
    },

    addShape: function(shape)
    {
        var node = shape.get("node");
        this.node.appendChild(node);
        if(!this._graphicsList)
        {
            this._graphicsList = [];
        }
        this._graphicsList.push(node);
    }
};
Y.Graphic = Graphic;

