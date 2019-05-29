import { Graph } from "../graph-classes/Graph";
import { QueueNode } from "../graph-classes/QueueNode";
import { QueueList } from "./QueueList";

export class Queue {
  public static queue1(graph: Graph): string {
		const list = QueueList.queue1List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
			const n: QueueNode = list[i];
			result = result + n.id + "-" + n.factor1.toString() + " --> ";
		}
		return result;
  }
  
  public static queue3(graph: Graph): string {
		const list = QueueList.queue3List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
      const n: QueueNode = list[i];
      if (!result) {
        result = result + "id-крит.час: " + n.id + "-" + n.criticalTime.toString();
      } else {
        result = result + " --> " + n.id + "-" + n.criticalTime.toString();
      }
		}
		return result;
	}

	public static queue6(graph: Graph): string {
		const list: QueueNode[] = QueueList.queue6List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
			const n: QueueNode = list[i];
			result = result + n.id + "-" + n .criticalDepth + " --> ";
		}
		return result;
	}

	public static queue12(graph: Graph): string{
		const list: QueueNode[] = QueueList.queue12List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
      const n: QueueNode = list[i];
			result = result + n.id + "-" + n.numOfOut + " --> ";
		}
		return result;
  }
  
  public static queue15(graph: Graph): string{
		const list: QueueNode[] = QueueList.queue15List(graph);
		let result = "";
		for (let i = 0; i < list.length; i++) {
      const n: QueueNode = list[i];
      if (!result) {
        result = result + "id-вага_вершин: " + n.id + "-" + n.weight;
      } else {
        result = result + " --> " + n.id + "-" + n.weight;
      }
		}
		return result;
	}
}