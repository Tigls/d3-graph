import { INode } from "./Node";
import { ILink } from "./Link";

export class Graph {
  nodes: INode[] = [];
  links: ILink[] = [];
  startNode: INode;
  currentLink: ILink;
  type: GraphType;
  fileName: string;
  constructor(type: GraphType, links:ILink[] = [], nodes:INode[]=[]) {
    this.type = type;
    this.links = links;
    this.nodes = nodes;
  }
}

export enum GraphType { GraphNone, GraphTask, GraphCS };
export type Matrix = Array<Array<number>>;