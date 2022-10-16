// Ejemplo 2

// Seleccionamos SVG y lo guardamos
const svg = d3.select('.example_2').select('svg');

// Asignamos tamaño y algunos atributos al SVG
svg.attr('width', '100%')
    .attr('height', '530px')
    .style('font-size', '20px')
    .style('border', '1px solid black');

function dataJoin(data, tipo) {
    // LLENAR
    
};

d3.csv('personas.csv').then( (data) => { // Funcion que abre csv (se vera en clases! o ya se vio!)
    // LLENAR

}).catch((err) => {
    // Cualquier error en la lectura de CSV llegara aca.
    console.log(err);
});