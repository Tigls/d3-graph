import * as d3 from './utils/d3';
const data = {
  nodes:
    [
      { "name": "fruit", "id": 0 },
      { "name": "apple", "id": 1 },
      { "name": "orange", "id": 2 },
      { "name": "banana", "id": 3 }
    ],
  links:
    [
      { "source": 0, "target": 1, "id": 0 },
      { "source": 0, "target": 2, "id": 1 }
    ]
}

const drag = (simulation) => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

const graph = () => {
  const width = 1080;
  const height = 800;
  console.log('Before: ', data.links);
  const links = data.links.map(d => Object.create(d));
  console.log('After: ', links);
  const nodes = data.nodes.map(d => Object.create(d));

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(70))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.select('svg');

  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 3)
    .attr("stroke", "#666666")

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .call(drag(simulation));

  const circles = node.append("circle")
    .attr("r", 25)
    .attr("class", "circle")
    .style("stroke", '#666666')
    .style('stroke-width', '3')
    .style('fill', '#1d1f20')

  const lables = node.append("text")
    .text(d => d.name)
    .style("fill", "#666666")
    .style("font-weight", "600")
    .style("text-transform", "uppercase")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle")
    .style("font-size", "10px")
    .style("font-family", "cursive")

  simulation.nodes(nodes).on("tick", ticked)
  function ticked(){
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
  };
  return svg.node();
  
}
graph();