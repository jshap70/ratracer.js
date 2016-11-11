var objects = [
    new Triangle(vec3(-.1,.4,1.4), vec3(.5,-.2,1.7), vec3(-.2,0,1.5),
                vec4(1,1,1,1), vec4(1,1,1,1), vec4(1,1,1,1),
                1)
];

var lights = [
    new PointSource(vec3(1, 1, 1), 
        vec4(.8, .2, .2, 1),
        vec4(.2, .8, .2, 1),
        vec4(.2, .2, .8, 1),
         1, 1, 1)
];
