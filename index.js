document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector("#buscar-btn");
  searchBtn.addEventListener("click", () => {
    const pokemonName = document.querySelector("#pokemon-name").value.trim().toLowerCase();
    if (pokemonName) {
      fetchPokemonData(pokemonName);
    }
  });

  const filterBtn = document.querySelector("#filtrar-btn");
  filterBtn.addEventListener("click", () => {
    const pokemonType = document.querySelector("#pokemon-type").value.trim().toLowerCase();
    if (pokemonType) {
      fetchPokemonByType(pokemonType);
    }
  });
});

function fetchPokemonData(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const appDiv = document.querySelector("#pokemon-info");

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
      appDiv.innerHTML = "Error al cargar los datos, verifica que el nombre Pokemon este escrito correctamente.";
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
