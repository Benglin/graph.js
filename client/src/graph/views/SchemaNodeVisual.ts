import { GroupSelection, IVisualContext, VisualContext, NodeVisual, DragHandler } from "graph-js";
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
            const id = ctx.node.id;
            ctx.context = {
                rows: new SchemaNodeRows(ctx.node.data.nodeItems),
                nodeGroup: SchemaVisual._createGroup(id, layerGroup),
            };
        }

        const nodeGroup = ctx.context.nodeGroup;
        ctx.context.rows.render(nodeGroup as GroupSelection);
    }

    private static _createGroup(id: string, layerGroup: GroupSelection): GroupSelection {
        const nodeGroup = layerGroup
            .append("g")
            .attr("id", `${id}`)
            .attr("transform", "translate(10, 10)")
            .classed("simple-node", true);

        // Register drag event handler
        new DragHandler<SVGGElement>(nodeGroup);
        return nodeGroup;
    }
}
