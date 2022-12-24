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
    createVis1(artists.slice(10, 20));
    // Delays
    createVis2();
    // Reordenar datos
    createVis3(artists.slice(10, 20));
    // MoveEvent mouse
    createVis4();
})


// Función para practicar múltiples appends.
function createVis1(array) {

    // Creamos un SVG de 800px de ancho y 400 de largo.
    const SVG = d3.select("#vis-1")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const domain = [...Array(10).keys()]; // Creamos una lista de 0 al 9

    // Definimos escala de bandas para poner cada dato.
    const escalaX = d3
        .scaleBand()
        .domain(domain)
        .rangeRound([0, 800])
        .padding(0.1); // agregar sepación entre el final y el inicio de una banda.

    // Definimos escala raiz cuadrada para procesar el total de obras por artista
    const escalaY = d3
        .scaleSqrt()
        .domain([0, d3.max(array, d => d.TotalArtwork)])
        .range([0, 200])

    // Hacemos el datajoin  y guardamos el resultados en la variable "grupos"
    // Recordar que el resultado del join es la unión de la selección enter y update
    const grupos = SVG
        .selectAll("g")
        .data(array, d => d.Artist)
        .join(enter => {
            // Creamos un grupo "g"
            const grupos = enter.append("g");


            // Para cada grupo, le agregamos un círculo 
            grupos.append("circle")
                .attr('r', 10)
                .attr('cx', 25)
                .attr('cy', 0)

            // Para cada grupo, le agregamos un cuadrado 
            const sizeRect = 20
            grupos.append("rect")
                .attr('width', sizeRect)
                .attr('height', sizeRect)
                .attr('x', 25 - sizeRect / 2)
                .attr('y', 10)

            // Para cada grupo, le agregamos una barrita
            grupos.append("rect")
                .attr('class', 'barra')
                .attr('width', 5)
                .attr('height', d => escalaY(d.TotalArtwork))
                .attr('x', 25 - 5 / 2)
                .attr('y', 35)

            // Para cada grupo, le agregamos un texto
            grupos.append("text")
                .attr('x', 25)
                .attr('y', d => 35 + escalaY(d.TotalArtwork) + 20)
                .style("dominant-baseline", "middle")
                .style("text-anchor", "middle")
                .text(d => d.Artist.slice(0, 8))

            // retornamos nuestros grupo ques aprovechamos de aplicar una traslación a 
            // cada uno en el eje X.
            return grupos.attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`)
        })

    // A cada grupo (enter + update) le aplicamos el evento click para cambiar su color
    grupos.on("click", (event, d, a) => {

        grupos.attr('fill', (dato) => {
            return dato.Artist == d.Artist ? 'tomato' : 'skyblue';
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

    // Definimos nuestra escala de color que ocupa la paleta de Tableau
    // y ocupa nuesta lista de 5 letras como dominio
    const COLOR = d3.scaleOrdinal(d3[`schemeTableau10`])
        .domain(possiblesCattegories)

    // Definimos escala de bandas para poner cada dato.
    const escalaX = d3
        .scaleBand()
        .domain(array.map((d, i) => i))
        .rangeRound([50, 800])
        .padding(0.1); // agregar sepación entre el final y el inicio de una banda.

    // Definimos escala lineal para determinar el tamaño de cada círculo.
    const radius = d3
        .scaleLinear()
        .domain([0, 20])
        .range([0, 20])

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
                    .delay(1000)
                    .duration(500)
                    .attr('r', d => radius(d.value))
            )

        // a todos los circulos (nuevos y los que se actualizarán) les cambiamos el color
        // con transiciones.
        circulos
            .transition("change-color")
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
function createVis3(artistas) {

    // Creamos un SVG de 800px de ancho y 400 de largo.
    const SVG = d3.select("#vis-3")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const domain = [...Array(10).keys()]; // lista de 0 al 9

    // Creamos una función encargada de hacer el dataJoin según los datos que reciba.
    function dataJoin(array) {
        // El código es casi identico al de createVis1

        const escalaX = d3
            .scaleBand()
            .domain(domain)
            .rangeRound([0, 800])
            .padding(0.1);

        const escalaY = d3
            .scaleSqrt()
            .domain([0, d3.max(array, d => d.TotalArtwork)])
            .range([0, 200])

        const grupos = SVG
            .selectAll("g")
            .data(array, d => d.Artist)
            .join(enter => {
                const grupos = enter.append("g");

                grupos.append("circle")
                    .attr('r', 10)
                    .attr('cx', 25)
                    .attr('cy', 0)

                const sizeRect = 20
                grupos.append("rect")
                    .attr('width', sizeRect)
                    .attr('height', sizeRect)
                    .attr('x', 25 - sizeRect / 2)
                    .attr('y', 10)

                grupos.append("rect")
                    .attr('class', 'barra')
                    .attr('width', 5)
                    .attr('height', d => escalaY(d.TotalArtwork))
                    .attr('x', 25 - 5 / 2)
                    .attr('y', 35)

                grupos.append("text")
                    .attr('x', 25)
                    .attr('y', d => 35 + escalaY(d.TotalArtwork) + 20)
                    .style("dominant-baseline", "middle")
                    .style("text-anchor", "middle")
                    .text(d => d.Artist.slice(0, 8))

                // Retornamos los grupos que por defecto ya tendrán su posición definida.
                return grupos.attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`)
            })

        // Agregamos una transición para que todos los groupos (g) actualizan la traslación
        // en función de la escalaX. 
        grupos
            .transition("position")
            .duration(1000)
            .attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`)

    }

    // Llamamos nuestra función con los datos iniciales
    dataJoin(artistas);

    // Me conecto con el selector al evento "change". El cual,
    // cada vez que cambie la opción seleccionada, gatille nuestra función
    d3.select("#orderBy").on("change", (event) => {
        // Obtengo el valor del selector
        const value = event.target.value;

        // Hago una copia de los datos originales
        const copy = JSON.parse(JSON.stringify(artistas));

        // Si el selector me dice que ordene por nombre, ordeno la copia por el nombre
        if (value == "nombre") {
            copy.sort((a, b) => a.Artist.localeCompare(b.Artist));
            // Llamo a dataJoin con la lista ordenado
            dataJoin(copy);
        }
        // En otro caso, llamo a dataJoin con la lista original
        else {
            dataJoin(copy);
        }
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

    // Creamos un texto para llenar con información
    const text1 = SVG
        .append("text")
        .attr("x", 10)
        .attr("y", 20)
        .text("Posición sin determinar")

    // Creamos otro texto para llenar con información
    const text2 = SVG
        .append("text")
        .attr("x", 10)
        .attr("y", 40)
        .text("Posición en SVG sin determinar")

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
    // con la posición del mouse DENTRO DEL SVG (pageX y pageY)
    circles.on("mousemove", (event) => {
        text1.text(`Posición en HTML ${event.pageX}-${event.pageY}`);
    })


    // Cada vez que el mouse se mueve en el SVG, actualizo el segundo texto
    // con la posición del mouse EN EL HTML (offsetX y offsetY)
    SVG.on("mousemove", (event) => {
        text2.text(`Posición en el SVG ${event.offsetX}-${event.offsetY}`)
        circle.attr("cx", event.offsetX).attr("cy", event.offsetY);
    })
}