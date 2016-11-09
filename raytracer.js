var canvas;
var context;

var framePixelWidth;

var frameHeight = 1;
var frameWidth = 1;
var frameDepth = 1;
var pixelHeight;
var pixelWidth;
var eye = vec3(0, 0, 0);

var objects = [];
var pixels = [];

var imagedata;

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    imagedata = context.createImageData(canvas.width, canvas.height);

    pixelHeight = frameHeight / canvas.height;
    pixelWidth = frameWidth / canvas.width;

    for (var r = 0; r < canvas.height; r++) {
        row = [];
        for (var c = 0; c < canvas.width; c++) {
            row.push(vec4(0, 0, 0, .25));
        }
        pixels.push(row);
    }

    window.requestAnimationFrame(main);
};

function writeToPixel(height, width, color) {
    var pixelindex = (height * canvas.height + width) * 4;
    imagedata.data[pixelindex]   = color[0] * 255;
    imagedata.data[pixelindex+1] = color[1] * 255;
    imagedata.data[pixelindex+2] = color[2] * 255;
    imagedata.data[pixelindex+3] = color[3] * 255;
}

function main() {
    for (var r = 0; r < pixels.length; r++) {
        for (var c = 0; c < pixels[r].length; c++) {
            var us = (r + .5) * pixelWidth - (frameWidth / 2);
            var vs = (c + .5) * pixelHeight - (frameHeight / 2);
            var ws = frameDepth;
            var s = vec3(us, vs, ws);
            color = traceRay(s);
            if (color != null) {
                pixels[r][c] = color
            }
        }
    }

    for (var r = 0; r < pixels.length; r++) {
        for (var c = 0; c < pixels[r].length; c++) {
            writeToPixel(r, c, pixels[r][c])
        }
    }

    context.putImageData(imagedata, 0, 0);
}

function traceRay(s) {
    var minT = Number.POSITIVE_INFINITY;
    var minObject = undefined;
    for (var i = 0; i < objects.length; i++) {
        var result = objects[i].intersects(eye, s);
        if (result[0]) {
            if (result[1] < minT) {
                minObject = objects[i];
            }
        }
    }
    var color = undefined;
    if (minT < Number.POSITIVE_INFINITY) {
        // TODO: get color of minObject at this point
        color = vec3(0, 0, 0);
    }
    return color;
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
        normal = scale(1 / length(normal), normal);
        var d = dot(normal, this.v3);
        var denom =  dot(normal, subtract(p2, p1));
        if (denom == 0) {
            return [Number.POSITIVE_INFINITY];
        }
        var t = (d - dot(normal, p1)) / denom;
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
        return within ? [t, p, normal] : [Number.POSITIVE_INFINITY];
    }
}

/*
 * build parameters for the ray
 * find intersection of ray with objects
 * determine intersection that’s closest to eye

 * find color of light along this ray from object at closest intersection
 * save color in array or display it
 */
