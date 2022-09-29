// Creamos un SVG en body
const svg = d3.select("body").append("svg");

// Definimos el ancho y largo del SVG. CONSTANTES
svg.attr("width", 400).attr("height", 500);


// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {
  console.log("Llamando a join de datos: ", datos)

  // Valor máximo de los datos (frecuencia)
  maximo = d3.max(datos, d => d.frecuencia)

  // Valor mínimo de los datos (frecuencia)
  minimo = d3.min(datos, d => d.frecuencia)

  // Rango de los datos (frecuencia) [mínimo, máximo]
  rango = d3.extent(datos, d => d.frecuencia)

  console.log(rango)
  const escalaAltura = d3.scaleLinear()
    .domain([0, maximo])
    .range([0, 500])

  const escalaEjeY = d3.scaleLinear()
    .domain([0, maximo])
    .range([500, 0])
  // Truco invertir el range para que 0 sea igual a 500

  console.log("MAp de datos", datos.map(d => d.categoria))
  const escalaBarras = d3.scaleBand()
    .domain(datos.map(d => d.categoria))
    .range([0, 400])
    .padding(0.1);


  console.log("B, ", escalaBarras("B"))

  

  // Vinculamos los datos con cada elemento rect con el comando join
  const enter_and_update = svg
    .selectAll("rect")
    .data(datos)
    .join("rect")

  // Personalizamos según la información de los datos.
  enter_and_update
    .attr("width", escalaBarras.bandwidth())
    .attr("fill", "orange")  
    .attr("height", (d) => escalaAltura(d.frecuencia)) //Aplicamos nuestra escala
    .attr("y", (d) => escalaEjeY(d.frecuencia)) //Aplicamos nuestra escala
    .attr("x", (d) => escalaBarras(d.categoria));
}

////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

// Función para transformar los datos del archivo en lo que nosotros
// queremos
function parseo(row) {
  console.log("Llamando a cada fila: ", row)
  return { categoria: row.categoria, frecuencia: +row.frecuencia }
}

function runCode(option) {
  if (option == 1) {
    // Opción 1: Cargamos el CSV
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    // Para windows, luego acceder a localhost:8000 (el número depende del servidor)
    d3.csv("datos/datos_mate.csv", parseo).then(datos => {
      console.log("hola, datos CSV cargados de forma local ")
      console.log(datos)
      joinDeDatos(datos)
    }).catch(error => {
      console.log("UPS hubo un error :c ")
      console.log(error)
    })
  }

  else if (option == 2) {
    // opción 2: Cargamos el json
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    // Para windows, luego acceder a localhost:8000 (el número depende del servidor)
    d3.json("datos/datos_leng.json").then(datos => {
      console.log("hola, datos cargados de forma local ")
      console.log(datos)
      joinDeDatos(datos)
    }).catch(error => {
      console.log("UPS hubo un error :c ")
      console.log(error)
    })
  }

  else if (option == 3) {
    // opción 3: Cargamos el json de internet.
    // Esta opción no requiere hacer python3 -m http.server.
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    const URL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/bfb874f18a545e0a33218b5fd345b97cbfa74e84/letter.json"
    console.log(URL)
    d3.json(URL).then(datos => {
      console.log("hola, datos cargados")
      console.log(datos)
      joinDeDatos(datos)
    }).catch(error => {
      console.log("UPS hubo un error :c ")
      console.log(error)
    })
    //COMPLETAR
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
      {
        "categoria": "PATO",
        "frecuencia": 100
      },
    ]
    joinDeDatos(datos);
  }
}

const OPTION = 4;
runCode(OPTION);