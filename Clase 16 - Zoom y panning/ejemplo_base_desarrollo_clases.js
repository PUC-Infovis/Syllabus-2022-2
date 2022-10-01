// Constantes
const HEIGHT = 200;
const WIDTH = 400;

// Crear un SVG, le agregamos borde para saber donde termina el SVG
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .style("border", '1px solid')
  .style("margin", '10px 10px');

// Agregamos un círculo
const circle = svg
  .append("circle")
  .attr("r", 50)
  .attr("fill", "orange")
  .attr("stroke", "black")
  .attr("cx", 200)
  .attr("cy", 100);

const manejadorZoom = (evento) => {
  const tranformacion = evento.transform
  console.log(tranformacion)
  circle.attr("transform", tranformacion)
}


const zoom = d3.zoom()
  .scaleExtent([1, 2]) // Manejar el rango del zoom
  .extent([[0, 0], [ WIDTH, HEIGHT]])
  .translateExtent([[0, 0], [ WIDTH, HEIGHT]])
  // .on("start", () => console.log("EMPECE"))
  .on("zoom", manejadorZoom)
  // .on("end", () => console.log("TERMINé"))

svg.call(zoom)