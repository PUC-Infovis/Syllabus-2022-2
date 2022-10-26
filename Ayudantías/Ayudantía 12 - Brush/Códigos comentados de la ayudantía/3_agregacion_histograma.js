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
    
    const pagesBin = d3
        .bin()
        .domain(escalaPages.domain())   //le indicamos el dominio sobre el dato
        .thresholds(30)                 //le indicamos cuantos grupos queremos que 'intente' hacer
        .value((d) => d.pages)          //le indicamos como acceder al valor en caso de ser el dato un objeto

    const gruposPages = pagesBin(datos);    //obtenemos los grupos al pasarle los datos como función


    /* Definimos los contenedores para el histograma */

    const yHistograma = 2 * margen.vertical + alturaDispersion;

    const contenerBarrasVerticales = svg
        .append("g")
        .attr("transform", `translate(${margen.horizontal} ${yHistograma})`);

    /* En este caso la magnitud de las barras del histograma corresponderá a la cantidad de elementos 
    que haya en cada grupo */
    
    const escalaAltura = d3
        .scaleLinear()
        .domain([0, d3.max(gruposPages, d => d.length)])
        .range([0, largoMaximoBarras]);

    const ejeAltura = d3.axisLeft(escalaAltura);

    svg
        .append("g")
        .attr("transform", `translate(${margen.horizontal}, ${yHistograma})`)
        .call(ejeAltura);

    console.log(gruposPages)
    /* Para realizar data join del histograma utilizaremos los grupos que obtuvimos de bin(). 
    Cada grupo además de contener a ciertos datos, tienen atributos x0 y x1 que nos permitiran ubicar
    y dimensionar cada barra respectiva para cada grupo.*/
    
    contenerBarrasVerticales
        .selectAll("rect")
        .data(gruposPages)
        .join("rect")
        .attr("width", d => escalaPages(d.x1) - escalaPages(d.x0))
        .attr("height", d => escalaAltura(d.length))
        .attr("x", d => escalaPages(d.x0))
        .attr("fill", "steelblue")
        .attr("stroke", "white"); 
};

d3.csv('top_100_scifi_books_preprocessed.csv', d => ({pages: parseInt(d.pages), rating: parseFloat(d.ratings)}))
    .then((datos) => visualizacion(datos))
    .catch((error) => console.log(error));

