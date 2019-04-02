import { graph } from './graph-ui/graph-simulation';

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