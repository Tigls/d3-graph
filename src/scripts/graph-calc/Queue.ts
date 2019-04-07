import { Graph } from "../graph-classes/Graph";
import { QueueNode } from "../graph-classes/QueueNode";
import { QueueList } from "./queueList";

export class Queue {
  public static queue1(graph: Graph): string {
		const list = QueueList.queue1List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
			const n: QueueNode = list[i];
			result = result + (n.id + 1) + "(" + n.factor1.toString() + "), ";
		}
		return result;
	}

	public static queue6(graph: Graph): string {
		const list: QueueNode[] = QueueList.queue6List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
			const n: QueueNode = list[i];
			result = result + (n.id + 1) + "(" + n .criticalDepth + "), ";
		}
		return result;
	}

	public static queue12(graph: Graph): string{
		const list: QueueNode[] = QueueList.queue6List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
      const n: QueueNode = list[i];
			result = result + (n.id + 1) + "(" + n.numOfOut + "), ";
		}
		return result;
	}
}