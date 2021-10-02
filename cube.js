//Name: Nayandip Banerjee
//Student Number: 201719986
//Brief Description:: This program renders and animates a 3d cube using WebGL and displays it on a canvas on a HTML page
"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 1;
var theta = [10 , 0, 5 ];
var posVertexAttribPointerSize = 4; //can be between 1-4
var colorVertexAttribPointerSize = 4; //can be between 1-4
var thetaLoc;
var colorLoc;
var toggle = true; //toggling rotation
var positionLoc;
var inputVertex=0;
var rotationXYZButtonclicked=false; //to check if one of the rotate X,Y,Z was clicked
var addTriangle=false; // to check if Add Triangle button was clicked
var removeTriangle=false;// to check if Remove Triangle button was clicked
var toggleDepth=false; // to check if depth was clicked
var initialAnim=true; // to check if the initial animation was on
var disNumVertices; // stores the html element for displaying no of vertices
var disposVertexAttribPointerSize; // stores the html element for displaying position components per vertex
var discolorVertexAttribPointerSize;// stores the html element for displaying color components per vertex
var rotationSpeedValues=[0.2,0.5,1.0]; //low, medium, high speed
var rotationSpeedIndex=1; //rotationSpeedIndex

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    //getting the html elements
    disNumVertices = document.getElementById("totVertice");
    disposVertexAttribPointerSize = document.getElementById("pVertex");
    discolorVertexAttribPointerSize = document.getElementById("cVertex");
    document.getElementById("rotSpeed").innerHTML = "medium";
    
    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //coloring the cube
    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //This function loads shader and buffer attributes
    loadShadersAndBuffer();

    //event listeners for buttons
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
        rotationButtonsClicked(); //updates boolean variables
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
        rotationButtonsClicked();
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
        rotationButtonsClicked();
    };
    document.getElementById( "tButton" ).onclick = function () {
        toggle = !toggle;
        initialAnim=false;
    };
    document.getElementById( "cycleSpeed" ).onclick = function () {
        //Cycling through speed
        var disSpeed=document.getElementById("rotSpeed");
        ++rotationSpeedIndex;
 
        if(rotationSpeedIndex > 2) {
            rotationSpeedIndex=0;
        }
        if(rotationSpeedIndex == 0) {
            disSpeed.innerHTML = "low";
        }
        else if(rotationSpeedIndex == 1) {
            disSpeed.innerHTML = "medium";
        }
        else if(rotationSpeedIndex == 2){
            disSpeed.innerHTML = "high";
        }

    };
    document.getElementById( "addTriangle" ).onclick = function () {
        addTriangle=true  //add Triangle
    };
    document.getElementById( "remTriangle" ).onclick = function () {
        removeTriangle=true //remove Triangle
    };
    document.getElementById( "dDisable" ).onclick = function () {
        toggleDepth=!toggleDepth;
    };
    document.getElementById( "cyclePVertex" ).onclick = function () {
        //cycling through position components per vertex which has a range of 1-4 
        --posVertexAttribPointerSize;
        if(posVertexAttribPointerSize<1) {
            posVertexAttribPointerSize=4;
        }

        gl.vertexAttribPointer( positionLoc, posVertexAttribPointerSize, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( positionLoc );
    };
    document.getElementById( "cycleCVertex" ).onclick = function () {
        //cycling through color components per vertex which has a range of 1-4 
        --colorVertexAttribPointerSize;
        if(colorVertexAttribPointerSize<1)
        {
            colorVertexAttribPointerSize=4;
            loadShadersAndBuffer();
            return;
        }
        else{
            gl.vertexAttribPointer( colorLoc, colorVertexAttribPointerSize, gl.FLOAT, false, 0, 0 );
        }
    };
    
    render();
    
}

//sets the variables when rotationButtons are clicked
function rotationButtonsClicked()
{
    toggle=true;
    initialAnim=false;
    rotationXYZButtonclicked=true;
}

//  Load shaders and initialize attribute buffers
function loadShadersAndBuffer()
{
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, posVertexAttribPointerSize, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    thetaLoc = gl.getUniformLocation(program, "theta");
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    
}

function quad(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

    var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 )   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);

    }
}

function render()
{
    
    //updating the values for display in html
    disposVertexAttribPointerSize.innerHTML = posVertexAttribPointerSize;
    disNumVertices.innerHTML = NumVertices;
    discolorVertexAttribPointerSize.innerHTML = colorVertexAttribPointerSize;
    
    if(NumVertices>=36) {//checking if cube is fully formed
        document.getElementById( "addTriangle" ).disabled = true;
        NumVertices=36;
    }
    else if(NumVertices <= 0) {//checking if the entire cube was taken apart
        document.getElementById( "remTriangle" ).disabled = true;
        NumVertices=0;
    }
    else {
        document.getElementById( "addTriangle" ).disabled = false;
        document.getElementById( "remTriangle" ).disabled = false;
    }
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //when Toggle Rotation is clicked
    if(toggle && !initialAnim) {
        var disAxis=document.getElementById("rotAxis");
        
        if(rotationXYZButtonclicked)
        {
            theta[axis] += rotationSpeedValues[rotationSpeedIndex];
            if(axis==xAxis) {
                disAxis.innerHTML = "X axis";
            }
            else if(axis==yAxis) {
                disAxis.innerHTML = "Y axis";
            }
            else if(axis == zAxis) {
                disAxis.innerHTML = "Z axis";
            }         
        }
        else {
            initialAnim=true;
        }
        
    }

    if(!toggle) {
        var disAxis=document.getElementById("rotAxis").innerHTML="stopped";
    }

    //setting up the initial animation
    if(initialAnim) {
        theta[0] +=rotationSpeedValues[rotationSpeedIndex];
        theta[1] +=rotationSpeedValues[rotationSpeedIndex];
        theta[2] +=rotationSpeedValues[rotationSpeedIndex];
        document.getElementById("rotAxis").innerHTML = "X,Y,Z axes";
    }
    
    //when adding a triangle we add 3 to the number of vertices
    if(addTriangle) {  
        NumVertices = NumVertices + 3.0;
        addTriangle=false;
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    //when removing a triangle we subtract 3 from the number of vertices
    if(removeTriangle) {
        NumVertices = NumVertices - 3.0;
        removeTriangle=false;
        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }
    //toggling depth test
    if(toggleDepth) {
        gl.disable(gl.DEPTH_TEST);
        document.getElementById("dValue").innerHTML = "Disabled";
    }
    else if(!toggleDepth) {
        gl.enable(gl.DEPTH_TEST);
        document.getElementById("dValue").innerHTML = "Enabled";
    }
        
    gl.uniform3fv(thetaLoc, theta);
    
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
   
    requestAnimationFrame( render );
}
