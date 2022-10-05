const WIDTH = 800;
const HEIGHT = 500;
const tope = 500;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Cargamos el geojson con la información de los paises
d3.json("paises.json").then((datos) => {
  // Algunas opciones de proyecciones
  // d3.geoMercator();
  // d3.geoCylindricalEqualArea();
  // d3.geoWinkel3();

  const proyeccion = d3.geoWinkel3()
    // Opción 1 - Definir nosotros parámetros de la proyección.
    // .scale(150)
    // .rotate([-10, -20, -40])
    // .center([-10, -40])
    // .translate([20, 20])
    // Opción 2 - Ajustar los parámetros automáticamente leyendo los datos disponibles
    .fitSize([WIDTH, HEIGHT], datos);

  // Generamos una función de D3 encargada de crear los "d" a partir de la proyección realizada
  const caminosGeo = d3.geoPath().projection(proyeccion);

  // Agregamos cada feature en el mapa
  svg
    .selectAll("path")
    .data(datos.features)
    .enter()
    .append("path")
    .attr("d", caminosGeo)
    .attr("fill", "blue")
    .attr("opacity", 0.3)
    .attr("stroke", "#ccc");
});


