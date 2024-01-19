let pokemonData;
let municipisData;
let moviesData;
let earthMeteoritesData;
let pokemonArray = [];
let municipisArray = [];
let moviesArray = [];
let earthMeteoritesArray = [];
let combinedDataArray = [];
// Variable para almacenar el tipo de datos seleccionado
let selectedDataType = "pokemon"; // Por defecto, cargar datos de Pokémon

// Función para cargar datos según el tipo seleccionado
function loadDataByType() {
  switch (selectedDataType) {
    case "pokemon":
      return pokemonArray;
    case "municipis":
      return municipisArray;
    case "movies":
      return moviesArray;
    case "earthMeteorites":
      return earthMeteoritesArray;
    default:
      return [];
  }
}

function reloadPage() {
  location.reload();
}



// Obtenir dades de POKÉMONS
fetch("js/data/pokemon.json")
  .then((response) => response.json())
  .then((data) => {
    pokemonData = data.pokemon;

    // Continuar amb la sol·licitud de MUNICIPIS
    return fetch("js/data/municipis.json");
  })
  .then((response) => response.json())
  .then((data) => {
    municipisData = data.elements || []; // Si no hi ha informació de municipi, utilitzar un array buit

    // Continuar amb la sol·licitud de MOVIES
    return fetch("js/data/movies.json");
  })
  .then((response) => response.json())
  .then((data) => {
    moviesData = data.movies || []; // Si no hi ha informació de pel·lícules, utilitzar un array buit

    // Continuar amb la sol·licitud de EARTH METEORITES
    return fetch("js/data/earthMeteorites.json");
  })
  .then((response) => response.json())
  .then((data) => {
    earthMeteoritesData = data || []; // Si no hi ha informació de meteorits, utilitzar un array buit

    // Combinar informació de Pokémon, Municipis, Pel·lícules i Meteorits
    pokemonArray = pokemonData.map((pokemon, index) => {
      // Convertir el pes a un número eliminant el "kg"
      const numericWeight = parseInt(pokemon.weight, 10);

      // Crear un array para cada Pokémon
      return [
        pokemon.id,
        pokemon.name,
        pokemon.img,
        numericWeight, // Ara s'emmagatzema com a número
      ];
    });

    municipisArray = municipisData.map((municipiInfo) => [
      municipiInfo.municipi_nom || "No disponible",
      municipiInfo.grup_ajuntament.codi_postal || "No disponible",
      municipiInfo.municipi_escut || "No disponible",
      municipiInfo.grup_comarca.comarca_nom || "No disponible"
      
    ]);

    moviesArray = moviesData.map((movieInfo) => [
      movieInfo.title || "No disponible",
      movieInfo.genres || "No disponible",
      movieInfo.url || "No disponible",
      movieInfo.rating || "No disponible",
    ]);

    earthMeteoritesArray = earthMeteoritesData.map((earthMeteoriteInfo) => [
      earthMeteoriteInfo.name || "No disponible",
      earthMeteoriteInfo.mass || "No disponible",
      earthMeteoriteInfo.mass || "No disponible",
      earthMeteoriteInfo.year || "No disponible",

    ]);

    // Combinar todos los arrays individuales en uno solo
    combinedDataArray = [...pokemonArray, ...municipisArray, ...moviesArray, ...earthMeteoritesArray];

    // Mostrar la informació en una taula a la consola
    console.table(combinedDataArray);
  })
  .catch((error) => {
    console.error("Error en obtenir els fitxers JSON:", error);
  });


function orderList(order) {
  // Verificar que el paràmetre és "asc" o "desc"
  if (order !== "asc" && order !== "desc") {
    console.error("Ordre no vàlid. Utilitza 'asc' o 'desc'.");
    return;
  }

  // Copiar l'array per no modificar l'original
  const orderedArray = [...combinedDataArray];

// Ordenar l'array en funció del paràmetre
orderedArray.sort((a, b) => {
  const compareValueA = (a[1] || '').toLowerCase(); // Verificar si a[1] existe
  const compareValueB = (b[1] || '').toLowerCase(); // Verificar si b[1] existe

  if (order === "asc") {
    return compareValueA.localeCompare(compareValueB);
  } else {
    return compareValueB.localeCompare(compareValueA);
  }
});
  // Mostrar la informació ordenada a la consola
  console.table(orderedArray);

  // Tornar a imprimir la taula amb les dades ordenades
  combinedDataArray = orderedArray;
  printList();
}

// Línia per fer que el cercador funcioni amb la tecla Enter
const searchInput = document.getElementById("searchInput");

// Afegir un esdeveniment d'escolta per la tecla "Enter"
searchInput.addEventListener("keyup", function (event) {
  // Verificar si la tecla premuda és "Enter" (codi 13)
  if (event.key === "Enter") {
    // Executar la funció searchList
    searchList();
  }
});

function searchList() {
  const searchTerm = searchInput.value;
  // Obtenir el valor del quadre de text

  // Verificar si s'ha introduït un valor
  if (searchTerm === "") {
    console.error("Nom del Pokémon no vàlid.");
    return;
  }

  // Buscar la posició del Pokémon a l'array
  const index = combinedDataArray.findIndex(
    (pokemon) => pokemon[1].toLowerCase() === searchTerm.toLowerCase()
  );

  // Verificar si s'ha trobat el Pokémon
  if (index !== -1) {
    console.log(`La posició del Pokémon "${searchTerm}" és: ${index + 1}`);

    // Netegar el contingut anterior del contenidor
    const tableContainer = document.getElementById("resultat");
    tableContainer.innerHTML = "";

    // Crear una taula HTML amb una sola fila que contingui el resultat de la cerca
    const table = document.createElement("table");
    table.classList.add("pokemon-table");

    const headerRow = table.createTHead().insertRow();
    [
      "ID",
      "Nom",
      "Imatge",
      "Pes",
      "Municipi",
      "Pel·lícula",
      "Meteorit",
    ].forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    const row = tbody.insertRow();

    combinedDataArray[index].forEach((cellData, cellIndex) => {
      const cell = row.insertCell();

      // Si és la columna de la imatge, crear un element d'imatge en lloc de text
      if (cellIndex === 2 && cellData) {
        const img = document.createElement("img");
        img.src = cellData;
        img.alt = "Imatge del Pokémon";
        img.style.width = "50px"; // Ajustar l'amplada segons sigui necessari
        cell.appendChild(img);
      } else {
        cell.textContent = cellData;
      }
    });

    // Afegir la taula al contenidor
    tableContainer.appendChild(table);

    return index + 1; // Tornar la posició (considerant que els índexs comencen a 0)
  } else {
    console.log(`El Pokémon "${searchTerm}" no s'ha trobat.`);
    return -1; // Tornar -1 si el Pokémon no s'ha trobat
  }
}

function calcMitjana() {
  // Obtenir els pesos de tots els Pokémon
  const pesos = combinedDataArray.map((pokemonData) => pokemonData[3]);

  // Verificar si hi ha pesos per calcular la mitjana
  if (pesos.length === 0) {
    alert("No hi ha pesos disponibles per calcular la mitjana.");
    return;
  }

  // Calcular la mitjana
  const mitjana = pesos.reduce((sum, peso) => sum + peso, 0) / pesos.length;

  // Mostrar la mitjana amb alerta
  alert(`La mitjana dels pesos és: ${mitjana.toFixed(2)}kg`);

  // També pots tornar la mitjana si és necessari
  return mitjana;
}

function printList() {
  // Obtener el div donde se mostrará la tabla
  const tableContainer = document.getElementById("resultat");

  // Obtener el array correspondiente al tipo de datos seleccionado
  const selectedArray = loadDataByType();

  // Crear una tabla HTML
  const table = document.createElement("table");
  table.classList.add("pokemon-table"); // Agregar una clase a la tabla si es necesario

  // Crear la cabecera de la tabla
  const headerRow = table.createTHead().insertRow();

  let columnNames;
  switch (selectedDataType) {
    case "pokemon":
      columnNames = ["ID", "Nombre", "Imagen", "Peso"];
      break;
    case "municipis":
      columnNames = ["Nom", "Codi Postal", "Escut", "Comarca"];
      break;
    case "movies":
      columnNames = ["Nom", "Gènere", "Imagen", "Puntuació"];
      break;
    case "earthMeteorites":
      columnNames = ["Nombre", "Massa", "Imagen", "data"];
      break;
    default:
      columnNames = [];
  }




columnNames.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  // Crear el cuerpo de la tabla con los datos del array seleccionado
  const tbody = table.createTBody();
  selectedArray.forEach((data) => {
    const row = tbody.insertRow();
    data.forEach((cellData, cellIndex) => {
      const cell = row.insertCell();

      // Si es la columna de imagen, crear un elemento de imagen en lugar de texto
      if (cellIndex === 2 && cellData) {
        const img = document.createElement("img");
        img.src = cellData;
        img.alt = "Imagen No disponible";
        img.style.width = "50px"; // Ajustar el ancho según sea necesario
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



// Función para actualizar el tipo de datos seleccionado
function updateSelectedDataType() {
  const dataTypeSelector = document.getElementById("dataTypeSelector");
  selectedDataType = dataTypeSelector.value;

  // Volver a imprimir la lista con el nuevo tipo de datos
  printList();
}

// ******** GRÀFIC ********

// Arrays buits
const arrayLabels = [
  "Grass",
  "Poison",
  "Fire",
  "Flying",
  "Water",
  "Bug",
  "Normal",
  "Electric",
  "Ground",
  "Fighting",
  "Psychic",
  "Rock",
  "Ice",
  "Ghost",
  "Dragon",
];
const arrayDadesGraf = [14, 33, 12, 19, 32, 12, 24, 9, 14, 8, 14, 11, 5, 3, 3];
// Generar un array pel borderColor
const borderColorArray = Array.from({ length: arrayLabels.length }, () =>
  getBorderColor()
);

// Generar un array pel backgroundColor amb opacitat
const backgroundColorArray = borderColorArray;

// Funció per generar un número aleatori entre min i max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funció per generar un color rgba aleatori amb opacitat
function getBackgroundColor() {
  const r = getRandomNumber(0, 255);
  const g = getRandomNumber(0, 255);
  const b = getRandomNumber(0, 255);
  const opacity = 0.2; // Ajustar l'opacitat segons sigui necessari
  return `rgba(${r},${g},${b},${opacity})`;
}

// Funció per generar un color rgba aleatori amb opacitat
function getBorderColor() {
  const color = getBackgroundColor();
  const opacity = 1; // Ajustar l'opacitat segons sigui necessari
  return `${color},${opacity})`;
}
// Utilitzar els arrays generats en el gràfic
const ctx = document.getElementById("myChart");

new Chart(ctx, {
  type: "polarArea",
  data: {
    labels: arrayLabels,
    datasets: [
      {
        label: "",
        data: arrayDadesGraf,
        borderWidth: 2,
        borderColor: borderColorArray,
        backgroundColor: backgroundColorArray,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
