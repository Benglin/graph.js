import { GroupSelection, IVisualContext, VisualContext, NodeVisual, DragHandler, GraphNode } from "graph-js";
import { SchemaData } from "../nodes/SchemaNode";
import { SchemaNodeRows } from "./SchemaNodeRows";

import "./styles/SimpleNode.css";

interface SchemaVisualContext {
    nodeGroup: GroupSelection;
    rows: SchemaNodeRows;
}

export class SchemaVisual extends NodeVisual {
    constructor() {
        super("schema-visual");
    }

    render(context: IVisualContext, layerGroup: GroupSelection): void {
        const ctx = context as VisualContext<SchemaData, SchemaVisualContext>;
        if (!ctx.context) {
            ctx.context = {
                rows: new SchemaNodeRows(ctx.node.data.nodeItems),
                nodeGroup: SchemaVisual._createGroup(ctx.node, layerGroup),
            };
        }

        const nodeGroup = ctx.context.nodeGroup;
        ctx.context.rows.render(nodeGroup as GroupSelection);
    }

    private static _createGroup(node: GraphNode<SchemaData>, layerGroup: GroupSelection): GroupSelection {
        const pos = node.rect.position;
        const nodeGroup = layerGroup
            .append("g")
            .attr("id", `${node.id}`)
            .attr("transform", `translate(${pos.x}, ${pos.y})`)
            .classed("simple-node", true);

        // Register drag event handler
        new DragHandler<SVGGElement>(nodeGroup);
        return nodeGroup;
    }
}
