const WIDTH = 600,
    HEIGHT = 400;

const margin = {
    top: 30,
    bottom: 30,
    right: 30,
    left: 30
};

const visualizacion = (datos) => {
    const svgPanoramica = d3.select("#panoramica")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);
    
    const escalaRatingPanoramica = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.rating))
        .range([HEIGHT - margin.top - margin.bottom, 0])
        .nice();

    const ejeRatingPanoramica = d3.axisLeft(escalaRatingPanoramica);

    //contenedorEjeRatingPanoramica
    svgPanoramica
        .append("g")
        .attr("transform", `translate(${margin.left} ${margin.top})`)
        .call(ejeRatingPanoramica);

    const escalaPagesPanoramica = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.pages))
        .range([0, WIDTH - margin.left - margin.right])
        .nice();

    const ejePagesPanoramica = d3.axisBottom(escalaPagesPanoramica);

    //contenedorEjePagesPanoramica 
    svgPanoramica
        .append("g")
        .attr("transform", `translate(${margin.left} ${HEIGHT - margin.bottom})`)
        .call(ejePagesPanoramica);

    const contenerdorPuntosPanoramica = svgPanoramica
        .append("g")
        .attr("transform", `translate(${margin.left} ${margin.top})`);

    const puntosPanoramica = contenerdorPuntosPanoramica
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "black")
        .attr("r", 7)
        .attr("opacity", 1)
        .attr("cx", d => escalaPagesPanoramica(d.pages))
        .attr("cy", d => escalaRatingPanoramica(d.rating));

    /* Hasta aquí se define la vista panorámica base, muy similar a las visualizaciones que ya han visto y 
    hecho anteriormente. A partir del código que viene a continuación se implementará la vista detalle,
    mediante la implementación de Brushing */

    /*
    
    Continuaremos el código desde acá
    
    */


}

d3.csv('top_100_scifi_books_preprocessed.csv', d => ({pages: parseInt(d.pages), rating: parseFloat(d.ratings)}))
    .then(datos => visualizacion(datos))
    .catch(error => console.log(error))