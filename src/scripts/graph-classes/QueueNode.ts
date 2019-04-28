import { Node } from "./Node";
import { ModellingNode } from "./ModellingNode";

export class QueueNode extends Node {
  criticalDepth: number;
  criticalTime: number;
  numOfOut: number;
  factor1: number;

  parentNodes: QueueNode[] = []; // QueueNodes
  processor: ModellingNode; // ModellingNode

  finished: boolean;

  startTime: number;
  endTime: number;

  isReady() {
    for (let node of this.parentNodes) {
      if (!node.finished) {
        return false;
      }
    }
    return true;
  }
} 