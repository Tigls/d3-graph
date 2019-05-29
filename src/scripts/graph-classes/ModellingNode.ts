import { ModellingLink } from "./ModellingLink";
import { QueueNode } from "./QueueNode";

export class ModellingNode {
  id: number
  sendingLink: ModellingLink;
  receivingLink: ModellingLink;

  task: QueueNode;
  linkedNodes: ModellingNode[] = [];
  finishedTasks: QueueNode[] = [];
  links: ModellingLink[] = [];

  constructor(id: number) {
    this.id = id;
  }

  setTask(newTask: QueueNode): void {
    this.task = newTask;
    if (newTask !== null) {
      newTask.processor = this;
    }
  }

  isLinkBusy(time: number, length: number, numOfLinks: number): boolean {
    let i = 0;
    for (let link of this.links) {
      if(Math.max(link.startTime, time) < Math.min(link.endTime, time + length)) {
        i++;
        if (i > 0) {
          return true;
        }
      }
    }
    return false;
  }

  hasDataForTask(task: QueueNode, time: number): boolean {
    for (let parentTask of task.parentNodes) {
      for (let link of this.links) {
        if (link.startNode === parentTask && link.endNode === task && link.endTime > time) {
          return false;
        }
      }
    }
    return true;
  }

}