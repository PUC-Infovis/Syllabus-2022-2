const ArtistProcessedURL = 'https://gist.githubusercontent.com/Hernan4444/16a8735acdb18fabb685810fc4619c73/raw/face46bb769c88a3e36ef3e7287eebd8c1b64773/ArtistProcessed.csv'

// Función para procesar los datos de artistas
function parseArtist(d) {
    const data = {
        Artist: d.Artist,
        BirthYear: +d.BirthYear,
        Categories: JSON.parse(d.Categories),
        DeathYear: +d.DeathYear,
        Gender: d.Gender,
        Nacionality: d.Nacionality,
        TotalArtwork: +d.TotalArtwork,
    }
    return data
}

// Cargamos los datos, los procesamos y creamos las 4 visualizaciones
d3.csv(ArtistProcessedURL, parseArtist).then(artists => {
    // Multiples appends
    // createVis1(artists.slice(10, 20));
    // Delays
    // createVis2();
    // Reordenar datos
    // createVis3(artists.slice(10, 20));
    // MoveEvent mouse
    createVis4();
})


// Función para practicar múltiples appends.
function createVis1(array) {
    // Array son los datos de 10 artistas
    console.log(array)

    // SVG
    const SVG = d3.select("#vis-1")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    // Crear lista de 0 a 9
    const domain = [...Array(10).keys()]
    console.log(domain)

    // Definir escalas para pasar números a pixeles del SVG
    const escalaX = d3.scaleBand()
        .domain(domain)
        .range([0, 800]).padding(0.1);

    const escalaY = d3.scaleSqrt()
        .domain([0, d3.max(array, d => d.TotalArtwork)])
        .range([0, 200]);

    function definirEnter(enter) {
        const grupos = enter.append("g");

        grupos.append("circle")
            .attr("r", 10)
            .attr("cx", 25)
            .attr("cy", 0)

        grupos.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 25 - 20 / 2)
            .attr("y", 10)

        grupos.append("rect")
            .attr("width", 5)
            .attr("height", d => escalaY(d.TotalArtwork))
            .attr("x", 25 - 5 / 2)
            .attr("y", 40)

        grupos.append("text")
            .attr("x", 25)
            .attr("y", d => escalaY(d.TotalArtwork) + 40 + 30)
            .text(d => d.Artist.slice(0, 5))
            .style("dominant-baseline", "middle")
            .style("text-anchor", "middle")

        return grupos.attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`);
    }

    const grupos = SVG
        .selectAll("g")
        .data(array, d => d.Artist) // Muy importante cuando hagamos eliminos datos
        .join(
            enter => definirEnter(enter),
            update => update,
            exit => exit.remove()
        )

    grupos.on("click", (event, d) => {
        console.log("Hice click en", d)
        grupos.attr("fill", (dato) => {
            console.log("REVISANDO ", dato)
            return d.Artist == dato.Artist ? 'tomato' : 'skyBlue';
        })
    })

}

// Función para poner en práctica delays
function createVis2() {

    // Función que selecciona aleatoriamente un dato de una lista.
    function choose(choices) {
        var index = Math.floor(Math.random() * choices.length);
        return choices[index];
    }

    // Creamos un SVG de 800px de ancho y 400 de largo.
    const SVG = d3.select("#vis-2")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    // Generamos una lista de 5 letras
    const possiblesCattegories = ["A", "B", "C", "D", "E"]

    // Generamos una lsita de 10 números (0 a 9) y cada número 
    // lo cambiamos por un diccionario 
    const array = [...Array(10).keys()].map(d => {
        return {
            "value": Math.random() * 20, // Número aleatorio entre 0 y 20
            "category": choose(possiblesCattegories) // Categoría aleatoria
        }
    })

    console.log(array)

    // Definimos nuestra escala de color que ocupa la paleta de Tableau
    // y ocupa nuesta lista de 5 letras como dominio
    const COLOR = d3.scaleOrdinal(d3[`schemeTableau10`])
        .domain(possiblesCattegories)

    // Definimos escala de bandas para poner cada dato.
    const escalaX = d3
        .scaleBand()
        .domain(array.map((d, i) => i))
        .range([50, 800])
        .padding(0.1); // agregar sepación entre el final y el inicio de una banda.

    // Definimos escala lineal para determinar el tamaño de cada círculo.
    const radius = d3
        .scaleLinear()
        .domain([0, 20])
        .range([0, 30])

    // Creamos nuestra función dataJoin encargada de recibir una lista de 
    // datos y hacer el data join.
    function dataJoin(array) {
        // En enter nos encargamos de crear los círculos
        // En update nos encargamos de esperar 1 segundo y luego en 0.5 segundos
        // le cambiamos el tamaño
        const circulos = SVG
            .selectAll(".statick-circles")
            .data(array)
            .join(
                enter => enter.append("circle")
                    .attr("class", "statick-circles")
                    .attr('r', d => radius(d.value))
                    .attr('cx', (d, i) => escalaX(i))
                    .attr('cy', 100)
                    .attr('fill', "black")

                ,
                update => update
                    .transition("change-size")
                    .duration(500)
                    .attr('r', d => radius(d.value))
            )

        // a todos los circulos (nuevos y los que se actualizarán) les cambiamos el color
        // con transiciones.
        circulos
            .transition("change-color")
            .delay(1000)
            .duration(500)
            .attr('fill', d => COLOR(d.category))
    }

    // Llamamos a nuestra función con los datos iniciales.
    dataJoin(array);

    // Cada vez que oprimimos el boton, generamos una nueva lista de datos random
    // y llamamos a nuestra función del dataJoin.
    d3.select("#updateVis2").on("click", () => {
        const arrayV2 = [...Array(10).keys()].map(d => {
            return {
                "value": Math.random() * 20,
                "category": choose(possiblesCattegories)
            }
        })
        dataJoin(arrayV2);
    })
}

// Función par poner en práctica el ordenamiento
function createVis3(array) {
    // SVG
    const SVG = d3.select("#vis-3")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    // Crear lista de 0 a 9
    const domain = [...Array(10).keys()]
    console.log(domain)

    // Definir escalas para pasar números a pixeles del SVG
    const escalaX = d3.scaleBand()
        .domain(domain)
        .range([0, 800]).padding(0.1);

    const escalaY = d3.scaleSqrt()
        .domain([0, d3.max(array, d => d.TotalArtwork)])
        .range([0, 200]);

    function definirEnter(enter) {
        console.log("NUEVOS DATOS A ASIGNAR")
        console.log(enter)
        const grupos = enter.append("g");

        grupos.append("circle")
            .attr("r", 10)
            .attr("cx", 25)
            .attr("cy", 0)

        grupos.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 25 - 20 / 2)
            .attr("y", 10)

        grupos.append("rect")
            .attr("width", 5)
            .attr("height", d => escalaY(d.TotalArtwork))
            .attr("x", 25 - 5 / 2)
            .attr("y", 40)

        grupos.append("text")
            .attr("x", 25)
            .attr("y", d => escalaY(d.TotalArtwork) + 40 + 30)
            .text(d => d.Artist.slice(0, 5))
            .style("dominant-baseline", "middle")
            .style("text-anchor", "middle")

        return grupos.attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`);
    }

    function dataJoin(lista) {
        const grupos = SVG
            .selectAll("g")
            .data(lista, d => d.Artist) // Muy importante cuando hagamos eliminos datos
            .join(
                enter => definirEnter(enter),
                update => {
                    console.log("UPDATEEEE")
                    console.log(update);
                    update
                        .transition("position")
                        .duration(1000)
                        .attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`);
                    return update
                },
                exit => exit.transition("position")
                    .duration(1000)
                    .attr("transform", (_, i) => `translate(0, 0)`).remove()
            )
    }
    dataJoin(array)

    d3.select("#orderBy").on("change", event => {
        console.log(event.target.value);

        const copy = JSON.parse(JSON.stringify(array))

        if (event.target.value == "nombre") {
            copy.sort(
                (a, b) => {
                    let nombreA = a.Artist
                    let nombreB = b.Artist
                    return nombreA.localeCompare(nombreB)
                }
            )
        }
        dataJoin(copy)

    })
}

// Función para poner en juego el dataJoin
function createVis4() {

    // Creamos un SVG de 800px de ancho y 400 de largo.
    const SVG = d3.select("#vis-4")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const array = [...Array(10).keys()]; // lista de 0 al 9

    // Definimos escaa de banda para poner nuestros datos
    const escalaX = d3
        .scaleBand()
        .domain(array)
        .rangeRound([0, 800])
        .padding(0.1);

    // Definimos escala lineal para definir el radio
    const radius = d3
        .scaleLinear()
        .domain(d3.extent(array))
        .range([0, 20])

    // IMPORTANTE
    // Creamos un texto para llenar con información
    const text1 = SVG
        .append("text")
        .attr("x", 10)
        .attr("y", 20)
        .text("Posición sin determinar")

    // IMPORTANTE
    // Creamos otro texto para llenar con información
    const text2 = SVG
        .append("text")
        .attr("x", 10)
        .attr("y", 40)
        .text("Posición en SVG sin determinar")

    // IMPORTANTE
    // Creamos un circulo que seguirá la posición del mouse
    const circle = SVG.append("circle")
        .attr("cx", -10)
        .attr("cy", -10)
        .attr("r", 10)
        .attr("fill", "orange")

    // creamos todos nuestros circulos con data join
    const circles = SVG
        .selectAll(".statick-circles")
        .data(array)
        .join(enter => {
            return enter.append("circle")
                .attr("class", "statick-circles")
                .attr('r', d => radius(d))
                .attr('cx', (d, i) => escalaX(i))
                .attr('cy', 100)

        })


    // Cada vez que el mouse se mueve encima de un círculo, actualizo el primer texto
    // con la posición del mouse DENTRO DEL HTML (pageX y pageY)
    circles.on("mousemove", (event) => {
        text1.text(`Posición en HTML ${event.pageX}-${event.pageY}`);
    })

    // Cada vez que el mouse se mueve en el SVG, actualizo el segundo texto
    // con la posición del mouse EN EL SVG (offsetX y offsetY)
    SVG.on("mousemove", (event) => {
        text2.text(`Posición en el SVG ${event.offsetX}-${event.offsetY}`)
        circle.attr("cx", event.offsetX).attr("cy", event.offsetY);
    })
}