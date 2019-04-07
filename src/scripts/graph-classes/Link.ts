import { Node } from "./Node";

export class Link {
  id: number;
  weight = 1;
  source: Node;
  target: Node;
  constructor() {}
}