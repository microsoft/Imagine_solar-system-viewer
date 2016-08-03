( function()
{
    // Helper function to calculate distance between two positions
    function getDistance( v1, v2 )
    {
        var x = v1.x - v2.x;
        var y = v1.y - v2.y;
        var z = v1.z - v2.z;
        return Math.sqrt( x * x + y * y + z * z );
    }

    // Helper function to calculate acceleration on a planet due to gravity from the sun
    function getAcceleration( distance )
    {
        return G * sun.astro.mass / ( Math.pow( distance, 2 ) );
    }

    // Utility function to convert period to frequency
    function getAngularFrequency( period )
    {
        return 2 * Math.PI / period;
    }

    // Cross-browser shim for requestAnimationFrame
    var requestAnimFrame = ( function()
    {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( callback )
            {
                window.setTimeout( callback, 1000 / 60 );
            };
    } )();

    window.utils = 
        {
            getDistance: getDistance,
            getAcceleration: getAcceleration,
            getAngularFrequency: getAngularFrequency
        }

    window.requestAnimFrame = requestAnimFrame;
} )();