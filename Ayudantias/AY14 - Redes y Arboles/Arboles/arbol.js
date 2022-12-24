/*
Este código está comentado en arbolColapsado.js ya que esta es una versión preliminar para entender como funciona
d3.tree y d3.hierarchy que no contiene la funcionalidad de colapsar los nodos
*/

const WIDTH = 1500;
const HEIGHT = 4000;
const MARGIN = {
    top: 30,
    right: 50,
    left: 30,
    bottom: 50,
}

const svg = d3.select("body")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

const contenedorArbol = svg.append("g")
    .attr("transform", `translate(${MARGIN.top} ${MARGIN.left})`);

function joinDeDatos(datos) {
    // https://github.com/d3/d3-hierarchy
    const raiz = d3.hierarchy(datos, (d) => d.children);

    console.log("Nodos:", raiz.descendants());
    console.log("Enlaces:", raiz.links());
    console.log("Hojas:", raiz.leaves());
    console.log("Cantidad de nodos:", raiz.count());
    console.log("Hojas:", raiz.leaves());
    console.log("Altura:", raiz.height);

    let layout = d3.tree();
    layout.size(
        [HEIGHT - MARGIN.top - MARGIN.bottom,
        WIDTH - MARGIN.left - MARGIN.right]
    );

    layout(raiz);
            
    const generadorDeEnlace = d3
        .linkHorizontal()
        .source((d) => d.source)
        .target((d) => d.target)
        .x((d) => d.y)
        .y((d) => d.x)
        
    contenedorArbol
        .selectAll("circle")
        .data(raiz.descendants())
        .join("circle")
        .attr("cx", (d) => d.y)
        .attr("cy", (d) => d.x)
        .attr("r", 3)
        .attr("cursor", "pointer")
        .on("click", (event, d) => console.log(d))

    contenedorArbol
        .selectAll("path")
        .data(raiz.links())
        .enter()
        .append("path")
        .attr("d", generadorDeEnlace)
        .attr("stroke", "gray")
        .attr("fill", "none")
    
    contenedorArbol
        .selectAll("text")
        .data(raiz.descendants())
        .join("text")
        .attr("x", (d) => d.y)
        .attr("y", (d) => d.x)
        .text((d) => d.data.name.length < 7 ? d.data.name : d.data.name.slice(0, 7) + "...")
        .attr("font-size", 12)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "hanging")
        .attr("dx", 6)
}




d3.json("chile.json")
    .then((datos) => joinDeDatos(datos))