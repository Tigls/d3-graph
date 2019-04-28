import { GraphSVG } from './graph-ui/graph-simulation';
import { saveToFile, newGraph } from './ui/header';
import { Getters } from './graph-calc/Getters';
import { GraphType } from './graph-classes/Graph';
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
  { id: 0, weight: 1 },
  { id: 1, weight: 1 },
  { id: 2, weight: 1 },
  { id: 3, weight: 1 }
];
const links = [
  { source: nodes[0], target: nodes[1], id: 0, weight: 1 },
  { source: nodes[0], target: nodes[2], id: 1, weight: 1 }
]


window.state.graphTS = new GraphSVG(GraphType.GraphTask, links, nodes);

document.querySelectorAll('a.dropdown-item')
  .forEach((el) => {
    el.innerHTML === 'Запис' && el.addEventListener('click', saveToFile);
    el.innerHTML === 'Новий' && el.addEventListener('click', newGraph);
  });

const matrix1 = Getters.getMatrix(window.state.graphTS);
console.table(matrix1)