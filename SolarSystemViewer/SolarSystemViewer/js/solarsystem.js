var planetName;
var container;

// Physics parameters
var G = 6.67384e-11; // m3 kg-1 s-2
var METERS_PER_UNIT = 1000000000; // 1 meter in Three.js world = 1 megameter in simulation

// Engine speed parameters
var SEC_PER_STEP = 8; // Simulation calculates on this time interval
var STEPS_PER_FRAME = 128; // Simulation calculates this many steps per frame

var MIN_STEPS_PER_FRAME = 64;
var MAX_STEPS_PER_FRAME = 65536;

var MAX_TRAIL_VERTICES = 200;

var MIN_OVERLAY_DISTANCE = 2;
var OVERLAY_DISTANCE_SCALE = 200;
var MAX_OVERLAY_OPACITY = 0.15;

var SUN_SCALE = 400;
var PLANET_SCALE = 2500;
var PLANET_SPACING = 420;
var ROTATION_FACTOR = 200;

var renderer;
var planetScene;
var camera;
var controls;

var sun;
var planets = [];
var skydome;

var pointLight;

var planetVShader;
var planetFShader;
var sunVShader;
var sunFShader;
var blurHorizontalVShader;
var blurHorizontalFShader;
var blurVerticalVShader;
var blurVerticalFShader;

var focusIndex = 0;
var focusVec = new THREE.Vector3();

// Initialization logic to run on page load
function init()
{
    // HUD elements
    planetName = document.getElementById( 'txtPlanet' );
    container = document.getElementById( 'container' );

    // Shaders
    planetVShader = document.getElementById( 'planet-vertex' ).textContent;
    planetFShader = document.getElementById( 'planet-fragment' ).textContent;
    sunVShader = document.getElementById( 'sun-vertex' ).textContent;
    sunFShader = document.getElementById('sun-fragment').textContent;
    blurHorizontalVShader = document.getElementById('post-vertex').textContent;
    blurHorizontalFShader = document.getElementById('post-fragment').textContent;
    blurVerticalVShader = document.getElementById('post2-vertex').textContent;
    blurVerticalFShader = document.getElementById('post2-fragment').textContent;

    // Create the renderer
    renderer = new THREE.WebGLRenderer( {
        antialias: true
    } );

    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild(renderer.domElement);

    // Create the camera
    var fov = 35;
    var aspect = window.innerWidth / window.innerHeight;
    var near = 0.01;
    var far = 100000;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( -1680, 1080, 1150 );

    // Create the scenes -- there are two scenes to accommodate different lighting effects
    planetScene = new THREE.Scene();
    planetScene.add( camera );
    camera.lookAt( planetScene.position );

    // Add lighting

    // Planets get a point light originating at the sun
    pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 0, 0 );
    planetScene.add( pointLight );

    // Create controls for moving the camera
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.minDistance = 500;
    controls.maxDistance = 35000;

    // Load required resources before building the sim
    planetdata.load(initSimulation);

    // Add effects

    var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true };

    var renderModel = new THREE.RenderPass(planetScene, camera);
    renderModel.clear = false;

    composerScene = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParameters));
    composerScene.addPass(renderModel);

    var renderScene = new THREE.TexturePass(composerScene.renderTarget2);
    renderScene.uniforms["tDiffuse"].texture = composerScene.renderTarget2;

    // Data to pass to post-process shader

    var uniforms = {
        tDiffuse: { type: "t", value: 0, texture: null },
        width:    { type: "f", value: window.innerWidth},
        height:   { type: "f", value: window.innerHeight}
    };

    var blurHorizontalShader = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: blurHorizontalVShader,
        fragmentShader: blurHorizontalFShader
    });

    var blurVerticalShader = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: blurVerticalVShader,
        fragmentShader: blurVerticalFShader
    });

    // create effects

    effectBlurHorizontal = new THREE.ShaderPass(blurHorizontalShader);    
    effectBlurVertical = new THREE.ShaderPass(blurVerticalShader);
    effectBlurVertical.renderToScreen = true; 

    // Add effect to the composer pass
    composer = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParameters));
    composer.addPass(renderScene);
    composer.addPass(effectBlurHorizontal);
    composer.addPass(effectBlurVertical);

}

// Logic to set up the solar system
function initSimulation()
{
    // Sun first
    sun = addSun();

    // Star background
    skydome = addStars();

    // *** Add your source code here ***

    // Start focus on the sun
    changeFocus( 0 );

    // Start looping the update logic
    requestAnimFrame( main );
}

// Logic to create planet motion trails
function createTrail( pos )
{
    // *** Add your source code here ***
}

// Logic to create overlay spheres
function createOverlay( position )
{
    // *** Add your source code here ***
    return null;
}

// Logic to add a planet to the solar system
function addPlanet( data, distance )
{
    // *** Add your source code here ***
}

// Logic to add the sun to the solar system
function addSun()
{
    var geometry = new THREE.SphereGeometry( planetdata.sun.radius * SUN_SCALE, 32, 32 );

    // Data to pass to shaders
    var uniforms = {
        texture: { type: 't', value: resources.get( planetdata.sun.texture ) },
        inverseViewMatrix: { type: 'mat4', value: camera.matrixWorld },
        lightPosition: { type: 'v3', value: pointLight.position },
        color: { type: 'v4', value: planetdata.sun.color }
    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: sunVShader,
        fragmentShader: sunFShader
    } );

    // The sun goes at (0,0,0)
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set( 0, 0, 0 );

    // Data to attach to the sun
    sphere.astro = {
        name: planetdata.sun.name,
        mass: planetdata.sun.mass,
        angularFrequency: utils.getAngularFrequency( planetdata.sun.rotationPeriod ),
    };

    // Add sun to scene
    planetScene.add( sphere );

    return sphere;
}

// Logic to set up the star background
function addStars()
{
    var texture = resources.get( planetdata.skydome.texture );

    // Repeat the texture multiple times over the surface -- reduces stretching
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 2, 2 );

    // The background is actually a very large sphere around the simulation
    var geometry = new THREE.SphereGeometry( planetdata.skydome.radius, 60, 40 );
    var uniforms = {
        texture: { type: 't', value: texture },
        inverseViewMatrix: { type: 'mat4', value: camera.matrixWorld },
    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'sky-vertex' ).textContent,
        fragmentShader: document.getElementById( 'sky-fragment' ).textContent
    } );

    skyBox = new THREE.Mesh( geometry, material );

    // Render on the inside of the sphere instead of on the outside
    skyBox.scale.set( -1, 1, 1 );
    skyBox.rotation.order = 'XZY';

    // Render behind every object in the scene (default renderOrder is 0)
    skyBox.renderOrder = 1000.0;

    planetScene.add( skyBox );
}

// Main update loop
function main()
{
    //renderer.render(planetScene, camera);
    render();
   

    var focus = getFocus( focusIndex );

    // Record current position of focused object
    focusVec.copy( focus.position );

    // Run update logic
    update();

    // Move camera with the focused object
    focusVec.subVectors( focus.position, focusVec );
    camera.position.add( focusVec );
    controls.target.copy( focus.position );

    // Loop when ready to render again
    requestAnimFrame(main);
    
}


function render() {
    var delta = 0.01;
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    composerScene.render(delta);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    composer.render(delta);
}

// Main simulation update logic
function update()
{
    // Rotate the sun but don't move it
    sun.rotateOnAxis( new THREE.Vector3(0, 1, 0), ( sun.astro.angularFrequency * SEC_PER_STEP * STEPS_PER_FRAME ) );

    // Orbit the planets
    for ( var i = 0; i < planets.length; ++i )
    {
        orbit( planets[i] );
    }
}

// Logic to move planets
function orbit( planet )
{
    // Rotate planet
    planet.rotateOnAxis( planet.astro.axis, ( planet.astro.angularFrequency * SEC_PER_STEP * STEPS_PER_FRAME ) );

    var vel = new THREE.Vector3();

    // Update several steps in a tick
    for ( var i = 0; i < STEPS_PER_FRAME; i++ )
    {
        // *** Add your source code here ***

        // One trail point per tick
        if ( i == 0 )
        {
            leaveTrail( planet );
        }
    }

    // Update the grey overlay
    updateOverlay( planet );
}

// Logic for planetary trails
function leaveTrail( planet )
{
    // *** Add your source code here ***
}

// Logic for grey planetary overlays
function updateOverlay( planet )
{
    var overlay = planet.astro.overlay;
    
    if ( !overlay )
    {
        return;
    }

    // *** Add your source code here ***
}

// Logic to change the focused planet
function changeFocus( index )
{
    // Don't select a planet after the last one or before the first one
    var clampedIndex = Math.max( 0, Math.min( index, planets.length ) );
    if ( clampedIndex === focusIndex )
    {
        return;
    }

    var oldFocus = getFocus( focusIndex );
    var newFocus = getFocus( clampedIndex );

    // Get a direction vector pointing to the new object
    var newVec = new THREE.Vector3();
    newVec.subVectors( camera.position, oldFocus.position ).normalize();

    // Zoom out 10x the radius of the new object
    var ratio = newFocus.geometry.parameters.radius * 10;
    newVec.multiplyScalar( ratio );

    // Move camera to new position
    camera.position.addVectors( newFocus.position, newVec );
    camera.lookAt( newFocus.position );
    controls.target.copy( newFocus.position );
    controls.update();

    focusIndex = clampedIndex;

    // Update HUD
    planetName.innerHTML = newFocus.astro.name;
}

// Helper function to get focused objects
function getFocus( index )
{
    // Sun is index 0
    if ( index === 0 )
    {
        return sun;
    }
    // Planets are 1-9
    else
    {
        return planets[index - 1];
    }
}

// Input handling
function onDocumentKeyDown( evt )
{
    var handled = false;
    switch ( evt.keyCode )
    {
        case 37: // Left - change focused planet
            handled = true;
            changeFocus( focusIndex - 1 );
            break;
        case 39: // Right - change focused planet
            handled = true;
            changeFocus( focusIndex + 1 );
            break;
        case 38: // Up - increase speed
            handled = true;
            STEPS_PER_FRAME = Math.min( STEPS_PER_FRAME * 2, MAX_STEPS_PER_FRAME );
            break;
        case 40: // Down - decrease speed
            handled = true;
            STEPS_PER_FRAME = Math.max( STEPS_PER_FRAME / 2, MIN_STEPS_PER_FRAME );
            break;
    }

    if ( handled )
    {
        // Eat the input if we handled it
        evt.preventDefault();
    }

    return !handled;
}

// Resize the render window when the browser window changes size
function onWindowResize()
{
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// Event bindings
window.addEventListener( 'load', init, false );
window.addEventListener( 'resize', onWindowResize, false );
document.addEventListener( 'keydown', onDocumentKeyDown, false );