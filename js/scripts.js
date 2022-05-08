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

    function addToPage(pokemon) {
        // Parent Element to append to
        const ul = document.querySelector('#pokemon-list');

        // Create children to append
        const li = document.createElement('li');
        const button = htmlGenerator.pokemonButton(pokemon);

        li.appendChild(button);
        ul.appendChild(li);
    }

    function showDetails(event, pokemon) {
        // Populate the details for the pokemon
        pokedex.fetchRemoteDetails(pokemon)
            // Create elements for the details
            .then(() => {
                modalController.openModal(pokemon.name, htmlGenerator.pokemonDetails(pokemon));
            })
            .then(() => {
                htmlGenerator.hideLoadingMessage(event.srcElement.parentElement);
            })
            .catch(() => {
                htmlGenerator.hideLoadingMessage(event.srcElement.parentElement);
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
        fetchRemoteList: fetchRemoteList,
        fetchRemoteDetails: fetchRemoteDetails,
        addToPokedex: addToPokedex,
        getAll: getAll,
        get: get,
        remove: remove,
        addToPage: addToPage,
        showDetails: showDetails,
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

        ///////////////////////////
        // Detail Children Elements
        ///////////////////////////

        // Title (Pokemon name)
        // const detailTitle = document.createElement('h1');
        // detailTitle.innerHTML = pokedex.capitalize(pokemon);
        // detailsDiv.appendChild(detailTitle);

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
        const typesHeader = document.createElement('h5');
        typesHeader.innerHTML = 'Types';
        detailsDiv.appendChild(typesHeader);

        // Start list
        const detailTypes = document.createElement('ul');

        // Setup Each list item with one type and add to list
        pokemon.types.forEach((type) => {
            const typeListItem = document.createElement('li');
            typeListItem.classList.add('pokemon-type-li');

            // The API returns other metadata about types
            // So it looks messy, but we're extracting only the name
            typeListItem.innerHTML = pokedex.capitalize(type.type.name);

            detailTypes.appendChild(typeListItem);
        });

        // Append full list to the details
        detailsDiv.appendChild(detailTypes);

        // Return copmleted element
        return detailsDiv;
    }

    function confirmDialog(text) {
        const dialogDiv = document.createElement('div');

        const dialogText = document.createElement('p');
        dialogText.innerHTML= text;
        dialogDiv.appendChild(dialogText);

        const confirmButton = document.createElement('button');
        confirmButton.classList.add('dialog-button');
        confirmButton.classList.add('button');
        confirmButton.innerHTML = 'Confirm';
        dialogDiv.appendChild(confirmButton);

        confirmButton.addEventListener('click', () => {
            modalController.closeModal();
            return new Promise((resolve) => {
                resolve();
            });
        });

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('dialog-button');
        cancelButton.classList.add('button');
        cancelButton.innerHTML = 'Cancel';
        dialogDiv.appendChild(cancelButton);

        cancelButton.addEventListener('click', () => {
            modalController.closeModal();
            return new Promise((_resolve, reject) => {
                reject();
            });
        });

        return dialogDiv;
    }

    return {
        showLoadingMessage: showLoadingMessage,
        hideLoadingMessage: hideLoadingMessage,
        pokemonButton: pokemonButton,
        pokemonDetails: pokemonDetails,
        confirmDialog: confirmDialog,
    };
})();

const modalController = (() => {
    const modalContainer = document.querySelector('#modal-container');
    const modalTitle = document.querySelector('#modal-title');
    const modalBody = document.querySelector('#modal-body');

    function openModal(title, content) {
        modalController.clearModal();
        modalContainer.classList.add('is-visible');
        modalController.populateModal(title, content);
    }
    
    function closeModal() {
        // set hidden
        modalContainer.classList.remove('is-visible');
        // clear contents
        modalController.clearModal();
    }

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
        openModal:openModal,
        closeModal:closeModal,
        populateModal:populateModal,
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
        // const modal = document.querySelector('#modal-container');

        // Clear and fetch pokedex
        // const pokdexClear = document.querySelector('#clear-pokedex');
        // const pokdexFetch = document.querySelector('#fetch-pokedex');

        // pokdexClear.addEventListener('click', () => {
        //     modalController.openModal('Confirm', htmlGenerator.confirmDialog('Are you sure you want to clear all pokemon from the pokedex?'));
        // });

        // pokdexFetch.addEventListener('click', () => {
        //     modalController.openModal('Confirm', htmlGenerator.confirmDialog('Are you sure you want to fetch and add all pokemon to the pokedex?'));
        // });

        const modalPokemonDetails = document.querySelector('#pokemonDetailsModal');

        modalPokemonDetails.addEventListener('show.bs.modal', modalController.populateModal);


    })
    .catch((err) => {
        console.error('Error with inital load');
        console.error(err);
    });
