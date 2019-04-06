import { Node } from "./node";

export class QueueNode extends Node {
  criticalDepth;
  criticalTime;
  numOfOut;
  factor1;

  parentNodes = []; // QueueNodes
  processor; // ModellingNode

  finished;

  startTime;
  endTime;

  isReady() {
    result = true;
    for (let node of this.parentNodes) {
      if (!node.finished) {
        result = false;
        break;
      }
    }
    return result;
  }
}