import { Link } from "./Link";
import { QueueNode } from "./QueueNode";
import { ModellingNode } from "./ModellingNode";

export class ModellingLink extends Link{
  startNode: QueueNode;
  endNode: QueueNode;

  startProcessor: ModellingNode;
  endProcessor: ModellingNode;

  startTime: number;
  endTime: number;
}