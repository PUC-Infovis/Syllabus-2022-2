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

    const svgDetalle = d3
        .select("#detalle")
        .attr("width", HEIGHT)
        .attr("height", HEIGHT);

    const escalaRatingDetalle = d3
        .scaleLinear()
        .domain([200, 100].map(escalaRatingPanoramica.invert))
        .range([HEIGHT - margin.top - margin.bottom, 0]);

    const ejeRatingDetalle = d3.axisLeft(escalaRatingDetalle);

    const contenedorEjeRatingDetalle = svgDetalle
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(ejeRatingDetalle);

    const escalaPagesDetalle = d3
        .scaleLinear()
        .domain([100, 200].map(escalaPagesPanoramica.invert))
        .range([0, HEIGHT - margin.top - margin.bottom]);

    const ejePagesDetalle = d3.axisBottom(escalaPagesDetalle);

    const contenedorEjePagesDetalle = svgDetalle
        .append("g")
        .attr("transform", `translate(${margin.left}, ${HEIGHT - margin.bottom})`)
        .call(ejePagesDetalle);

    const contenedorPuntosDetalle = svgDetalle
        .append("g")
        .attr("transform", `translate(${margin.left} ${margin.top})`);

    const puntosDetalle = contenedorPuntosDetalle
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "steelblue")
        .attr("r", 7)
        .attr("opacity", 1)
        .attr("cx", d => escalaPagesDetalle(d.pages))
        .attr("cy", d => escalaRatingDetalle(d.rating));

    /*
    
    Deberemos realizar cambios para adaptar el clip-path utilizado y hacer que destaque la 
    nueva forma que tiene la vista detalle

    */


    svgDetalle
        .append("clipPath")
        .attr("id", "clip-detalle")
        .append("rect")
        .attr("width", HEIGHT - margin.top - margin.bottom)
        .attr("height", HEIGHT - margin.top - margin.bottom);

    contenedorPuntosDetalle
        .attr("clip-path", "url(#clip-detalle)");    

    const contenedorBrush = svgPanoramica
        .append("g")
        .attr("transform", `translate(${margin.left} ${margin.top})`);
    
    const brush = d3
        .brush()
        .extent([
            [0, 0],
            [WIDTH - margin.left - margin.right, HEIGHT - margin.top - margin.bottom]
        ]);

    contenedorBrush.call(brush)

    const brushed = (evento) => {
        const seleccion = evento.selection; 

        const pagesMin = escalaPagesPanoramica.invert(seleccion[0][0]);
        const pagesMax = escalaPagesPanoramica.invert(seleccion[1][0]);

        const ratingMax = escalaRatingPanoramica.invert(seleccion[0][1]);
        const ratingMin = escalaRatingPanoramica.invert(seleccion[1][1]);

        /*
        
        Deberemos realizar cambios para adaptar el filtro
        
        */

        const filtro = d => 
            pagesMin <= d.pages && d.pages <= pagesMax && ratingMin <= d.rating && d.rating <= ratingMax;

        puntosPanoramica
            .attr("fill", d => (filtro(d) ? "steelblue" : "black"));

        escalaPagesDetalle.domain([pagesMin, pagesMax]);
        contenedorEjePagesDetalle.call(d3.axisBottom(escalaPagesDetalle));

        escalaRatingDetalle.domain([ratingMin, ratingMax]);
        contenedorEjeRatingDetalle.call(d3.axisLeft(escalaRatingDetalle));

        puntosDetalle
            .attr("cx", d => escalaPagesDetalle(d.pages))
            .attr("cy", d => escalaRatingDetalle(d.rating));
    }
    
    brush.filter((event) => {
        return (
          !event.ctrlKey &&
          !event.button &&
          event.target.__data__.type !== "overlay"
        );
      })
      .on("brush", brushed);
    
    contenedorBrush
        .call(brush)
        .call(brush.move, [
            [100, 100],
            [200, 200]
        ]);

    /*
    
    Deberemos realizar cambios para adaptar la forma del brush

    */
    contenedorBrush.select(".selection").attr("fill", "steelblue");
    contenedorBrush.select(".overlay").style("cursor", "default");
    contenedorBrush.selectAll(".handle").remove();
}

d3.csv('top_100_scifi_books_preprocessed.csv', d => ({pages: parseInt(d.pages), rating: parseFloat(d.ratings)}))
    .then(datos => visualizacion(datos))
    .catch(error => console.log(error))