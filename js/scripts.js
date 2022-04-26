let pokedex = (function () {
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
        && Object.keys(pokemon).length === 3) {
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
        let result = pokemonList.filter(pokemon => pokemon.name === pokemonName);
        return result;
    }

    function remove(pokemonName) {
        if (typeof pokemonName !== 'string') {
            return false;
        }
        pokemonList = pokemonList.filter(pokemon => pokemon.name !== pokemonName);
        return true;
    }

    function addToList(pokemon) {
        // Parent Element to append to
        let ul = document.querySelector('#pokemon-list');

        // Create children to append
        let li = document.createElement('li');
        let button = document.createElement('button');

        button.innerText = pokemon.name;
        button.classList.add('pokemon-button');

        button.addEventListener('click', function (event) {
            pokedex.showDetails(event,pokemon);
        });

        li.appendChild(button);
        ul.appendChild(li);
    }

    function showDetails(event,pokemon) {
        console.log(event.type);
        console.log(pokemon.name);
    }

    return {
        add: add,
        getAll: getAll,
        get: get,
        remove: remove,
        addToList: addToList,
        showDetails: showDetails
    };
})();

// Print each pokemon
pokedex.getAll().forEach(pokedex.addToList);
