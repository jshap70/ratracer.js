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