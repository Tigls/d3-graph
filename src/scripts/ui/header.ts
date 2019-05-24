import { saveAs } from 'file-saver';
import { GraphSVG } from '../graph-ui/graph-simulation';
import { GraphType } from '../graph-classes/Graph';
import * as d3 from '../utils/d3';
import { GraphString } from '../index';
import { Calculation } from '../graph-calc/Calculation';
declare const state: any;

export function saveToFile() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type : 'application/json'});
  const url = URL.createObjectURL(blob);
  saveAs(url);
}

export function newGraph() {
  state.graphTS.clear();
  state.graphTS = new GraphSVG(GraphType.GraphTask, [], [], '#graphTS');
}

export function toggleGraph() {
  const graphs = document.querySelectorAll('svg');
  let graphShownId;
  if (graphs[0].classList.contains('hidden')) {
    graphs[0].classList.remove('hidden');
    graphs[1].classList.add('hidden');
    graphShownId = graphs[0].id;
  } else {
    graphs[1].classList.remove('hidden');
    graphs[0].classList.add('hidden');
    graphShownId = graphs[1].id;
  }
  const graphShown = window.state[graphShownId];
  d3.select(window)
    .on("keydown", graphShown.keydown.bind(graphShown))
    .on("keyup", graphShown.keyup.bind(graphShown));
  checkGraph(graphShownId);
}

function showHideElem(id) {
  const els = document.querySelectorAll(`.checks`);
  els.forEach((el) => { !el.classList.contains('d-none') && el.classList.add('d-none')})
  const el = document.querySelector(id);
  el.classList.remove('d-none');
}

export function checkGraph(graphType: GraphString) {
  if (graphType === 'graphTS') {
    const isCyclic = Calculation.isCyclic(window.state.graphTS);
    isCyclic ? showHideElem('#hasCycleGraph') : showHideElem('#acyclicGraph');
  } else {
    const isConnected = Calculation.isConnected(window.state.graphCS);
    isConnected ? showHideElem('#adjacentGraph') : showHideElem('#nonAdjacentGraph');
  }
}