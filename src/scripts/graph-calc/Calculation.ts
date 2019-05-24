import { Graph, Matrix, GraphType } from "../graph-classes/Graph";
import { Getters } from "./Getters";
import { INode } from "../graph-classes/Node";

export class Calculation {

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

  public static maxTime(graph: Graph, prod: number): number {
    const matrix = Getters.getMatrix(graph);
    const weights = Getters.getWeights(graph);
    for (let i = 0; i < weights.length; i++) {
			weights[i] = Math.ceil(weights[i] / prod);
		}
		let maxTime = 0;
		for (let i = 0; i < matrix.length; i++) {
			maxTime = Math.max(maxTime, this.countTime(matrix, weights, weights[i], i));
		}
		return maxTime;
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
  
  private static isCyclicUtil(i: number, visited: boolean[], recStack: boolean[], graph: Graph): boolean {
    if (recStack[i]) 
      return true; 
    if (visited[i]) 
      return false; 
    visited[i] = true; 
    recStack[i] = true;
    const children = graph.links
      .filter((link) => link.source.id === i)
      .map((link) => link.target.id); 
      
    for (const c of children)
      if (this.isCyclicUtil(c, visited, recStack, graph))
         return true; 
              
    recStack[i] = false;
    return false;
  }

  public static isCyclic(graph: Graph): boolean {
    const visited = []; 
    const recStack = []; 
    for (let i = 0; i < graph.nodes.length; i++) 
      if (this.isCyclicUtil(i, visited, recStack, graph)) 
        return true;
    return false;
	}
	
	public static isConnected(graph: Graph) { 
    if (graph.links.length === 0 && graph.nodes.length === 0)
      return true;
    
    const visited = []; 
		for (let i = 0; i < graph.nodes.length; i++) 
				visited[i] = false; 
    this.DFSUtil(graph, graph.nodes[0].id, visited);
    return !visited.includes(false)
	} 
  
  private static DFSUtil(graph: Graph, vert: number, visited: boolean[]) { 
    if (vert !== undefined) {
      visited[vert] = true;
    }
	
		const neighbours = graph.links
      .filter((link) => link.source.id === vert)
      .map((link) => link.target.id);
	
		for (const i in neighbours) {
      const elem = neighbours[i];
      if (!visited[elem]) 
        this.DFSUtil(graph, elem, visited); 
		} 
	}
}