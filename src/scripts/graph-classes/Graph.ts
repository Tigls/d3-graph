import { Node } from "./Node";
import { Link } from "./Link";

export class Graph {
  nodesList: Node[] = [];
  linksList: Link[] = [];
  startNode: Node;
  currentLink: Link;
  type: GraphType;
  fileName: string;
  constructor(type) {
    this.type = type;
  }
}

export enum GraphType { GraphNone, GraphTask, GraphCS };
export type Matrix = Array<Array<number>>;