import * as d3 from '../utils/d3';
import { drag } from './graph-drag';
import { ILink } from '../graph-classes/Link';
import { INode } from '../graph-classes/Node';
import { GraphType, Graph } from '../graph-classes/Graph';
import { Simulation } from 'd3';
import { checkGraph } from '../ui/header';
import { GraphString } from '..';
declare const state: any;
export type HtmlID = '#graphTS' | '#graphCS';

export class GraphSVG extends Graph {
  width = 1080;
  height = 800;
  simulation: Simulation<INode, ILink>;
  svg: any;
  selected_link: ILink;
  selected_node: INode;
  selected_target_node: INode;
  marker: any;
  linesg: any;
  circlesg: any;
  drawing_line: any;
  should_drag: boolean;
  new_line: any;
  htmlId: string;
  htmlType: any;
  constructor(type: GraphType, links:ILink[]=[], nodes:INode[]=[], htmlId: HtmlID) {
    super(type, links, nodes);
    this.htmlId = htmlId;
    this.htmlType = htmlId.slice(1);
    this.init();
  }
  
  init() {
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force("link", d3.forceLink(this.links).distance(200))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    const svg = d3.select(this.htmlId);
    this.svg = svg;
    this.initialGraph();
    this.update();
    this.update();
    d3.select(this.htmlId)
      .on("mousemove", this.mousemove.bind(this))
      .on("mousedown", this.mousedown.bind(this))
      .on("mouseup", this.mouseup.bind(this));
    d3.select(window)
      .on("keydown", this.keydown.bind(this))
      .on("keyup", this.keyup.bind(this));
    return this.svg.node();
  }

  initialGraph() {
    this.linesg = this.svg.append("g")
      .attr("class", "links")
    
    this.marker = this.svg.append("defs")
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
    
    this.circlesg = this.svg.append("g")
      .attr("class", "nodes")
  }

  update() {
    const link = this.linesg
      .selectAll("line")
      .data(this.links, (d) => d.id);
    link
      .enter()
      .append("line")
      .attr("stroke-width", 3)
      .attr("stroke", "#666666")
      .on("mousedown", this.line_mousedown.bind(this));
    link
      .exit()
      .remove();

    d3.selectAll("line").attr("marker-end", "url(#triangle)");

    const node = this.circlesg
      .selectAll("g")
      .data(this.nodes, (d) => d.id);
    const nodeg = node
      .enter()
      .append("g")
      .call(drag(this.simulation))
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
    const circles = nodeg
      .append("circle")
      .attr("r", 25)
      .attr("class", "circle")
      .style("stroke", '#666666')
      .style('stroke-width', '3')
      .style('fill', '#1d1f20')
      .on("mousedown", this.node_mousedown.bind(this))
      .on("mouseover", this.node_mouseover.bind(this))
      .on("mouseout", this.node_mouseout.bind(this));
    const lables = nodeg
      .append("text")
      .text(d => `node ${d.id}`)
      .classed("unselectable", true)
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

    this.simulation.nodes(this.nodes);
    this.simulation.on("tick", ticked);
    this.simulation.tick(50);
    this.simulation.force("center", null);
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

  mousemove() {
    if (this.drawing_line && !this.should_drag && this.selected_node) {
      const m = d3.mouse(this.svg.node());
      const x = Math.max(0, Math.min(this.width, m[0]));
      const y = Math.max(0, Math.min(this.height, m[1]));
      // debounce - only start drawing line if it gets a bit big
      const dx = this.selected_node.x - x;
      const dy = this.selected_node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) > 10) {
        // draw a line
        if (!this.new_line) {
          this.new_line = this.linesg
            .append("line")
            .attr("stroke-width", 3)
            .attr("stroke", "#666666");
        }
        this.new_line
          .attr("x1", (d) => this.selected_node.x)
          .attr("y1", (d) => this.selected_node.y)
          .attr("x2", (d) => x)
          .attr("y2", (d) => y);
      }
    }
  }

  // add a new disconnected node
  mousedown() {
    this.simulation.stop();
    const m = d3.mouse(d3.select(this.htmlId).node())
    this.nodes.push({ 
      index: this.nodes.length,
      x: m[0],
      y: m[1],
      id: this.nodes.length,
      weight: 1
    });
    this.selected_link = null;
    this.update();
    this.update();
    checkGraph(this.htmlType);
  }

  node_mouseover(d) {
    if (this.drawing_line && d !== this.selected_node) {
      // highlight and select target node
      this.selected_target_node = d;
    }
  }

  node_mouseout(d) {
    if (this.drawing_line) {
      this.selected_target_node = null;
    }
  }

  // select node / start drag
  node_mousedown(d) {
    if (!this.drawing_line) {
      this.selected_node = d;
      this.selected_link = null;
    }
    if (!this.should_drag) {
      d3.event.stopPropagation();
      this.drawing_line = true;
    }
    d.fixed = true;
    this.simulation.stop()
    this.update();
    this.update();
  }

  // select line
  line_mousedown(d) {
    this.selected_link = d;
    this.selected_node = null;
    this.update();
    this.update();
  }

  // end node select / add new connected node
  mouseup() {
    this.drawing_line = false;
    let new_node: INode;
    if (this.new_line) {
      if (this.selected_target_node) {
        this.selected_target_node.fixed = false;
        new_node = this.selected_target_node;
      } else {
        const m = d3.mouse(this.svg.node());
        new_node = {
          index: this.nodes.length,
          x: m[0],
          y: m[1],
          id: this.nodes.length,
          weight: 1,
        }
        this.nodes.push(new_node);
      }
      this.selected_node.fixed = false;
      this.links.push({
        source: this.selected_node,
        target: new_node,
        id: this.links.length,
        index: this.links.length,
        weight: 1
      })
      this.selected_node = this.selected_target_node = null;
      this.new_line.remove();
      this.new_line = null;
      this.simulation.restart()
      this.update();
      this.update();
      checkGraph(this.htmlType);
      // setTimeout(function () {
      //   this.new_line.remove();
      //   this.new_line = null;
      //   this.simulation.restart();
      // }, 300);
    }
  }

  keyup() {
    switch (d3.event.keyCode) {
      case 16: { // shift
        this.should_drag = false;
        this.update();
        this.update();
        checkGraph(this.htmlType);
        // this.simulation.restart();
      }
    }
  }

  // select for dragging node with shift; delete node with backspace
  keydown() {
    switch (d3.event.keyCode) {
      case 8: // backspace
      case 46: { // delete
        if (this.selected_node) { // deal with nodes
          const i = this.nodes.indexOf(this.selected_node);
          this.nodes.splice(i, 1);
          // find links to/from this node, and delete them too
          const new_links: ILink[] = [];
          this.links.forEach(l => {
            if (l.source !== this.selected_node && l.target !== this.selected_node) {
              new_links.push(l);
            }
          });
          this.links = new_links;
          this.selected_node = null;
        } 
        // else if (this.selected_link) { // deal with links
        //   const i = this.links.indexOf(this.selected_link);
        //   this.links.splice(i, 1);
        //   this.selected_link = this.links.length ? this.links[i > 0 ? i - 1 : 0] : null;
        // }
        this.update();
        this.update();
        break;
      }
      case 16: { // shift
        this.should_drag = true;
        break;
      }
    }
  }

  clear() {
    d3.select(this.htmlId).selectAll("*").remove();
  }
}