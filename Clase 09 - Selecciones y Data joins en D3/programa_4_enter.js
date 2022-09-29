const datos = [23, 45, 99, 64]
const update = d3.select("svg").selectAll("rect").data(datos);
const sinElementos = update.enter().append("rect");

update.merge(sinElementos).attr("height", 40)
  .attr("width", (d, i, _) => d)
  .attr("y", (d, i, _) => i * 50);
