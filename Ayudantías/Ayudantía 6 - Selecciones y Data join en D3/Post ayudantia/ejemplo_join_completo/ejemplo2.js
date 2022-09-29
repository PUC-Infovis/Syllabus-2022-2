// Ejemplo 2

// Seleccionamos SVG y lo guardamos
const svg = d3.select('.example_2').select('svg');

// Asignamos tamaño y algunos atributos al SVG
svg.attr('width', '100%')
    .attr('height', '530px')
    .style('font-size', '20px')
    .style('border', '1px solid black');

function dataJoin(data, tipo) {
    // Unimos data con las marcas y canales!

    // Seleccionamos el svg 
    const svg = d3.select('.example_2').select('svg');

    // Binding de datos con elementos tipo 'rect'.
    // Ojo que enterUpdate es la union de enter y update!
    const enterUpdate = svg.selectAll('rect')
        .data(data) // Data!
        .join(  // Join especifico con enter, update y exit.
            (enter) => { // Enter especifica que para cada dato nuevo se agregue un 'rect' y se pinte rojo
                console.log(enter);                
                return enter.append('rect')
                    .style('fill', (d) => {
                        return 'red'
                    });
            },

            (update) => { // Update actauliza los 'rect' presentes con la data
                console.log(update);
                return update.style('fill', (d) => {
                                d.gender == 'M' ? (color = 'blue') : color = 'magenta';
                                return color
                            });
            },

            (exit) => { // Exit eliimna los 'rect' que no tienen data para asociarse
                console.log(exit);
                return exit.remove()
            });

    // Definimos funcionamiento comun entre enter y update
    enterUpdate.attr('width', (d) => 
                    tipo == 'Edad' ? 10 * d.age : 300 * d.height) // Dependiendo del tipo de data que pedimos se hace el width
                .attr('height', '20px') // Height igual para todos  
                .attr('y', (d, i) => { // La posicion en y va a ir cambiando para cada 'rect', sino estarian uno encima del otro.
                    return `${5 + 35 * i}px`
                });
};

d3.csv('personas.csv').then( (data) => { // Funcion que abre csv (se vera en clases! o ya se vio!)
    // data es un array de objetos!

    let tipo = 'Edad'; // Partimos con los datos de edad
    let cantidadData = 10; // Partimos con 10 datos
    const btn = document.getElementById('data'); // Buscamos el boton para cambiar tipo de dato
    btn.textContent = tipo; // Asignamos el tipo de dato que pedinmos en el texto del boton

    // Creamos un evento para el boton de tipo de dato
    // Para cada click se cambia el tipo de dato y el texto del boton.
    btn.addEventListener('click', (e) => { 
        tipo == 'Edad' ? tipo = 'Altura' : tipo = 'Edad' 
        e.target.textContent = tipo
        dataJoin(data.slice(0, cantidadData), tipo); // Se vuelve a llamar la funcion que actualiza el svg.
    });

    const add = document.getElementById('add'); // Buscamos boton que sume cantidad de elementos
    const remove = document.getElementById('remove'); // Buscamos boton que reste cantidad de elementos

    // Agregamos evento al add_btn -> Cada click se suma un elemento al data
    add.addEventListener('click', () => {
        cantidadData < 15 ? cantidadData++ : cantidadData = 15; // Maximo de datos -> 15
        dataJoin(data.slice(0, cantidadData), tipo); // Se llama la funcion con la cantidad de datos actualizada
    });

    remove.addEventListener('click', () => {
        cantidadData > 0 ? cantidadData-- : cantidadData = 0; // Minimo de datos -> 0
        dataJoin(data.slice(0, cantidadData), tipo); // Se llama la funcion con la cantidad de datos actualizada
    });

    // Inicializacion. Es el que corre la primera vez que abrimos el html
    dataJoin(data.slice(0, cantidadData), tipo);

}).catch((err) => {
    // Cualquier error en la lectura de CSV llegara aca.
    console.log(err);
});