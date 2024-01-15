let pokemonData;
let municipisData;
let moviesData;
let earthMeteoritesData;
let combinedDataArray = [];

function reloadPage() {
  location.reload();
}

function orderList(order) {
  // Verificar que el parámetro es "asc" o "desc"
  if (order !== "asc" && order !== "desc") {
    console.error("Orden no válida. Use 'asc' o 'desc'.");
    return;
  }

  // Copiar el array para no modificar el original
  const orderedArray = [...combinedDataArray];
  
  // Ordenar el array en función del parámetro
  orderedArray.sort((a, b) => {
    const compareValueA = a[1].toLowerCase(); // Modifica según la columna que deseas ordenar
    const compareValueB = b[1].toLowerCase(); // Modifica según la columna que deseas ordenar

    if (order === "asc") {
      return compareValueA.localeCompare(compareValueB);
    } else {
      return compareValueB.localeCompare(compareValueA);
    }
  });

  // Mostrar la información ordenada en la consola
  console.table(orderedArray);

  // Volver a imprimir la tabla con los datos ordenados
  combinedDataArray = orderedArray;
  printList();
}

function searchList() {
  // Obtener el valor del cuadro de texto
  const searchTerm = document.getElementById("searchInput").value;

  // Verificar si se ingresó un valor
  if (searchTerm === "") {
    console.error("Nombre del Pokémon no válido.");
    return;
  }

  // Buscar la posición del Pokémon en el array
  const index = combinedDataArray.findIndex((pokemon) =>
    pokemon[1].toLowerCase() === searchTerm.toLowerCase()
  );

  // Verificar si se encontró el Pokémon
  if (index !== -1) {
    console.log(`La posición del Pokémon "${searchTerm}" es: ${index + 1}`);

    // Limpiar el contenido anterior del contenedor
    const tableContainer = document.getElementById("resultat");
    tableContainer.innerHTML = "";

    // Crear una tabla HTML con una sola fila que contiene el resultado de la búsqueda
    const table = document.createElement("table");
    table.classList.add("pokemon-table");

    const headerRow = table.createTHead().insertRow();
    ["ID", "Nombre", "Imagen", "Peso", "Municipio", "Película", "Meteorito"].forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    const row = tbody.insertRow();

    combinedDataArray[index].forEach((cellData, cellIndex) => {
      const cell = row.insertCell();

      // Si es la columna de imagen, crea un elemento de imagen en lugar de texto
      if (cellIndex === 2 && cellData) {
        const img = document.createElement("img");
        img.src = cellData;
        img.alt = "Pokemon Image";
        img.style.width = "50px"; // Ajusta el ancho según sea necesario
        cell.appendChild(img);
      } else {
        cell.textContent = cellData;
      }
    });

    // Agregar la tabla al contenedor
    tableContainer.appendChild(table);

    return index + 1; // Devolver la posición (considerando que los índices comienzan en 0)
  } else {
    console.log(`El Pokémon "${searchTerm}" no fue encontrado.`);
    return -1; // Devolver -1 si el Pokémon no fue encontrado
  }
}


function calcMitjana() {
  // Obtener los pesos de todos los Pokémon
  const pesos = combinedDataArray.map((pokemonData) => pokemonData[3]);

  // Verificar si hay pesos para calcular la media
  if (pesos.length === 0) {
    alert("No hay pesos disponibles para calcular la media.");
    return;
  }

  // Calcular la media
  const media = pesos.reduce((sum, peso) => sum + peso, 0) / pesos.length;

  // Mostrar la media usando alert
  alert(`La media de los pesos es: ${media.toFixed(2)}kg`);

  // También puedes devolver la media si es necesario
  return media;
}


function printList() {
  // Obtener el div donde se mostrará la tabla
  const tableContainer = document.getElementById("resultat");

  // Crear una tabla HTML
  const table = document.createElement("table");
  table.classList.add("pokemon-table"); // Agregar una clase a la tabla si es necesario

  // Crear la cabecera de la tabla
  const headerRow = table.createTHead().insertRow();
  ["ID", "Nombre", "Imagen", "Peso", /*"Municipio", "Película", "Meteorito"*/].forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  // Crear el cuerpo de la tabla con los datos
  const tbody = table.createTBody();
  combinedDataArray.forEach((pokemonData) => {
    const row = tbody.insertRow();
    pokemonData.forEach((cellData, cellIndex) => {
      const cell = row.insertCell();

      // Si es la columna de imagen, crea un elemento de imagen en lugar de texto
      if (cellIndex === 2 && cellData) {
        const img = document.createElement("img");
        img.src = cellData;
        img.alt = "Pokemon Image";
        img.style.width = "50px"; // Ajusta el ancho según sea necesario
        cell.appendChild(img);
      } else {
        cell.textContent = cellData;
      }
    });
  });

  // Limpiar el contenido anterior del contenedor
  tableContainer.innerHTML = "";

  // Agregar la tabla al contenedor
  tableContainer.appendChild(table);
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
    combinedDataArray = pokemonData.map((pokemon, index) => {
      const municipiInfo = municipisData[index] || {};
      const movieInfo = moviesData[index] || {};
      const earthMeteoriteInfo = earthMeteoritesData[index] || {};

      // Convertir el peso a un número eliminando el "kg"
      const numericWeight = parseInt(pokemon.weight, 10);

      // Crear un array multidimensional para cada Pokémon
      return [
        pokemon.id,
        pokemon.name,
        pokemon.img,
        numericWeight, // Ahora se almacena como un número
        // municipiInfo.municipi_nom || "No disponible",
        // movieInfo.title || "No disponible",
        // earthMeteoriteInfo.name || "No disponible"
      ];
    });

    // Mostrar la información en una tabla en la consola
    console.table(combinedDataArray);

   
  })
  .catch((error) => {
    console.error('Error al obtener los archivos JSON:', error);
  });




  //GRÀFIC

  // const ctx = document.getElementById('myChart');

  // new Chart(ctx, {
  //   type: 'bar',
  //   data: {
  //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //     datasets: [{
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       borderWidth: 1
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       y: {
  //         beginAtZero: true
  //       }
  //     }
  //   }
  // });


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