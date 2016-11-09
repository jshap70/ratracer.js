
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
    var minObject = undefined;
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
        // plane equation: normal (dot) (v3 - v1) = 0
        //                  normal (dot) v3 = d
        var v12 = subtract(this.v2, this.v1);
        var v13 = subtract(this.v3, this.v1);
        var normal = cross(v12, v13);
        var d = dot(normal, this.v3);
        var t = (d - dot(normal, p1)) / dot(normal, subtract(p2, p1));
        var p = add(p1, scale(t, subtract(p2, p1)));

        // Barycentric technique
        // vectors
        var vec0 = v13;
        var vec1 = v12;
        var vec2 = subtract(p, this.v1);

        // dot products
        var dot00 = dot(vec0, vec0);
        var dot01 = dot(vec0, vec1);
        var dot02 = dot(vec0, vec2);
        var dot11 = dot(vec1, vec1);
        var dot12 = dot(vec1, vec2);

        // barycentric coords
        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        var within = (u >= 0) && (v >= 0) && (u + v < 1);
        return [within, t, u, v];
    }
}

/*
 * build parameters for the ray
 * find intersection of ray with objects
 * determine intersection that’s closest to eye
 * find color of light along this ray from object at closest intersection
 * save color in array or display it
 */
