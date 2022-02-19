import { GraphNode } from "../core/GraphNode";
import { ViewObject } from "./ViewObject";

export class SimpleNode extends ViewObject {
    constructor() {
        super("simple-node");
    }

    render(node: GraphNode): void {}
}
