let pokemonList = [];

pokemonList[0] = {
    name: 'Gyarados',
    height: 6.5,
    types: ['water', 'flying']
}

pokemonList[1] = {
    name: 'Ninetales',
    height: 1.1,
    types: ['fire']
}

pokemonList[2] = {
    name: 'Houndour',
    height: 0.6,
    types: ['dark', 'fire']
}

pokemonList[3] = {
    name: 'Mantine',
    height: 2.1,
    types: ['water', 'flying']
}

pokemonList[4] = {
    name: 'Phanpy',
    height: 0.5,
    types: ['ground']
}

document.write(JSON.stringify(pokemonList));
