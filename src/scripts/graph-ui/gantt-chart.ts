import { ModellingNode } from "../graph-classes/ModellingNode";
import * as d3 from '../utils/d3';

export class GanttChart {
  width = 600;
  height = 250;
  svg: any;
  htmlId: string;
  model: ModellingNode[];
  dataX = [];
  dataY = [];
  barGroups;

  constructor (model: ModellingNode[], htmlId) {
    this.htmlId = htmlId;
    this.init(model);
  }

  init(model: ModellingNode[]) {
    this.model = model;
    const margin = [20,50,20,70]; // In clock direction
    const realHeight = this.height - (margin[0] + margin[2]);
    const realWidth = this.width - (margin[1] + margin[3]);

    const data = this.handleData();
    const axY = [...new Set(data.map((el) => el.y))];
    const axX = data.map((el) => el.end);

    d3.select(this.htmlId)
      .select("svg")
      .remove()
    d3.select(this.htmlId)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
      
    this.svg = d3.select(this.htmlId)
      .select('svg');

    const scale_Y = d3.scaleBand()
      .domain(axY)
      .range([realHeight, 0])
      // .padding(0.1);
    const y_axis = d3.axisLeft()
      .scale(scale_Y);
    this.svg.append("g")
      .attr("class", "axisLight")
      .attr("transform", `translate(${margin[3]}, ${margin[0]})`)
      .call(y_axis);

    const scale_X = d3.scaleLinear()
      .domain([0, d3.max(axX)])
      .range([0, realWidth]);
    const x_axis = d3.axisBottom()
      .scale(scale_X);
    this.svg.append("g")
      .attr("class", "axisLight")
      .attr("transform", `translate(${margin[3]}, ${this.height-margin[2]})`)
      .call(x_axis);

    this.barGroups = this.svg
      .append('g');
    const barGroup = this.barGroups
      .selectAll('.bar')
      .remove()
      .exit()
      .data(data)
      .enter()
      .append('g')
      .attr("transform", d => `translate(${scale_X(d.x)+margin[3]}, ${scale_Y(d.y)+margin[0]+margin[2]})`);
    const bar = barGroup
      .append('rect')
      .attr('class', 'bar')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('height', d => 10)
      .attr('width', d => scale_X(d.width))
      .attr("transform", d => `translate(1, 0)`);

    const lables = barGroup
      .append("text")
      .text(d => `task ${d.taskName}`)
      .style("fill", "#666666")
      .style("font-weight", "600")
      .style("text-anchor", "middle")
      .style("text-transform", "uppercase")
      .style("alignment-baseline", "middle")
      .style("font-size", "7px")
      .style("font-family", "cursive")
      .attr("transform", d => `translate(17, -6)`);
  }

  handleData() {
    return this.model.reduce((acc, el) => {
      const procName = el.id;
      const items = el.finishedTasks.map((task) => ({
        x: task.startTime,
        y: procName,
        width: task.endTime - task.startTime,
        heigth: 10,
        end: task.endTime,
        taskName: task.id
      }));
      return acc.concat(items);
    }, []);
  }

}