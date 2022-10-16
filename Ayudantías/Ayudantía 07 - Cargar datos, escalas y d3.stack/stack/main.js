const WIDTH = 1000;
const HEIGHT = 300;

const margin = {
    top: 70,
    bottom: 30,
    right: 30,
    left: 50,
};

// Definimos nuestro svg y distintos tags g para tener nuestros contenedores de ejes, barras y leyenda

const svg = d3
    .select("body")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${HEIGHT - margin.bottom})`);

const contenedorBarras = svg
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorLeyenda = svg
    .append("g")

function joinDeDatos(data) {
    // console.log(data)                                               // Vemos como nos entregan los datos    

    // let stackGen = d3.stack()                                       // Creamos un stack para agrupar los valores iguales
    //     .keys(["Javascript", "Ruby", "Python", "Java", "C"])        // Definimos los valores que queremos agrupar
    
    // let stackData = stackGen(data)                              // Generamos la data agrupada a partir de nuestro generador

    // console.log(stackData)                                      // Vemos como nos entrega los datos nuestro generador

    const escalaX = d3.scaleBand()                              // Definimos una escala para las barras agrupadas
        .domain(data.map(d => d.year))                          // Mapeamos los años para que sean el dominio
        .range([0, WIDTH - margin.left - margin.right])         // Definimos el rango
        .padding(0.3)

    // Calculamos los maximos, hay dos maneras de hacerlo, una es ir calculando el maximo de cada fila
    // de datos y despues calcular el maximo de estos maximos, y la otra forma es calcular el maximo usnado
    // los datos agrupados que nos entregó stack

    // let max = d3.max(stackData, d => d3.max(d, subArreglo => subArreglo[1]))
    // let max2 = d3.max(stackData[stackData.length - 1], d => d[1])

    // console.log(max,max2)
    
    // Definimos una escala para las alturas de las barras agrupadas

    const escalaY = d3.scaleLinear()
        .domain([0, max])
        .range([HEIGHT - margin.top - margin.bottom, 0]);

    // Definimos nuestro eje X y eje Y mediante el uso de axisBottom y axisLeft.
    // Estas funciones construyen ejes en base a las escalas utilizadas, creando una linea, ticks y labels. 

    const ejeX = d3.axisBottom(escalaX);
    const ejeY = d3.axisLeft(escalaY);

    // Tenemos que ubicar nuestro eje en la visualización, lo hacemos mediante call() a los contenedores de los ejes
    
    // contenedorEjeX
    //     .call(ejeX)
    
    // contenedorEjeY
    //     .call(ejeY)

    // Definimos una escala ordinal para el color, donde el dominio son nuestros lenguajes de programación

    const color = d3.scaleOrdinal()
        .domain(["Javascript", "Ruby", "Python", "Java", "C"])
        .range(["yellow", "red", "blue", "orange", "lightblue"])

    // Tenemos que hacer un doble join, ya que para cada lista de nuestor stack data, queremos ir revisando
    // todos los array que estan dentro de cada array. Con esto, agregamos un g para cada lenguaje de programacion
    // y para cada lenguaje agregamos las barras en los años correspondiente

    // contenedorBarras
    //     .selectAll("g")                             // Seleccionamos todos los tags g de nuestro contenedor de barras
    //     .data(stackData)                            // Seleccionamos nuestro data generado por d3.stack
    //     .join("g")                                  // Hacemos un join con "g" que contendra nuestras barras de cada lenguaje
    //     .attr("fill", d => color(d.key))            // Agregamos colores a cada lenguaje con nuestra escala color
    //     .selectAll("rect")                          // Seleccionamos todos los rectangulos de cada lenguaje
    //     .data(d => d)                               // Usamos el dato que se esta iterando anteriormente
    //     .join("rect")                               // Hacemos un join con "rect" que seran las barras de cada lenguaje
    //     .attr("x", d => escalaX(d.data.year))       // Ubicamos los rectangulos segun la escalaX
    //     .attr("y", d => escalaY(d[1]))              // Ubicamos los rectangulos segun su escalaY
    //     .attr("width", escalaX.bandwidth())         // Asignamos el ancho de cada barra
    //     .attr("height", d => escalaY(d[0]) - escalaY(d[1]))         // Asignamos la altura de cada barra
    
    // Agregamos un rectangulo gris para poder escribir nuestra leyenda, le definimos sus coordenadas x, y
    // altura, ancho, borde, y color
        
    // contenedorLeyenda
    //     .append("rect")                          
    //     .attr("x", 895)
    //     .attr("y", 0)
    //     .attr("height", 100)
    //     .attr("width", 105)
    //     .attr("fill", "#aaaaaa")
    //     .attr("stroke", "black")

    // Agregamos elipses a la leyenda para indicar el color que representa cada barra le definimos sus coordenadas cx, cy
    // rx, ry y su color interior

    // contenedorLeyenda
    //     .selectAll("ellipse")
    //     .data(stackData)
    //     .join("ellipse")
    //     .attr("cx", 910)
    //     .attr("cy", (d, i) => 10 + (i * 20))
    //     .attr("rx", 5)
    //     .attr("ry", 3)
    //     .attr("fill", d => color(d.key))
    
    // Agregamos texto a la leyenda para indicar el color que representa cada barra, le definimos coordenadas x, y,
    // font-weight, color de la letra y el texto que tendrá
    
    // contenedorLeyenda
    //     .selectAll("text")
    //     .data(stackData)
    //     .join("text")
    //     .attr("x", 925)
    //     .attr("y", (d, i) => 15 + (i * 20))
    //     .attr("fill", d => color(d.key))
    //     .attr("font-weight", 600)
    //     .text(d => d.key)
} 

function toInt(d) {
    let data = {
        year: +d.year,
        Javascript: +d.Javascript,
        Ruby: +d.Ruby,
        Python: +d.Python,
        Java: +d.Java,
        C:  +d.C
    }

    return data
}

d3.csv("../issues_stack.csv", toInt)    
    .then(datos => joinDeDatos(datos))
    .catch(error => console.log(error));
