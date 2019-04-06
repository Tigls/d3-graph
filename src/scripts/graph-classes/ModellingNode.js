export class ModellingNode {
  sendingLink;
  receivingLink;

  task; // QueueNode
  linkedNodes = []; // ModellingNode
  finishedTasks = []; //QueueNode
  links = []; // ModellingLink

  constructor(id) {
    this.id = id;
  }

  setTask(newTask) { // QueueNode
    task = newTask;
    if (!newTask) {
      newTask.processor = this;
    }
  }

  getTask () {}

  isLinkBusy(time, length, numOfLinks) {
    result = false;
    i = 0;
    for (let link of links) {
      if(Math.max(link.startTime, time) < Math.min(link.endTime, time + length)) {
        i++;
        if (i === numOfLinks) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  hasDataForTask(task, time) {
    result = true;
    for (let parentTask of task.parentNodes) {
      for (let link of links) {
        if (link.startNode === parentTask && link.endNode === task && link.endTime > time) {
          result = false;
          break;
        }
      }
    }
    return result;
  }

}