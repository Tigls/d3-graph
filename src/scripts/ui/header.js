import { saveAs } from '../utils/FileSaver';
import { graph } from '../graph-ui/graph-simulation';

export function saveToFile() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type : 'application/json'});
  const url = URL.createObjectURL(blob);
  saveAs(url);
}

export function newGraph() {
  state.links = [];
  state.nodes = [];
  graph();
}