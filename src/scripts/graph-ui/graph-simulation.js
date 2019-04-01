import * as d3 from '../utils/d3';
import { drag } from './graph-drag';

export const graph = (data) => {
 
  const width = 1080;
  const height = 800;

  state.links = data.links.map(d => Object.create(d));
  state.nodes = data.nodes.map(d => Object.create(d));

  state.simulation = d3.forceSimulation(state.nodes)
    .force("link", d3.forceLink(state.links).id(d => d.id).distance(200))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.select('svg');
  state.svg = svg;
  initialGraph();
  console.log(state);
  update();
  console.log(state);
  d3.select(window)
    // .on("mousemove", mousemove)
    .on("mousedown", mousedown)
    .on("mouseup", mouseup)
    .on("keydown", keydown)
    .on("keyup", keyup);
  
  return state.svg.node();
}

function initialGraph() {
  state.linesg = state.svg.append("g")
    .attr("class", "links")
  
  state.marker = state.svg.append("defs")
    .append("marker")
    .attr("id", "triangle")
    .attr("refX", 14)
    .attr("refY", 3)
    // .attr("markerUnits", 10)
    .attr("markerWidth", 8)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 6 3 0 6 1 3")
    .style("fill", "#666666");
  
  state.nodesClass = state.svg.append("g")
    .attr("class", "nodes")
}

function update() {
  console.log('In Update: ', state);
  state.link = state.linesg
    .selectAll("line")
    .data(state.links);
  state.link
    .enter()
    .append("line")
    .attr("stroke-width", 3)
    .attr("stroke", "#666666");
  state.link
    .exit()
    .remove();

  d3.selectAll("line").attr("marker-end", "url(#triangle)");

  state.node = state.nodesClass
    .selectAll("g")
    .data(state.nodes);
  state.nodeg = state.node
    .enter()
    .append("g")
    .call(drag(state.simulation));
  const circles = state.node.append("circle")
    .attr("r", 25)
    .attr("class", "circle")
    .style("stroke", '#666666')
    .style('stroke-width', '3')
    .style('fill', '#1d1f20')
  const lables = state.node.append("text")
    .text(d => d.name)
    .style("fill", "#666666")
    .style("font-weight", "600")
    .style("text-transform", "uppercase")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle")
    .style("font-size", "10px")
    .style("font-family", "cursive")
  state.nodeg
    .exit()
    .remove();

  state.simulation.nodes(state.nodes).on("tick", ticked)
  function ticked() {
    state.link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    state.nodeg
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
  };
}

function mousemove() {
  if (state.drawing_line && !state.should_drag) {
    const m = d3.mouse(state.svg.node());
    const x = Math.max(0, Math.min(state.width, m[0]));
    const y = Math.max(0, Math.min(state.height, m[1]));
    // debounce - only start drawing line if it gets a bit big
    const dx = state.selected_node.x - x;
    const dy = state.selected_node.y - y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      // draw a line
      if (!state.new_line) {
        state.new_line = state.linesg.append("line").attr("class", "new_line");
      }
      state.new_line
        .attr("x1", (d) => selected_node.x)
        .attr("y1", (d) => selected_node.y)
        .attr("x2", (d) => x)
        .attr("y2", (d) => y);
    }
  }
  update();
}

// add a new disconnected node
function mousedown() {
  console.log(state)
  const m = d3.mouse(state.svg.node())
  state.nodes.push({ x: m[0], y: m[1], index: 4 });
  state.selected_link = null;
  state.simulation.stop();
  update();
  state.simulation.restart();
}

// end node select / add new connected node
function mouseup() {
  state.drawing_line = false;
  if (state.new_line) {
    if (state.selected_target_node) {
      state.selected_target_node.fixed = false;
      const new_node = state.selected_target_node;
    } else {
      const m = d3.mouse(svg.node());
      const new_node = {x: m[0], y: m[1], name: default_name + " " + nodes.length, group: 1}
      nodes.push(new_node);
    }
    state.selected_node.fixed = false;
    data.links.push({source: state.selected_node, target: new_node})
    state.selected_node = selected_target_node = null;
    update();
    setTimeout(function () {
      new_line.remove();
      state.new_line = null;
      force.start();
    }, 300);
  }
}

function keyup() {
  switch (d3.event.keyCode) {
    case 16: { // shift
      should_drag = false;
      update();
      force.start();
    }
  }
}

// select for dragging node with shift; delete node with backspace
function keydown() {
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      if (selected_node) { // deal with nodes
        const i = nodes.indexOf(selected_node);
        nodes.splice(i, 1);
        // find links to/from this node, and delete them too
        const new_links = [];
        links.forEach(function(l) {
          if (l.source !== selected_node && l.target !== selected_node) {
            new_links.push(l);
          }
        });
        links = new_links;
        selected_node = nodes.length ? nodes[i > 0 ? i - 1 : 0] : null;
      } else if (selected_link) { // deal with links
        const i = links.indexOf(selected_link);
        links.splice(i, 1);
        selected_link = links.length ? links[i > 0 ? i - 1 : 0] : null;
      }
      update();
      break;
    }
    case 16: { // shift
      should_drag = true;
      break;
    }
  }
}