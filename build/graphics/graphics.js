YUI.add('graphics', function(Y) {

/**
 * The Graphics widget provides an api for basic drawing operations.
 *
 * @module graphics
 */
var ISCHROME = Y.UA.chrome,
    DRAWINGAPI,
    canvas = document.createElement("canvas");
if(document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"))
{
    DRAWINGAPI = "svg";
}
else if(canvas && canvas.getContext && canvas.getContext("2d"))
{
    DRAWINGAPI = "canvas";
}
else
{
    DRAWINGAPI = "vml";
}


}, '@VERSION@' ,{requires:['dom', 'event-custom', 'event-mouseenter']});
