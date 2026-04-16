import './styles.css'
import * as d3 from 'd3'

// 1. LOAD DATA
const raw = await d3.csv("data/labeling.csv")

const data = raw.map(d => ({
  id: d.event_id,
  title: d.title,
  volume: +d.volume,
  open_date: new Date(d.open_time),
  close_date: new Date(d.close_time),
  platform: d.platform,
  classification: d.classification,
}))

// 2. CATEGORY CONFIG
const categoryConfig = {
  "1_Violence Required":             { label: "Death / Violence required", color: "#c92a2a" },
  "2_Coercion Required":             { label: "Coercion required",         color: "#e85d04" },
  "3_Violence / Coercion Plausible": { label: "Violence plausible",        color: "#fab005" },
  "4_Mass Harm Context":             { label: "Mass harm context",         color: "#868e96" },
  "5_Neutral":                       { label: "Neutral",                   color: "#dee2e6" },
}

function getColor(classification) {
  return categoryConfig[classification]?.color ?? "#dee2e6"
}

// 3. LEGEND
const legend = d3.select("#legend")
legend.selectAll(".legend-item")
  .data(Object.entries(categoryConfig))
  .join("div")
  .classed("legend-item", true)
  .html(([, { label, color }]) => `
    <span class="legend-swatch" style="background:${color}"></span>
    <span class="legend-label">${label}</span>
  `)

// 4. DRAW CANVAS
const margin = { top: 40, right: 60, bottom: 40, left: 100 }
const totalWidth = document.getElementById("chart").clientWidth //When SVG renders, it will take the full width of the container div#chart
const width = totalWidth - margin.left - margin.right

const [minDate, maxDate] = d3.extent(data, d => d.open_date)
const monthTicks = d3.timeMonth.range( //Draw lines and labels for each month
  d3.timeMonth.floor(minDate),
  d3.timeMonth.offset(d3.timeMonth.ceil(maxDate), 1)
)
const height = monthTicks.length * 100

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", totalWidth)
  .attr("height", height + margin.top + margin.bottom)

const chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// 4. SCALES
const yScale = d3.scaleTime()
  .domain([monthTicks[0], monthTicks[monthTicks.length - 1]])
  .range([0, height])

const rScale = d3.scaleSqrt() 
  .domain([0, d3.max(data, d => d.volume)])
  .range([4, 40])

// 5. MONTH LINES + LABELS
chart.selectAll(".month-line")
  .data(monthTicks)
  .join("line")
  .classed("month-line", true)
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", d => yScale(d))
  .attr("y2", d => yScale(d))
  .attr("stroke", "#e0e0e0")
  .attr("stroke-width", 1)

chart.selectAll(".month-label")
  .data(monthTicks)
  .join("text")
  .classed("month-label", true)
  .attr("x", -10)
  .attr("y", d => yScale(d))
  .attr("text-anchor", "end")
  .attr("dominant-baseline", "middle")
  .attr("font-size", "0.75rem")
  .attr("fill", "#666")
  .text(d => d3.timeFormat("%b %Y")(d))

// 6. PREPARE BUBBLE DATA
const cx = width / 2  // center x of the timeline

const nodes = data.map(d => ({ //Create nodes object for each bubble that contains everything needed to draw and simulate it
  ...d, //Copy all fields (title, volume, open_date, etc.) from original data
  r: rScale(d.volume), //Encode volume as bubble radius
  targetY: yScale(d.open_date), // Position bubbles based on open_date
}))

nodes.forEach(d => {
  d.x = cx // Start all bubbles in the center
  d.y = d.targetY // Start all bubbles at their target y position
})

// 7. D3-FORCE SIMULATION
const simulation = d3.forceSimulation(nodes) //Use forceSimulation to avoid bubble overlap
  .force("y", d3.forceY(d => d.targetY).strength(0.6)) // Rather strong force to pull bubbles to target y position
  .force("x", d3.forceX(cx).strength(0.05)) // Weak force to keep bubbles centered on timeline -> allows some horizontal movement
  .force("collide", d3.forceCollide(d => d.r + 3).iterations(3)) 
  .force("bounds", () => {
    nodes.forEach(d => {
      d.x = Math.max(d.r, Math.min(width - d.r, d.x)) // keep bubbles within horizontal bounds (can't go further left or right than its own radius)
      d.y = Math.max(d.r, Math.min(height - d.r, d.y))
    })
  })
  .stop() // prevent simulation run with animation loop

for (let i = 0; i < 500; i++) simulation.tick() //manually run the simulation for a fixed number of iterations to resolve overlaps and find stable positions

// 8. DRAW BUBBLES
chart.selectAll(".bubble")
  .data(nodes)
  .join("circle")
  .classed("bubble", true)
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", d => d.r)
  .attr("fill", d => getColor(d.classification))
  .attr("stroke", "#fff")
  .attr("stroke-width", 0.5)
  .attr("opacity", 0.85)
