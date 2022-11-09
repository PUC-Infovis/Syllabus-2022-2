// Definimos el ancho y largo del svg, ademas de los margenes para el contenedor del arbol

const WIDTH = 1500;
const HEIGHT = 4000;
const MARGIN = {
    top: 30,
    right: 50,
    left: 30,
    bottom: 50,
}

// Definimos el svg, junto con su ancho y altura

const svg = d3.select("body")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

// Definimos el contenedor del Arbol, trasladandolo segun el margen superior e inferior

const contenedorArbol = svg.append("g")
    .attr("transform", `translate(${MARGIN.top} ${MARGIN.left})`);

// Definimos nuestra funcion que hará el join de datos

function joinDeDatos(raiz) {
    // https://github.com/d3/d3-hierarchy

    let layout = d3.tree();                                 // Definimos nuestra funcion que nos dara las coordenadas x e y 
    layout.size(                                            // de los nodos, definimos las dimensiones. Es mportante que se
        [HEIGHT - MARGIN.top - MARGIN.bottom,               // definen al reves debido a que el arbol es horizontal
        WIDTH - MARGIN.left - MARGIN.right]
    );

    layout(raiz);                                           // Obtenemos nuestros datos con las coordenadas x e y de los nodos
    
    //console.log(raiz)
    raiz.parent = raiz                                      // Definimos el padre de la raiz para evitar futuros errores por ser
                                                            // nulo

    const generadorDeEnlace = d3                            // Definimos una funcion que nos cree nuestros enlaces
        .linkHorizontal()                                   // Las lineas seran horizontales
        .source((d) => d.source)                            // Se define el source y el target (estos los entrega raiz.links())
        .target((d) => d.target)                            
        .x((d) => d.y)                                      // Se define el x y el y de los enlaces, estan al reves dado que
        .y((d) => d.x)                                      // queremos que el arbol se genere horizontalmente
        
    contenedorArbol
        .selectAll("circle")                                // Seleccionamos todos los circulos (nodos)
        .data(raiz.descendants(), d => d.id)                // La data que ocuparemos son todos los nodos presentes y los asociamos
        .join(                                              // segun su id, lo siguiente es personalizar el join
            (enter) => {                                    // Definimos el enter del join
                enter
                    .append("circle")                       // Agregamos un circulo por cada dato
                    .attr("r", 3)                           // Definimos el radio del circulo
                    .attr("cx", (d) => d.parent.y)          // Definimos la posicion x e y del nodo como la posicion del padre
                    .attr("cy", (d) => d.parent.x)          // Para poder hacer la transicion desde el nodo hasta las hojas
                    .on("click", (event, d) => collapseNode(raiz, d))       // Agregamos el evento para colapsar los nodos
                    .transition()                           // Definimos la transicion
                    .duration(1000)         
                    .attr("cx", (d) => d.y)                 // Definimos la posicion x e y final del nodo
                    .attr("cy", (d) => d.x)
                    .attr("cursor", "pointer")              // El estilo del cursor es un puntero cuando se posa el mouse
            },  
            (update) => {                                   // Definimos la actualizacion de los nodos
                update  
                    .transition()                           // Se define una transicion para que no sea subito el cambio
                    .duration(1000)
                    .attr("cx", (d) => d.y)                 // Se definen las nuevas coordenadas
                    .attr("cy", (d) => d.x)
            },
            (exit) => {
                exit                                        // Definimos la eliminacion de los nodos
                    .transition()                           // Se define la transicion para la salida de los nodos
                    .duration(1000)                         
                    .attr("cx", (d) => d.parent.y)          // La posicion del nodo se traslada a la del padre
                    .attr("cy", (d) => d.parent.x)
                    .attr("r", 0)                           // El radio del nodo se vuelve 0
                    .remove()                               // Removemos los nodos
            }
        )

    contenedorArbol
        .selectAll("path")                                  // Seleccionamos todos los paths (enlaces)
        .data(raiz.links(), d => d.target.id)               // Los datos que ocuparemos son los enlaces que nos entrega
        .join(                                              // d3.hierarchy y asociamos los links al id del target
            (enter) => {                                    // Definimos la creacion de los enlaces
                enter
                    .append("path")                         // Agregamos un path
                    .attr("d", generadorDeEnlace)           // Generamos el atributo d mediante la funcion previamente definida
                    .attr("stroke", "white")                // Definimos el color del enlace como blanco para hacer la transicion
                    .transition()                           // Definimos la transicion
                    .duration(1000)
                    .attr("stroke", "gray")                 // Definimos el color de los links
                    .attr("fill", "none")                   // Definimos el llenado como none para que solo se vean las lineas
            },
            (update) => {
                update
                    .transition()                           // Definimos la transicion
                    .duration(1000)
                    .attr("d", generadorDeEnlace)           // Establecemos el nuevo enlace
            },
            (exit) => {
                exit
                    .transition()                           // Definimos la transicion
                    .duration(1000)
                    .attr("stroke", "white")                // Volvemos el enlace blanco para que se note la transicion
                    .remove()                               // Removemos los enlaces
            }
        )
        
    
    contenedorArbol             
        .selectAll("text")                                  // Seleccionamos todos los textos
        .data(raiz.descendants(), d => d.id)                // Los datos a ocupar son los nodos del arbol, asociamos el id
        .join(
            (enter) => {                        
                enter                                       // Definimos la creacion del texto
                    .append("text")                         // Agregamos texto
                    .attr("x", (d) => d.y)                  // Definimos la posicion del texto
                    .attr("y", (d) => d.x)
                    .text((d) => d.data.name.length < 7 ? d.data.name : d.data.name.slice(0, 7) + "...")    // Abreviamos los nombres
                    .transition()                           // Creamos la transicion para que el texto salga junto a los nodos
                    .duration(1000)
                    .attr("font-size", 12)                  // Definimos el tamaño del texto
                    .attr("text-anchor", "start")           // Definimos la posición del texto dado el punto x, y
                    .attr("dominant-baseline", "hanging")
                    .attr("dx", 6)                          // Desplazamos el texto un poco a la derecha
                    .attr("dy", (d) => !d.children ? -4 : 0)    // Desplazamos las hojas unos pixeles hacia arriba
            },
            (update) => {
                update                                      // Definimos la actualizacion del texto
                    .transition()                           // Creamos la transicion
                    .duration(1000)
                    .attr("x", (d) => d.y)                  // Definimos la nueva posicion del texto
                    .attr("y", (d) => d.x)
            },
            (exit) => {
                exit                                        // Definimos la eliminacion del texto
                    .transition()                           // Definimos la transicion para la eliminacion
                    .duration(1000)
                    .attr("font-size", 0)                   // Volvemos el tamaño del texto 0 para que se note la transicion
                    .remove()                               // Removemos el texto
            }
        )
        
}

// Esta funcion nos va a ayudar a filtrar los datos para que podamos colapsar los nodos
// childrenCollapsed es atributo auxiliar que nos ayudara a guardar los hijos originales 
// de cada nodo y de esta forma poder actualizar los hijos de los nodos dependiendo de
// si estan colapsados o no, ademas nos ayudamos del booleano isCollapsed para saber si
// el nodo esta colapsado

function collapseNode(raiz, node) {
    if (!node.isCollapsed) {                                // Si el nodo no estaba colapsado
        node.isCollapsed = true;                            // Establecemos que el nodo esta colapsado
        node.children = null;                               // Como esta colapsado, no tiene hijos, es decir, son nulos
        node.childrenCollapsed.map((d, i) => {              // Para cada hijo del nodo colapsado hacemos lo mismo
            d.isCollapsed = true;
            d.children= null;
        });
    } else {                                                // Si el nodo estaba colapsado
        node.isCollapsed = false;                           // Establecemos que el nodo no esta colapsado
        node.children = node.childrenCollapsed;             // Establecemos los hijos del nodo como sus hijos originales
        node.childrenCollapsed.map((d, i) => {              // Repetimos el mismo proceso para todos sus hijos
            d.isCollapsed = false;
            d.children = d.childrenCollapsed;
        });
    }
    // console.log(raiz.descendants())
    joinDeDatos(raiz)                                       // Llamamos de nuevo a joinDeDatos para actualizar el arbol
}


d3.json("chile.json")                                       // Abrimos el archivo .json
    .then((datos) => {
        let raiz = d3.hierarchy(datos, (d) => d.children);  // Definimos la raiz con d3.hierarchy, donde los hijos los da
                                                            // el atributo children
        raiz["childrenCollapsed"] = [...raiz.children]      // Creamos una variable auxiliar de los hijos de la raiz
    
        raiz.descendants().map((d, i) => {                  // Para cada descendiente
            d.id = i;                                       // Definimos un id dada su posicion en la lista de nodos
            d.children? d.children = d.children : d.children = null;    // Si no tiene hijos, se define su atributo children como nulo
            d.children? d.childrenCollapsed = d.children : d.childrenCollapsed = null;  // Si tiene hijos, definimos la variable
                                                                                        // auxiliar como sus hijos, sino, es nula
            d.isCollapsed = false;                                                      // Definimos un booleano que ayuda a saber
                                                                                        // si el nodo esta colapsado
        });

        joinDeDatos(raiz)                                   // Llamamos a nuestra funcion joinDeDatos para crear el arbol
    })