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