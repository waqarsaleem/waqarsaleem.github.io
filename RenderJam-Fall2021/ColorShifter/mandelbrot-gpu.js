"use strict";
let gl, canvas;  // WebGL "context"
let n_t = 100.0;
let vertices = [];
let nt_GPU;
let scalingFactor;
let scaleLoc;

window.onload = function init()
{
    
    
    let canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1 );
    
    //  Load shaders and initialize attribute buffers
    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    //Covert from Canvas cordinates to complex  pass to vertex shader
    for( let i = -2 ; i<2 ; i+=2 / document.getElementById("gl-canvas").height){

        for (let j = -2 ; j< 2 ; j+=2 / document.getElementById("gl-canvas").width){

            vertices.push(vec2(j, i) );  //Adding every vertex row-by-row to vertices list
        
        }
    }  

    
    // Load the data into the GPU and bind to shader variables.
    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices) ,gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    scaleLoc = gl.getUniformLocation( program, "scale" );

    scalingFactor = 0.5;
    document.getElementById("myRange").oninput = function() {
	scalingFactor = this.value;
	render();
    }

    render();

    

   
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
     gl.uniform1f(scaleLoc, scalingFactor);
    gl.drawArrays( gl.POINTS, 0, vertices.length );
}
