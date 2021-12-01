"use strict";

let gl;  // WebGL "context"
let program;
let vertices = [];
let colorss = [];



var near = 0.1;
var far = 100.0;
var fovy = 80;
var cont = 0;
var aspect;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc
var eye = vec3(0.0, 4.0, 0.0);
var at = vec3(0.0, 0.0, -5.0);
var up = vec3(0.0, 1.0, 0.0);

var x = vec2(-5, 5);
var z = vec2(-5, 5);

function get_patch(){
    var xmin = x[0]
    var xmax = x[1]
    var zmin = z[0]
    var zmax = z[1];
    var scl = 0.05;

    noise.seed(5);
    for (let z = zmin; z < zmax; z+=scl) {
        for (let x = xmin; x < xmax; x+=scl) {
          vertices.push(vec4(x, 0, z, 1.0));
        }
        
    }


    for (var i=0; i<vertices.length; i++){
		vertices[i][1] = noise.perlin2(vertices[i][0], vertices[i][2]);
    }

    for (var i=0; i<vertices.length; i++){
       let third = noise.perlin2(vertices[i][0], vertices[i][2]);
       let color = vec4(vertices[i][0], third, vertices[i][2], 1.0);
       colorss.push(color);
      }
}



window.onload = function init()
{



    let canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    gl.enable(gl.DEPTH_TEST);

    // Compute data.
    aspect = canvas.width/canvas.height;

    get_patch(x, z);

    // Load the data into the GPU and bind to shader variables.
    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorss), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    modelViewMatrix = lookAt(eye, at , up);
	projectionMatrix = perspective(fovy, aspect, near, far);
    //projectionMatrix = ortho(left, right, bottom, topVal, near, far);
    
    render();
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}




let count = 0;

var intervalId = setInterval(function() {

  if(count == 0){
  for (var i=0; i<vertices.length; i++){
		colorss[i][0] = Math.random()
    colorss[i][1] = Math.random()
    colorss[i][2] = Math.random()
	}

  count++;
}
else if(count == 1){
  colorss = colorss.map(function(c, i) {
    // Convert to HSL and keep track of original indices
    return {color: rgbToHsl(c), index: i};
  }).sort(function(c1, c2) {
    // Sort by hue
    return c1.color[0] - c2.color[0];
  }).map(function(data) {
    // Retrieve original RGB color
    return colorss[data.index];
  });

  count++;
}



}, 2000);

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    noise.seed(5);

    for (var i=0; i<vertices.length; i++){
		vertices[i][1] = noise.perlin2(vertices[i][0]-cont, vertices[i][2]-cont);
	}


    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorss), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );


    
    cont += 0.01
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawArrays( gl.POINTS, 0, vertices.length );
    requestAnimationFrame(render);
}
