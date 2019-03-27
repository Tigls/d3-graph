import { graph } from './graph-ui/graph-simulation';

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