const datos = [150, 256, 130, 0, 23, 422, 235];
// Encontrar el body en el HTML y agregar un elemento SVG
const svg = d3.select("body").append("svg");
// Definir ancho y largo del SVG
svg.attr("width", 50 + datos.length * 100).attr("height", 500);
// Agregar rect según los datos que tenemos
svg
  .selectAll("rect")
  .data(datos)
  .enter()
  .append("rect")
  .attr("width", 50)
  .attr("fill", "orange")
  .attr("height", (d) => d)
  .attr("x", (_, index) => 50 + index * 100);