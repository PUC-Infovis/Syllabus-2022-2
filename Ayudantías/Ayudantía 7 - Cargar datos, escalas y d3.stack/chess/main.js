// Tablero de ajedrez después de la 13ava jugada negra, Magnus Carlsen vs Hans Moke (07-2022)
// https://www.chessgames.com/perl/chessgame?gid=2372960 

const tableroSinColor = [
    {X: 0, Y: 0, pieza: "T", color: "B"},
    {X: 1, Y: 0, pieza: null, color: null},
    {X: 2, Y: 0, pieza: null, color: null},
    {X: 3, Y: 0, pieza: "T", color: "B"},
    {X: 4, Y: 0, pieza: null, color: null},
    {X: 5, Y: 0, pieza: null, color: null},
    {X: 6, Y: 0, pieza: "K", color: "B"},
    {X: 7, Y: 0, pieza: null, color: null},
    {X: 0, Y: 1, pieza: null, color: null},
    {X: 1, Y: 1, pieza: null, color: null},
    {X: 2, Y: 1, pieza: null, color: null},
    {X: 3, Y: 1, pieza: null, color: null},
    {X: 4, Y: 1, pieza: "P", color: "B"},
    {X: 5, Y: 1, pieza: "P", color: "B"},
    {X: 6, Y: 1, pieza: "A", color: "B"},
    {X: 7, Y: 1, pieza: "P", color: "B"},
    {X: 0, Y: 2, pieza: "P", color: "B"},
    {X: 1, Y: 2, pieza: null, color: null},
    {X: 2, Y: 2, pieza: "P", color: "B"},
    {X: 3, Y: 2, pieza: null, color: null},
    {X: 4, Y: 2, pieza: null, color: null},
    {X: 5, Y: 2, pieza: "C", color: "B"},
    {X: 6, Y: 2, pieza: "P", color: "B"},
    {X: 7, Y: 2, pieza: null, color: null},
    {X: 0, Y: 3, pieza: null, color: null},
    {X: 1, Y: 3, pieza: null, color: null},
    {X: 2, Y: 3, pieza: "Q", color: "B"},
    {X: 3, Y: 3, pieza: null, color: null},
    {X: 4, Y: 3, pieza: null, color: null},
    {X: 5, Y: 3, pieza: null, color: null},
    {X: 6, Y: 3, pieza: null, color: null},
    {X: 7, Y: 3, pieza: null, color: null},
    {X: 0, Y: 4, pieza: null, color: null},
    {X: 1, Y: 4, pieza: null, color: null},
    {X: 2, Y: 4, pieza: null, color: null},
    {X: 3, Y: 4, pieza: null, color: null},
    {X: 4, Y: 4, pieza: "P", color: "N"},
    {X: 5, Y: 4, pieza: null, color: null},
    {X: 6, Y: 4, pieza: "A", color: "B"},
    {X: 7, Y: 4, pieza: null, color: null},
    {X: 0, Y: 5, pieza: null, color: null},
    {X: 1, Y: 5, pieza: null, color: null},
    {X: 2, Y: 5, pieza: "C", color: "N"},
    {X: 3, Y: 5, pieza: null, color: null},
    {X: 4, Y: 5, pieza: "A", color: "N"},
    {X: 5, Y: 5, pieza: "C", color: "N"},
    {X: 6, Y: 5, pieza: null, color: null},
    {X: 7, Y: 5, pieza: "P", color: "N"},
    {X: 0, Y: 6, pieza: "P", color: "N"},
    {X: 1, Y: 6, pieza: "P", color: "N"},
    {X: 2, Y: 6, pieza: null, color: null},
    {X: 3, Y: 6, pieza: null, color: null},
    {X: 4, Y: 6, pieza: null, color: null},
    {X: 5, Y: 6, pieza: "P", color: "N"},
    {X: 6, Y: 6, pieza: "P", color: "N"},
    {X: 7, Y: 6, pieza: null, color: null},
    {X: 0, Y: 7, pieza: "T", color: "N"},
    {X: 1, Y: 7, pieza: null, color: null},
    {X: 2, Y: 7, pieza: null, color: null},
    {X: 3, Y: 7, pieza: "Q", color: "N"},
    {X: 4, Y: 7, pieza: null, color: null},
    {X: 5, Y: 7, pieza: "T", color: "N"},
    {X: 6, Y: 7, pieza: "K", color: "N"},
    {X: 7, Y: 7, pieza: null, color: null},
]

const tablero = tableroSinColor.map(d => {
    let copy = { ...d }
    if (copy.Y % 2 != 0) {
        if (copy.X % 2 == 0) {
            copy.colorCasilla = "C"
        } else {
            copy.colorCasilla = "O"
        }
    } else {
        if (copy.X % 2 != 0) {
            copy.colorCasilla = "C"
        } else {
            copy.colorCasilla = "O"
        }
    }
    return copy;
})

// Después de definir nuestro dataset, definimos el svg y las escalas

const WIDTH = 640;
const HEIGHT = 640;

// const svg = d3                                   // Definimos nuestro svg
//     .select("body")                              // Seleccionamos el tag body de html
//     .append("svg")                               // Le agregamos un svg al body
//     .attr("width", WIDTH)                        // Le agregamos el ancho al svg
//     .attr("height", HEIGHT)                      // Le agregamos la altura al svg
//     .style("border", "1px solid black");         // Le agregamos un borde al svg

// Definimos dos escalas lineales, una para la coordenada x, y otra para la coordenada y.
// Una escala lineal, mapea mediante una función f(x) = mx + n, los elementos del dominio al 
// recorrido que definamos. En este caso, la función que ocupa es f(x) = 80x.
// Mas informació en https://observablehq.com/@d3/d3-scalelinear

const escalaX = d3.scaleLinear()            // Definimos la escala con d3.scaleLinear()        
    .domain([0, 8])                         // Definimos el dominio de la escala (los valores a mapear)
    .range([0, WIDTH]);                     // Definimos el rango de la escala (los valores mapeados)

const escalaY = d3.scaleLinear()            // Se repite el mismo proceso de antes
    .domain([0, 8])
    .range([HEIGHT, 0]);

// Podemos hacer lo mismo pero ocupado scaleBand(), es decir una escala de bandas. 
// Retorna el inicio de la banda, y podemos acceder a escalaX.bandwidth() para saber el ancho de cada barra
// Podriamos definir atributos adicionales como padding o step.
// Mas informacion en https://observablehq.com/@d3/d3-scaleband


// const escalaX = d3.scaleBand()
//     .domain([0, 1, 2, 3, 4, 5, 6, 7])
//     .range([0, WIDTH]);

// const escalaY = d3.scaleBand()
//     .domain([0, 1, 2, 3, 4, 5, 6, 7])
//     .range([HEIGHT, 0]);

// Por otro lado, definimos escalas ordinales para el color de las casillas, las piezas y 
// los códigos unicode de las piezas. d3.scaleOrdinal() realiza un mapeo 1 a 1 entre los elementos
// Por ejemplo, si nuestro dominio es ["tierra", "aire", "fuego"] y nuestro rango es ["green", "blue", "red"]
// El mapeo será:
// tierra -> green
// aire -> blue
// fire -> red

const colorCasillas = d3.scaleOrdinal()
    .domain(["C", "O"])
    .range(["#cc9966", "#ffcc99"])

const colorPiezas = d3.scaleOrdinal()
    .domain(["B", "N"])
    .range(["white", "black"])

const codigoPiezas = d3.scaleOrdinal()
    .domain(["K", "Q", "A", "C", "T", "P", null])
    .range(["\u2654", "\u2655", "\u2657", "\u2658", "\u2656", "\u2659", ""])

// Definimos el ancho y altura de las casillas

const anchoCasilla = (WIDTH) / 8
const alturaCasilla = (HEIGHT) / 8

// Realizamos el data join

// svg
//     .selectAll("rect")                                  
//     .data(tablero)
//     .join("rect")
//     .attr("x", d => escalaX(d.X))                           // El atributo x del rect lo entrega la escala al procesar el d.X
//     .attr("y", d => escalaX(d.Y))                           // El atributo y del rect lo entrega la escala al procesar el d.Y
//     .attr("fill", d => colorCasillas(d.colorCasilla))       // La escala ordinal de color, entrega el color para cada casilla
//     .attr("width", anchoCasilla)                            // Asignamos el ancho de cada casilla
//     .attr("height", anchoCasilla)                           // Asignamos la altura de cada casilla

// svg
//     .selectAll("text")
//     .data(tablero)
//     .join("text")
//     .attr("x", d => escalaX(d.X) + (anchoCasilla / 2))          //Desplazamos la coordenada X a la mitad de la casilla
//     .attr("y", d => escalaY(d.Y) - (alturaCasilla / 2))         //Desplazamos la coordenada Y a la mitad de la casilla
//     .attr("fill", d => colorPiezas(d.color))                    //Le asignamos color a las piezas
//     .text(d => codigoPiezas(d.pieza))                           //Asignamos el texto que tendra cada pieza (unicode)
//     .style("font-size", "60px")                                 //Agrandamos cada pieza
//     .style("text-anchor", "middle")                             //Ubicamos la pieza al medio de su coordenada X
//     .style("dominant-baseline", "mathematical")                 //Ubicamos la pieza al medio de su coordenada Y

// atributo text-anchor: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
// atributo dominant-baseline: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
// Notar que este estilo siempre se aplica en todos los textos presentes en el código 
// Por lo que una buena practica es mandarlo a CSS


// Si se eligen las escalas de bandas tenemos que hacer unos ligeros cambios cuando hagamos el join
// Especificamente, ocupamos el bandwidth() en vez de el anchoCasilla y alturaCasilla

// svg
//     .selectAll("rect")
//     .data(tablero)
//     .join("rect")
//     .attr("x", d => escalaX(d.X))
//     .attr("y", d => escalaX(d.Y))
//     .attr("fill", d => colorCasillas(d.colorCasilla))
//     .attr("width", escalaX.bandwidth())
//     .attr("height", escalaY.bandwidth())

// svg
//     .selectAll("text")
//     .data(tablero)
//     .join("text")
//     .attr("x", d => escalaX(d.X) + escalaX.bandwidth() / 2)
//     .attr("y", d => escalaY(d.Y) + escalaY.bandwidth() / 2)
//     .attr("fill", d => colorPiezas(d.color))
//     .text(d => codigoPiezas(d.pieza))
//     .style("font-size", "60px")
//     .style("dominant-baseline", "mathematical")   
//     .style("text-anchor", "middle")    
	
    



