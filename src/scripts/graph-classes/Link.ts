import { INode } from "./Node";
import { SimulationLinkDatum } from "d3";

export interface ILink extends SimulationLinkDatum<INode> {
  id: number;
  weight: number;
  source: INode;
  target: INode;
}

export class Link {
  id: number;
  weight = 1;
  source: INode;
  target: INode;
  constructor() {}
}