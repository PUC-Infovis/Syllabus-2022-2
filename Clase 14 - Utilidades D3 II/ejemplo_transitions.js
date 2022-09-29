const width = 600;
const height = 400;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const rectangulo = svg
  .append("rect")
  .attr("width", 100)
  .attr("height", 100)
  .attr("fill", "black");

//// Paso 1
// rectangulo.transition().attr("width", 300);

//// Paso 2 (comantar paso anterior)
// rectangulo.transition().duration(2000).attr("width", 300);

//// Paso 3 (comantar pasos anteriores)
// rectangulo
//   .transition()
//   .duration(2000)
//   .attr("width", 300)
//   .attr("fill", "magenta");

//// Paso 4 (comantar pasos anteriores)
// rectangulo
//   .transition()
//   .duration(2000)
//   .attr("width", 300)
//   .attr("fill", "magenta")
//   .transition()
//   .attr("width", 100)
//   .attr("fill", "black");

//// Paso 4.1 (ejecutar junto al paso 4)
// rectangulo.transition().duration(1000).attr("height", 300);

//// Paso 5
// rectangulo
//   .transition("t1")
//   .duration(2000)
//   .attr("width", 300)
//   .attr("fill", "magenta")
//   .transition()
//   .attr("width", 100)
//   .attr("fill", "black");

// rectangulo.transition("t2").duration(1000).attr("height", 300);
