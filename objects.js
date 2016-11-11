var objects = [
    new Triangle(vec3(0, 0, 2), vec3(.5, -.2, .5), vec3(-.5, -.2, .5),
                vec4(.2,.2,.1,1), vec4(.5,.5,.3,1), vec4(1,1,.8,1),
                100),
    new Triangle(vec3(0, .05, 2.2), vec3(.15, -.15, .7), vec3(-.15, -.15, .7),
                vec4(.1,.2,.2,1), vec4(.3,.5,.5,1), vec4(.8,1,1,1),
                100)
];

var lights = [
    new PointSource(vec3(-.5, .1, 1.7),
        vec4(1, 1, 1, 1),
        vec4(1, .9, .8, 1),
        vec4(1, 0, 0, 1),
        1, 1, 1),
    new PointSource(vec3(.5, .1, 1.7),
        vec4(1, 1, 1, 1),
        vec4(.8, .9, 1, 1),
        vec4(0, 0, 1, 1),
        1, 1, 1)
];
