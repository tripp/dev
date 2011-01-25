var UID = '_yuid',
    NODE_NAME = 'nodeName',
    _addClass = Y.Node.prototype.addClass,
    node_toString = Y.Node.prototype.toString,
    nodeList_toString = Y.NodeList.prototype.toString;
Y.Node.prototype.addClass = function(className) {
   var node = this._node;
   if(node.tagName.indexOf("svg") > -1)
   {    
        if(node.className && node.className.baseVal)
        {
            node.className.baseVal = Y.Lang.trim([node.className.baseVal, className].join(' '));
        }
        else
        {
            node.setAttribute("class", className);
        }
    }
    else
    {
        _addClass.apply(this, arguments);
    }
    return this;
};

Y.Node.prototype.toString = function() {
    var node = this._node,
        str;
    if(node && node.className && node.className.baseVal)
    {
        if(typeof node.className.baseVal == "string")
        {
            str = node[NODE_NAME] + "." + node.className.baseVal.replace(' ', '.');
        }
        else
        {
            str = this[UID] + ': not bound to any nodes';
        }
    }
    else
    {
        str = node_toString.apply(this, arguments);
    }
    return str;
};

Y.NodeList.prototype.toString = function() {
    var nodes = this._nodes,
        node,
        str;
    if (nodes && nodes[0]) {
        node = nodes[0];
    }    
    if(node && node.className && node.className.baseVal)
    {
        if(typeof node.className.baseVal == "string")
        {
            str = node[NODE_NAME];
            if(node.id)
            {
                str += "#" + node.id;
            }
            str += "." + node.className.baseVal.replace(' ', '.');
        }
        else
        {
            str = this[UID] + ': not bound to any nodes';
        }
    }
    else
    {
        str = nodeList_toString.apply(this, arguments);
    }
    return str;
};

Y.NodeList.importMethod(Y.Node.prototype, ['addClass']);
