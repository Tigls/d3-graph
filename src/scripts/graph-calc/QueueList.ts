import { Graph, Matrix } from "../graph-classes/Graph";
import { QueueNode } from "../graph-classes/QueueNode";
import { Calculation } from "./Calculation";
import { Getters } from "./Getters";

export class QueueList {
  public static queue1List(graph: Graph): QueueNode[] {
		const matrix = Getters.getMatrix(graph);
		const weights = Getters.getWeights(graph);
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

  public static queue3List(graph: Graph): QueueNode[]{
		const matrix = Getters.getMatrix(graph);
		const weights = Getters.getWeights(graph);
    const arr: QueueNode[] = [];
    let maxTime = 0;

		for (let i = 0; i < matrix.length; i++) {
			const node = new QueueNode();
			node.criticalTime = Calculation.countTime(matrix, weights, weights[i], i);
			node.id = i;
      node.weight = weights[i];
      maxTime = Math.max(maxTime, node.criticalTime);
			arr[i] = node;
		}
		return this.sortedNodesList(this.getQueueNodeList(arr, matrix), 3);
  }

  public static queue6List(graph: Graph): QueueNode[]{
		const matrix = Getters.getMatrix(graph);
		const weights = Getters.getWeights(graph);
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
		const matrix = Getters.getMatrix(graph);
		const weights = Getters.getWeights(graph);
		const arr: QueueNode[] = [];

		for (let i = 0; i < matrix.length; i++) {
			let sum = 0;
			for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] ? sum += matrix[i][j] : sum;
			}
			const node = new QueueNode();
      node.numOfOut = sum;
			node.id = i;
			node.weight = weights[i];
			arr[i] = node;
		}
		return this.sortedNodesList(this.getQueueNodeList(arr, matrix), 12);
  }

  public static queue15List(graph: Graph): QueueNode[]{
		const matrix = Getters.getMatrix(graph);
		const weights = Getters.getWeights(graph);
		const arr: QueueNode[] = [];
    
		for (let i = 0; i < matrix.length; i++) {
      const node = new QueueNode();
      node.criticalDepth = Calculation.countDepth(matrix, 1, i);
			node.id = i;
			node.weight = weights[i];
			arr[i] = node;
    }
    return this.sortedNodesList(this.getQueueNodeList(arr, matrix), 15);
  }
  
  public static sortedNodesList(list: QueueNode[], algN: number): QueueNode[] {
    switch (algN) {
      case 1:
        return list.sort((a, b) => a.factor1 - b.factor1);
      case 3:
        return list.sort((a, b) => a.criticalTime - b.criticalTime);
      case 6:
        return list.sort((a, b) => a.criticalDepth - b.criticalDepth);
      case 12:
        return list.sort((a, b) => a.numOfOut - b.numOfOut);
      case 15:
        return list.sort((a, b) => a.weight - b.weight);
    }
    // for (let i = 0; i < list.length - 1; i++) {
    //   for (let j = 0; j < list.length - i - 1; j++) {
    //     let flag = false;
        // switch (algN) {
        //   case 1:
        //     flag = (list[j].factor1 <= list[j + 1].factor1);
        //     break;
        //   case 3:
        //     flag = (list[j].criticalTime <= list[j + 1].criticalTime);
        //     break;
        //   case 6:
        //     flag = (list[j].criticalDepth <= list[j + 1].criticalDepth);
        //     break;
        //   case 12:
        //     flag = (list[j].numOfOut <= list[j + 1].numOfOut);
        //     break;
        //   case 15:
        //     flag = list[j].weight <= list[j + 1].weight;
        //     break;
        // }
		// 		if (flag) {
		// 			const temp = list[j];
		// 			list[j] = list[j + 1];
		// 			list[j + 1] = temp;
		// 		}
    //   }
    // }
    // return list;
  }

  public static getQueueNodeList(arr: QueueNode[], matrix: Matrix): QueueNode[] {
    const result = [];
    for (let node of arr) {
      result.push(node);
    }
    for (let i = 0; i < matrix.length; i++) {
      const node = result[i];
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] === 1 && result[j].parentNodes.push(node);
      }
    }
    return result;
  }
}