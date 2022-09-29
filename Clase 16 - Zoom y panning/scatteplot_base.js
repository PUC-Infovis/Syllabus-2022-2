// Creamos constantes para esta visualización.
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

const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`);

const contenedorVis = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

// d3.autoType parsea el CSV de forma automática.
// Ojo que a veces puede fallar, así que siempre verificar
// que los tipos de datos estén bien antes de comenzar a programar 
d3.csv('datasaurus.csv', d3.autoType).then(datos => {
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
})