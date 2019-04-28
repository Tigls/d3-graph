import * as d3 from '../utils/d3';
import { drag } from './graph-drag';
declare const state: any;

export const graph = (data) => {
 
  const width = 1080;
  const height = 800;

  if (data) {
    state.links = data.links.map(d => Object.create(d));
    state.nodes = data.nodes.map(d => Object.create(d));
  }
  
  state.simulation = d3
    .forceSimulation(state.nodes)
    .force("link", d3.forceLink(state.links).distance(100))
    .force("charge", d3.forceManyBody().strength(-70))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.select('svg');
  state.svg = svg;
  initialGraph();
  console.log('Before update: ', state);
  update();
  update();
  console.log('After update:', state);
  d3.select('svg')
    .on("mousemove", mousemove)
    .on("mousedown", mousedown)
    .on("mouseup", mouseup);
  d3.select(window)
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
  
  state.circlesg = state.svg.append("g")
    .attr("class", "nodes")
}

function update() {
  const link = state.linesg
    .selectAll("line")
    .data(state.links);
  link
    .enter()
    .append("line")
    .attr("stroke-width", 3)
    .attr("stroke", "#666666")
    .on("mousedown", line_mousedown);
  link
    .exit()
    .remove();

  d3.selectAll("line").attr("marker-end", "url(#triangle)");

  const node = state.circlesg
    .selectAll("g")
    .data(state.nodes);
  const nodeg = node
    .enter()
    .append("g")
    .call(drag(state.simulation))
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
  const circles = nodeg
    .append("circle")
    .attr("r", 25)
    .attr("class", "circle")
    .style("stroke", '#666666')
    .style('stroke-width', '3')
    .style('fill', '#1d1f20')
    .on("mousedown", node_mousedown)
    .on("mouseover", node_mouseover)
    .on("mouseout", node_mouseout);
  const lables = nodeg
    .append("text")
    .text(d => `node ${d.id}`)
    .style("fill", "#666666")
    .style("font-weight", "600")
    .style("text-transform", "uppercase")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle")
    .style("font-size", "10px")
    .style("font-family", "cursive")
  node
    .exit()
    .remove();

  state.simulation.nodes(state.nodes);
  state.simulation.on("tick", ticked);
  state.simulation.tick(50);
  state.simulation.force("center", null);
  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
  };
}

function mousemove() {
  if (state.drawing_line && !state.should_drag && state.selected_node) {
    const m = d3.mouse(state.svg.node());
    const x = Math.max(0, Math.min(state.width, m[0]));
    const y = Math.max(0, Math.min(state.height, m[1]));
    // debounce - only start drawing line if it gets a bit big
    const dx = state.selected_node.x - x;
    const dy = state.selected_node.y - y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      // draw a line
      if (!state.new_line) {
        state.new_line = state.linesg
          .append("line")
          .attr("stroke-width", 3)
          .attr("stroke", "#666666");
      }
      state.new_line
        .attr("x1", (d) => state.selected_node.x)
        .attr("y1", (d) => state.selected_node.y)
        .attr("x2", (d) => x)
        .attr("y2", (d) => y);
    }
    update();
    update();
  }
}

// add a new disconnected node
function mousedown() {
  state.simulation.stop();
  const m = d3.mouse(d3.select('svg').node())
  state.nodes.push({ 
    index: state.nodes.length,
    x: m[0],
    y: m[1],
  });
  state.selected_link = null;
  update();
  update();
  console.log('After Mouse Down: ', state);
}

function node_mouseover(d) {
  if (state.drawing_line && d !== state.selected_node) {
    // highlight and select target node
    state.selected_target_node = d;
  }
}

function node_mouseout(d) {
  if (state.drawing_line) {
    state.selected_target_node = null;
  }
}

// select node / start drag
function node_mousedown(d) {
  if (!state.drawing_line) {
    state.selected_node = d;
    state.selected_link = null;
  }
  if (!state.should_drag) {
    d3.event.stopPropagation();
    state.drawing_line = true;
  }
  d.fixed = true;
  state.simulation.stop()
  update();
  update();
}

// select line
function line_mousedown(d) {
  state.selected_link = d;
  state.selected_node = null;
  update();
  update();
}

// end node select / add new connected node
function mouseup() {
  state.drawing_line = false;
  let new_node;
  if (state.new_line) {
    if (state.selected_target_node) {
      state.selected_target_node.fixed = false;
      new_node = state.selected_target_node;
    } else {
      const m = d3.mouse(state.svg.node());
      new_node = {
        index: state.nodes.length,
        x: m[0],
        y: m[1],
      }
      state.nodes.push(new_node);
    }
    state.selected_node.fixed = false;
    state.links.push({source: state.selected_node, target: new_node})
    state.selected_node = state.selected_target_node = null;
    update();
    update();
    state.new_line.remove();
    state.new_line = null;
    state.simulation.restart()
    // setTimeout(function () {
      // state.new_line.remove();
      // state.new_line = null;
    //   state.simulation.restart();
    // }, 300);
  }
}

function keyup() {
  switch (d3.event.keyCode) {
    case 16: { // shift
      state.should_drag = false;
      update();
      update();
      // state.simulation.restart();
    }
  }
}

// select for dragging node with shift; delete node with backspace
function keydown() {
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      if (state.selected_node) { // deal with nodes
        const i = state.nodes.indexOf(state.selected_node);
        state.nodes.splice(i, 1);
        // find links to/from this node, and delete them too
        const new_links = [];
        state.links.forEach(l => {
          if (l.source !== state.selected_node && l.target !== state.selected_node) {
            new_links.push(l);
          }
        });
        state.links = new_links;
        state.selected_node = state.nodes.length ? state.nodes[i > 0 ? i - 1 : 0] : null;
      } else if (state.selected_link) { // deal with links
        const i = state.links.indexOf(state.selected_link);
        state.links.splice(i, 1);
        state.selected_link = state.links.length ? state.links[i > 0 ? i - 1 : 0] : null;
      }
      update();
      update();
      break;
    }
    case 16: { // shift
      state.should_drag = true;
      break;
    }
  }
}