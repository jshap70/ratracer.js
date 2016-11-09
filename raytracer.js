
var framePixelHeight = 500;
var framePixelWidth = 500;

var frameHeight = 1;
var frameWidth = 1;
var frameDepth = 1;
var pixelHeight = frameHeight / framePixelHeight;
var pixelWidth = frameWidth / framePixelWidth;
var eye = vec3(0, 0, 0);

var objects = [];

function traceRay(pixel) {
    var us = (pixel[0] + .5) * pixelWidth - (frameWidth / 2);
    var vs = (pixel[1] + .5) * pixelHeight - (frameHeight / 2);
    var ws = frameDepth;
    var s = vec3(us, vs, ws);

    var minT = Number.POSITIVE_INFINITY;
    for (var i = 0; i < objects.length; i++) {
        var t = objects[i].intersects(eye, s);
        // TODO: do stuff with t
    }
}

class Triangle {
    constructor(v1, v2, v3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    intersects(p1, p2) {
        var v12 = subtract(this.v1, this.v2);
        var v13 = subtract(this.v1, this.v3);
        var normal = cross(v12, v13);
        var d = dot(normal, this.v3);
        var t = (d - dot(normal, p1)) / dot(normal, subtract(p2, p1));
        // plane equation: normal (dot) (v3 - v1) = 0
        //                  normal (dot) v3 = d
        return t;
    }
}

/*
 * build parameters for the ray
 * find intersection of ray with objects
 * determine intersection that’s closest to eye
 * find color of light along this ray from object at closest intersection
 * save color in array or display it
 */
