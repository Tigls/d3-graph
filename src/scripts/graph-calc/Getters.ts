import { Graph, GraphType, Matrix } from "../graph-classes/Graph";

export class Getters {
  
  public static getMatrix(graph: Graph): Matrix {
    const matrix = new Array(graph.nodes.length);
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(graph.nodes.length)
    }
    for (let link of graph.links) {
      const source = graph.nodes.indexOf(link.source)
      const target = graph.nodes.indexOf(link.target)
      matrix[source][target] = 1;
      if (graph.type === GraphType.GraphCS) {
        matrix[target][source] = 1;
      }
    }
    return matrix;
  }

  public static getWeights(graph: Graph): Array<number> {
    const arr = new Array(graph.nodes.length);
    for (let node of graph.nodes) {
      arr[graph.nodes.indexOf(node)] = node.weight;
    }
    return arr;
  }

  public static getLinkWeights(graph: Graph, prodLinks: number): Matrix {
    const nodesList = graph.nodes;
    const size = nodesList.length;
    const arr: Matrix = new Array(size);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(size);
    }
    for (let link of graph.links) {
      const source = graph.nodes.indexOf(link.source)
      const target = graph.nodes.indexOf(link.target)
      arr[source][target] = Math.ceil(link.weight / prodLinks);
    }
    return arr;
  }
}