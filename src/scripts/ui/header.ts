import { saveAs } from 'file-saver';
import { GraphSVG } from '../graph-ui/graph-simulation';
import { GraphType } from '../graph-classes/Graph';
declare const state: any;

export function saveToFile() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type : 'application/json'});
  const url = URL.createObjectURL(blob);
  saveAs(url);
}

export function newGraph() {
  state.graphTS.clear();
  state.graphTS = new GraphSVG(GraphType.GraphTask);
}