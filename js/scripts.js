let pokedex = (function () {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function showLoadingMessage(element) {
        let loader = document.createElement('img');

        loader.classList.add('loading-gif');
        loader.src = 'img/loading.gif';

        element.appendChild(loader);
    }

    function hideLoadingMessage(element) {
        let loader = element.querySelector('.loading-gif');

        if (loader) {
            loader.remove();
        }
    }

    function fetchRemoteList() {
        let mainList = document.querySelector('#pokemon-list');
        pokedex.showLoadingMessage(mainList);

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

    function addToPage(pokemon) {
        // Parent Element to append to
        let ul = document.querySelector('#pokemon-list');

        // Create children to append
        let li = document.createElement('li');
        let button = document.createElement('button');

        button.innerText = pokedex.printName(pokemon);
        button.classList.add('pokemon-button');

        button.addEventListener('click', function (event) {
            pokedex.showDetails(event,pokemon);
        });

        li.appendChild(button);
        ul.appendChild(li);
    }

    function showDetails(event,pokemon) {
        // Remove details if they're already open
        let existingDetails = event.srcElement.parentElement.querySelector('.pokemon-details');
        if (existingDetails) {
            existingDetails.remove();
            return;
        }

        // We're passing the element to show the loader in the correct place
        showLoadingMessage(event.srcElement.parentElement);

        // Populate the details for the pokemon
        pokedex.fetchRemoteDetails(pokemon)
            // Create elements for the details
            .then(function (){
                // The div where all the details will live
                let detailsDiv = document.createElement('div');
                detailsDiv.classList.add('pokemon-details');

                ///////////////////////////
                // Detail Children Elements
                ///////////////////////////

                // Title (Pokemon name)
                let detailTitle = document.createElement('h1');
                detailTitle.innerHTML = pokedex.printName(pokemon);
                detailsDiv.appendChild(detailTitle);

                // Pokemon Picture
                let detailPicture = document.createElement('img');
                detailPicture.classList.add('.pokemon-details-img');
                detailPicture.src = pokemon.imageUrl;
                detailsDiv.appendChild(detailPicture);

                // Pokemon height in decimeters (10 cm)
                let detailHeight = document.createElement('p');
                detailHeight.innerHTML = `Height: ${pokemon.height} decimeters`;
                detailsDiv.appendChild(detailHeight);

                // List of pokemon types
                let typesHeader = document.createElement('h2');
                typesHeader.innerHTML = 'Types';
                detailsDiv.appendChild(typesHeader);

                // Start list
                let detailTypes = document.createElement('ul');

                // Setup Each list item with one type and add to list
                pokemon.types.forEach(function (type) {
                    let typeListItem = document.createElement('li');
                    typeListItem.classList.add('pokemon-type-li');
                    typeListItem.innerHTML = type;
                    detailTypes.appendChild(typeListItem);
                });

                // Append full list to the details
                detailsDiv.appendChild(detailTypes);

                // Add the completed details to the page
                event.srcElement.parentElement.appendChild(detailsDiv);
            })
            .then(function () {
                hideLoadingMessage(event.srcElement.parentElement);
            })
            .catch(function (){
                hideLoadingMessage(event.srcElement.parentElement);
            });
    }

    function printName(pokemon) {
        return pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
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
        printName: printName
    };
})();

pokedex.fetchRemoteList()
    .then(function() {
        // Print each pokemon
        pokedex.getAll().forEach(pokedex.addToPage);
    })
    .catch(function (err) {
        console.error('Error with inital load');
        console.error(err);
    });
