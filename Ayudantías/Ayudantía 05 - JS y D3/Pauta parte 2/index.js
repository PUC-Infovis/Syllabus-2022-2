// Definimos primero las constantes para el ancho y largo que le asignaremos a nuestro elemento svg
const WIDTH = 900,
      HEIGHT = 500;

/* Seleccionamos mediante el id al elemento svg y lo asignamos a una variable. 
Además modificamos sus atributos de ancho y largo por las constantes que definimos previamente, 
mediante el método attr('atributo', valor)*/
const lienzo = d3.select('#lienzo')
                 .attr('width', WIDTH)
                 .attr('height', HEIGHT);

/* Algunos de los elementos svg con formas básicas que podemos utilizar son rectangulos, círculos,
elipses, líneas, texto y otros más complejos como polylineas, poligonos y path. Para ver más detalle cada uno, 
recomiendo revisar la siguiente página: https://www.mclibre.org/consultar/htmlcss/html/svg-formas-1.html */

/* También, para cualquier tipo de consultas sobre elementos web recomiendo buscar en el navegador la consulta
en mozilla developer. Por ejemplo, buscar 'mozilla developer elemento rect en svg' */

/* Aquí lo primero que haremos es 'crear bordes' que nos indiquen los margenes del svg en el que 
estamos dibujando. Para ello utilizaremos dos rectangulos, uno de color negro y uno blanco más pequeño
dentro, de esta forma tenemos la sensación de tener un 'lienzo' blanco con bordes negros*/

const bordes_1 = lienzo.append('rect');
const bordes_2 = lienzo.append('rect');

/* Aprovechar de mencionar los métodos raise() y lower(), los cuales nos sirven para modificar la 
prioridad del elemento que es dibujado por sobre otros. Por ejemplo, si ejecutando normalmente el 
código a continuación de casualidad nos quedara el rectangulo negro sobre el blanco, lo podriamos
solucionar usando raise() en el rectangulo blanco o lower() en el rectangulo negro.*/

/* Entre los posibles atributos de los elementos rect se encuentran la posición de la esquina
superior izquierda (x,y) mediante los atributos x e y. Luego, tenemos su ancho y alto, que utilizan
los atributos width y height. En general, podemos asignar el color de relleno de los elementos svg
con 'fill', ya sea trabajandolo como un atributo o como una regla de css.*/

/*En SVG lo siguiente es equivalente:
<svg>
    <rect style = 'fill: red'></rect>   <---- seleccion.style(fill, 'red')
    <rect fill = 'red'></rect>          <---- seleccion.attr(fill, 'red')
<svg>
*/ 

bordes_1.attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('fill', 'black');  
//      .lower(); 

bordes_2.attr('width', WIDTH - 10)
        .attr('height', HEIGHT - 10)
        .attr('x', 5)
        .attr('y', 5)
        .attr('fill', 'white');
//      .raise();



/* Ejemplos de utilizar diferentes figuras en SVG */

lienzo.append('circle')
      .attr('cx', 300)
      .attr('cy', 350)
      .attr('r', 20)
      .attr('fill', 'green');

lienzo.append('ellipse')
      .attr('cx', 600)
      .attr('cy', 100)
      .attr('rx', 30)
      .attr('ry', 70)
      .attr('fill', 'purple');

lienzo.append('text')
      .attr('x', 700)
      .attr('y', 450)
      .attr('font-family', 'Verdana')
      .attr('font-size', 30)
      .text('soy texto!'); //.text() permite definir el texto para diferentes tipos de elementos, sean svg o html 

lienzo.append('line')
      .attr('x1', 600)
      .attr('y1', 400)
      .attr('x2', 300)
      .attr('y2', 200)
      .attr('stroke-width', 3)
      .attr('stroke', 'orange');


/* Ejemplo de como rotar una figura. Para poder rotar utilizamos transform que es una propiedad css que
nos puede permitir aplicar muchas transformaciones visuales sobre un elemento. A transform le deberemos indicar
el tipo de transformacion, en este caso rotate(), y la cantidad de grados dentro del paréntesis. Por defecto, 
se hará respecto al origen, si queremos que se aplique con respecto a otro punto deberemos indicarlo
con transform-origin */

lienzo.append('rect') 
      .attr('x', 100)
      .attr('y', 100)
      .attr('width', 50)
      .attr('height', 50)
      .attr('fill', 'steelblue')
      .attr('transform-origin', '100 100') //el vertice de referencia será la esquina del rectangulo
      .attr('transform', 'rotate(45)'); 

lienzo.append('rect') //referencia para comparar la rotación
      .attr('x', 100)
      .attr('y', 100)
      .attr('width', 50)
      .attr('height', 50)
      .attr('fill', 'red');