document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.querySelector("#buscar-btn");
    searchBtn.addEventListener("click", () => {
      const pokemonName = document.querySelector("#pokemon-name").value.trim().toLowerCase();
      if (pokemonName) {
        fetchPokemonData(pokemonName);
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
        showPokemon(data);
      })
      .catch((error) => {
        console.error("Hubo un problema con la operación fetch:", error);
        appDiv.innerHTML = "Error al cargar los datos, verifica que el nombre Pokemon este escrito correctamente.";
      });
  }

  function showPokemon(pokemon) {
    const pokeContainer = document.querySelector("#pokemon-info");
    const templatePokemon = `
    <div>
      <div>
        <h2>${pokemon.name}</h2>
        <p>#${pokemon.id.toString().padStart(3, '0')}</p>
      </div>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />
      <div>
        ${pokemon.types.map(typeInfo => `<div>${typeInfo.type.name}</div>`).join('')}
      </div>
      <div>
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
    pokeContainer.innerHTML = templatePokemon;
  }