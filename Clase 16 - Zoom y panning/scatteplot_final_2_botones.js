// Creamos constantes para esta visualización.

const LINK = "https://raw.githubusercontent.com/PUC-Infovis/codigos-2022-2/main/Clase%2016%20-%20Zoom%20y%20panning/datasaurus.csv"
const WIDTH = 600;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70,
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

const svg = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Cleamos nuestro clip que oculta todo lo que está fuera del rect
svg
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", WIDTHVIS)
  .attr("height", HEIGHTVIS);

const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`);

// Asignamos nuestro clip al contenedor de la visualización.
const contenedorVis = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
  .attr("clip-path", "url(#clip)");

// Crearemos botones que usaremos para alterar la navegación.
const reinicio = d3.select("body").append("button").text("Reiniciar")
const zoom_ojo = d3.select("body").append("button").text("Ver ojo")
const derecha = d3.select("body").append("button").text("ir derecha")

// d3.autoType parsea el CSV de forma automática.
// Ojo que a veces puede fallar, así que siempre verificar
// que los tipos de datos estén bien antes de comenzar a programar
d3.csv(LINK, d3.autoType).then(datos => {
  const escalaY = d3
    .scaleLinear()
    .domain([0, d3.max(datos, (d) => d.y) * 1.1])
    .range([HEIGHTVIS, 0]);

  const ejeY = d3.axisLeft(escalaY);
  contenedorEjeY.call(ejeY);

  const escalaX = d3
    .scaleLinear()
    .domain([0, d3.max(datos, (d) => d.x) * 1.1])
    .range([0, WIDTHVIS]);
  const ejeX = d3.axisBottom(escalaX);
  contenedorEjeX.call(ejeX);

  const puntos = contenedorVis
    .selectAll("circle")
    .data(datos)
    .join("circle")
    .attr("fill", "magenta")
    .attr("r", 2)
    .attr("cx", (d) => escalaX(d.x))
    .attr("cy", (d) => escalaY(d.y));

  const manejadorZoom = (evento) => {
    const transformacion = evento.transform;
    puntos.attr("transform", transformacion);

    // Ajustamos escalas. Esta función solo sirve con escalas continuas.
    const escalaX2 = transformacion.rescaleX(escalaX);
    const escalaY2 = transformacion.rescaleY(escalaY);

    // Actualizamos las escalas en la visualización
    contenedorEjeX.call(ejeX.scale(escalaX2));
    contenedorEjeY.call(ejeY.scale(escalaY2));
  };

  // Creamos objeto zoom
  // Definimos los rangos de escalas (máximo alejarse 0.5 y acercarse el doble)
  // Los eventos de start y end las conectamos a funciones que imprimen en consola
  // El evento principal (zoom) la conectamos con nuestra función que actualiza la vis.

  // Panning. Definimos el tamaño de nuestra cámara (con extent)
  // Definimos el cuadro máximo donde se puede mover nuestra cámara (con translateExtent)
  // Recomendación: extent == translateExtent == tamaño svg

  const zoom = d3.zoom()
    .scaleExtent([0.5, 2])
    .extent([[0, 0], [WIDTH, HEIGHT]])
    .translateExtent([[0, 0], [WIDTH, HEIGHT]])
    .on("zoom", manejadorZoom)

  // Conectamos el objeto zoom con el SVG para que se encargue de definir
  // todos los eventos necesarios para que funcione el zoom.
  svg.call(zoom);

  // 1. Boton de reinicio.
  reinicio.on("click", () => {
    // Obtenemos una transformación identidad (x=0, y=0, k=1)
    const transformacion = d3.zoomIdentity;
    // De forma elegante (con transition) aplicamos esta transformación
    svg.transition().duration(1000).call(zoom.transform, transformacion);
  });

  // 2. Boton de ojo.
  zoom_ojo.on("click", () => {
    // Obtenemos una transformación identidad y definimos la posición a hacer zoom
    const transformacion = d3.zoomIdentity.scale(2).translate(-100, -10);
    // De forma elegante (con transition) aplicamos esta transformación
    svg.transition().duration(1000).call(zoom.transform, transformacion);
  });

  // 3. Boton de moverse a la derecha.
  derecha.on("click", () => {
    // Aplicamos una traslación al zoom
    svg.transition().call(zoom.translateBy, -20, 0);
  });
})
