import * as d3 from '../utils/d3';
import { drag } from './graph-drag';

export const graph = (data) => {
  const width = 1080;
  const height = 800;
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(200))
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
  
  const marker = svg.append("defs")
    .append("marker")
    .attr("id", "triangle")
    .attr("refX", 14)
    .attr("refY", 3)
    .attr("markerUnits", 10)
    .attr("markerWidth", 8)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 6 3 0 6 1 3")
    .style("fill", "#666666");
  d3.selectAll("line").attr("marker-end", "url(#triangle)");
    
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
  function ticked() {
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