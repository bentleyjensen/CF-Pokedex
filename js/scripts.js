let pokedex = (function () {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function loadList() {
        return fetch(apiUrl)
            .then(function (response){
                return response.json();
            })
            .then(function (json){
                json.results.forEach(function (result){
                    let pokemon = {
                        'name': result.name,
                        'detailUrl': result.url
                    };
                    const added = this.add(pokemon);
                    if (!added) {
                        console.log('Error adding pokemon:', pokemon);
                    } else {
                        console.log(`Added ${pokemon.name}`);
                    }
                });
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    function add(pokemon) {
        if (pokemon.name 
        && pokemon.detailUrl
        && Object.keys(pokemon).length === 2) {
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
        loadList: loadList,
        add: add,
        getAll: getAll,
        get: get,
        remove: remove,
        addToList: addToList,
        showDetails: showDetails
    };
})();

pokedex.loadList().then(function() {
    // Print each pokemon
    pokedex.getAll().forEach(pokedex.addToList);
})
;
