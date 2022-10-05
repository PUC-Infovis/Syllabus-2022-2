// Randint
/**
 * Devuelve un entero aleatorio entre a y b, inclusive
 * @param a - El número mínimo (entero) permitido.
 * @param b - el número máximo que la función puede devolver
 * @returns Un entero aleatorio entre a y b
 */
function randint(a, b) {
  return Math.floor(Math.random() * (b - a + 1) + a)
}

/**
 * Toma una matriz y devuelve una nueva matriz con un elemento eliminado, junto con el elemento
 * eliminado
 * @param array - la matriz para eliminar un elemento de
 * @returns Un objeto con dos propiedades: newArray y removeElement.
 */
function removeRandomElementOfArray(array) {
  const indexToRemove = randint(0, array.length - 1);
  const newArray = [...array];
  const removedElement = newArray.splice(indexToRemove, 1)[0];
  return {
    newArray: newArray,
    removedElement: removedElement
  }
}

// Constants
/* Definición del tamaño del SVG. */
const size = {
  width: 750,
  height: 650
}

// Setting up SVGs

/* Seleccionando el elemento con el id 'vis_container' y configurando su ancho y alto a los valores en
el objeto "size". */
const svg = d3.select('#vis_container')
  .style('width', `${size.width}px`)
  .style('height', `${size.height}px`);

/* Creación de una ruta de recorte que se utilizará para recortar los puntos al hacer zoom. */
svg.append("clipPath") 
  .attr("id", "clip")
  .attr('transform', 'translate(0, -30)')
  .append("rect")
  .attr("width", size.width - 70)
  .attr("height", size.height - 70);

/* Seleccionando el contenedor de la leyenda y configurando su ancho y alto a una cuarta parte del
tamaño del svg principal. Luego selecciona la leyenda svg y establece su ancho y alto en un cuarto
del tamaño del svg principal y una cuarta parte de la altura del contenedor de la leyenda. */
const legendSvg = d3.select('#legend_container')
  .style('width', `${size.width / 4}px`)
  .style('height', `${size.height}px`)
  .select('#legend_svg')
  .style('width', `${size.width / 4}px`)
  .style('height', `${size.height / 2.5}px`);

/* Crear un elemento de grupo y establecer su clase en xAxis, su atributo de transformación en
translate(50, ${size.height - 50}) y su opacidad en 0.7. */
svg.append('g')
  .attr('class', 'xAxis')
  .attr('transform', `translate(50, ${size.height - 50})`)
  .style('opacity', 0.7);

/* Crear un elemento de grupo y establecer su clase en yAxis, su atributo de transformación en
translate(50, 50) y su opacidad en 0.7. */
svg.append('g')
  .attr('class', 'yAxis')
  .attr('transform', `translate(50, 50)`)
  .style('opacity', 0.7);

/* Crear un elemento de texto y establecer sus atributos. */
const xLabel = svg.append('text')
  .attr('class', 'xLabel')
  .attr('transform', `translate(${ (size.width) / 2 }, ${size.height - 15})`)
  .style("text-anchor", "middle");

/* Crear un elemento de texto y establecer sus atributos. */
const yLabel = svg.append('text')
  .attr('class', 'yLabel')
  .attr('transform', `translate(${ 15 }, ${size.height / 2}) rotate(-90)`)
  .style("text-anchor", "middle");

/* Creando un elemento de grupo y configurando su atributo de transformación para traducir (50, 50) y
su atributo de ruta de recorte para url (# clip). */
const dotsContainer = svg.append('g')
  .attr('transform', `translate(50, ${50})`)
  .attr("clip-path", "url(#clip)");

/* Creamos variable global para manejar el estado del zoom actual.
Por defecto será la identidad (x = 0, y = 0, k = 1). */
let lastTransformation = d3.zoomIdentity;

/**
 * Creamos los ejes, las etiquetas, la leyenda y el zoom, y luego creamos los puntos y los animamos en
 * su lugar.
 * @param data - los datos que se utilizarán para crear el gráfico
 */
function createGraph(data) {

  // Domains

  /* Obtener los valores máximos para cada una de las tres variables. */
  const xMax = d3.max(data, d => d['Deaths per TWh of electricity production']);
  const yMax = d3.max(data, d => d['Greenhouse emissions']);
  const rMax = d3.max(data, d => d['Percentage of global electricity']);

  // Scale creation

  /* Creando una escala para el eje x. */
  const scaleX = d3.scaleSqrt()
    .domain([0, xMax + 2])
    .range([0, size.width - 100])
    .nice();

  // Ajustamos escala al Zoom
  const reScaledX = lastTransformation.rescaleX(scaleX);

  /* Crear una escala para el eje y. */
  const scaleY = d3.scaleSqrt()
    .domain([0, yMax + 10])
    //.domain([d3.max([lastTransformation.applyY(0), 0]), yMax + 10])
    .range([size.height - 100, 0])
    .nice();

  console.log(d3.max([lastTransformation.applyY(0), 0]))

  // Ajustamos escala al Zoom
  const reScaledY = lastTransformation.rescaleY(scaleY);

  /* Crear una escala para el radio de los círculos. */
  const scaleR = d3.scaleSqrt()
    .domain([0, rMax])
    .range([0, 50])

  // Setting axes

  /* Creando un eje usando la función scaleX. */
  const xAxis = d3.axisBottom(reScaledX);
    //.ticks(4, '.1f')
    //.tickValues([0.1, 10, 20, 30])
    
  /* Creando un eje usando la función scaleY. */
  const yAxis = d3.axisLeft(reScaledY);
    //.ticks(5)
    //.tickValues([10, 250, 500, 750, 900]);

  /* Seleccionando todas las líneas en el eje x y configurando su opacidad en 0.1. Luego está haciendo
  la transición de las líneas para tener un valor y1 de la altura del svg. */
  d3.select('.xAxis')
    .call(xAxis)
    .selectAll("line")
    .attr("opacity", 0.1)
    .transition('intro')
    .delay(1000)
    .duration(1500)
    .attr("y1", - (size.height - 70));
    
  /* Seleccionando todas las líneas en el eje y y configurando su opacidad a 0.1. Luego está haciendo
  la transición de las líneas para tener un valor x1 del ancho del svg. */
  d3.select('.yAxis')
    .call(yAxis)
    .selectAll("line")
    .attr("opacity", 0.1)
    .transition('intro')
    .delay(1000)
    .duration(1500)
    .attr("x1", size.width - 70);
    
  // Labels
  /* Establecer el texto de xLabel en 'Muertes por TWh de producción de electricidad'. */
  xLabel
    .text('Deaths per TWh of Electricity Production');

  /* Establecer el texto de la yLabel en 'Emisiones de gases de efecto invernadero'. */
  yLabel
    .text('Greenhouse Gas Emissions');

  // Data Join
  /* Actualiza los puntos en el diagrama de dispersión. */
  const dotsUpdate = dotsContainer.selectAll('circle')
    .data(data, d => d.Entity)
    .join(
      /* Creando los círculos que aún no están en el gráfico. */
      (enter) => {
        return (
          enter.append('circle')
            .attr('cx', (d) => reScaledX(d['Deaths per TWh of electricity production']))
            .attr('cy', (d) => reScaledY(d['Greenhouse emissions']))
            .attr('r', scaleR(0))
            .style('opacity', 0)
            .transition('intro')
            .duration(1000)
            .style('opacity', 1)
            .style('fill', (d) => d.color)
            .attr('r', (d) => scaleR(d['Percentage of global electricity']))
        )},
        /* Actualizar los círculos que ya están en el diagrama de dispersión. */
        (update) => {
          return (
            update.transition('update')
              .duration(1000)
              .style('fill', (d) => d.color)
              .attr('cx', (d) => reScaledX(d['Deaths per TWh of electricity production']))
              .attr('cy', (d) => reScaledY(d['Greenhouse emissions']))
              .attr('r', (d) => scaleR(d['Percentage of global electricity']))
          )},
        /* Esta es la selección de salida. Se utiliza para eliminar los círculos que ya no están en los
        datos. */
        (exit) => {
          exit.transition('out')
            .duration(1000)
            .attr('r', (d) => scaleR(0))
            .remove()
        }
        );
  
  /* Agregar una clase a los puntos. */
  dotsUpdate
    .attr('class', 'dot');  
  
  // Legend
  /* Creando una escala para la leyenda. */
  const scaleL = d3.scaleBand()
      .domain(data.map(d => d['Entity']))
      .range([10, size.height / 2.5]);
  
  /* Creando los puntos de la leyenda. */
  legendSvg.selectAll('circle')
      .data(data)
      .join('circle')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .attr('cy', (d) => scaleL(d['Entity']))
      .attr('cx', 20)
      .attr('r', 10)
      .attr('fill', (d) => d.color);
      
  /* Creando los textos de la leyenda. */
  legendSvg.selectAll('text')
    .data(data)
    .join('text')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .text((d) => d['Entity'])
    .attr('y', (d) => scaleL(d['Entity']) + 5)
    .attr('x', 35)
    .style('opacity', 1);

  // Zoom 
  /**
   * Toma el objeto de transformación del evento de zoom y lo usa para cambiar las escalas
   * x e y. Luego usa las nuevas escalas para actualizar la posición de los círculos y los ejes.
   * @param event - el evento que desencadenó el zoom
   */
  const zoomController = (event) => {
    const transformation = event.transform;
    const scaleX2 = transformation.rescaleX(scaleX);
    const scaleY2 = transformation.rescaleY(scaleY);

    svg.selectAll('circle')
      .attr('cx', (d) => scaleX2(d['Deaths per TWh of electricity production']))
      .attr('cy', (d) => scaleY2(d['Greenhouse emissions']));

    svg.select('.xAxis')
      .call(xAxis.scale(scaleX2))
      .selectAll("line")
      .attr("y1", - (size.height - 70))
      .attr("opacity", 0.1);

    svg.select('.yAxis')
      .call(yAxis.scale(scaleY2))
      .selectAll("line")
      .attr("x1", (size.width - 70))
      .attr("opacity", 0.1);

    lastTransformation = transformation;
  }

  /* Crear un objeto de zoom que se usará para acercar y alejar el gráfico. */
  const zoom = d3.zoom()
    .extent([
      [0, 0],
      [size.width, size.height],
    ])
    .translateExtent([
      [0, 0],
      [size.width, size.height],
    ])
    .scaleExtent([1, 15])
    .on("zoom", zoomController);

  /* Llamar al zoom y deshabilitar el zoom al doble clic. */
  svg.call(zoom)
    .on("dblclick.zoom", null);

  /* Restablecer el zoom al nivel de zoom predeterminado (x = 0, y = 0, k = 1). */
  d3.select('#zoom').on('click', (e, d) => {
    lastTransformation = d3.zoomIdentity;
    svg.transition()
      .duration(500)
      .call(zoom.transform, d3.zoomIdentity);
  })

}

/**
 * Hace que el título, los párrafos, los botones y las etiquetas de los ejes aparezcan lentamente
 */
function initVis() {
  /* Hace que el título aparezca lentamente. */
  d3.select('h1')
    .style('opacity', 0)
    .transition('intro')
    .delay(2000)
    .duration(1000)
    .style('opacity', 1);
  
  /* Hace que los párrafos aparezcan lentamente. */
  d3.selectAll('p')
    .style('opacity', 0)
    .transition('intro')
    .delay(2000)
    .duration(1000)
    .style('opacity', 1);

  /* Hace que los botones aparezcan lentamente. */
  d3.selectAll('button')
    .style('opacity', 0)
    .transition('intro')
    .delay(2000)
    .duration(1000)
    .style('opacity', 1);

  /* Hacer que xLabel aparezca lentamente. */
  xLabel
    .style('opacity', 0)
    .transition('intro')
    .delay(2000)
    .duration(1000)
    .style('opacity', 1);

  /* Hacer que yLabel aparezca lentamente. */
  yLabel
    .style('opacity', 0)
    .transition('intro')
    .delay(2000)
    .duration(1000)
    .style('opacity', 1);
  
}

// Load JSON
/* Cargar los datos del archivo json y luego llamar a la función createGraph con los datos como
argumento. */
d3.json('Dataset/energy_data.json')
  .then((data) => {
    
    /* Creando una nueva matriz con los datos que se usaran. */
    let newData = data.map((d) => {
        return {
          "Entity": d.Entity,
          "Deaths per TWh of electricity production": d["Deaths per TWh of electricity production"],
          "Percentage of global electricity": d["Percentage of global electricity"],
          "Greenhouse emissions": d["Greenhouse emissions"],
          "color": d.color
        }
    });
    let removedData = [];
    
    createGraph(newData);
    initVis();
    
    /* Adición de un nuevo elemento al gráfico. */
    d3.select('#add').on('click', (e, d) => {
      if (removedData.length > 0) {
        let data = removeRandomElementOfArray(removedData);
        newData.push(data.removedElement);
        removedData = data.newArray;
        createGraph(newData);
        return
      }
    })
    
/* Eliminar un elemento aleatorio de la matriz y luego crear un nuevo gráfico con la nueva matriz. */
    d3.select('#remove').on('click', (e, d) => {
      if (newData.length > 1) {
        let data = removeRandomElementOfArray(newData);
        removedData.push(data.removedElement);
        newData = data.newArray;
        createGraph(newData);
        return
      }
    })


})

