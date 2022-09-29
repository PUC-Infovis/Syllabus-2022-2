const datos = [23, 45, 99, 64]
const update = d3.select("svg")
  .selectAll("rect")
  .data(datos)
  .attr("height", 40)
  .attr("width", (d, i, all) => {
    console.log("Empezando un nuevo dato");
    console.log("data:", d);
    console.log("index:", i);
    console.log("all:", all);
    return d
  })
  .attr("y", (d, i, _) => i * 50)
  .attr("fill", "orange");