// Creamos un SVG en body
const svg = d3.select("body").append("svg");

// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {
  // Definimos el ancho y largo del SVG.
  svg.attr("width", 50 + datos.length * 100).attr("height", 500);

  // Vinculamos los datos con cada elemento rect con el comando join
  const enter_and_update = svg
    .selectAll("rect")
    .data(datos)
    .join("rect")

  // Personalizamos según la información de los datos.
  enter_and_update.attr("width", 50)
    .attr("fill", "orange")
    .attr("height", (d) => d)
    .attr("x", (_, i) => 50 + i * 100);
}

// Creamos una lista inicial de datos y llamamos a joinDeDatos
const datos = [10, 20, 30, 40];
joinDeDatos(datos);

// Buscamos el elemento HTML con id="boton"
const boton = document.getElementById("boton");

// Le agregamos un evento. Cada vez que le hagan click, se activa la función.
boton.addEventListener("click", () => {
  // Definimos un número aleatorio entre 1 y 11.
  const largo = Math.round(Math.random() * 10 + 1);

  // Agregamos números aleatorios entre 1 y 21 tantas veces según el 
  // número definido anteriormente.
  const nuevos_datos = []
  for (let i = 0; i < largo; i++) {
    nuevos_datos.push(Math.round(Math.random() * 20 + 1))
  }

  // Actualizamos el SVG con esta nueva lista de datos.
  joinDeDatos(nuevos_datos);
});