class Triangle {
    constructor(v1, v2, v3,
        ambient = vec4(1,1,1,1),
        diffuse = vec4(1,1,1,1),
        specular = vec4(1,1,1,1),
        shininess = 100) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;

        this.v12 = subtract(this.v2, this.v1);
        this.v13 = subtract(this.v3, this.v1);
        this.normal = normalize(cross(this.v12, this.v13));
    }

    intersects(p1, p2) {
        // plane equation: normal (dot) (v3 - v1) = 0
        //                  normal (dot) v3 = d
        var d = dot(this.normal, this.v3);
        var denom = dot(this.normal, subtract(p2, p1));
        if (denom >= 0) {
            return [Number.POSITIVE_INFINITY];
        }
        var t = (d - dot(this.normal, p1)) / denom;
        var p = add(p1, scale(t, subtract(p2, p1)));

        // Barycentric technique
        // vectors
        var vec0 = this.v13;
        var vec1 = this.v12;
        var vec2 = subtract(p, this.v1);

        // dot products
        var dot00 = dot(vec0, vec0);
        var dot01 = dot(vec0, vec1);
        var dot02 = dot(vec0, vec2);
        var dot11 = dot(vec1, vec1);
        var dot12 = dot(vec1, vec2);

        // barycentric coords
        var denom = (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) / denom;
        var v = (dot00 * dot12 - dot01 * dot02) / denom;
        var within = (u >= 0) && (v >= 0) && (u + v < 1);
        return within ? [t, p, this.normal] : [Number.POSITIVE_INFINITY];
    }

    lightFrom(point, eye, lightSource) {
        return planarLightFrom(point, eye, this.normal, this, lightSource);
    }
}

class Cube {
    constructor(v1,size,
        ambient = vec4(1,1,1,1),
        diffuse = vec4(1,1,1,1),
        specular = vec4(1,1,1,1),
        shininess = 100) {
        this.v1 = vec3(v1[0]-size, v1[1]-size, v1[2]-size);
        this.v2 = vec3(v1[0]+size, v1[1]+size, v1[2]+size);
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;

        this.points = [ this.v1,
                        vec3(this.v1[0], this.v1[1], this.v2[2]),
                        vec3(this.v1[0], this.v2[1], this.v2[2]),
                        vec3(this.v1[0], this.v2[1], this.v1[2]),
                        vec3(this.v2[0], this.v1[1], this.v1[2]),
                        vec3(this.v2[0], this.v1[1], this.v2[2]),
                        this.v2,
                        vec3(this.v2[0], this.v2[1], this.v1[2])
                      ]

        this.faces = [  [0,1,5],
                        [5,4,0],
                        [0,4,7],
                        [7,3,0],
                        [0,3,2],
                        [2,1,0],
                        [6,5,1],
                        [1,2,6],
                        [6,2,3],
                        [3,7,6],
                        [6,7,4],
                        [4,5,6] ]
    }

    intersects(p1, p2) {
        var mint = Infinity;
        var minp = undefined;
        var norm = undefined;

        for (var i = 0; i < this.faces.length; i++) {
            var v1 = this.points[this.faces[i][0]];
            var v2 = this.points[this.faces[i][1]];
            var v3 = this.points[this.faces[i][2]];

            var v12 = subtract(v1, v2);
            var v13 = subtract(v3, v2);
            var normal = normalize(cross(v12, v13));


            // plane equation: normal (dot) (v3 - v1) = 0
            //                  normal (dot) v3 = d
            var d = dot(normal, v3);
            var denom = dot(normal, subtract(p2, p1));
            if (denom >= 0) {
                continue;
            }
            var t = (d - dot(normal, p1)) / denom;
            var p = add(p1, scale(t, subtract(p2, p1)));

            // Barycentric technique
            // vectors
            var vec0 = v13;
            var vec1 = v12;
            var vec2 = subtract(p, v2);

            // dot products
            var dot00 = dot(vec0, vec0);
            var dot01 = dot(vec0, vec1);
            var dot02 = dot(vec0, vec2);
            var dot11 = dot(vec1, vec1);
            var dot12 = dot(vec1, vec2);

            // barycentric coords
            var denom = (dot00 * dot11 - dot01 * dot01);
            var u = (dot11 * dot02 - dot01 * dot12) / denom;
            var v = (dot00 * dot12 - dot01 * dot02) / denom;
            var within = (u >= 0) && (v >= 0) && (u + v < 1);

            if (within && mint > t) {
                mint = t;
                minp = p;
                norm = normal;
            }
        }
        return [mint, minp, norm];
    }

    lightFrom(point, eye, lightSource) {
        var k = this.intersects(eye, point);
        if (!(k[0] < Infinity)) {
            return vec4(0, 0, 0, 1);
        }
        var normal = k[2];
        return planarLightFrom(point, eye, normal, this, lightSource);
    }
}

class Sphere {
    constructor(center, radius,
        ambient = vec4(1,1,1,1),
        diffuse = vec4(1,1,1,1),
        specular = vec4(1,1,1,1),
        shininess = 100) {
        this.center = center;
        this.radius = radius;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
    }

    intersects(p1, p2) {
        var l = normalize(subtract(p1, p2));
        var oc = subtract(p1, this.center);
        var loc = length(oc);
        var b = dot(l, oc);
        var sqt = Math.sqrt(b * b - loc * loc + this.radius * this.radius);
        var t = - b + sqt;
        if (!t) {
            return [Math.POSITIVE_INFINITY];
        }
        var p = add(p1, scale(t, l));
        return [t, p, normalize(subtract(p, this.center))];
    }

    lightFrom(point, eye, lightSource) {
        var normal = normalize(subtract(point, this.center));
        return planarLightFrom(point, eye, normal, this, lightSource);
    }
}

class PointSource {
    constructor(location, ambient, diffuse, specular, a, b, c) {
        this.location = location;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.a = a;
        this.b = b;
        this.c = c;
    }
}

function planarLightFrom(point, eye, normal, thiis, lightSource) {
    var ambient, diffuse, specular;

    // ambient
    ambient = mult(lightSource.ambient, thiis.ambient);

    // check for shadow
    var isShadow = false;
    for (var i = 0; i < objects.length; i++) {
        if (objects[i] != thiis) {
            var t = objects[i].intersects(lightSource.location, point)[0];
            if (t < Number.POSITIVE_INFINITY && t < 1) {
                isShadow = true;
            }
        }
    }
    if (isShadow) {
        diffuse = vec4(0, 0, 0, 1);
        specular = vec4(0, 0, 0, 1);
    } else {
        // diffuse
        var lightPosition = subtract(lightSource.location, point);
        var d = Math.max(dot(normal, lightPosition), 0.0);
        diffuse = mult(lightSource.diffuse, thiis.diffuse);
        diffuse = scale(d, diffuse);
        diffuse[3] = 1.0;

        // specular
        var ray = subtract(eye, point);
        var half = normalize(add(lightPosition, ray));
        var ss = dot(half, normal);
        if (ss > 0) {
            var specularProduct = mult(lightSource.specular, thiis.specular);
            specular = scale(Math.pow(ss, thiis.shininess), specularProduct);
            specular[3] = 1.0;
        } else {
            specular = vec4(0, 0, 0, 1);
        }
        // if (d < 0) {
        //     specular = vec4(0, 0, 0, 1);
        // }
    }
    return mix(mix(ambient, diffuse), specular);
}