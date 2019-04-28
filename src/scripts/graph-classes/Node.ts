import { Force, ForceLink, SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface INode extends SimulationNodeDatum {
  fixed?: boolean;
  id: number;
  weight: number;
}

export class Node implements INode {
  id: number;
  weight:number = 1;
  fixed: boolean;
  // name: string;
}