// Ejemplo 1

// Funcion para obtener elementos al azar de un array
function getRandomElementOfArray(array, numbr_of_elements) {
    const newArray = []
    for (let i = 0; i < numbr_of_elements; i++) {
        newArray.push(array[Math.floor(Math.random() * array.length)])
    }
    return newArray
}; 

// Definimos el abecedario en un Array -> Esta sera nuestra data.
const abcedario = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']; // Array

const container = d3.select(".example_1"); // Seleccionamos container del ejemplo 1

/* ------------------------------------------------------------------------------- */
// Ejemplo 1.1 / Ejemplo data()

const container_ej1 = container.select("#example_1_static"); // Seleccionamos container del ejemplo 1.1
const data_ej11 = [...abcedario.slice(10, 20)]; // Array de 10 letras consecutivas

container_ej1.select("#content") // Seleccionamos div donde se encuentra el contenido
    .selectAll("p") // Seleccionamos todos los elementos a cambiar ('p')
    .data(data_ej11) // Realizamos el binding de data con cada elemento -> OBS: Hay 10 elementos 'p' y 10 datos 
    .text((d) => d); // Se el dato como texto

/* ------------------------------------------------------------------------------- */
// Ejemplo 1.2 / Ejemplo data() + update

function ejemplo2(data) {
    const container = d3.select(".example_1")
        .select("#example_1_update"); // Seleccionamos container del ejemplo 1.2

    container.select("#content") // Seleccionamos div donde se encuentra el contenido
        .selectAll("p") // Seleccionamos todos los elementos a cambiar ('p')
        .data(data) // Realizamos el binding de data con cada elemento -> OBS: Hay 10 elementos 'p' y 10 datos
        .text((d) => d); // Se el dato como texto
};

ejemplo2(getRandomElementOfArray(abcedario, 10)); // Array de 10 letras al azar

const btn = document.getElementById('update_ej12'); // Buscamos boton que se hara cargo de actualizar los datos

btn.addEventListener('click', () => {
    // Cada vez que se aprete el boton, se vuelve a llamar a la funcion y se actualizan los datos
    ejemplo2(getRandomElementOfArray(abcedario, 10)) 
});

/* ------------------------------------------------------------------------------- */
// Ejemplo 1.3 / Ejemplo data() + update + exit + enter

function ejemplo3(data) {
    const container = d3.select(".example_1")
        .select("#example_1_full"); // Seleccionamos container del ejemplo 1.3

    const update = container.select("#content") // Seleccionamos div donde se encuentra el contenido
        .selectAll("p") // Seleccionamos todos los elementos a cambiar ('p')
        .data(data) // Realizamos el binding de data con cada elemento 
        .text((d) => d); // Se el dato como texto

    update.enter() // Enter
        .append('p') // Para cada dato nuevo se crea un 'p'
        .text((d) => d); // A cada 'p' nuevo se le asigna como texto un dato
    
    update.exit().remove(); // Exit, se elimina cada elemento 'p' que no este asociado a un dato.

    // Actualizamos contador 
    d3.select('#count_ej13')
        .text(`Numero de elementos: ${contador}`); 
};

let contador = 10; // Cuantos elementos vamos a tener
let data_ej3 = getRandomElementOfArray(abcedario, contador); // Array de 10 letras al azar

// Botones
const add_btn = document.getElementById('add_ej13'); // Buscamos boton add
const update_btn = document.getElementById('update_ej13'); // Buscamos boton update
const remove_btn = document.getElementById('remove_ej13'); // Buscamos boton remove

// Eventos botones

// Al apretar boton add se agrega un elemento al azar a los datos y se vuelve a llamar a la funcion
add_btn.addEventListener('click', () => {
    contador++; // No hay maximo
    data_ej3.push(getRandomElementOfArray(abcedario, 1)); // Agregar 1 nuevo dato
    ejemplo3(data_ej3, contador);
});

// Al apretar boton remove se elimina el ultimo elemento a los datos y se vuelve a llamar a la funcion
remove_btn.addEventListener('click', () => {
    contador <= 0 ? contador = 0 : contador--; // Minimo 0
    data_ej3.pop(); // Elimina ultimo dato
    ejemplo3(data_ej3, contador);
});

// Al apretar boton update se cambaian al azar a los datos y se vuelve a llamar a la funcion
update_btn.addEventListener('click', () => { 
    data_ej3 = getRandomElementOfArray(abcedario, contador); // Nuevo array de datos
    ejemplo3(data_ej3, contador);
});

// Inicializamos 
ejemplo3(data_ej3, contador);

/* ------------------------------------------------------------------------------- */
// Ejemplo 1.4  / Ejemplo join()


function ejemplo14(data) {
    const container = d3.select(".example_1")
        .select("#example_1_join"); // Seleccionamos container del ejemplo 1.4

    // La varable update va a ser la union de entre y update!
    const update = container.select("#content") // Seleccionamos div donde se encuentra el contenido
        .selectAll("p")
        .data(data) // Binding de datos
        /* 
        Para cada dato entrante (enter) crea un nuevo elemento. 
        Para elementos existentes les cambia el texto (update) 
        ELimina cada elemento sin dato (exit)
        */
        .join('p') 
        .text((d) => d);

    // Actualizamos contador 
    d3.select('#count_ej14')
        .text(`Numero de elementos: ${contador_ej4}`);
};

let contador_ej4 = 10; // Cuantos elementos vamos a tener
let data_ej4 = getRandomElementOfArray(abcedario, contador); // Array de 10 letras al azar

// Botones
const add_btn_ej4 = document.getElementById('add_ej14'); // Buscamos boton add
const update_btn_ej4 = document.getElementById('update_ej14'); // Buscamos boton update
const remove_btn_ej4 = document.getElementById('remove_ej14'); // Buscamos boton remove

// Eventos botones

// Al apretar boton add se agrega un elemento al azar a los datos y se vuelve a llamar a la funcion
add_btn_ej4.addEventListener('click', () => {
    contador_ej4++; // No hay maximo
    data_ej4.push(getRandomElementOfArray(abcedario, 1)); // Agregar 1 nuevo dato
    ejemplo14(data_ej4, contador);
});

// Al apretar boton remove se elimina el ultimo elemento a los datos y se vuelve a llamar a la funcion
remove_btn_ej4.addEventListener('click', () => {
    contador_ej4 <= 0 ? contador_ej4 = 0 : contador_ej4--; // Minimo 0
    data_ej4.pop(); // Elimina el ultimo dato
    ejemplo14(data_ej4, contador_ej4);
});

// Al apretar boton update se cambaian al azar a los datos y se vuelve a llamar a la funcion
update_btn_ej4.addEventListener('click', () => {
    data_ej4 = getRandomElementOfArray(abcedario, contador_ej4); // Nuevo array de datos
    ejemplo14(data_ej4, contador_ej4);
});

// Inicializamos 
ejemplo14(data_ej4, contador_ej4);
