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

    // TODO: Figure out if we need to return the new pokemon,
    // or if it was passed by reference and doesn't need updated
    function fetchRemoteDetails(pokemon) {
        return fetch(pokemon.detailUrl)
            .then((response) => response.json())
            .then((details) => {
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.types = details.types;

                return pokemon;
            }).catch((e) => {
                console.error(e);
            });
    }

    function addToPokedex(pokemon) {
        if (pokemon.name
            && pokemon.detailUrl
            && Object.keys(pokemon).length === 2) {
            pokemon.name = capitalize(pokemon.name);
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

        button.innerText = pokedex.capitalize(pokemon);
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
        const typesHeader = document.createElement('h2');
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

    function populateModal(title, content) {
        modalTitle.innerHTML = title;
        // Set blank to remove loader before adding new content
        modalBody.innerHTML = '';
        modalBody.appendChild(content);
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
                modalController.closeModal();
            }
        });

        // Close an open modal if click is outside modal
        modal.addEventListener('click', (event) => {
            if (event.target == modal) {
                modalController.closeModal();
            }
        });

        // Clear and fetch pokedex
        const pokdexClear = document.querySelector('#clear-pokedex');
        const pokdexFetch = document.querySelector('#fetch-pokedex');

        pokdexClear.addEventListener('click', () => {
            modalController.openModal('Confirm', htmlGenerator.confirmDialog('Are you sure you want to clear all pokemon from the pokedex?'));
        });

        pokdexFetch.addEventListener('click', () => {
            modalController.openModal('Confirm', htmlGenerator.confirmDialog('Are you sure you want to fetch and add all pokemon to the pokedex?'));
        });


    })
    .catch((err) => {
        console.error('Error with inital load');
        console.error(err);
    });
