import { GraphSVG } from './graph-ui/graph-simulation';
import { saveToFile, newGraph, toggleGraph, stringQueue } from './ui/header';
import { GraphType } from './graph-classes/Graph';
import { modeling } from './graph-calc/Modelling';
import { GanttChart } from './graph-ui/gantt-chart';
export type GraphString = 'graphTS' | 'graphCS';
declare global {
  interface Window {
    state: any;
  }
}

window.state = {
  width: 1080,
  height: 800,
}

// const nodes = [
//   { id: 0, weight: 41 },
//   { id: 1, weight: 51 },
//   { id: 2, weight: 50 },
//   { id: 3, weight: 36 },
//   { id: 4, weight: 38 },
//   { id: 5, weight: 45 },
//   { id: 6, weight: 21 },
//   { id: 7, weight: 32 },
//   { id: 8, weight: 32 },
//   { id: 9, weight: 29 },
//   { id: 10, weight: 29 },
// ];
// const links = [
//   { source: nodes[0], target: nodes[1], id: 0, weight: 1 },
//   { source: nodes[0], target: nodes[7], id: 1, weight: 1 },
//   { source: nodes[0], target: nodes[9], id: 2, weight: 1 },
//   { source: nodes[1], target: nodes[2], id: 3, weight: 1 },
//   { source: nodes[6], target: nodes[3], id: 4, weight: 1 },
//   { source: nodes[6], target: nodes[8], id: 5, weight: 1 },
//   { source: nodes[7], target: nodes[3], id: 6, weight: 1 },
//   { source: nodes[7], target: nodes[8], id: 7, weight: 1 },
//   { source: nodes[8], target: nodes[2], id: 8, weight: 1 },
//   { source: nodes[9], target: nodes[4], id: 9, weight: 1 },
//   { source: nodes[9], target: nodes[6], id: 10, weight: 1 },
//   { source: nodes[10], target: nodes[0], id: 11, weight: 1 },
// ]

// const nodesCS = [
//   { id: 0, weight: 1 },
//   { id: 1, weight: 1 },
//   { id: 2, weight: 1 },
//   { id: 3, weight: 1 },
// ];
// const linksCS = [
//   { source: nodesCS[0], target: nodesCS[1], id: 0, weight: 1 },
//   { source: nodesCS[2], target: nodesCS[1], id: 1, weight: 1 },
//   { source: nodesCS[3], target: nodesCS[2], id: 2, weight: 1 },
//   { source: nodesCS[3], target: nodesCS[0], id: 3, weight: 1 },
// ]

const nodes = [
  { id: 0, weight: 1 },
  { id: 1, weight: 2 },
  { id: 2, weight: 3 },
  { id: 3, weight: 4 },
  { id: 4, weight: 5 },
  { id: 5, weight: 5 },
];
const links = [
  { source: nodes[0], target: nodes[4], id: 0, weight: 1 },
  { source: nodes[1], target: nodes[4], id: 1, weight: 1 },
  { source: nodes[2], target: nodes[4], id: 2, weight: 1 },
  { source: nodes[3], target: nodes[4], id: 3, weight: 1 },
  { source: nodes[5], target: nodes[4], id: 4, weight: 1 },
]

const nodesCS = [
  { id: 0, weight: 1 },
  { id: 1, weight: 1 },
  { id: 2, weight: 1 },
  { id: 3, weight: 1 },
  { id: 4, weight: 1 },
];
const linksCS = [
  { source: nodesCS[0], target: nodesCS[1], id: 0, weight: 4 },
  { source: nodesCS[1], target: nodesCS[2], id: 1, weight: 2 },
  { source: nodesCS[2], target: nodesCS[3], id: 2, weight: 6 },
  { source: nodesCS[3], target: nodesCS[4], id: 3, weight: 5 },
]

window.state.graphCS = new GraphSVG(GraphType.GraphCS, linksCS, nodesCS, '#graphCS');
window.state.graphTS = new GraphSVG(GraphType.GraphTask, links, nodes, '#graphTS');

const model = modeling(window.state.graphTS, window.state.graphCS, 3, 1)
console.log(model);
window.state.model1 = new GanttChart(model, '#gantt');

document.querySelectorAll('a.dropdown-item')
  .forEach((el) => {
    el.innerHTML === 'Запис' && el.addEventListener('click', saveToFile);
    el.innerHTML === 'Новий' && el.addEventListener('click', newGraph);
  });

document.querySelectorAll('label.btn-secondary')
  .forEach((el) => {
    el.addEventListener('click', toggleGraph);
  })

document.querySelector('#queue').innerHTML = stringQueue(window.state.graphTS, 3);
document.querySelectorAll('input[name=queuAlgo]')
  .forEach((el) => {
    el.addEventListener('change', () => {
      const checkedRadio = document.querySelector('input[name=queuAlgo]:checked').value;
      document.querySelector('#queue').innerHTML = stringQueue(window.state.graphTS, Number(checkedRadio)); 
    });
  });

document.querySelectorAll('input[name=assignAlgo]')
  .forEach((el) => {
    el.addEventListener('change', () => {
      const checkedRadioQueue = document.querySelector('input[name=queuAlgo]:checked').value;
      const checkedRadioAssign = document.querySelector('input[name=assignAlgo]:checked').value;
      const model = modeling(window.state.graphTS, window.state.graphCS, Number(checkedRadioQueue), Number(checkedRadioAssign))
      window.state.model1.init(model);
    });
  });
