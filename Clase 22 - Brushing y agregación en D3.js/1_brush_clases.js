////////////////////////////////////////////////////
// Definir constantes
////////////////////////////////////////////////////
const WIDTH = 600;
const HEIGHT = 400;
const margin = {
  top: 30,
  bottom: 30,
  right: 30,
  left: 30,
};

const WIDTHVIS = WIDTH - margin.right - margin.left
const HEIGHTVIS = HEIGHT - margin.top - margin.bottom

////////////////////////////////////////////////////
// Generar datos aleatorios
////////////////////////////////////////////////////
const datos = d3
  .range(500)
  .map(() => (
    {
      x: Math.random() * 400 + 20,
      y: Math.random() * 50 + 10
    }));


////////////////////////////////////////////////////
// Obtener min y max para cada eje (X e Y)
////////////////////////////////////////////////////

// Restamos 50 para tener un valor un poco más pequeño que el mínimo
const minValueY = d3.min(datos, (d) => d.y) - 50
const minValueX = d3.min(datos, (d) => d.x) - 50

// Sumamos 30 para para tener un valor un poco más grande que el máximo
const maxValueY = d3.max(datos, (d) => d.y) + 30
const maxValueX = d3.max(datos, (d) => d.x) + 30

////////////////////////////////////////////////////
// Crear SVG y sus escalas
////////////////////////////////////////////////////

// Crear SVG
const SVG = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Crear escala en EJE X y EJE Y
const escalaY = d3
  .scaleLinear()
  .domain([minValueY, maxValueY])
  .range([HEIGHTVIS, 0]);

const escalaX = d3
  .scaleLinear()
  .domain([minValueX, maxValueX])
  .range([0, WIDTHVIS]);

// Crear objetos Eje que usan las escalas definidas anteriormente
const ejeY = d3.axisLeft(escalaY);
const ejeX = d3.axisBottom(escalaX);


// Al SVG le agregamos nuestras escalas 
SVG
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .call(ejeY);

SVG
  .append("g")
  .attr("transform", `translate(${margin.left}, ${HEIGHTVIS + margin.bottom})`)
  .call(ejeX);


////////////////////////////////////////////////////
// Crear visualización
////////////////////////////////////////////////////

const contenedorPuntos = SVG
  .append("g")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

const puntos = contenedorPuntos
  .selectAll("circle")
  .data(datos)
  .join("circle")
  .attr("fill", "gray")
  .attr("r", 2)
  .attr("opacity", 0.9)
  .attr("cx", (d) => escalaX(d.x))
  .attr("cy", (d) => escalaY(d.y));


////////////////////////////////////////////////////
// Completar para hacer Brush
////////////////////////////////////////////////////

// Contendeor de nuestro brush. 
// Este tiene que estar posicionado en el mismo lugar que nuestro
// contendeorPuntos
const contenedorBrush = SVG
  .append("g")
  .attr("id", "BRUUUUUUSH")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

function detectarBrush(event) {
  const selection = event.selection

  const esquinaIzquierdaSuperior = selection[0]
  const esquinaDerechaInferior = selection[1]

  const MinY = escalaY.invert(esquinaDerechaInferior[1])
  const MaxY = escalaY.invert(esquinaIzquierdaSuperior[1])

  const MinX = escalaX.invert(esquinaIzquierdaSuperior[0])
  const MaxX = escalaX.invert(esquinaDerechaInferior[0])

  // console.log(MinY, MaxY)
  // console.log(MinX, MaxX)

  const filtrados = puntos.filter(d => {
    if ((MinX < d.x && d.x < MaxX) &&
      (MinY < d.y && d.y < MaxY)
    ) {
      return true
    }
    return false
  })
  filtrados.attr("fill", "orange")

  const Nofiltrados = puntos.filter(d => {
    if ((MinX < d.x && d.x < MaxX) &&
      (MinY < d.y && d.y < MaxY)
    ) {
      return false
    }
    return true
  })
  Nofiltrados.attr("fill", "gray")

}

const brush = d3.brush()
  .extent([
    [0, 0],
    [WIDTHVIS, HEIGHTVIS]
  ])
  .on("brush", detectarBrush)
  .filter(event => {


    // Detectar si oprimió ctrl
    const ctrlKeyEvent = event.ctrlKey;

    // Detectar qué boton del mouse oprimió 
    // (0 click izquierdo, 2 derecho)
    const buttonEvent = event.button;

    // Detectar el tipo de brush. En la visualización o en el cuadro de selección
    const typeEvent = event.target.__data__.type

    console.log({
      ctrlKey: ctrlKeyEvent,
      button: buttonEvent,
      type: typeEvent,
    });
    return typeEvent == "selection"
  })


contenedorBrush.call(brush)

contenedorBrush.call(brush.move, [
  [100, 100],
  [300, 250],
]);


contenedorBrush.selectAll(".handle").remove()

contenedorBrush.select(".overlay").attr("cursor", "default")

// Aplicar cambios al rect que representa el cuadro de selección
contenedorBrush.select(".selection").attr("fill", "magenta");


