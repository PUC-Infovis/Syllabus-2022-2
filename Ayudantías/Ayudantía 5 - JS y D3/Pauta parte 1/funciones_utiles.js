/* Propiedades y métodos del objeto Math */

/* En JavaScript Math es el objeto al cual recurriremos para poder utilizar ciertas operaciones 
matemáticas más complejas (como el coseno del algo), prácticas (como redondear un décimal) o
específicas (como obtener números aleatorios) que no podriamos hacer directamente sólo con operadores básicos. 
También, nos da acceso a constantes y valores numéricos importantes como lo puede ser el número Pi */

let decimal = 4.74;
console.log(Math.ceil(decimal));//5; Math.ceil() redondea el número al entero mayor o igual al número
console.log(Math.floor(decimal));//4; Math.floor() redondea el número al entero menor o igual al número
console.log(Math.round(decimal));//5; Math.round() redondea el número al entero más cercano

let numero_aleatorio = Math.random(); //devuelve un número pseudo-aleatorio entre 0 y 1

let radio = 3;
let perimetroCirculo = 2*radio*Math.PI; //es el valor de Pi

let negativo = -7;
let positivo = Math.abs(negativo); //devuelve el valor absoluto de un numero

/* Para ver en más detalle las posibilidades del objeto Math pueden revisar el siguiente link:
https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math */




/* Uso de Arrow Functions*/

/*Les recomiendo mucho acostumbrarse a usar arrow functions, ya que su sintaxis se vuelve muy práctica
para cosas que veremos durante esta ayudantía.*/

const primerElemento = (array) => array[0]; //Podemos hacer desde funciones muy breves en poco espacio,

const minimoElemento = (array) => {         //hasta funciones más complejas usando llaves
    let minimo = false;
    for (const numero of array) {
        if (numero < minimo) {
            minimo = numero
        } else if (minimo === false) {
            minimo = numero
        }
    }
    return minimo;
}

//Pueden encontrar más detalles de las arrow functions acá: https://javascript.info/arrow-functions-basics




/* Métodos avanzados para Arrays */

/* El método para arrays .foreach() nos permite aplicar la funcion que le entreguemos a los elementos 
del array. Los posibles argumentos que puede recibir la función son (item, index, array) en ese orden, 
donde item es el elemento 'actual', index es su indice y array es una referencia al array completo.
En este caso la función que le pasaremos es una arrow funtion que definimos en el mismo método de forma
muy conveniente.*/ 

let array = [1, 'hola mundo', 4.5];
array.forEach((elemento, indice, arreglo) => { 
    console.log(`$El elemento (${elemento}) se encuentra en la posicion (${indice}) del array (${arreglo})`)    
    //estas 'comillas especiales' (backsticks) junto al signo peso sirven para evaluar una 
    //variable dentro de un string 
});

/*En el ejemplo anterior cambie los nombres de los argumentos aproposito, para que se dieran cuenta que no
 depende del nombre sino de la posicion del argumento. https://javascript.info/array-methods#iterate-foreach */


/* El método para arrays .map(), similar al anterior, nos permite entregarle una funcion que se le aplicará 
a todos los elementos del array. La principal diferencia es que retorna un nuevo array con los resultados
de haber aplicado la funcion a cada elemento. */

let datos = [1, 4, 8, 43];
let datosPonderados = datos.map((e, _, a) => { //utilizar el guion bajo es una convencion que nos sirve
    let largoArray = a.length;                     //para indicar que ese argumento o variable en particular 
    return e / largoArray;                         //no será utilizada, y ocupa el espacio para poder 
});                                                //utilizar la siguiente. Si no utilizaremos ninguna de las
console.log(datosPonderados);                      //ultimas variables podemos simplemente omitirlas en el parentesis

/*Para revisar detalles pueden ir a esta página: https://javascript.info/array-methods#map */


/* El método para arrays .filter() nos permite filtrar el array. En este caso le pasamos una función
que sirva como criterio, para cada elemento en que la función retorne el valor true será agregado a un nuevo 
array que será devuelto al finalizar el método.*/

let numeros = [1,2,5,4,8];
let numerosPares = numeros.filter((item) => item % 2 == 0);
console.log(numerosPares);

/*Para revisar detalles pueden ir a esta página: https://javascript.info/array-methods#filter */


/* El método para arrays .reduce() nos permite aplicar una función que recuerda el valor obtenido con respecto
al elemento previo al actual. Esto, por ejemplo, nos puede ayudar a acumular valores. A diferencia de los
métodos anteriormente mencionados, la función al interior del método puede recibir cuatro argumentos:
(accumulator, item, index, array) donde accumulator es el argumento que guarda el resultado previo de la función.
Además, se puede definir un valor inicial para el argumento accumulator como un segundo argumento del método,
en caso de no quedar definido se toma como primer valor de accumulator el primer elemento del array */

let valores = [12,53,21,75];
let sumatoria = valores.reduce((suma, numero) => suma + numero, 0); 
console.log(sumatoria);

/* Este método puede ser bastante difícil de entender, así que les invito a buscar más información en esta
página: https://javascript.info/array-methods#reduce-reduceright */


/* Existen muchas otras funciones y métodos que se pueden aplicar sobre arrays, les invito a revisar
este link que contiene el desglose de las ya mencionadas y muchas otras: https://javascript.info/array-methods .
Tal vez, puedan encontrar alguna que les sea útil para una cosa determinada.*/




/* Métodos de Strings */

/* Podemos hacer que un string se encuentre totalmente en mayúsculas o en minúsculas */

console.log('StrInGRarO'.toUpperCase()); //String en mayúsculas
console.log('StrInGRarO'.toLowerCase()); //String en minúsculas

console.log('StrInGRarO'.slice(0,6));    //'StrIng'; retorna un substring según los indices

let arrayPalabras = 'Esta es una oración'.split(' '); //Retorna un array de substrings dados por un separador




/* JavaScript puede ser raro... */

/* A continuación les mostraré un par de ejemplos de cosas curiosas y resultados no tan intuitivos que  
realiza JavaScript, y sus explicaciones de porqué ocurren. El objetivo es ver que muchas veces JavaScript
hará su mayor esfuerzo para obtener algún  resultado, por más extraño que pueda ser.*/

console.log( ("b" + "a" + + "a" + "a").toLowerCase() ) //"banana" 

/* En este caso ocurre que al haber un signo + adicional antes del string "a", se comporta como un operador 
unario, es decir, un operador que requiere un solo valor para dar un resultado. Ejemplo de este tipo de operadores
puede ser la exclamación ! para 'negar' valores. La suma como operador unario realiza una conversión numérica, 
entonces al darle un string con un valor no numerico es resultado es NaN ("Not a Number"). Esta operación tiene
mayor prioridad que las sumas binarias por lo que ocurre antes que las demás. Luego, el resto de sumas
concadenarán el valor NaN como si fuera un string más. Obteniendose "baNaNa", que al pasarlo por el método 
toLowerCase() se leeria como un string cualquiera "banana". Para una explicación aún más detallada, pueden
revisar el siguiente link: https://razvan-cirlugea.medium.com/javascript-banana-meme-explained-527696d27767*/

/* Algunos ejemplos más de cosas que ocurren debido a como estan definidas algunas operaciones
y como son interpretadas algunos valores son los siguientes: */

console.log( true / false ) //Infinity

console.log( '3' - 1 ) //2
console.log( '3' + 1 ) //'31'

console.log( [] + [] ) //""
console.log( {} + [] ) //0
console.log( [] + {} ) //"[object Object]" 
console.log( {} + {} )//NaN

/* Si quieren profundizar en ver que otros casos extraños hay en JavaScript y porqué estos ocurren, les
recomiendo revisar el siguiente enlace: https://github.com/denysdovhan/wtfjs */