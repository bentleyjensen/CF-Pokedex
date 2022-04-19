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

// Iterate each pokemon
for (let i = 0; i < pokemonList.length; i++) {
    document.write(`<h1>${pokemonList[i].name}</h1>`);

    // print the height of the pokemon
    // Leave a note if they're especially small or large
    let height = pokemonList[i].height;
    document.write(`<p>Height: ${height}`);
    if (height > 5){
        document.write(" (He's huge!)");
    } else if (height <= 0.5) {
        document.write(" (So cute and little!)");
    }
    document.write('</p>');


    // Start types section
    document.write(`<p>Types: `);
    
    // Iterate types for each pokemon
    for (let j = 0; j < pokemonList[i].types.length; j++) {
        document.write(`<br>${pokemonList[i].types[j]}`);
    }
    // End types section
    document.write(`</p>`);
}
