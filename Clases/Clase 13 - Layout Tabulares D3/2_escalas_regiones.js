const WIDTH = 500;
const HEIGHT = 500;

//////////////////////////////////////////////////
//////                 Datos               ///////
//////////////////////////////////////////////////

const categorias = ["A", "B", "C", "D"];
const otrasCategorias = ["E", "F", "G", "H"];
const datos = [
  { categoria1: "A", categoria2: "E", color: "blue" },
  { categoria1: "B", categoria2: "E", color: "magenta" },
  { categoria1: "C", categoria2: "E", color: "yellow" },
  { categoria1: "D", categoria2: "E", color: "green" },
  { categoria1: "A", categoria2: "F", color: "red" },
  { categoria1: "B", categoria2: "F", color: "orange" },
  { categoria1: "C", categoria2: "F", color: "yellow" },
  { categoria1: "D", categoria2: "F", color: "magenta" },
  { categoria1: "A", categoria2: "G", color: "green" },
  { categoria1: "B", categoria2: "G", color: "blue" },
  { categoria1: "C", categoria2: "G", color: "olive" },
  { categoria1: "D", categoria2: "G", color: "gray" },
  { categoria1: "A", categoria2: "H", color: "orange" },
  { categoria1: "B", categoria2: "H", color: "yellow" },
  { categoria1: "C", categoria2: "H", color: "magenta" },
  { categoria1: "D", categoria2: "H", color: "green" },
];

//////////////////////////////////////////////////
//////               Ejemplo 1             ///////
//////////////////////////////////////////////////
const svgEj1 = d3
  .select("#ej1")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Definir escala de bandas para las columnas.
const escalaRegiones = d3
  .scaleBand()
  .domain(categorias)
  .range([0, WIDTH])
  .paddingInner(0.5)  // Indicar el espacio entre banda
  .paddingOuter(0.5)  // Indicar el espacio en los extremos
  .align(0.5);        // Alineación de las bandas. 0.5 == centradas

// Agregar cuadros que representan el tamaño de cada banda (columnas)
svgEj1
  .append("g")
  .selectAll("rect")
  .data(categorias)
  .join("rect")
  .attr("x", escalaRegiones)                 // La posición en X se determina usando la escala
  .attr("height", HEIGHT)
  .attr("width", escalaRegiones.bandwidth()) // El ancho del cuadro igual al tamaño de la banda
  .attr("fill", "blue")
  .attr("opacity", 0.3);

// Agregar texto de la categoría de cada banda (columnas)
svgEj1
  .append("g")
  .selectAll("text")
  .data(categorias)
  .join("text")
  .attr("x", escalaRegiones)  // La posición en X se determina usando la escala
  .attr("y", 15)
  .text((d) => d);

// Agregar línea punteada para indicar el centro de cada banda (columnas)
svgEj1
  .append("g")
  .selectAll("line")
  .data(categorias)
  .join("line")
  .attr("x1", (d) => escalaRegiones(d) + escalaRegiones.bandwidth() / 2)
  .attr("x2", (d) => escalaRegiones(d) + escalaRegiones.bandwidth() / 2)
  .attr("y1", 0)
  .attr("y2", HEIGHT)
  .attr("stroke", "black")
  .attr("stroke-dasharray", 12)
  .attr("stroke-width", 1);

// Definir escala de bandas para las filas.
const escalaRegiones2 = d3
  .scaleBand()
  .domain(otrasCategorias)
  .range([0, HEIGHT])
  .paddingInner(0.5)
  .paddingOuter(0.5)
  .align(0.5);

// Agregar cuadros que representan el tamaño de cada banda (filas)
svgEj1
  .append("g")
  .selectAll("rect")
  .data(otrasCategorias)
  .join("rect")
  .attr("y", escalaRegiones2)
  .attr("height", escalaRegiones2.bandwidth())
  .attr("width", WIDTH)
  .attr("fill", "green")
  .attr("opacity", 0.3);

// Agregar texto de la categoría de cada banda (filas)
svgEj1
  .append("g")
  .selectAll("text")
  .data(otrasCategorias)
  .join("text")
  .attr("y", d => escalaRegiones2(d) + 15)
  .text((d) => d);

// Agregar línea punteada para indicar el centro de cada banda (filas)
svgEj1
  .append("g")
  .selectAll("line")
  .data(otrasCategorias)
  .join("line")
  .attr("y1", (d) => escalaRegiones2(d) + escalaRegiones2.bandwidth() / 2)
  .attr("y2", (d) => escalaRegiones2(d) + escalaRegiones2.bandwidth() / 2)
  .attr("x1", 0)
  .attr("x2", WIDTH)
  .attr("stroke", "black")
  .attr("stroke-dasharray", 12)
  .attr("stroke-width", 1);

// Agregar datos usando categoria1 y categoria2 para definir su espacio.
svgEj1
  .append("g")
  .selectAll("rect")
  .data(datos)
  .join("rect")
  .attr("x", (d) => escalaRegiones(d.categoria1))
  .attr("y", (d) => escalaRegiones2(d.categoria2))
  .attr("width", escalaRegiones.bandwidth())
  .attr("height", escalaRegiones2.bandwidth())
  .attr("fill", (d) => d.color);

//////////////////////////////////////////////////
//////               Ejemplo 2             ///////
//////////////////////////////////////////////////
const svgEj2 = d3
  .select("#ej2")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Definir escala puntual para las columnas.
const escalaPuntual = d3
  .scalePoint()
  .domain(categorias)
  .range([0, WIDTH])
  .padding(1)
  .align(0.5);

// Agregar líneas con la posición de cada escala (columnas).
svgEj2
  .append("g")
  .selectAll("line")
  .data(categorias)
  .join("line")
  .attr("x1", escalaPuntual)
  .attr("x2", escalaPuntual)
  .attr("y1", 0)
  .attr("y2", HEIGHT)
  .attr("stroke", "black")
  .attr("stroke-dasharray", 12)
  .attr("stroke-width", 3);

// Agregar texto de la categoría de cada punto (columnas).
svgEj2
  .append("g")
  .selectAll("text")
  .data(categorias)
  .join("text")
  .attr("x", d => escalaPuntual(d) + 5)
  .attr("y", 15)
  .text((d) => d);

// Definir escala puntual para las filas.
const escalaPuntual2 = d3
  .scalePoint()
  .domain(otrasCategorias)
  .range([0, HEIGHT])
  .padding(1)
  .align(0.5);

// Agregar líneas con la posición de cada escala (filas).
svgEj2
  .append("g")
  .selectAll("line")
  .data(otrasCategorias)
  .join("line")
  .attr("y1", escalaPuntual2)
  .attr("y2", escalaPuntual2)
  .attr("x1", 0)
  .attr("x2", WIDTH)
  .attr("stroke", "black")
  .attr("stroke-dasharray", 12)
  .attr("stroke-width", 3);

// Agregar texto de la categoría de cada punto (filas).
svgEj2
  .append("g")
  .selectAll("text")
  .data(otrasCategorias)
  .join("text")
  .attr("y", d => escalaPuntual2(d) + 15)
  .text((d) => d);

// Agregar datos usando categoria1 y categoria2 para definir su espacio.
svgEj2
  .append("g")
  .selectAll("circle")
  .data(datos)
  .join("circle")
  .attr("cx", (d) => escalaPuntual(d.categoria1))
  .attr("cy", (d) => escalaPuntual2(d.categoria2))
  .attr("r", escalaPuntual2.step() / 3)
  .attr("fill", (d) => d.color);
