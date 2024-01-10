let pokemonData;
let municipisData;
let moviesData;
let earthMeteoritesData;

function reloadPage() {
  location.reload();
}

// Obtener datos de POKEMONS
fetch("js/data/pokemon.json")
  .then((response) => response.json())
  .then((data) => {
    pokemonData = data.pokemon;

    // Continuar con la solicitud de MUNICIPIS
    return fetch("js/data/municipis.json");
  })
  .then((response) => response.json())
  .then((data) => {
    municipisData = data.elements || []; // Si no hay información de municipio, usa un array vacío

    // Continuar con la solicitud de MOVIES
    return fetch("js/data/movies.json");
  })
  .then((response) => response.json())
  .then((data) => {
    moviesData = data.movies || []; // Si no hay información de películas, usa un array vacío

    // Continuar con la solicitud de EARTH METEORITES
    return fetch("js/data/earthMeteorites.json");
  })
  .then((response) => response.json())
  .then((data) => {
    earthMeteoritesData = data || []; // Si no hay información de meteoritos, usa un array vacío

    // Combinar información de Pokémon, Municipios, Películas y Meteoritos
    const combinedData = pokemonData.map((pokemon, index) => {
      const municipiInfo = municipisData[index] || {};
      const movieInfo = moviesData[index] || {};
      const earthMeteoriteInfo = earthMeteoritesData[index] || {};

      return {
        Pokemon: pokemon.name,
        Municipis: municipiInfo.municipi_nom || "No disponible",
        "Pel·lícules": movieInfo.title || "No disponible",
        EarthMeteorite: earthMeteoriteInfo.name || "No disponible"
      };
    });

    // Mostrar la información en una tabla en la consola
    console.table(combinedData, ["Pokemon", "Municipis", "Pel·lícules", "EarthMeteorite", "name"]);
  })
  .catch((error) => {
    console.error('Error al obtener los archivos JSON:', error);
  });


/*
// MUNICIPIS
fetch("js/data/municipis.json")
.then((response) => response.json())
.then((data) => {
	dades = data.elements;		
	
	console.log(dades)
	console.log(dades[0].municipi_nom)
});

/*

// METEORITS
fetch("js/data/earthMeteorites.json")
.then((response) => response.json())
.then((data) => {
	dades = data;		
	
	console.log(dades)
	console.log(dades[0].name)
});


// MOVIES
fetch("js/data/movies.json")
.then((response) => response.json())
.then((data) => {
	dades = data.movies;		
	
	console.log(dades)
	console.log(dades[0].title)
});

*/