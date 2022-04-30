const pokedex = (function () {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function showLoadingMessage(element) {
        const loader = document.createElement('img');

        loader.classList.add('loading-gif');
        loader.src = 'img/loading.gif';

        element.appendChild(loader);
    }

    function hideLoadingMessage(element) {
        const loader = element.querySelector('.loading-gif');

        if (loader) {
            loader.remove();
        }
    }

    function fetchRemoteList() {
        const mainList = document.querySelector('#pokemon-list');
        pokedex.showLoadingMessage(mainList);

        return fetch(apiUrl)
            .then(function (response){
                return response.json();
            })
            .then(function (json){
                json.results.forEach(function (result){
                    const pokemon = {
                        'name': result.name,
                        'detailUrl': result.url
                    };
                    const added = pokedex.addToPokedex(pokemon);
                    if (!added) {
                        console.error('Error adding pokemon:', pokemon);
                    }
                });
            })
            .then(function () {
                pokedex.hideLoadingMessage(mainList);
            })
            .catch(function (e) {
                pokedex.hideLoadingMessage(mainList);
                console.error(e);
            });
    }

    // TODO: Figure out if we need to return the new pokemon,
    // or if it was passed by reference and doesn't need updated
    function fetchRemoteDetails(pokemon) {
        return fetch(pokemon.detailUrl)
            .then(function (response){
                return response.json();
            })
            .then(function(details){
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.types = details.types;

                return pokemon;
            }).catch(function (e) {
                console.error(e);
            });
    }

    function addToPokedex(pokemon) {
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
        const result = pokemonList.filter(pokemon => pokemon.name === pokemonName);
        return result;
    }

    function remove(pokemonName) {
        if (typeof pokemonName !== 'string') {
            return false;
        }
        pokemonList = pokemonList.filter(pokemon => pokemon.name !== pokemonName);
        return true;
    }

    function addToPage(pokemon) {
        // Parent Element to append to
        const ul = document.querySelector('#pokemon-list');

        // Create children to append
        const li = document.createElement('li');
        const button = document.createElement('button');

        button.innerText = pokedex.capitalize(pokemon);
        button.classList.add('pokemon-button');

        button.addEventListener('click', function (event) {
            pokedex.showDetails(event,pokemon);
        });

        li.appendChild(button);
        ul.appendChild(li);
    }

    function showDetails(event,pokemon) {
        const modal = document.querySelector('#modal');

        // Remove details of previous modal open
        const existingDetails = modal.querySelector('.pokemon-details');
        if (existingDetails) {
            existingDetails.remove();
        }

        // We're passing the element to show the loader in the correct place
        showLoadingMessage(event.srcElement.parentElement);

        // Populate the details for the pokemon
        pokedex.fetchRemoteDetails(pokemon)
            // Create elements for the details
            .then(function (){
                // The div where all the details will live
                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('pokemon-details');

                ///////////////////////////
                // Detail Children Elements
                ///////////////////////////

                // Title (Pokemon name)
                const detailTitle = document.createElement('h1');
                detailTitle.innerHTML = pokedex.capitalize(pokemon);
                detailsDiv.appendChild(detailTitle);

                // Pokemon Picture
                const detailPicture = document.createElement('img');
                detailPicture.classList.add('.pokemon-details-img');
                detailPicture.src = pokemon.imageUrl;
                detailsDiv.appendChild(detailPicture);

                // Pokemon height in decimeters (10 cm)
                const detailHeight = document.createElement('p');
                detailHeight.innerHTML = `Height: ${pokemon.height} decimeters`;
                detailsDiv.appendChild(detailHeight);

                // List of pokemon types
                const typesHeader = document.createElement('h2');
                typesHeader.innerHTML = 'Types';
                detailsDiv.appendChild(typesHeader);

                // Start list
                const detailTypes = document.createElement('ul');

                // Setup Each list item with one type and add to list
                pokemon.types.forEach(function (type) {
                    const typeListItem = document.createElement('li');
                    typeListItem.classList.add('pokemon-type-li');

                    typeListItem.innerHTML = pokedex.capitalize(type.type.name);

                    detailTypes.appendChild(typeListItem);
                });

                // Append full list to the details
                detailsDiv.appendChild(detailTypes);

                // Add the completed details to the page
                modal.appendChild(detailsDiv);
                modal.parentElement.classList.add('is-visible');
            })
            .then(function () {
                hideLoadingMessage(event.srcElement.parentElement);
            })
            .catch(function (){
                hideLoadingMessage(event.srcElement.parentElement);
            });
    }

    function capitalize(input) {
        let parseString = '';

        // Parse a whole pokemon object
        if (typeof input === 'object') {
            parseString = input.name;
        } else {
            // But also handle just a string
            parseString = input;
        }
        return parseString[0].toUpperCase() + parseString.slice(1);
    }

    return {
        showLoadingMessage: showLoadingMessage,
        hideLoadingMessage: hideLoadingMessage,
        fetchRemoteList: fetchRemoteList,
        fetchRemoteDetails: fetchRemoteDetails,
        addToPokedex: addToPokedex,
        getAll: getAll,
        get: get,
        remove: remove,
        addToPage: addToPage,
        showDetails: showDetails,
        capitalize: capitalize
    };
})();

// First, get all the pokemons
pokedex.fetchRemoteList()
    // Then add the pokemon to the page
    .then(function() {
        // Print each pokemon
        pokedex.getAll().forEach(pokedex.addToPage);
    })
    // Do some other miscelaneous page setup
    .then(function() {
        const modal = document.querySelector('#modal-container');

        // Close an open modal when escape is pressed
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('is-visible')) {
                closeModal();
            }
        });
    })
    .catch(function (err) {
        console.error('Error with inital load');
        console.error(err);
    });

function closeModal() {
    const modal = document.querySelector('#modal-container');
    modal.classList.remove('is-visible');
}
