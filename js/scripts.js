let  pokedex =  (function () {
    let pokemonList = [
        {
            name: 'Gyarados',
            height: 6.5,
            types: ['water', 'flying']
        },{
            name: 'Ninetales',
            height: 1.1,
            types: ['fire']
        },{
            name: 'Houndour',
            height: 0.6,
            types: ['dark', 'fire']
        },{
            name: 'Mantine',
            height: 2.1,
            types: ['water', 'flying']
        },{
            name: 'Phanpy',
            height: 0.5,
            types: ['ground']
        }
    ];

    function add(pokemon) {
        if (pokemon.name 
        && pokemon.height
        && pokemon.types
        &&  Object.keys(pokemon).length  === 3) {
            pokemonList.push(pokemon);
            return true;
        }

        return false;
    }

    function getAll() {
        return pokemonList;
    }

    function get(pokemonName) {
        if (typeof pokemonName !== 'string') {
            return [];
        }
        let result = pokemonList.filter(pokemon => pokemon.name === pokemonName)
        return result;
    }

    function remove(pokemonName) {
        if (typeof pokemonName !== 'string') {
            return false;
        }
        pokemonList = pokemonList.filter(pokemon => pokemon.name !== pokemonName)
        return true;
    }

    return {
        add: add,
        getAll: getAll,
        get: get,
        remove: remove
    }
})();

// Print each pokemon
pokedex.getAll().forEach(function(pokemon){
    document.write(`<h1>${pokemon.name}</h1>`);

    // print the height of the pokemon
    // Leave a note if they're especially small or large
    let height = pokemon.height;
    document.write(`<p>Height: ${height}`);
    if (height > 5) {
        document.write(" (He's huge!)");
    } else if (height <= 0.5) {
        document.write(" (So cute and little!)");
    }
    document.write('</p>');


    // Start types section
    document.write(`<p>Types: `);

    // Iterate types for each pokemon
    for (let j = 0; j < pokemon.types.length; j++) {
        document.write(`<br>${pokemon.types[j]}`);
    }
    // End types section
    document.write(`</p>`);
});
