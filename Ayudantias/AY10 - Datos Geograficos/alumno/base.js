/********************************************************************
Constantes de tamaño:
Acá vamos a dejar las constantes ocupadas para obtener el tamaño de 
los elementos donde se van a dibujar los mapas y los gráficos.
*********************************************************************/


const WIDTH = document.getElementById("vis1").clientWidth;
const HEIGHT = document.getElementById("vis1").clientHeight;
const WIDTH2 = document.getElementById("vis2").clientWidth;
const HEIGHT2 = document.getElementById("vis2").clientHeight;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;

/********************************************************************
Añadir svg "estático" para los mapas en el facet container
*********************************************************************/
const svgTopCountry = d3.select("#vis2")
.append("svg")
.attr("width", WIDTH2)
.attr("height", HEIGHT2);

const svgBottomCountry = d3.select("#vis3")
.append("svg")
.attr("width", WIDTH2)
.attr("height", HEIGHT2);

// Agregamos el grupo mapa que va a contener al path del país
const mapTopCountry = svgTopCountry.append("g")
.attr('class', 'countryMap')

const mapBottomCountry = svgBottomCountry.append("g")
.attr('class', 'countryMap')

// Agregamos el grupo tiendas que va a contener a las tiendas representadas
// como círculos
const circlesGroupTop = svgTopCountry.append("g")
.attr('class', 'storePoints')

const circlesGroupBottom = svgBottomCountry.append("g")
.attr('class', 'storePoints')


/********************************************************************
Otras variables globales
*********************************************************************/

// Variable que nos va a ayudar a saber si el último país 
// que se dibujó fue en el vis2 o en el vis3
let lastUsed = 1;

/********************************************************************
Proyecciones
*********************************************************************/


/******************************************************************** 
Escalas
*********************************************************************/


/******************************************************************** 
Funciones
*********************************************************************/

// Función que carga los datos de los archivos .csv y .json
async function initialLoad() {
    const countries = await d3.json("./data/countries.geojson");
    const starbucks = await d3.csv("./data/starbucks.csv");
    return { countries, starbucks };
}

// Función para obtener el número de tiendas por país
function totalStarbucksByCountry(starbucksData) {
    const sumByCountry = d3.rollup(starbucksData, v => v.length, d => d.countryCode);
    const starbucksByCountry = Array.from(sumByCountry, ([countryCode, total]) => ({ countryCode, total }));
    const starbucksByCountryDict = {}
    starbucksByCountry.forEach(d => {
        starbucksByCountryDict[d.countryCode] = d.total;
    })
    
    return {starbucksByCountry, starbucksByCountryDict};
}

// Función para desplegar un país con sus respectivas tiendas 
function displayCountry(d, vis, starbucksData) {
    // Definimos la proyección
    
    // Definimos el path generator

    if(vis){
    //Agregamos el path del país al mapa

    //Agregamos los círculos de las tiendas al mapa
 
    }
    else{
    //Agregamos el path del país al mapa

    //Agregamos los círculos de las tiendas al mapa

    }
   
}

// Revisa donde fue agregada la última visualización de país y según eso 
// agrega la nueva visualización en la otra área
function chooseVisArea(country, starbucksData) {
    //check if there is a svg element in vis2
    if(lastUsed == 0){
        //filtrar los starbucks a los del país correspondientes
        const filteredStarbucks = starbucksData.filter(store => store.countryCode == country.properties.ISO_A2);
        displayCountry(country, 1, filteredStarbucks);
        lastUsed = 1;          
    }
    else{
        const filteredStarbucks = starbucksData.filter(store => store.countryCode == country.properties.ISO_A2);
        displayCountry(country, 0, filteredStarbucks);
        lastUsed = 0;     
    }

}

function displayWorldMap(countries, starbucks){

    const {starbucksByCountry, starbucksByCountryDict} = totalStarbucksByCountry(starbucks);

    const svg = d3.select("#vis1")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    const countriesGroup = svg.append("g")
                            .attr("id", "worldMap")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`);


    svg.append("rect")
        .attr("id", "bounding-rect")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("fill", "none")
        .attr("stroke", "black");

        //Definir la proyección

        //Definir el path generator
    
        // Para cada país, agregamos un g que va a contener el path del país
        // y una burbuja asociada al número de tiendas de ese país
        const countryNodes = countriesGroup.selectAll("country")
            .data(countries.features)
            .join("g")
            .attr("class", "country")
    
        //Agregamos el path
    
        // Setear los valores de la escala logaritmica
    
        // Filtrar los G para solo quedarme con aquellos cuya data esté en starbucksByCountryDict
    
        // Agregar evento gatillado por click
        countryNodes.on("click", function (e, d) {
            //console.log(d.properties.ADMIN, d.properties.ISO_A2);
            chooseVisArea(d, starbucks);
        });
}

/******************************************************************** 
Main
*********************************************************************/

initialLoad().then(data => {
    const { countries, starbucks } = data;
    console.log(countries);

    displayWorldMap(countries, starbucks);
});
