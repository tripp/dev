YUI.add("graphics",function(c){var b=c.UA.chrome,d,a=document.createElement("canvas");if(document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")){d="svg";}else{if(a&&a.getContext&&a.getContext("2d")){d="canvas";}else{d="vml";}}},"@VERSION@",{requires:["dom","event-custom","event-mouseenter"]});