import { graph } from './graph-ui/graph-simulation';

let selected_node;
let selected_target_node;
let selected_link; 
let new_line;
let circlesg; 
let linesg;
let should_drag = false;
let drawing_line = false;

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