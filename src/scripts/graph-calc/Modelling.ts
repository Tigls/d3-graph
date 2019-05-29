import { ModellingNode } from '../graph-classes/ModellingNode';
import { QueueList } from './QueueList';
import { Matrix, Graph } from '../graph-classes/Graph';
import { Calculation } from './Calculation';
import { Getters } from './Getters';
import { QueueNode } from '../graph-classes/QueueNode';
import { Processors } from './Processors';
import { ModellingLink } from '../graph-classes/ModellingLink';


export function modeling(currentGraphTask: Graph, currentGraphCS: Graph, queueAlg:number, setAlg: number): ModellingNode[] {
  let prodLines = 1;
  let numOfLines = currentGraphTask.links.length;
  const prod = 1;
  
  let queue = QueueList.queue1List(currentGraphTask);
  if (queueAlg === 3) {
    queue = QueueList.queue3List(currentGraphTask);
  } else if (queueAlg == 15) {
    queue = QueueList.queue15List(currentGraphTask);
  }
  const processors:ModellingNode[] = [];
  const matrix: Matrix = Getters.getMatrix(currentGraphCS);
  const linesWeight: Matrix = Getters.getLinkWeights(currentGraphTask, prodLines);
  for (const node of currentGraphCS.nodes) {
    const mNode = new ModellingNode(node.id);
    processors.push(mNode);
  }
  for (const line of currentGraphCS.links) {
    for (const node1 of processors) {
      if (line.source.id == node1.id) {
        for (const node2 of processors) {
          if (line.target.id == node2.id) {
            node1.linkedNodes.push(node2);
            node2.linkedNodes.push(node1);
          }
        }
      }
    }
  }
  for (const node of queue) {
    //			System.out.println(node.weight + " " + (int)Math.ceil(node.weight / (float)prod));
    node.weight = Math.ceil(node.weight / prod);
  }
  let tick = 0;
  while (!(queue.length === 0) || Processors.hasBusyProccessors(processors)) {

    while (Processors.hasReadyTasks(queue) && Processors.hasFreeProccessors(processors)) {
      const readyTask: QueueNode = Processors.getReadyTask(queue);
      let processor: ModellingNode = Processors.getProcessor1(processors);
      if (setAlg == 4) {
        processor = Processors.getProcessor5(processors, readyTask, matrix, linesWeight);
      }

      processor.setTask(readyTask);
      if (readyTask.parentNodes.length > 0) {
        let maxStartTime = 0;
        for (const doneTask of readyTask.parentNodes) {
          let route: number[] = Calculation.dijkstra(matrix, processors.indexOf(doneTask.processor), processors.indexOf(processor));
          const w = linesWeight[doneTask.id][readyTask.id];

          let time = (setAlg == 4 ? doneTask.endTime : tick);

          if (route.length == 1) {
            maxStartTime = Math.max(maxStartTime, time);
          }
          for (let i = 0; i < route.length - 1; i++) {
            const fromProc: ModellingNode = processors[route[i]];
            const toProc: ModellingNode = processors[route[i + 1]];
            let searching = true;
            while (searching) {
              if (fromProc.isLinkBusy(time, w, numOfLines) || toProc.isLinkBusy(time, w, numOfLines) ) {

              } else {
                const mLine: ModellingLink = new ModellingLink();
                mLine.startNode = doneTask;
                mLine.endNode = readyTask;
                mLine.startProcessor = fromProc;
                mLine.endProcessor = toProc;
                mLine.startTime = time;
                mLine.endTime = time + w;

                fromProc.links.push(mLine);
                toProc.links.push(mLine);
                searching = false;
                maxStartTime = Math.max(maxStartTime, time + w);
              }
              time++;
            }
          }
        }
        readyTask.startTime = Math.max(maxStartTime, tick);
      } else {
        readyTask.startTime = tick;
      }
      queue.splice(queue.indexOf(readyTask), 1);
    }
    tick++;
    for (const processor of processors) {
      const task: QueueNode = processor.task;
      if (task != null && processor.hasDataForTask(task, tick) && task.startTime < tick) {
        task.weight--;
        if (task.weight == 0) {
          task.endTime = tick;
          task.finished = true;
          processor.finishedTasks.push(task);
          processor.setTask(null);
        }
      }
    }
  }
  // processors.push(new ModellingNode(tick));

  return processors;
}