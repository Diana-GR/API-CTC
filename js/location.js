/*document.addEventListener("DOMContentLoaded", () => {
    const regionBtn = document.querySelector("#search-btn");
    regionBtn.addEventListener("click", () => {
      const regionName = document.querySelector("#region-name");
      if (regionName) {
        // fetchRegionData(regionName);
        console.log(regionName);
      }
    });
  });
  
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
  }*/
  