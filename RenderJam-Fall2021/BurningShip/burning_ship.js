"use strict";

let gl;  // WebGL "context"
let pixellen;
let val = 8;
let flag = 1;
window.onload = function init()
{
    let canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0 , 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Compute data.
    let vertices = [];

    // Number of Pixels.
    pixellen = canvas.height * canvas.width;

    for (var i = 0; i < canvas.height; i++)
    {
        // Mapping of each pixel to relevant point from -2 to 2, where mandelbrot occurs.
        var x = map_point(0, canvas.height, -2, -1.75, i);
        
        for (var j = 0; j < canvas.width; j++)
        {
            var y = map_point(0, canvas.width, -2, -1.75, j);

            // Our canvas only takes from -1 to 1, so we map each point previously mapped
            vertices.push(vec2(map_point(-2, -1.75, -1, 1, y), map_point(-2, -1.75, -1, 1, x)));
        }
    }
    
    // Load the data into the GPU and bind to shader variabls.
    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var locationOfnt = gl.getUniformLocation(program, "iter");
    gl.useProgram(program);
    gl.uniform1f(locationOfnt, 20.0);

    setInterval(() => {
        gl.uniform1f(locationOfnt, val);
        render();
        val += flag*1;
        
        
        if (val >= 30)
        {
            flag = -1;
        }
        else if (val <= 8){
            flag =1;
        }
        
    }, 30);


    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, pixellen );

}

