import { GraphSVG } from './graph-ui/graph-simulation';
import { saveToFile, newGraph } from './ui/header';
import { Getters } from './graph-calc/Getters';
import { GraphType } from './graph-classes/Graph';
import { QueueList } from './graph-calc/QueueList';
import { Queue } from './graph-calc/Queue';
declare global {
  interface Window {
    state: any;
  }
}

window.state = {
  width: 1080,
  height: 800,
}

const nodes = [
  { id: 0, weight: 41 },
  { id: 1, weight: 51 },
  { id: 2, weight: 50 },
  { id: 3, weight: 36 },
  { id: 4, weight: 38 },
  { id: 5, weight: 45 },
  { id: 6, weight: 21 },
  { id: 7, weight: 32 },
  { id: 8, weight: 32 },
  { id: 9, weight: 29 },
  { id: 10, weight: 29 },
];
const links = [
  { source: nodes[0], target: nodes[1], id: 0, weight: 1 },
  { source: nodes[0], target: nodes[7], id: 1, weight: 1 },
  { source: nodes[0], target: nodes[9], id: 2, weight: 1 },
  { source: nodes[1], target: nodes[2], id: 3, weight: 1 },
  { source: nodes[6], target: nodes[3], id: 4, weight: 1 },
  { source: nodes[6], target: nodes[8], id: 5, weight: 1 },
  { source: nodes[7], target: nodes[3], id: 6, weight: 1 },
  { source: nodes[7], target: nodes[8], id: 7, weight: 1 },
  { source: nodes[8], target: nodes[2], id: 8, weight: 1 },
  { source: nodes[9], target: nodes[4], id: 9, weight: 1 },
  { source: nodes[9], target: nodes[6], id: 10, weight: 1 },
  { source: nodes[10], target: nodes[0], id: 11, weight: 1 },
]

window.state.graphTS = new GraphSVG(GraphType.GraphTask, links, nodes);

document.querySelectorAll('a.dropdown-item')
  .forEach((el) => {
    el.innerHTML === 'Запис' && el.addEventListener('click', saveToFile);
    el.innerHTML === 'Новий' && el.addEventListener('click', newGraph);
  });

// const matrix1 = Getters.getMatrix(window.state.graphTS);
// console.log(matrix1)
// const nodeWeight = Getters.getWeights(window.state.graphTS)
// console.log('Node wights: ', nodeWeight);
// const linkWeight = Getters.getLinkWeights(window.state.graphTS, 1)
// console.log('link wights: ', linkWeight);

const result = Queue.queue3(window.state.graphTS);
console.log('3: ', result);
const result15 = QueueList.queue15List(window.state.graphTS);
console.log('15: ', result15);
const result12 = QueueList.queue12List(window.state.graphTS);
console.log('12: ', result12);