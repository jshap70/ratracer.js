var objects = [
    new Triangle(vec3(-.1, .4, 1.4), 
        vec3(-.2, 0, 1.5), vec3(.5, -.2, 1.7))
];

var lights = [
    new SimplePointSource(vec3(1, 1, 1), vec3(.2, .2, .8)),
    new ComplexPointSource(vec3(1, 1, 1), vec3(.2, .2, .8), 1, 1, 1)
];
