import { Selection, EnterElement } from "d3-selection";
import { GroupSelection, VisualContext, GraphObjectVisual, DragHandler, GraphNode, Size, NodePort } from "graph-js";
import { SchemaData } from "../nodes/SchemaNode";
import { SchemaNodeRows } from "./SchemaNodeRows";

import "./styles/SimpleNode.css";

interface SchemaVisualContext {
    rows: SchemaNodeRows;
    nodeGroup?: GroupSelection;
}

type VisualContextType = VisualContext<SchemaVisualContext>;

export class SchemaNodeVisual extends GraphObjectVisual {
    constructor() {
        super("schema-node");
    }

    public createVisualContext(visctx: VisualContextType): void {
        const node = visctx.graphObject as GraphNode<SchemaData>;
        visctx.context = { rows: new SchemaNodeRows(node.data.nodeItems) };
    }

    public calculateSize(visctx: VisualContextType): Size {
        return visctx.context?.rows.calcNodeSize() ?? { width: 0, height: 0 };
    }

    public render(visctx: VisualContextType, layerGroup: GroupSelection): void {
        const context = visctx.context as SchemaVisualContext;
        if (!context.nodeGroup) {
            const node = visctx.graphObject as GraphNode<SchemaData>;
            context.nodeGroup = SchemaNodeVisual._createGroup(node, layerGroup);
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

        nodeGroup
            .selectChildren<SVGCircleElement, NodePort>("circle")
            .data<NodePort>(node.ports, (d) => d.id)
            .join(SchemaNodeVisual._createPorts);

        // Register drag event handler
        new DragHandler<SVGGElement>(nodeGroup);
        return nodeGroup;
    }

    private static _createPorts(
        elem: Selection<EnterElement, NodePort, SVGGElement, unknown>
    ): Selection<SVGCircleElement, NodePort, SVGGElement, unknown> {
        return elem
            .append("circle")
            .attr("r", "3.5")
            .attr("cx", (d) => d.position?.x || "0.0")
            .attr("cy", (d) => d.position?.y || "0.0");
    }
}
