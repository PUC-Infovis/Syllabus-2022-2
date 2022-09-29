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

// IMPORTANTE --> con ZOOM hay que hacer clipPath
svg.append("clipPath")
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

  contenedorVis
    .selectAll("circle")
    .data(datos)
    .join("circle")
    .attr("fill", "magenta")
    .attr("r", 2)
    .attr("cx", (d) => escalaX(d.x))
    .attr("cy", (d) => escalaY(d.y));


  const manejadorZoom = (evento) => {
    const tranformacion = evento.transform
    console.log(tranformacion)
    // Actualizar datos
    contenedorVis
      .selectAll("circle")
      .attr("transform", tranformacion);

    // Actualizar ejes
    // 1. Actualizar escalas
    const escalaX2 = tranformacion.rescaleX(escalaX);
    const escalaY2 = tranformacion.rescaleY(escalaY);

    // 2. actualizar el objeto eje con .scale(nuevaEscala)
    // 3. Actualizar nuestro contener visual
    contenedorEjeX.call(ejeX.scale(escalaX2))
    contenedorEjeY.call(ejeY.scale(escalaY2))
  }

  const zoom = d3.zoom()
    .scaleExtent([1, 2]) // Manejar el rango del zoom
    .extent([[0, 0], [WIDTH, HEIGHT]])
    .translateExtent([[0, 0], [WIDTH, HEIGHT]])
    .on("zoom", manejadorZoom)

  svg.call(zoom) // Le da poder al usuario de hacer zoom

  reinicio.on("click", () => {
    const tranformacion = d3.zoomIdentity;
    svg.transition("reinicio").duration(2000).call(zoom.transform, tranformacion);
  })
  zoom_ojo.on("click", () => {
    const tranformacion = d3.zoomIdentity.translate(-422, -68).scale(3);
    svg.transition("ver_ojo").duration(2000).call(zoom.transform, tranformacion);
  })
  derecha.on("click", () => {
    svg.transition("ver_ojo").duration(500)
      .call(zoom.translateBy, -20, 0);
  })
})