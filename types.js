class Triangle {
    constructor(v1, v2, v3, 
        ambient = vec4(1,1,1,1), 
        diffuse = vec4(1,1,1,1), 
        specular = vec4(1,1,1,1),
        shininess = 1) {
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
        return within ? [t, p] : [Number.POSITIVE_INFINITY];
    }

    lightFrom(point, eye, s, lightSource) {
        var ambient, diffuse, specular;

        // ambient
        ambient = mult(lightSource.ambient, this.ambient);

        // diffuse
        var lightPosition = subtract(lightSource.location, point);
        var d = Math.max(dot(this.normal, lightPosition), 0.0);
        diffuse = mult(lightSource.diffuse, this.diffuse);
        diffuse = scale(d, diffuse);
        diffuse[3] = 1.0;

        // specular
        var ray = subtract(eye, s);
        var half = normalize(add(lightPosition, ray));
        var ss = dot(half, this.normal);
        if (ss > 0) {
            var specularProduct = mult(lightSource.specular, this.specular);
            specular = scale(Math.pow(ss, this.shininess), specularProduct);
            specular[3] = 1.0;
        } else {
            specular = vec4(0, 0, 0, 1);
        }
        if (d < 0) {
            specular = vec4(0, 0, 0, 1);
        }
        return add(add(ambient, diffuse), specular);
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

// class SimplePointSource {
//     constructor(location, color) {
//         this.location = location;
//         this.color = color;
//     }

//     intensity(point) {
//         var distance = length(subtract(point, this.location));
//         if (distance == 0) {
//             return this.color;
//         }
//         var scalar = 1 / (distance * distance);
//         var intensity = scale(scalar, this.color);
//         return intensity;
//     }
// }