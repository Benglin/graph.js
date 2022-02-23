import { GroupSelection, VisualContext, NodeVisual, DragHandler, GraphNode, Size } from "graph-js";
import { SchemaData } from "../nodes/SchemaNode";
import { SchemaNodeRows } from "./SchemaNodeRows";

import "./styles/SimpleNode.css";

interface SchemaVisualContext {
    rows: SchemaNodeRows;
    nodeGroup?: GroupSelection;
}

type VisualContextType = VisualContext<SchemaData, SchemaVisualContext>;

export class SchemaVisual extends NodeVisual {
    constructor() {
        super("schema-visual");
    }

    public createVisualContext(visctx: VisualContextType): void {
        visctx.context = { rows: new SchemaNodeRows(visctx.node.data.nodeItems) };
    }

    public calcNodeSize(visctx: VisualContextType): Size {
        return visctx.context?.rows.calcNodeSize() ?? { width: 0, height: 0 };
    }

    public render(visctx: VisualContextType, layerGroup: GroupSelection): void {
        const context = visctx.context as SchemaVisualContext;
        if (!context.nodeGroup) {
            context.nodeGroup = SchemaVisual._createGroup(visctx.node, layerGroup);
        }

        const nodeGroup = context.nodeGroup;
        context.rows.render(nodeGroup as GroupSelection);
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
