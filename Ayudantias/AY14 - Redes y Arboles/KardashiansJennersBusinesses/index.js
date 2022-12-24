// Obtenemos el width y height del elemento net definido para dejar el svg
const width = document.getElementById("net").clientWidth;
const height = document.getElementById("net").clientHeight;

// Agregamos el svg
const svg = d3
  .select("#net")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


// Función que usaremos para imprimir la posición de los nodos 
const imprimirEstadoNodo = (nodos, indice) => {
  const nodo = nodos[indice];
  console.log(`x(${nodo.x}) y(${nodo.y})`);
};


const iniciarSimulacion = (nodos, enlaces) => {

    // Crear una escala para los radios de los círculos, utilizando el atributo negocios 
    const escalaRadio = d3.scaleLinear()
                        .domain([0, d3.max(nodos, d => d.negocios)])
                        .range([10, 30]);


    // Función para limitar el rango de desplazamiento de un elemento (no se puede salir de los límites del svg)    
    //https://bl.ocks.org/mbostock/1557377
    const setMaxMin = (d, origen, medida) => {
        // Tengo que considerar el radio de mis nodos
        const radius = escalaRadio(d.negocios);
        return Math.max(radius, Math.min(medida - radius, origen));
    }

    // Crear una simulación de fuerzas con los nodos especificados 
    const simulacion = d3.forceSimulation(nodos)
        // Le agrego una fuerza a la simulación, el primer valor será el nombre de la fuerza y el segundo valor, 
        // será la fuerza que se le aplicará a los nodos. 
        // En este caso, crea un link entre los enlaces que se entregan y por default la distancia es 30. Nosotros 
        // vamos a personalizar la distancia que tienen que haber entre los nodos. Dejando más cerca si es que tienen
        // El mismo apellido y más lejos si es que tienen distinto apellido. Para el caso de la mamá (Kris) Se dejará 
        // en una distancia menor con sus links. 
        .force('enlaces', d3.forceLink(enlaces).id(d => d.nombre).distance(
            d => {
                if (d.source.nombre === 'Kris' || d.target.nombre === 'Kris') {
                    return 50;
                }
                if (d.source.apellido === d.target.apellido) {
                    return 100;
                }
                return 200;
            }
        ))
        // Simular una fuerza de atracción o repulsión entre los nodos.
        .force('carga', d3.forceManyBody())
        // Crea una fuerza que hace que el centro de masa promedio se encuentre en el punto especificado 
        .force('centro', d3.forceCenter(width / 2, height / 2))
        // Crea una fuerza que evita que los nodos se sobrepongan, para eso hago una especie de campo de fuerza alrededor de los nodos. 
        // Como tienen área, ocupo su radio como los límites de no colisión. 
        .force('colision', d3.forceCollide(d => escalaRadio(d.negocios)))
        
    
    // Funciones asosiadas al manejo del drag
    const inicioArrastre = (evento) => {
        if (evento.active === 0) {
            // Reinicio la simulación,, como le seteo 0.3 al target, la función no se detendrá hasta que ocurra el evento de fin de arrastre
            // target < min
            simulacion.alphaTarget(0.3).restart();
        }
        // Le entrego a fx y fy la posición actual del nodo ¿Por qué a fx y fy? 
        evento.subject.fx = evento.x;
        evento.subject.fy = evento.y;
        };
        
    const arrastre = (evento) => {
        evento.subject.fx = setMaxMin(evento.subject, evento.x, width);
        evento.subject.fy = setMaxMin(evento.subject, evento.y, height);
        };
        
    const finArrastre = (evento) => {
        if (evento.active === 0) {
            simulacion.alphaTarget(0);
        }
        // evento.subject.fx = null;
        // evento.subject.fy = null;
        };

    const drag = d3
    .drag()
    .on("start", inicioArrastre)
    .on("drag", arrastre)
    .on("end", finArrastre);

    // Aggrego los elementos al svg, utilizando las posiciones x e y para los nodos y enlaces que se calcularon en la simulación
    // const lineas = svg
    // .append("g")
    // .attr("stroke", "#999")
    // .attr("stroke-opacity", 0.6)
    // .selectAll("line")
    // .data(enlaces)
    // .join("line")
    // .attr("stroke-width", 2);

    // const circulos = svg
    // .append("g")
    // .attr("stroke", "#fff")
    // .attr("stroke-width", 1.5)
    // .selectAll("circle")
    // .data(nodos)
    // .join("circle")
    // .attr("r", d => escalaRadio(d.negocios))
    // .attr("fill", (d) => d.color)
    // .call(drag);
    
    // // Agregamos evento que nos imprime el nombre del nodo al hacer hover
    // circulos.on("mouseover", function (e, d) { 
    //     d3.select(this).attr("fill", "gray");
    //     console.log(d.nombre);
    // });
    // circulos.on("mouseout", function (d) {
    //     d3.select(this).attr("fill", d.color);
    // });

    // // Agregamos evento que "desfixea" al nodo al hacer click
    // circulos.on("click", function (e, d) {
    //     d.fx = null;
    //     d.fy = null;
    // });
       
    // Evento que escucha al timer de la simulación y actualiza las posiciones de los nodos y enlaces
    simulacion.on('tick', () => {
        console.log(simulacion.alpha(), simulacion.alpha() < simulacion.alphaMin());
        imprimirEstadoNodo(nodos, 0);
        // circulos.attr("cx", (d) => setMaxMin(d, d.x, width))
        // .attr("cy", (d) => setMaxMin(d, d.y, height));

        // lineas
        //       .attr("x1", (d) => setMaxMin(d.source, d.source.x, width))
        //       .attr("y1", (d) => setMaxMin(d.source, d.source.y, height))
        //       .attr("x2", (d) => setMaxMin(d.target, d.target.x, width))
        //       .attr("y2", (d) => setMaxMin(d.target, d.target.y, height));
    });

    
    

    console.log("enlaces", enlaces);
        
}


d3.json("kardashians.json").then((datos)=>{
    const nodos = datos.nodos;
    const enlaces = datos.enlaces;
    iniciarSimulacion(nodos, enlaces);
}).catch((error)=>{
    console.log(error);
});