const width = 600;
const height = 600;

const margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
};

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


const iniciarSimulacion = (nodos, enlaces) => {
  const simulacion = d3
    .forceSimulation(nodos)
    .force("enlaces", d3.forceLink(enlaces).id((d) => d.nombre))
    .force("carga", d3.forceManyBody())
    .force("colision", d3.forceCollide(10))
    .force("centro", d3.forceCenter(width / 2, height / 2));

  const lineas = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(enlaces)
    .join("line")
    .attr("stroke-width", 2);

  const circulos = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodos)
    .join("circle")
    .attr("r", 5)
    .attr("fill", (d) => d.color);

  simulacion.on("tick", () => {
    // console.log({ ...nodos[0] });
    // console.log(simulacion.alpha(), simulacion.alpha() < simulacion.alphaMin());

    circulos.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    lineas
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  d3.select("#restart").on("click", () => {
    simulacion.alpha(0.8).restart()
  })
};

d3.json("ejemplo.json")
  .then((datos) => {
    const nodos = datos.nodos;
    const enlaces = datos.enlaces;
    iniciarSimulacion(nodos, enlaces);
  })
  .catch((error) => {
    console.log(error);
  });
