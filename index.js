document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector("#buscar-btn");
  searchBtn.addEventListener("click", () => {
    const pokemonName = document.querySelector("#pokemon-name").value.trim().toLowerCase();
    if (pokemonName) {
      fetchPokemonData(pokemonName);
      fetchPokemonDataCadena(pokemonName);
    }
  });

  const filterBtn = document.querySelector("#filtrar-btn");
  filterBtn.addEventListener("click", () => {
    const pokemonType = document.querySelector("#pokemon-type").value.trim().toLowerCase();
    if (pokemonType) {
      fetchPokemonByType(pokemonType);
    }
  });

  const regionBtn = document.querySelector("#search-btn");
  regionBtn.addEventListener("click", () => {
    const regionName = document.querySelector("#region-name");
    if (regionName) {
      fetchRegionData(regionName);
    }
    // console.log(regionName.value);
  });
});

function fetchPokemonData(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const appDiv = document.querySelector("#pokemon-results");

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      showPokemon(data, appDiv);
    })
    .catch((error) => {
      console.error("Hubo un problema con la operación fetch:", error);
      appDiv.innerHTML = "Error al cargar los datos, verifica que el nombre Pokemon esté escrito correctamente.";
    });
}

function fetchPokemonByType(pokemonType) {
  const apiUrl = `https://pokeapi.co/api/v2/type/${pokemonType}`;
  const resultsDiv = document.querySelector("#pokemon-results");
  resultsDiv.innerHTML = ''; // Clear previous results

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const pokemons = data.pokemon.map(p => p.pokemon);
      pokemons.forEach(p => {
        fetch(p.url)
          .then(response => response.json())
          .then(pokemonData => showPokemon(pokemonData, resultsDiv));
      });
    })
    .catch((error) => {
      console.error("Hubo un problema con la operación fetch:", error);
      resultsDiv.innerHTML = "Error al cargar los datos.";
    });
}

function showPokemon(pokemon, container) {
  const templatePokemon = `
  <div class="pokemon-card">
    <div>
      <h2>${pokemon.name}</h2>
      <p>#${pokemon.id.toString().padStart(3, '0')}</p>
    </div>
    <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />
    <div class="types">
      ${pokemon.types.map(typeInfo => `<div style="background-color: ${getTypeColor(typeInfo.type.name)};">${typeInfo.type.name}</div>`).join('')}
    </div>
    <div class="stats">
      <div>
        <div>${pokemon.weight / 10} kg</div>
        <p>Peso</p>
      </div>
      <div>
        <div>${pokemon.height / 10} m</div>
        <p>Altura</p>
      </div>
    </div>
  </div>
  `;
  container.innerHTML += templatePokemon;
}

function getTypeColor(type) {
  const colors = {
    fire: "#f08030",
    water: "#6890f0",
    grass: "#78c850",
    electric: "#f8d030",
    rock: "#b8a038",
    ground: "#e0c068",
    psychic: "#f85888",
    dark: "#705848",
    fairy: "#ee99ac",
    normal: "#a8a878",
    fighting: "#c03028",
    flying: "#a890f0",
    poison: "#a040a0",
    bug: "#a8b820",
    ghost: "#705898",
    steel: "#b8b8d0",
    dragon: "#7038f8",
    ice: "#98d8d8"
  };
  return colors[type] || "#68a090";
}

async function fetchPokemonDataCadena(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
  const evolutionDiv = document.querySelector("#evolution-chain");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    fetchEvolutionChain(data.evolution_chain.url);
  } catch (error) {
    console.error("Hubo un problema con la operación fetch:", error);
    evolutionDiv.innerHTML = "Error al cargar los datos";
  }
}

async function fetchEvolutionChain(url) {
  const evolutionDiv = document.querySelector("#evolution-chain");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    showEvolutionChain(data.chain);
  } catch (error) {
    console.error("Hubo un problema con la operación fetch:", error);
    evolutionDiv.innerHTML = "Error al cargar la cadena de evolución";
  }
}

async function fetchPokemonImage(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    return data.sprites.other["official-artwork"].front_default;
  } catch (error) {
    console.error("Hubo un problema con la operación fetch:", error);
    return null;
  }
}

async function showEvolutionChain(chain) {
  const evolutionDiv = document.querySelector("#evolution-chain");
  let evolutionHtml = `<h2>Linea evolutiva de ${chain.species.name}:</h2>`;

  let current = chain;
  while (current) {
    const pokemonImage = await fetchPokemonImage(current.species.name);
    evolutionHtml += `
      <div>
        <h3>${current.species.name}</h3>
        ${pokemonImage ? `<img src="${pokemonImage}" alt="${current.species.name}">` : ''}
      </div>
    `;
    if (current.evolves_to.length > 0) {
      evolutionHtml += '<div style="margin-left: 20px;">';
      current = current.evolves_to[0];
    } else {
      current = null;
    }
  }
  evolutionDiv.innerHTML = evolutionHtml;
}

async function fetchRegionData(regionName) {
  const apiUrl = `https://pokeapi.co/api/v2/region/`;
  const regionTitle = document.querySelector("#region-title");
  const regionImage = document.querySelector("#region-image");
  const locationsList = document.querySelector("#locations-list");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    const region = data.results.find(r => r.name.toLowerCase() === regionName);

    if (!region) {
      regionTitle.textContent = "Región no encontrada, por favor verifica que la región exista.";
      regionImage.style.display = 'none';
      locationsList.innerHTML = '';
      return;
    }

    const regionDetailsResponse = await fetch(region.url);
    if (!regionDetailsResponse.ok) {
      throw new Error("Network response was not ok " + regionDetailsResponse.statusText);
    }
    const regionDetails = await regionDetailsResponse.json();

    showRegionData(regionDetails);
  } catch (error) {
    console.error("Hubo un problema con la operación fetch:", error);
    regionTitle.textContent = "Error al cargar los datos";
    regionImage.style.display = 'none';
    locationsList.innerHTML = '';
  }
}

function showRegionData(region) {
  const regionTitle = document.querySelector("#region-title");
  const regionImage = document.querySelector("#region-image");
  const locationsList = document.querySelector("#locations-list");

  const regionImages = {
    "alola": "Alola.png",
    "galar": "Galar.png",
    "hisui": "Hisui.png",
    "hoenn": "Hoenn.png",
    "johto": "Johto.png",
    "kalos": "Kalos.png",
    "kanto": "Kanto.png",
    "paldea": "Paldea.png",
    "sinnoh": "Sinnoh.jpg",
    "unova": "Unova.png"      
  };

  const imagePath = `../mapas/${regionImages[region.name.toLowerCase()]}`;

  regionTitle.textContent = `Región: ${region.name}`;
  if (regionImages[region.name.toLowerCase()]) {
    regionImage.src = imagePath;
    regionImage.style.display = 'block';
  } else {
    regionImage.style.display = 'none';
  }

  locationsList.innerHTML = region.locations.map(location => `<li>${location.name}</li>`).join('');
}
