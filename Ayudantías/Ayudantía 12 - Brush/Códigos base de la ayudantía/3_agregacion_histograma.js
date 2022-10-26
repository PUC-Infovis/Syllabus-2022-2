/* En este caso toda la visualización estará incluida dentro de un mismo svg, por lo tanto,
para definir el tamaño del svg definiremos los tamaños por separado de los elementos que la conformarán. 
En este caso un gráfico de dispersión y un histogramas */

/* Definimos un margen general */
const margen = {
    vertical: 30,
    horizontal: 30
};

const alturaDispersion = 300;
const anchuradispersion = 500;

const largoMaximoBarras = 150;

const WIDTH = 2 * margen.horizontal + anchuradispersion;
const HEIGHT = 4 * margen.vertical + alturaDispersion + largoMaximoBarras;

const visualizacion = (datos) => {
    const svg = d3
        .select("#visualizacion")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    const contenedorDispersion = svg
        .append("g")
        .attr("transform", `translate(${margen.horizontal} ${margen.vertical})`);

    const escalaRating = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.rating))
        .range([alturaDispersion, 0])
        .nice();

    const ejeRating = d3.axisLeft(escalaRating);

    svg
        .append("g")
        .attr("transform", `translate(${margen.horizontal}, ${margen.vertical})`)
        .call(ejeRating);

    const escalaPages = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.pages))
        .range([0, anchuradispersion])
        .nice();

    const ejePages = d3.axisBottom(escalaPages);

    svg
        .append("g")
        .attr("transform", `translate(${margen.horizontal}, ${margen.vertical + alturaDispersion})`)
        .call(ejePages);

    contenedorDispersion
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "steelblue")
        .attr("r", 7)
        .attr("cx", d => escalaPages(d.pages))
        .attr("cy", d => escalaRating(d.rating));

    /* Hasta aquí se define el gráfico de dispersión base, muy similar a las visualizaciones que ya han visto y 
    hecho anteriormente. A partir del código que viene a continuación se implementará un histograma,
    mediante la utilización del método bin() */
    
    /*
    
    Continuaremos el código desde acá
    
    */
   
    
};

d3.csv('top_100_scifi_books_preprocessed.csv', d => ({pages: parseInt(d.pages), rating: parseFloat(d.ratings)}))
    .then((datos) => visualizacion(datos))
    .catch((error) => console.log(error));

