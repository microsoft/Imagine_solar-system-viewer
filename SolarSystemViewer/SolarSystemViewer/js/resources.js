( function()
{
    var textures = {};

    function loadAssets( options )
    {
        var paths = options.paths;
        var onBegin = options.onBegin;
        var onComplete = options.onComplete;
        var onProgress = options.onProgress;
        var total = 0;
        var completed = 0;
        var key;
        var textureLoader = new THREE.TextureLoader();

        // Count number of assets to load
        for ( key in paths )
            if ( paths.hasOwnProperty( key ) ) total++;

        // if a begin function was passed in, call it now
        if ( typeof onBegin === 'function' )
        {
            onBegin( {
                total: total,
                completed: completed
            } );
        }

        // Load each texture
        for ( key in paths )
        {
            if ( paths.hasOwnProperty( key ) )
            {
                var path = paths[key];
                if ( typeof path === 'string' ) // Normal texture loading
                    textureLoader.load( path, getOnLoad(path, key) );
                else if ( typeof path === 'object' ) // Loading for cube textures (6 faces)
                    THREE.ImageUtils.loadTextureCube( path, null, getOnLoad( path, key ) );
            }
        }

        // Closure for a callback function for the texture loader
        function getOnLoad( path, name )
        {
            // This function is called when the texture finishes loading
            return function( tex )
            {
                textures[name] = tex;
                completed++;
                
                // Update progress loading all textures
                if ( typeof onProgress === 'function' )
                {
                    onProgress( {
                        path: path,
                        name: name,
                        total: total,
                        completed: completed
                    } );
                }
                // Check completion
                if ( completed === total && typeof onComplete === 'function' )
                {
                    onComplete( {
                        textures: textures
                    } );
                }
            };
        }

    }

    // Simple getter function for textures
    function get( texture )
    {
        return textures[texture];
    }

    // Bindings for other scripts
    window.resources = {
        load: loadAssets,
        get: get
    };
} )();