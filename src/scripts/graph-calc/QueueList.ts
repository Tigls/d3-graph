import { Graph, GraphType, Matrix } from "../graph-classes/Graph";
import { Node } from "../graph-classes/Node";
import { Link } from "../graph-classes/Link";
import { ModellingNode } from "../graph-classes/ModellingNode";
import { ModellingLink } from "../graph-classes/ModellingLink";
import { QueueNode } from "../graph-classes/QueueNode";
import { Calculation } from "./Calculation";

export class QueueList {
  public static queue1List(graph: Graph): QueueNode[] {
		const matrix = Calculation.getMatrix(graph);
		const weights = Calculation.getWeights(graph);
		const arr: QueueNode[] = [];
		let maxDepth = 0;
		let maxTime = 0;
    
    for (let i = 0; i < matrix.length; i++) {
			const node = new QueueNode();
			node.criticalDepth = Calculation.countDepth(matrix, 1, i);
			node.criticalTime = Calculation.countTime(matrix, weights, weights[i], i);
			node.id = i;
			node.weight = weights[i];
			maxDepth = Math.max(maxDepth, node.criticalDepth);
			maxTime = Math.max(maxTime, node.criticalTime);
			arr[i] = node;
		}
		for (let i = 0; i < arr.length; i++) {
			const node = arr[i];
			node.factor1 = node.criticalDepth / maxDepth + node.criticalTime / maxTime;
		}
		return this.sortedNodesList(this.getQueueNodeList(arr, matrix), 1);
  }

  public static queue6List(graph: Graph): QueueNode[]{
		const matrix = Calculation.getMatrix(graph);
		const weights = Calculation.getWeights(graph);
		const arr: QueueNode[] = [];

		for (let i = 0; i < matrix.length; i++) {
			const node = new QueueNode();
			node.criticalDepth = Calculation.countDepth(matrix, 1, i);
			node.id = i;
			node.weight = weights[i];
			arr[i] = node;
		}
		return this.sortedNodesList(this.getQueueNodeList(arr, matrix), 6);
  }
  
  public static queue12List(graph: Graph): QueueNode[]{
		const matrix = Calculation.getMatrix(graph);
		const weights = Calculation.getWeights(graph);
		const arr: QueueNode[] = [];

		for (let i = 0; i < matrix.length; i++) {
			let sum = 0;
			for (let j = 0; j < matrix[i].length; j++) {
				sum += matrix[i][j];
			}
			const node = new QueueNode();
			node.numOfOut = sum;
			node.id = i;
			node.weight = weights[i];
			arr[i] = node;
		}
		return this.sortedNodesList(this.getQueueNodeList(arr, matrix), 12);
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
}