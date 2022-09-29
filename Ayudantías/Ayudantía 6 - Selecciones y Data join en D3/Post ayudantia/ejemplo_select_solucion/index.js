// NO CAMBIAR
// Puede ser recomendable usar un objeto para guardar variables que pueden ser utiles mas adelante
const ajustes_svg = {
    height: 250,
    width: '100%',
    border: '1px solid black'
};

// Esto para que se les haga mas facil
const container = d3.select('.container');

// seteamos el primer SVG con width, height y borde. 
container.select("#primer_svg")
    .style('width', ajustes_svg.width)
    .style('height', `${ajustes_svg.height}px`)
    .style('border', ajustes_svg.border)
    .append('line'); // Agregamos una linea para que se haga mas facil alinear los rect

/* Resumen de instrucciones

0. Cambia el texto del titulo por algo que quieras! (es un h1)

1. Agregar 3 elementos a la lista y que tengan
    texto de color "tomato". Luego, a todos los elementos <li> agregarles la clase
    "item_de_mi_lista"

2. Reemplaza el subtitulo (h2) y agregale un tag a con un link que nos lleve al landing page de d3js. 

3. Seleccionar el SVG que viene y editar los 4 <rect> que tiene, cambiandole tamaño (Ojo que todos queden del mismo tamaño) 
    y color de fondo. Ademas, deben quedar alineados de tal forma que la mitad del rectangulo (en "y") coincida con la 
    mitad del SVG

4. Selecciona todos los h3 y eliminalos.

*/

/* 
UTIL: Mas arriba se definio un objeto para el primer SVG. En ese objeto se define largo y ancho. 
Esto les puede servir para calcular algunas cosas mas adelante
*/

// CAMBIAR DE ACA PARA ABAJO
// Cambiamos texto al h1
container.select('h1')
    .text("InfoVis es el mejor ramo del DCC");

// Seleccionamos la la lista
const lista = container.select('ul');

// Agregamos <li> a la lista
lista.append("li")
    .text('Hola Mundo desde un <li>');
lista.append("li")
    .text('Hello World from a <li>');
lista.append("li")
    .text('Ciao Mondo da un <li>');  

// Seleccionamos todos los elementos <li> de la lista
lista.selectAll('li')
    .attr('class', 'item_de_mi_lista')
    .style('color', 'tomato');

// Reemplazamos texto de h2 por un link a d3.js
container.select('h2')
    .text('')
    .append('a')
    .text('Aca esta el link a d3.js')
    .attr('href', 'https://d3js.org/');

// Seleccionamos el primer SVG
const svg = container.select('#primer_svg');

// Seleccionamos todos los rectangulos y les damos un tamaño

const rectangulos = svg.selectAll('rect')
    .attr('width', '200px')
    .attr('height', `${ajustes_svg.height / 2}px`)
    .attr('y', `${ajustes_svg.height / 2 - ajustes_svg.height / 4}px`)
    .attr('x', (d, i) => {
        return `${20 + i * 220}px`
    })
    .style('fill', (d, i) => {
        const colores = ['red', 'blue', 'green', 'yellow'];
        return colores[i]
    });

// Eliminamos todos los h3

container.selectAll('h3')
    .remove();



