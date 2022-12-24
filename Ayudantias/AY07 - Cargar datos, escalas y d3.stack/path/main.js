const WIDTH = 1000;
const HEIGHT = 700;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// let puntos = [
//     [50, 200],
//     [100, 150],
//     [150, 300],
//     [200, 600],
//     [250, 475],
//     [300, 550],
//     [350, 100],
//     [400, 25],
//     [450, 70],
//     [500, 500]
// ]

const path = d3.path()

// path.moveTo(50, 200)
// path.lineTo(100, 10)
// path.lineTo(200, 50)
// path.lineTo(100, 500)
// path.lineTo(500, 600)

path.moveTo(30, 10)
path.lineTo(30, 690)
path.moveTo(30, 340)
path.lineTo(130, 340)
path.lineTo(130, 10)
path.lineTo(130, 690)

path.moveTo(180, 10)
path.lineTo(180, 690)
path.lineTo(280, 690)
path.moveTo(180, 340)
path.lineTo(280, 340)
path.moveTo(180, 10)
path.lineTo(280, 10)

path.moveTo(330, 10)
path.lineTo(330, 690)
path.moveTo(330, 10)
path.lineTo(430, 10)
path.lineTo(430, 280)
path.lineTo(330, 280)
path.lineTo(430, 690)

path.moveTo(480, 690)
path.lineTo(480, 10)
path.lineTo(580, 690)
path.lineTo(580, 10)

path.moveTo(630, 690)
path.lineTo(680, 10)
path.lineTo(730, 690)
path.moveTo(655, 340)
path.lineTo(705, 340)

path.moveTo(780, 690)
path.lineTo(780, 10)
path.lineTo(880, 690)
path.lineTo(880, 10)

svg
    .append("path")
    .attr("fill", "transparent")
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("d", path);

svg
    .selectAll("circle")
    .data(puntos)
    .enter()
    .append("circle")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("r", 4);