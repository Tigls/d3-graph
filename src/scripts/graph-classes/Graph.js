export class Graph {
  nodesList = [];
  linksList = [];
  startNode;
  currentLink;
  type;
  fileName;
  constructor(type) {
    this.graphType = type;
  }
}