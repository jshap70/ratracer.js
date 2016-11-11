var canvas;
var context;

var framePixelWidth;

var frameHeight = 1;
var frameWidth = 1;
var frameDepth = 1;
var pixelHeight;
var pixelWidth;
var eye = vec3(0, 0, 0);
var defaultColor = vec4(0, 0, 0, .25);
var REFLECT_THRESHOLD = 3;

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
            row.push(defaultColor);
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
            var s = getS(r, c);
            var color = traceRay(eye, s, 0);
            if (color != null) {
                pixels[r][c] = color;
            }
        }
    }

    for (var r = 0; r < pixels.length; r++) {
        for (var c = 0; c < pixels[r].length; c++) {
            writeToPixel(c, r, pixels[r][c])
        }
    }

    context.putImageData(imagedata, 0, 0);
}

function getS(r, c) {
    var us = (r + .5) * pixelWidth - (frameWidth / 2);
    var vs = (c + .5) * pixelHeight - (frameHeight / 2);
    var ws = frameDepth;
    var s = vec3(us, - vs, ws);
    return s;
}

function traceRay(eye, s, deep) {
    if (deep >= REFLECT_THRESHOLD) {
        return vec4(0, 0, 0, 1);
    }
    var minT = Number.POSITIVE_INFINITY;
    var minNorm = undefined;
    var minP = undefined;
    var minObject = undefined;
    var result;
    for (var i = 0; i < objects.length; i++) {
        result = objects[i].intersects(eye, s);
        if (result[0] < minT) {
            minT = result[0];
            minP = result[1];
            minNorm = result[2];
            minObject = objects[i];
        }
    }
    var color = defaultColor;
    if (minT < Number.POSITIVE_INFINITY) {
        color = vec4(0, 0, 0, 1);
        for (var j = 0; j < lights.length; j++) {
            color = add(minObject.lightFrom(minP, eye, lights[j]), color);
        }

        if (minObject.shininess > 500) {
            var v = subtract(minP, eye);
            if (v[0] == 0 && v[1] == 0 && v[2] == 0) {
                return color;
            }
            var leaving = normalize(add(v, scale(-2, scale(dot(minNorm, v), minNorm))));
            color = mix(color, traceRay(minP, add(minP, leaving), deep + 1));
        }
    }
    return color;
}

function mix(c1, c2) {
    out = vec4(0, 0, 0, 1);
    for (var i = 0; i < 3; i++) {
        out[i] = c1[i] + c2[i] - (c1[i] * c2[i]);
        if (out[i] > 1) { // can't happen but just in case
            out[i] = 1;
        } else if (out[i] < 0) { // also shouldn't happen
            out[i] = 0;
        }
    }
    return out;
}

/*
 * build parameters for the ray
 * find intersection of ray with objects
 * determine intersection that’s closest to eye

 * find color of light along this ray from object at closest intersection
 * save color in array or display it
 */
