/*
Size constants
*/

const WIDTH = document.getElementById("vis1").clientWidth;
const HEIGHT = document.getElementById("vis1").clientHeight;
const WIDTH2 = document.getElementById("vis2").clientWidth;
const HEIGHT2 = document.getElementById("vis2").clientHeight;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;

/*
Other variants
*/

let lastFilled = 1;


/* 
Functions
*/

// This function loads the data
async function initialLoad() {
    const countries = await d3.json("./data/countries.geojson");
    const starbucks = await d3.csv("./data/starbucks.csv");
    return { countries, starbucks };
}

// This function gets the number of starbucks in each country and returns and array of objects with 
// the country name and the number of starbucks
function totalStarbucksByCountry(starbucksData) {
    const sumByCountry = d3.rollup(starbucksData, v => v.length, d => d.countryCode);
    const starbucksByCountryArray = Array.from(sumByCountry, ([countryCode, total]) => ({ countryCode, total }));
    return starbucksByCountryArray;
}

function displayCountry(d, vis, starbucksData) {
    console.log(d);
    const countryCode = d.properties.ISO_A2;
    // if (countryCode === "US") {

    //     // filter countries to get the usa path 

    const svg = d3.select(`${vis}`)
                    .append("svg")
                    .attr("width", WIDTH2)
                    .attr("height", HEIGHT2);

    const map = svg.append("g")
        .attr('id', 'topCountryMap')
    
    const pointsGroup = svg.append("g")
                    .attr('id', 'topCountryPoints')


    //     // define a projection
    const projectionWinkel3 = d3.geoMercator()
    projectionWinkel3.fitSize([WIDTH2, HEIGHT2], d);
    const pathGenerator = d3.geoPath().projection(projectionWinkel3);

    // For every country we create a g element to group his path and bubble 
    const countryNodes = map.selectAll("country")
        .data([d])
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("fill", "lightgrey")
        .attr("opacity", 0.6)
        .attr("stroke", "black")
    
    //add points in the map by latitude and longitude
    const points = pointsGroup.selectAll("circle")
        .data(starbucksData)
        .enter()
        .filter(d => countryCode === d.countryCode)
        .append("circle")
        .attr("cx", d => projectionWinkel3([d.longitude, d.latitude])[0])
        .attr("cy", d => projectionWinkel3([d.longitude, d.latitude])[1])
        .attr("r", 2)
        .attr("fill", "red")
        .attr("opacity", 0.6)
        .attr("stroke", "black")

    
}

// Check if value is USA, and if it is, display the cities in vis2 and vis3
async function checkUSA(countryCode, d, starbucksData) {
    //check if there is a svg element in vis2
    if(lastFilled == 0){
        d3.select("#vis3").select("svg").remove();
        displayCountry(d, "#vis3", starbucksData);
        lastFilled = 1;
    }
    else{
        d3.select("#vis2").select("svg").remove();
        displayCountry(d, "#vis2", starbucksData);
        lastFilled = 0;
    }

}


/* 
Projections
*/

const projectionWinkel3 = d3.geoWinkel3();
//const projection = d3.geoMercator();

/*
Scales
*/

function logScale(data, min, max) {
    const scale = d3.scaleLog()
        .domain(d3.extent(data, d => d.total))
        .range([min, max]);
    return scale;
}

function linearScale(data, min, max) {
    const scale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.total))
        .range([min, max]);
    return scale;
}

function sqrtScale(data, min, max) {
    const scale = d3.scaleSqrt()
        .domain(d3.extent(data, d => d.total))
        .range([min, max]);
    return scale;
}

const svg = d3.select("#vis1")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

const map = svg.append("g")
    .attr('id', 'map')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const countriesGroup = map.append("g")
    .attr("id", "countries");

const boundingRect = map.append("rect")
    .attr("id", "bounding-rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("stroke", "black");


/*
Main
*/

//Create first visualization: static map
initialLoad().then(data => {
    const { countries, starbucks } = data;
    console.log(countries);

    const starbucksByCountry = totalStarbucksByCountry(starbucks);
    const starbucksByCountryDict = {}
    starbucksByCountry.forEach(d => {
        starbucksByCountryDict[d.countryCode] = d.total;
    })

    projectionWinkel3.fitSize([width, height], countries);
    const pathGenerator = d3.geoPath().projection(projectionWinkel3);

    // For every country we create a g element to group his path and bubble 
    const countryNodes = countriesGroup.selectAll("country")
        .data(countries.features)
        .enter()
        .append("g")
        .attr("class", "country")

    countryNodes.append("path")
        .attr("d", pathGenerator)
        .attr("fill", "lightgrey")
        .attr("opacity", 0.6)
        .attr("stroke", "black")

    // Crear una escala logaritmica
    const scale = logScale(starbucksByCountry, 1, 20);

    // Filtrar los G para solo quedarme con aquellos cuya data esté en starbucksByCountryDict
    countryNodes
        .filter(feature => feature.properties.ISO_A2 in starbucksByCountryDict)
        .append("circle")
        .attr("cx", d => pathGenerator.centroid(d.geometry)[0])
        .attr("cy", d => pathGenerator.centroid(d.geometry)[1])
        .attr("r", function (d) {
            return scale(starbucksByCountryDict[d.properties.ISO_A2]);
        })
        .attr("id", function (d) {
            return d.properties.ISO_A2;
        })
        .style("fill", "#00704A")
        .style("opacity", 0.5)

    // Add onclick action to country nodes 
    countryNodes.on("click", function (e, d) {
        console.log(d.properties.ADMIN, d.properties.ISO_A2);
        checkUSA(d.properties.ISO_A2, d, starbucks);
    });
});
