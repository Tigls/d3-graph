import { graph } from './graph-ui/graph-simulation';
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
  should_drag: false,
  drawing_line: false,
  selected_node: undefined,
  selected_target_node: undefined,
  selected_link: undefined,
  new_line: undefined,
  circlesg: undefined,
  linesg: undefined,
}

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

graph(data);

document.querySelectorAll('a.dropdown-item')
  .forEach((el) => {
    el.innerHTML === 'Запис' && el.addEventListener('click', saveToFile);
    el.innerHTML === 'Новий' && el.addEventListener('click', newGraph);
  });

const graph1 = Getters.getGraph(window.state.nodes, window.state.links, GraphType.GraphTask);
console.log(graph1);
const matrix1 = Getters.getMatrix(graph1);
console.log(matrix1)