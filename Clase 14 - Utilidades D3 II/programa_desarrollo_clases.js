// Creamos constantes para esta visualización.
const WIDTH = 1000;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 30,
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

// Creamos un SVG en body junto con su tamaño ya definido.
const svg = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)

// Creamos un contenedor específico para cada eje y la visualización.
const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)

const contenedorVis = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

// Vamos a crear el LABEL
const texto = d3.select("body").append("p")

// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {

  // Obtenemos los rangos de los datos. En este caso solo necesitamos el máximo.
  const maximaFrecuencia = d3.max(datos, (d) => d.frecuencia);

  // Definimos una escala lineal para determinar la altura.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre 0 y (HEIGHT - los margenes)
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaAltura = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([0, HEIGHTVIS]);

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre (HEIGHT - los margenes) y 0.
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaY = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([HEIGHTVIS, 0]);

  // Creamos un eje izquierdo con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeY = d3.axisLeft(escalaY);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeY a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos las líneas del eje.
  contenedorEjeY
    .transition()
    .duration(2000)
    .call(ejeY)
    .selectAll("line")
    .attr("x1", WIDTHVIS)
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.5);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  const escalaX = d3.scaleBand()
    .domain(datos.map((d) => d.categoria))
    .rangeRound([0, WIDTHVIS])
    .padding(0.5);

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisBottom(escalaX);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeX a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos el texto de dicho eje.
  contenedorEjeX.transition()
    .duration(2000)
    .call(ejeX)
    .selectAll("text")
    .attr("font-size", 20);

  // Vinculamos los datos con cada elemento rect con el comando join.
  const enter_and_update = contenedorVis
    .selectAll("rect")
    .data(datos, d => d.categoria)  // hicimos join personalizado :D
    .join(
      (enter) => enter
        .append("rect")
        .attr("fill", "orange")
        .attr("width", escalaX.bandwidth())
        .attr("height", 0)
        .attr("y", HEIGHTVIS)
        .attr("x", (d) => escalaX(d.categoria))
      ,
      (update) => update,
      (exit) => exit
        .transition()
        .duration(1000)
        .attr("y", HEIGHTVIS)
        .attr("height", 0)
        .remove()
    )

  // Personalizamos según la información de los datos.
  // Usamos nuestras escalas para determinar las posiciones y altura de las barras.
  // Lo hacemos de forma animada
  enter_and_update
    .transition("update")
    .duration(2000)
    .attr("height", (d) => escalaAltura(d.frecuencia))
    .attr("y", (d) => escalaY(d.frecuencia))
    .attr("x", (d) => escalaX(d.categoria));

  enter_and_update
    .on("click", (_, d) => {
      // Sacamos el dato de la lista y volvemos a llamar a joinDeDatos
      datosFinales.splice(datosFinales.indexOf(d), 1);
      joinDeDatos(datosFinales);
    })
    .on("mouseenter", (event, d) => {
      // Vamos a guardar esos datos en un label
      texto.text(`Categoria: ${d.categoria} - Frecuencia: ${d.frecuencia}`)
      // Altero el color de mi elemento
      d3.select(event.target).attr("fill", "magenta");

      // Altero los demás elementos
      enter_and_update.attr("opacity", (dato) => {
        if (dato.categoria == d.categoria) {
          return 1;
        }
        return 0.1;
      })
    })
    .on("mouseleave", (event, d) => {
      // Altero el color de mi elemento
      d3.select(event.target).attr("fill", "orange");

      // Altero los demás elementos
      enter_and_update.attr("fill", "orange")
      enter_and_update.attr("opacity", 1);
      texto.text("")
    })
}


let datosFinales = [];

// Función encargada de crear un nuevo dato.
// Revisa la última categoría de la lista y utiliza la siguiente letra
// para definir la nueva categoría.
const datoNuevoRandom = (datos) => {
  if (datos.length == 0) {
    return { categoria: "A", frecuencia: Math.floor(Math.random() * 800) }
  }
  return {
    categoria: String.fromCharCode(
      datos[datos.length - 1].categoria.charCodeAt(0) + 1
    ),
    frecuencia: Math.floor(Math.random() * 800)
  }
};


d3.select("#add-button").on("click", (event) => {
  // Se agrege un nuevo dato.
  const nuevoDato = datoNuevoRandom(datosFinales)
  datosFinales.push(nuevoDato);
  joinDeDatos(datosFinales);
})


////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

function runCode(option) {
  if (option == 1) {
    // Cargamos el json de internet.
    // Esta opción no requiere hacer python3 -m http.server.
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    const URL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/bfb874f18a545e0a33218b5fd345b97cbfa74e84/letter.json"

    d3.json(URL).then(datos => {
      // Generamos una copia de los datos y lo guardamos
      // En nuestra variable global "datosFinales"
      datosFinales = JSON.parse(JSON.stringify(datos));
      joinDeDatos(datosFinales)
    }).catch(error => {
      console.log("UPS hubo un error :c ")
    })
  }

  else if (option == 2) {
    // opción 2: usar los datos desde el mismo archivo JS
    // Esta opción no requiere hacer python3 -m http.server.
    const datos = [
      { "categoria": "A", "frecuencia": 100 },
      { "categoria": "B", "frecuencia": 120 },
      { "categoria": "C", "frecuencia": 140 },
    ]
    joinDeDatos(datos);
  }
}

const OPTION = 1;
runCode(OPTION);