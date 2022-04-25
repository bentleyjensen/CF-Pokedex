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

        // This EXECUTES showDetails() when the event is ADDED,
        // and does not when the element is clicked
        // button.addEventListener('click', pokedex.showDetails(pokemon));

        // This passes the event object to showDetails(),
        // and does not have access to/cannot pass the pokemon object
        // button.addEventListener('click', pokedex.showDetails);

        li.appendChild(button);
        ul.appendChild(li);
    }

    // TODO: Will expand in later tasks
    function showDetails (pokemon) {
        console.log(Object.keys(pokemon));
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
