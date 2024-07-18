  //////////////////////////
  document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.querySelector("#buscar-btn");
    searchBtn.addEventListener("click", () => {
      const pokemonName = document.querySelector("#pokemon-name").value.trim().toLowerCase();
      if (pokemonName) {
        fetchPokemonData(pokemonName);
      }
    });
  });
  
  async function fetchPokemonData(pokemonName) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const appDiv = document.querySelector("#pokemon-info");
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      showPokemon(data, appDiv);
    } catch (error) {
      console.error("Hubo un problema con la operación fetch:", error);
      appDiv.innerHTML = "Error al cargar los datos, verifica que el nombre Pokemon esté escrito correctamente.";
    }
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
          <p>Peso:</p>
          <h4>${pokemon.weight / 10} kg</h4>
        </div>
        <div>
          <p>Altura:</p>
          <h4>${pokemon.height / 10} m</h4>
        </div>
      </div>
      <div>
        <button id="evolution-btn">Evolución</button>
      </div>
    </div>
    `;
    container.innerHTML = templatePokemon;
  
    // Agregar event listener para el botón de evolución
    const evolutionBtn = document.querySelector("#evolution-btn");
    evolutionBtn.addEventListener("click", () => {
      fetchPokemonCadena(pokemon.name);
    });
  }
  
  async function fetchPokemonCadena(pokemonName) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
    const evolutionDiv = document.querySelector("#pokemon-results");
    evolutionDiv.innerHTML = ''; // Clear previous results
  
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
    const evolutionDiv = document.querySelector("#pokemon-results");
  
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
      return {
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map(typeInfo => typeInfo.type.name),
        weight: data.weight,
        height: data.height
      };
    } catch (error) {
      console.error("Hubo un problema con la operación fetch:", error);
      return null;
    }
  }
  
  async function showEvolutionChain(chain) {
    const evolutionDiv = document.querySelector("#pokemon-results");
    let evolutionHtml = '<h2>Cadena de evolución:</h2>';
  
    let current = chain;
    while (current) {
      const pokemonData = await fetchPokemonImage(current.species.name);
      if (pokemonData) {
        evolutionHtml += `
        <div class="pokemon-card">
          <h3>${current.species.name}</h3>
          <img src="${pokemonData.image}" alt="${current.species.name}">
          <div class="types">
            ${pokemonData.types.map(type => `<div style="background-color: ${getTypeColor(type)};">${type}</div>`).join('')}
          </div>
          <div class="stats">
            <div>
              <p>Peso:</p>
              <h4>${pokemonData.weight / 10} kg</h4>
            </div>
            <div>
              <p>Altura:</p>
              <h4>${pokemonData.height / 10} m</h4>
            </div>
          </div>
        </div>
        `;
      }
      current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
    }
  
    evolutionDiv.innerHTML = evolutionHtml;
  }
  
  function getTypeColor(type) {
    const colors = {
      bug: '#A8B820',
      dark: '#705848',
      dragon: '#7038F8',
      electric: '#F8D030',
      fairy: '#EE99AC',
      fighting: '#C03028',
      fire: '#F08030',
      flying: '#A890F0',
      ghost: '#705898',
      grass: '#78C850',
      ground: '#E0C068',
      ice: '#98D8D8',
      normal: '#A8A878',
      poison: '#A040A0',
      psychic: '#F85888',
      rock: '#B8A038',
      steel: '#B8B8D0',
      water: '#6890F0'
    };
    return colors[type] || '#000000';
  }