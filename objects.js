// scene 1:
// var objects = [
//     new Triangle(vec3(0, 0, 2), vec3(.5, -.2, .5), vec3(-.5, -.2, .5),
//                 vec4(.2,.2,.1,1), vec4(.5,.5,.3,1), vec4(1,1,.8,1),
//                 0),
//     new Triangle(vec3(0, .05, 2.2), vec3(.15, -.15, .7), vec3(-.15, -.15, .7),
//                 vec4(.1,.2,.2,1), vec4(.3,.5,.5,1), vec4(.8,1,1,1),
//                 0)
// ];

// var lights = [
//     new PointSource(vec3(-.5, .1, 1.7),
//         vec4(1, 1, 1, 1),
//         vec4(1, .9, .8, 1),
//         vec4(1, 0, 0, 1),
//         1, 1, 1),
//     new PointSource(vec3(.5, .1, 1.7),
//         vec4(1, 1, 1, 1),
//         vec4(.8, .9, 1, 1),
//         vec4(0, 0, 1, 1),
//         1, 1, 1)
// ];

// scene 2:
var objects = [
    new Sphere(vec3(-.3, .3, 2), .25,
                vec4(.2, .2, .1, 1), vec4(.5, .5, .3, 1), vec4(.8, .8, .6, 1),
                35),
    new Triangle(vec3(-.3, .9, 2.8), vec3(.7, -.3, 2.3), vec3(-.3, -.3, 2.8),
                vec4(.3, .3, .3, 1), vec4(.5, .5, .5, 1), vec4(.8, .8, .8, 1),
                1000),
    new Triangle(vec3(.7, .9, 2.3), vec3(.7, -.3, 2.3), vec3(-.3, .9, 2.8),
                vec4(.3, .3, .3, 1), vec4(.5, .5, .5, 1), vec4(.8, .8, .8, 1),
                1000)
];

var lights = [
    new PointSource(vec3(.3, .5, -1),
                    vec4(.2, .2, .2, 1),
                    vec4(.4, .4, .4, 1),
                    vec4(.6, .6, .6, 1),
                    1, 1, 1),
    new PointSource(vec3(-.2, .3, 7),
                    vec4(.2, .2, .2, 1),
                    vec4(.4, .4, .4, 1),
                    vec4(.6, .6, .6, 1),
                    1, 1, 1)
];