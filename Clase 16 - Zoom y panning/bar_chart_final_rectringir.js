// Creamos constantes para esta visualización.
const WIDTH = 600;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70, // se agranda este margen para asegurar que se vean los números
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

// Almacenamos la última transformación realizada. 
// Por defecto será la identidad (x=0, y=0, k=1)
let lastTransformation = d3.zoomIdentity;

// Creamos un SVG en body junto con su tamaño ya definido.
const svg = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)

// Cleamos nuestro clip que oculta todo lo que está fuera del rect
svg
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", WIDTHVIS)
  .attr("height", HEIGHTVIS);

// Creamos un boton y un párrafo en el body.
const boton = d3.select("body").append("button").text("Agregar elemento");
const parrafo = d3.select("body").append("p");

// Creamos un contenedor específico para cada eje y la visualización.
const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

// Asignamos nuestro clip al contenedor del eje X
const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)
  .attr("clip-path", "url(#clip)");

// Asignamos nuestro clip al contenedor de barras
const contenedorVis = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
  .attr("clip-path", "url(#clip)");


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
  contenedorEjeY.transition()
    .duration(500)
    .call(ejeY)
    .selectAll("line")
    .attr("x1", WIDTHVIS)
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.5);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  const range = [lastTransformation.applyX(0), lastTransformation.applyX(WIDTHVIS)]
  const escalaX = d3.scaleBand()
    .domain(datos.map((d) => d.categoria))
    .rangeRound(range)
    .padding(0.5);

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisBottom(escalaX);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeX a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos el texto de dicho eje.
  contenedorEjeX.transition()
    .duration(500)
    .call(ejeX)
    .selectAll("text")
    .attr("font-size", 20);

  // Vinculamos los datos con cada elemento rect con el comando join.
  // Usamos el enter para personalizar nuestros rect cuando se crean.
  // Los creamos con largo 0 pero ya posicionados donde corresponde.
  const enter_and_update = contenedorVis
    .selectAll("rect")
    .data(datos, d => d.categoria) // Muy importante definir la llave del join.
    .join(enter =>
      enter
        .append("rect")
        .attr("fill", "orange")
        .attr("y", HEIGHTVIS)
        .attr("height", 0)
        .attr("width", escalaX.bandwidth())
        .attr("x", (d) => escalaX(d.categoria)),
      update => update, // Esto es para acceder a la función de exit que es la tercera
      exit => exit // Transicion para eliminar elegamentement las barras
        .transition()
        .duration(500)
        .attr("y", HEIGHTVIS)
        .attr("height", 0)
        .remove()
    )

  // Personalizamos según la información de los datos.
  // Usamos nuestras escalas para actualizar sus posiciones y altura de
  // las barras que ya estaban creadas y las nuevas.
  enter_and_update.transition()
    .duration(500)
    .attr("width", escalaX.bandwidth())
    .attr("height", (d) => escalaAltura(d.frecuencia))
    .attr("x", (d) => escalaX(d.categoria))
    .attr("y", (d) => escalaY(d.frecuencia))

  // Definimos eventos. En particular:
  // (1) [click] Click en una barra se elimina
  // (2) [mouseenter] Pasar el mouse sobre una barra
  // (2) [mouseleave] Sacar el mouse de una barra
  enter_and_update.on("click", (_, d) => {
    datosFinales.splice(datosFinales.indexOf(d), 1);
    joinDeDatos(datosFinales);
  })
    .on("mouseenter", (evento, d) => {
      // console.log(d);
      // console.log(evento.currentTarget);
      parrafo.text(`Categoría: ${d.categoria}, Frecuencia: ${d.frecuencia}`);
    })
    .on("mouseleave", (evento, d) => {
      // console.log(d);
      // console.log(evento.currentTarget);
      parrafo.text("");
    });

  // Contruimos nuestra función manejadora de zoom
  const manejadorZoom = (evento) => {
    const transformacion = evento.transform;
    // Actualizamos el rango de la escala considerando la transformación realizada.
    escalaX.rangeRound([transformacion.applyX(0), transformacion.applyX(WIDTHVIS)])

    // Actualizamos posición en X y ancho de las barras considerando la nueva escala.
    enter_and_update
      .attr("x", (d) => escalaX(d.categoria))
      .attr("width", escalaX.bandwidth());
    // Actualizamos el ejeX
    contenedorEjeX.call(ejeX);
    // Guardamos dicha transformación en nuestra variable global.
    lastTransformation = transformacion;
  };

  const zoom = d3.zoom()
    .extent([[0, 0], [WIDTH, HEIGHT]])
    .translateExtent([[0, 0], [WIDTH, HEIGHT]])
    .scaleExtent([1, 4])
    .on("zoom", manejadorZoom);

  svg.call(zoom);
}

// Lista global para guardar todos los datos.
let datosFinales = [
  { "categoria": "A", "frecuencia": 100 },
  { "categoria": "B", "frecuencia": 120 },
  { "categoria": "C", "frecuencia": 140 },
]

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

// Vinculamos el click del boton con una función encargada de
// generar un nuevo dato, agregarlo a la lista global y de llamar
// a la función joinDeDatos para actualizar la visualización.
boton.on("click", () => {
  const nuevoValor = datoNuevoRandom(datosFinales)
  datosFinales.push(nuevoValor);
  joinDeDatos(datosFinales);
});

////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

// Llamamos a la función con nuestra lista global
joinDeDatos(datosFinales);