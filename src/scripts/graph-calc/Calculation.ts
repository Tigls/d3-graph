import { Graph, GraphType, Matrix } from "../graph-classes/Graph";
import { Node } from "../graph-classes/Node";
import { Link } from "../graph-classes/Link";
import { ModellingNode } from "../graph-classes/ModellingNode";
import { ModellingLink } from "../graph-classes/ModellingLink";
import { QueueNode } from "../graph-classes/QueueNode";

export class Calculation {
  public static getMatrix(graph: Graph): Matrix {
    const matrix = new Array(graph.nodesList.length);
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(graph.nodesList.length)
    }
    for (let link of graph.linksList) {
      const source = graph.nodesList.indexOf(link.source)
      const target = graph.nodesList.indexOf(link.target)
      matrix[source][target] = 1;
      if (graph.type === GraphType.GraphCS) {
        matrix[target][source] = 1;
      }
    }
    return matrix;
  }

  public static getWeights(graph: Graph): Array<number> {
    const arr = new Array(graph.nodesList.length);
    for (let node of graph.nodesList) {
      arr[graph.nodesList.indexOf(node)] = node.weight;
    }
    return arr;
  }

  public static getLinkWeights(graph: Graph, prodLinks: number): Matrix {
    const nodesList = graph.nodesList;
    const size = nodesList.length;
    const arr: Matrix = new Array(size);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(size);
    }
    for (let link of graph.linksList) {
      const source = graph.nodesList.indexOf(link.source)
      const target = graph.nodesList.indexOf(link.target)
      arr[source][target] = Math.ceil(link.weight / prodLinks);
    }
    return arr;
  }

  public static hasRoute(matrix: Matrix, from: number, to: number, isCycle: boolean): boolean {
    if(from != to && from >= 0 && from < matrix.length && to >= 0 && to < matrix.length) {
      if (matrix[from][to] === 1) {
        return true;
      } else {
        if (isCycle) {
          matrix[from][to] === 1
        }
        // if (isCycle) {
				// 	matrix[from][to] = 0;
				// }
        return this.hasCycle(matrix, 0, (isCycle ? to : from), to) ;
      }
    }
    return true;
  }

  public static hasCycle(matrix: Matrix, depth: number, current: number, to: number): boolean{
		let result = false;

		if (to == current && depth != 0) {
			result = true;
		} else if (depth < matrix.length) {
			for (let m = 0; m < matrix.length; m++) {
				if (matrix[current][m] == 1) {
					matrix[current][m] = 0;
					result = this.hasCycle(matrix, depth + 1, m, to);
					matrix[current][m] = 1;
					if (result) {
						break;
					}
				}
			}
		}
		return result;
	}

  public static countDepth(matrix: Matrix, currentDepth: number, current: number): number {
    const depth = currentDepth;
    for (let i = 0; i < matrix[current].length; i++) {
      if (matrix[current][i] === 1) {
        currentDepth = Math.max(currentDepth, this.countDepth(matrix, depth + 1, i));
      }
    }
    return currentDepth;
  }

  public static countTime(matrix: Matrix, weights: Array<number>, currentTime: number, current: number): number {
    const time = currentTime;
    for (let i = 0; i < matrix[current].length; i++) {
      if (matrix[current][i] === 1) {
        currentTime = Math.max(currentTime, this.countTime(matrix, weights, time + weights[i], i));
      }
    }
    return currentTime;
  }

  public static sortedNodesList(list: QueueNode[], algN: number): QueueNode[] {
    for (let i = 0; i < list.length - 1; i++) {
      for (let j = 0; j < list.length - i - 1; j++) {
        let flag = false;
				if (algN == 1) {
					flag = (list[j].factor1 <= list[j + 1].factor1);
				} else if (algN == 6) {
					flag = (list[j].criticalDepth <= list[j + 1].criticalDepth);
				} else if (algN == 12) {
					flag = (list[j].numOfOut <= list[j + 1].numOfOut);
				}
				if (flag)
				{
					const temp = list[j];
					list[j] = list[j + 1];
					list[j + 1] = temp;
				}
      }
    }
    return list;
  }

  public static getQueueNodeList(arr: QueueNode[], matrix: Matrix): QueueNode[] {
    const result = [];
    for (let node of arr) {
      result.push(node);
    }
    for (let i = 0; i < matrix.length; i++) {
      const node = result[i];
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          result[j].parentNodes.push(node);
        }
      }
    }
    return result;
  }

  public static maxTime(graph: Graph, prod: number): number {
    const matrix = this.getMatrix(graph);
    const weights = this.getWeights(graph);
    for (let i = 0; i < weights.length; i++) {
			weights[i] = Math.ceil(weights[i] / prod);
		}
		let maxTime = 0;
		for (let i = 0; i < matrix.length; i++) {
			maxTime = Math.max(maxTime, this.countTime(matrix, weights, weights[i], i));
		}
		return maxTime;
  }

  public static dijkstra(graph: Matrix, src: number, dst: number): Array<number> {
		let size = graph.length;
		const dist = [];
		let list: Matrix;
		for (let i = 0; i < size; i++) {
			list.push([]);
		}
		const sptSet: Array<boolean> = [];
		for (let i = 0; i < size; i++)
		{
			dist[i] = Number.MAX_SAFE_INTEGER;
			sptSet[i] = false;
		}
		dist[src] = 0;

		for (let count = 0; count < size-1; count++)
		{
			let u = this.minDistance(dist, sptSet);
			sptSet[u] = true;
			for (let v = 0; v < size; v++)
				if (!sptSet[v] && graph[u][v]!=0 &&
				dist[u] != Number.MAX_SAFE_INTEGER &&
				dist[u]+graph[u][v] < dist[v]) {
					dist[v] = dist[u] + graph[u][v];
					const l: Array<number> = list[v];
					Array.prototype.push.apply(l, list[u]);
					l.push(u);
					list[v] = l;
				}
		}
		const result: Array<number> = list[dst];
		result.push(dst);
		return result;
	}

	private static minDistance(dist: Array<number>, sptSet: Array<boolean>): number {
		let min = Number.MAX_SAFE_INTEGER;
		let min_index = -1;

		for (let v = 0; v < dist.length; v++)
			if (sptSet[v] === false && dist[v] <= min)
			{
				min = dist[v];
				min_index = v;
			}
		return min_index;
	}
}