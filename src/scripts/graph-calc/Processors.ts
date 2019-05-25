import { ModellingNode } from "../graph-classes/ModellingNode";
import { QueueNode } from "../graph-classes/QueueNode";
import { Matrix } from "../graph-classes/Graph";
import { Calculation } from "./Calculation";

export class Processors {
  public static hasBusyProccessors(list: ModellingNode[]): boolean {
		for (let node of list) {
			if (node.task != null) {
				return true;
			}
		}
		return false;
	}

	public static hasFreeProccessors(list: ModellingNode[]): boolean{
		for (let node of list) {
			if (node.task == null) {
				return true;
			}
		}
		return false;
	}

	public static hasReadyTasks(list: QueueNode[]): boolean {
		for (let node of list) {
			if (node.isReady()) {
				return true;
			}
		}
		return false;
	}

	public static getReadyTask(list: QueueNode[]): QueueNode {
		for (let node of list) {
			if (node.isReady()) {
				return node;
			}
		}
		return null;
  }
  
  public static getProcessor1(list: ModellingNode[]): ModellingNode {
		let result: ModellingNode = null;
		const freeNodes: ModellingNode[] = [];
		for (let node of list) {
			if (node.task == null) {
				freeNodes.push(node);
			}
		}
		if (freeNodes.length > 0) {
      const index = Math.floor((1 + Math.random() * ((freeNodes.length - 1) + 1)) / 1);
      console.log(index); 
			result = freeNodes[index - 1];
		}
		return result;
	}

	public static getProcessor5(list: ModellingNode[], readyTask: QueueNode, graph: Matrix, linesWeight: Matrix): ModellingNode {
		let result: ModellingNode = null;
		if (readyTask.parentNodes.length > 0) {
			const freeNodes: ModellingNode[] = [];
			for (let node of list) {
				if (node.task == null) {
					freeNodes.push(node);
				}
			}
			let count = Number.MAX_SAFE_INTEGER;
			for (let proc of freeNodes) {

				let curCount = 0;
				for (let parentTask of readyTask.parentNodes) {
					curCount += linesWeight[parentTask.id][readyTask.id] * Calculation.dijkstra(graph, list.indexOf(parentTask.processor), list.indexOf(proc)).length;
				}
				if (curCount < count) {
					count = curCount;
					result = proc;
				}
			}
		} else {
			result = this.getProcessor1(list);
		}
		return result;
	}
}