import { GraphNode } from "../core/GraphNode";
import { ViewObject } from "./ViewObject";

export class SimpleNode extends ViewObject {
    constructor() {
        super("simple-node");
    }

    render(node: GraphNode, context: CanvasRenderingContext2D): void {
        const rect = node.rect;
        context.rect(rect.position.x, rect.position.y, rect.size.width, rect.size.height);
    }
}
