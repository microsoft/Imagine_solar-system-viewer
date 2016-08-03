( function()
{
    // All distance units are in megameters (10^6 meters)
    var planets = [
        {
            name: "Current Focus: Mercury, the Swift Planet", // Name, visible on HUD
            radius: .0024397, // Radius of planet
            distance: 57.91, // Average distance from sun
            mass: 3.301e23, // Mass in kg
            velocity: 4.74e-5, // velocity of planet (megameters per second)
            rotationPeriod: 5067031.68, // time in seconds for planet to rotate once around its axis
            axialTilt: 0.01, // Angle of axis from vertical (degrees)
            texture: 'mercury', // Resource name for the texture
            color: new THREE.Vector4(0.9,0.8,0.7,1.0) // Color, used for custom shaders
        },
        {
            name: "Current Focus: Venus, the Evening Star",
            radius: .0060519,
            distance: 108.2,
            mass: 4.867e24,
            velocity: 3.5e-5,
            rotationPeriod: -20996815.68,
            axialTilt: 2.64,
            texture: 'venus',
            color: new THREE.Vector4( 1, 1, 1, 1 )
        },
        {
            name: "Current Focus: Earth, the Blue Planet",
            radius: .0063674447,
            distance: 149.6,
            mass: 6.046e24,
            velocity: 2.98e-5,
            rotationPeriod: 86164.100352,
            axialTilt: 23.4,
            texture: 'earth',
            color: new THREE.Vector4( 0.9, 1.1, 1.4, 1 )
        },
        {
            name: "Current Focus: Mars, the Red Planet",
            radius: .003386,
            distance: 227.94,
            mass: 6.417e23,
            velocity: 2.41e-5,
            rotationPeriod: 88642.6632,
            axialTilt: 25.19,
            texture: 'mars',
            color: new THREE.Vector4( 1.2, 0.9, 0.5, 1 )
        },
        {
            name: "Current Focus: Jupiter, the Gas Giant",
            radius: .069173,
            distance: 778.33,
            mass: 1.899e27,
            velocity: 1.31e-5,
            rotationPeriod: 35430.048,
            axialTilt: 3.12,
            texture: 'jupiter',
            color: new THREE.Vector4( 1.1, 0.8, 0.6, 1 )
        },
        {
            name: "Current Focus: Saturn, the Ringed Planet",
            radius: .057316,
            distance: 1424.6,
            mass: 5.685e26,
            velocity: 9.7e-6,
            rotationPeriod: 36806.4,
            axialTilt: 26.73,
            texture: 'saturn',
            color: new THREE.Vector4( 1, 1, 1, 1 )
        },
        {
            name: "Current Focus: Uranus, the Ice Giant",
            radius: .025266,
            distance: 2873.55,
            mass: 8.682e25,
            velocity: 6.8e-6,
            rotationPeriod: -62063.712,
            axialTilt: 82.23,
            texture: 'uranus',
            color: new THREE.Vector4(0.6, 1.2, 1.4, 1)
        },
        {
            name: "Current Focus: Neptune, the Watery Planet",
            radius: .024553,
            distance: 4501.0,
            mass: 1.024e26,
            velocity: 5.4e-6,
            rotationPeriod: 57996,
            axialTilt: 28.33,
            texture: 'neptune',
            color: new THREE.Vector4( 0.6, 0.9, 1.1, 1 )
        }
    ];

    var sun =
    {
        name: "Current Focus: The Sun, Center of our Solar System",
        radius: 0.6955,
        distance: 0,
        mass: 1.989e30,
        rotationPeriod: 19999999,
        axialTilt: 7.25,
        texture: 'sun',
        color: new THREE.Vector4( 1.7, 1.1, 0.9, 1 )
    };

    var skydome =
        {
            name: "Skydome",
            radius: 50000,
            texture: 'starmap'
        }

    // Function to load all necessary textures
    function loadResources( readyCB )
    {
        resources.load( {
            paths: {
                sun: 'res/sun.jpg',
                mercury: 'res/mercury.jpg',
                venus: 'res/venus.jpg',
                earth: 'res/earth.jpg',
                mars: 'res/mars.jpg',
                jupiter: 'res/jupiter.jpg',
                saturn: 'res/saturn.jpg',
                uranus: 'res/uranus.jpg',
                neptune: 'res/neptune.jpg',
                starmap: 'res/starmap.jpg'
            },
            onComplete: function( evt )
            {
                readyCB();
            }
        } );
    }

    // Bindings for other scripts
    window.planetdata =
    {
        planets: planets,
        sun: sun,
        skydome: skydome,
        load: loadResources
    };

}) ();