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

    /* En este caso nos interesa utilizar un brush cuadrado, por lo tanto, la vista detalle tendrá esa misma
    forma. Para ello, tanto para el ancho y alto del svg trabajaremos con la constante HEIGHT y sus margenes
    respectivos*/

    const svgDetalle = d3
        .select("#detalle")
        .attr("width", HEIGHT)
        .attr("height", HEIGHT);

    const escalaRatingDetalle = d3
        .scaleLinear()
        .domain([200, 100].map(escalaRatingPanoramica.invert))
        .range([HEIGHT - margin.top - margin.bottom, 0]);

    /* El método invert nos permite utilizar una escala de forma inversa, podemos entregarle valores del 'rango' 
    y nos retornará el valor del 'dominio' correspondiente. Es decir, si le pasamos un valor utilizando las
    distancias del svg nos devuelve el valor del dato correspondiente */

    /* En este caso el dominio de escalaRatingDetalle lo definimos a partir de los rangos iniciales que tomará
    el brush dentro de la vista panorámica.*/

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
    
    /* Hasta este punto del código, se puede ver que si bien las escalas están correctas y las posiciones de los 
    puntos estan bien, ocurre que hay puntos que se escapan del los ejes de la vista detalle. Para solucionar
    esto deberemos implementar la propiedad de css 'clip-path' que nos permite definir una región en la que los
    elementos pueden ser visibles y fuera de ella no lo son. */

    svgDetalle
        .append("clipPath")
        .attr("id", "clip-detalle")
        .append("rect")
        .attr("width", HEIGHT - margin.top - margin.bottom)
        .attr("height", HEIGHT - margin.top - margin.bottom);

    contenedorPuntosDetalle
        .attr("clip-path", "url(#clip-detalle)");

    /* Definimos entonces el clip-path sobre el svg del detalle, luego, le indicamos al contenedor de los puntos 
    del detalle que utilice ese clip-path en particular mediante el id. */

    /* A continuación vamos a implementar el brush para la visualización. */

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
    
    /* Primero creamos una forma básica del comportamiento con el método brush, extent() nos permite especificar
    las coordenadas relativas de la región con la que se va a interactuar. Posteriormente, llamaremos el 
    comportamiento del brush mediante call() sobre el contenedor que definimos. */

    /* Cada vez que se gatille algún comportamiento del brush, podemos provocar que se ejecute algún código 
    en particular, esto lo hacemos con el método on() y el evento 'brush'; el argumento que recibirá la función
    es un objeto evento con la información del evento que ocurrió.*/

    /* Por lo tanto, aprovecharemos este evento para implementar la funcionalidad de las vista detalle,
    definiremos, primero, entonces la función brushed*/

    const brushed = (evento) => {
        const seleccion = evento.selection; 
        // seleccion nos dice los puntos de referencia que conforman el cuadro del brush

        const pagesMin = escalaPagesPanoramica.invert(seleccion[0][0]);
        const pagesMax = escalaPagesPanoramica.invert(seleccion[1][0]);

        const ratingMax = escalaRatingPanoramica.invert(seleccion[0][1]);
        const ratingMin = escalaRatingPanoramica.invert(seleccion[1][1]);

        /* Accedemos al par de coordenadas del svg que definen donde se encuentra el brush y su tamaño. Estas
        estan contenidas dentro de seleccion, las llevamos al dominio de los datos y las guardamos en un formato 
        más intuitivo para ver los rangos de los valores. */

        /* A continuación definiremos una función de filtrado con la que buscaremos acceder a todos los puntos
        que se se encuentren dentro de esos rangos de valores. */

        const filtro = d => 
            pagesMin <= d.pages && d.pages <= pagesMax && ratingMin <= d.rating && d.rating <= ratingMax;

        puntosPanoramica
            .attr("fill", d => (filtro(d) ? "steelblue" : "black"));
        
        /* Utilizamos el operador ternario ?, para que encaso de que se cumpla el filtro el punto cambie
        de color, y no se cumple entonces se mantenga su color. */

        /* A continuación se actualizarán las escalas de la vista detalle con los nuevos rangos de los datos.
        Para, luego actualizar los ejes y finalmente las posiciones de los puntos. */

        escalaPagesDetalle.domain([pagesMin, pagesMax]);
        contenedorEjePagesDetalle.call(d3.axisBottom(escalaPagesDetalle));

        escalaRatingDetalle.domain([ratingMin, ratingMax]);
        contenedorEjeRatingDetalle.call(d3.axisLeft(escalaRatingDetalle));

        puntosDetalle
            .attr("cx", d => escalaPagesDetalle(d.pages))
            .attr("cy", d => escalaRatingDetalle(d.rating));
    }

    //brush
    //    .on("brush", brushed);

    /* De momento si vinculamos el evento brush a la función que acabamos de crear ya tendríamos lista 
    la implementación sobre la vista detalle. Sin embargo, como se podría ver, tal como está definido el 
    brush actualemtente el uso de la visualización se vuelve caótico, por lo que es necesario poder 
    limitar el brush. Para ello, filtraremos algunos de los eventos brush que se gatillan antes de 
    vincular la función y definiremos un tamaño fijo con la misma proporción de la vista detalle. */
    
    brush.filter((event) => {
        return (
          !event.ctrlKey &&
          !event.button &&
          event.target.__data__.type !== "overlay"
        );
      })
      .on("brush", brushed);

    /* Con este filtro impedimos que a partir de mantener presionado el mouse podamos crear un 
    brush nuevo y hacer variar su tamaño*/
    
    contenedorBrush
        .call(brush)
        .call(brush.move, [
            [100, 100],
            [200, 200]
        ]);

    /* Con esta llamada del brush definimos la posición y tamaño inicial que tendrá el brush */
    
    /* A continuación se realizan algunos cambios estéticos como cambiar el color o la forma en
    que se muestra el mouse sobre el brush */
    contenedorBrush.select(".selection").attr("fill", "steelblue");
    contenedorBrush.select(".overlay").style("cursor", "default");

    /* Esta última línea de código evita que podamos modificar el tamaño del brush a partir de 
    los bordes de él. */
    contenedorBrush.selectAll(".handle").remove();
}

d3.csv('top_100_scifi_books_preprocessed.csv', d => ({pages: parseInt(d.pages), rating: parseFloat(d.ratings)}))
    .then(datos => visualizacion(datos))
    .catch(error => console.log(error))