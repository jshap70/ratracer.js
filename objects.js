var objects = [
    new Triangle(vec3(0,.5,1.5), vec3(.5,0,1.5), vec3(-.5,0,1.5),
                vec4(1,1,1,1), vec4(1,1,1,1), vec4(.8,.2,.8,1),
                100),
    new Triangle(vec3(0,1,1.3), vec3(.5,.5,1.3), vec3(-.5,.5,1.3),
                vec4(1,1,1,1), vec4(1,1,1,1), vec4(.2,.8,.8,1),
                100)
];

var lights = [
    new PointSource(vec3(0, 4, 1.3),
        vec4(.8, .8, .8, 1),
        vec4(.8, .8, .8, 1),
        vec4(.8, .8, .8, 1),
        1, 1, 1)
];
