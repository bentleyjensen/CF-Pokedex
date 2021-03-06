const pokedex = (() => {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function fetchRemoteList() {
        const mainList = document.querySelector('#pokemon-list');
        htmlGenerator.showLoadingMessage(mainList);

        return fetch(apiUrl)
            .then((response) => response.json())
            .then((json) => {
                json.results.forEach((result) => {
                    const pokemon = {
                        'name': result.name,
                        'detailUrl': result.url,
                    };
                    const added = pokedex.addToPokedex(pokemon);
                    if (!added) {
                        console.error('Error adding pokemon:', pokemon);
                    }
                });
            })
            .then(() => {
                htmlGenerator.hideLoadingMessage(mainList);
            })
            .catch((e) => {
                htmlGenerator.hideLoadingMessage(mainList);
                console.error(e);
            });
    }

    function fetchRemoteDetails(pokemon) {
        return new Promise((resolve, reject) => {
            // When given just the pokemon name, we need to fetch the whole object
            if (typeof pokemon === 'string') {
                pokemon = pokedex.get(pokemon.toLowerCase())[0];
            }

            if (pokemon.detailUrl === undefined) {
                return reject('pokemon did not have a detailUrl to fetch');
            }

            fetch(pokemon.detailUrl)
                .then((response) => response.json())
                .then((details) => {
                    pokemon.imageUrl = details.sprites.front_default;
                    pokemon.height = details.height;
                    pokemon.types = details.types;

                    return resolve(pokemon);
                }).catch((e) => {
                    return reject(e);
                });
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
            console.log('Could not get pokemon: name was not of type \'string\'');
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

    function clear() {
        pokemonList = [];
    }

    function addToPage(pokemon) {
        // Parent Element to append to
        const containerRow = document.querySelector('#pokemon-list');
        const containerCol = document.createElement('div');

        // Responsive Breakpoints
        containerCol.classList.add('col-xs');
        containerCol.classList.add('col-sm-6');
        containerCol.classList.add('col-md-4');
        containerCol.classList.add('col-lg-3');
        containerCol.classList.add('col-xl-2');

        // Create children to append
        const button = htmlGenerator.pokemonButton(pokemon);
        button.classList.add('pokemon-button');

        containerCol.appendChild(button);
        containerRow.appendChild(containerCol);
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
        fetchRemoteList: fetchRemoteList,
        fetchRemoteDetails: fetchRemoteDetails,
        addToPokedex: addToPokedex,
        getAll: getAll,
        get: get,
        remove: remove,
        clear: clear,
        addToPage: addToPage,
        capitalize: capitalize,
    };
})();

const htmlGenerator = (() => {
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

    function pokemonButton(pokemon) {
        const button = document.createElement('button');

        button.textContent = pokedex.capitalize(pokemon);
        button.classList.add('pokemon-button');
        button.classList.add('btn');
        button.classList.add('btn-primary');
        // Add Y margins
        button.classList.add('my-1');

        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#pokemonDetailsModal');
        button.setAttribute('data-bs-pokemon', pokemon.name);

        return button;
    }

    function pokemonDetails(pokemon) {
        // The div where all the details will live
        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('pokemon-details');
        detailsDiv.classList.add('container');

        ///////////////////////////
        // Detail Children Elements
        ///////////////////////////

        // Pokemon Picture
        const imgRow = document.createElement('div');
        imgRow.classList.add('row');
        const detailPicture = document.createElement('img');
        // detailPicture.classList.add('pokemon-details-img');
        detailPicture.classList.add('img-fluid');
        detailPicture.classList.add('border');
        detailPicture.classList.add('border-2');
        detailPicture.classList.add('col-xs-8');
        detailPicture.classList.add('col-sm-6');
        detailPicture.classList.add('col-md-5');
        detailPicture.classList.add('col-lg-4');
        detailPicture.classList.add('col-xl-3');
        detailPicture.src = pokemon.imageUrl;
        imgRow.appendChild(detailPicture);
        detailsDiv.appendChild(imgRow);

        // Pokemon height in decimeters (10 cm)
        const heightRow = document.createElement('div');
        heightRow.classList.add('row');
        const detailHeight = document.createElement('p');
        detailHeight.classList.add('col');
        detailHeight.innerHTML = `Height: ${pokemon.height} decimeters`;
        heightRow.appendChild(detailHeight);
        detailsDiv.appendChild(heightRow);

        // List of pokemon types
        const typesRow = document.createElement('div');
        typesRow.classList.add('row');
        const typesHeader = document.createElement('h6');
        typesHeader.classList.add('col');
        typesHeader.innerHTML = 'Types';
        typesRow.appendChild(typesHeader);

        // Start list
        const detailTypes = document.createElement('ul');
        detailTypes.classList.add('list-group');

        // Setup Each list item with one type and add to list
        pokemon.types.forEach((type) => {
            const typeListItem = document.createElement('li');
            typeListItem.classList.add('pokemon-type-li');
            typeListItem.classList.add('list-group-item');

            // The API returns other metadata about types
            // So it looks messy, but we're extracting only the name
            typeListItem.innerHTML = pokedex.capitalize(type.type.name);

            detailTypes.appendChild(typeListItem);
        });

        // Append full list to the details
        typesRow.appendChild(detailTypes);
        detailsDiv.appendChild(typesRow);

        // Return copmleted element
        return detailsDiv;
    }

    function clearList() {
        const list = document.querySelector('#pokemon-list');
        list.innerHTML = '';
    }

    return {
        showLoadingMessage: showLoadingMessage,
        hideLoadingMessage: hideLoadingMessage,
        pokemonButton: pokemonButton,
        pokemonDetails: pokemonDetails,
        clearList: clearList,
    };
})();

const modalController = (() => {
    const modalTitle = document.querySelector('#modal-title');
    const modalBody = document.querySelector('#modal-body');

    function populateModal(event) {
        const pokemonName = event.relatedTarget.getAttribute('data-bs-pokemon');

        pokedex.fetchRemoteDetails(pokemonName)
            .then((pokemonDetails) => {

                const modalTitle = document.querySelector('.modal-title');
                modalTitle.textContent = pokedex.capitalize(pokemonName);

                const modalBody = document.querySelector('.modal-body');
                modalBody.innerHTML = '';
                modalBody.appendChild(htmlGenerator.pokemonDetails(pokemonDetails));
            })
            .catch((err) => {
                console.log('Error when loading modal', pokemonName, err);
            });
    }

    function clearModal() {
        // remove contents
        modalTitle.innerHTML = 'Default Modal Title';
        modalBody.innerHTML = '';
        // Set Loader
        htmlGenerator.showLoadingMessage(modalBody);
    }

    return {
        populateModal: populateModal,
        clearModal: clearModal,
    };
})();

//////////////////////////////////////////////////
// Initial Page Setup
//////////////////////////////////////////////////

// First, get all the pokemons
pokedex.fetchRemoteList()
    // Then add the pokemon to the page
    .then(() => {
        // Print each pokemon
        pokedex.getAll().forEach(pokedex.addToPage);
    })
    // Do some other miscelaneous page setup
    .then(() => {
        const modalPokemonDetails = document.querySelector('#pokemonDetailsModal');

        modalPokemonDetails.addEventListener('show.bs.modal', modalController.populateModal);
        modalPokemonDetails.addEventListener('hide.bs.modal', modalController.clearModal);

        const buttonFetchPokedex = document.querySelector('#fetchPokedex');
        const buttonClearPokedex = document.querySelector('#confirmConfirm');
        
        buttonFetchPokedex.addEventListener('click', () => {
            pokedex.fetchRemoteList()
                .then(() => {
                    pokedex.getAll().forEach(pokedex.addToPage);
                })
                .catch((err) => {
                    console.log('Error fetching remote list', err);
                });
        });
        
        buttonClearPokedex.addEventListener('click', () => {
            pokedex.clear();
            htmlGenerator.clearList();
        });
    })
    .catch((err) => {
        console.error('Error with inital load');
        console.error(err);
    });
