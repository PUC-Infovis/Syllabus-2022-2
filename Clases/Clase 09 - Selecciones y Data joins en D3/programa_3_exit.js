const datos = [23, 45]
const update = d3.select("svg").selectAll("rect").data(datos).attr("height", 40)
  .attr("width", (d, i, _) => d)
  .attr("y", (d, i, _) => i * 50);

const sinDatos = update.exit().remove();
