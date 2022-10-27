const width = 600;
const height = 600;

const margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
};

const contenedor = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${margin.top} ${margin.left})`);

const dibujarJerarquia = (raiz) => {
  const pack = d3
    .pack()
    .size([
      width - margin.left - margin.right,
      height - margin.top - margin.bottom,
    ])
    .padding(5);

  pack(raiz);
  console.log(raiz.descendants());

  const color = d3.scaleSequential([8, 0], d3.interpolateMagma);

  contenedor
    .selectAll("circle")
    .data(raiz.descendants())
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", (d) => color(d.height))
    .attr("stroke", "black");
};

d3.json("jerarquia_anidada.json")
  .then((datos) => {
    const raiz = d3.hierarchy(datos, (d) => d.hijos);
    raiz.sum((d) => d.valor);
    console.log(raiz);

    dibujarJerarquia(raiz);
  })
  .catch((error) => {
    console.log(error);
  });
