// Creamos un SVG en body.
const svg = d3.select("body").append("svg");

// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {
  // Definimos el ancho y largo del SVG.
  svg.attr("width", 50 + datos.length * 100).attr("height", 500);

  // Vinculamos los datos con cada elemento rect con el comando join.
  const enter_and_update = svg
    .selectAll("rect")
    .data(datos)
    .join("rect")

  // Personalizamos según la información de los datos.
  enter_and_update.attr("width", 50)
    .attr("fill", "orange")
    .attr("height", (d) => d.frecuencia)
    .attr("x", (_, i) => 50 + i * 100);
}

// Creamos una función que parsea los datos del csv al formato deseado.
const parseo = (d) => ({
  categoria: d.categoria,
  frecuencia: parseInt(d.frecuencia),
});

////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

function runCode(option) {
  if (option == 1) {
    // Opción 1: Cargamos el CSV y le indicamos que ocupe la función
    // parseo para procesar cada línea.
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    d3.csv("datos_mate.csv", parseo)
      .then((datos) => {
        // Usamos .then para acceder a los datos ya cargados
        // y actualizamos el svg.
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 2) {
    // opción 2: Cargamos el json y aquí ya vienen los datos con 
    // el formato deseado, así que no necesitamos la función parseo.
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    d3.json("datos_leng.json")
      .then((datos) => {
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 3) {
    // opción 3: Cargamos el json de internet.
    // Esta opción no requiere hacer python3 -m http.server.
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    const URL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/bfb874f18a545e0a33218b5fd345b97cbfa74e84/letter.json"
    d3.json(URL)
      .then((datos) => {
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 4) {
    // opción 4: usar los datos desde el mismo archivo JS
    // Esta opción no requiere hacer python3 -m http.server.
    const datos = [
      {
        "categoria": "Rojo",
        "frecuencia": 77
      },
      {
        "categoria": "Azul",
        "frecuencia": 108
      },
      {
        "categoria": "Verde",
        "frecuencia": 16
      },
    ]
    joinDeDatos(datos);
  }
}

const OPTION = 3;
runCode(OPTION);