import { Selection } from "d3-selection";

import {
    GraphEdge,
    GraphNode,
    GraphObjectVisual,
    GroupSelection,
    NodePort,
    Size,
    Vector,
    VisualContext,
} from "graph-js";

interface SchemaEdgeVisualContext {
    edgeElement?: Selection<SVGLineElement, unknown, HTMLElement, any>;
}

type VisualContextType = VisualContext<SchemaEdgeVisualContext>;

export class SchemaEdgeVisual extends GraphObjectVisual {
    constructor() {
        super("schema-edge");
    }

    createVisualContext(visctx: VisualContextType): void {
        visctx.context = {};
    }

    calculateSize(visctx: VisualContextType): Size {
        return { width: 0, height: 0 }; // Not used for edges.
    }

    render(visctx: VisualContextType, layerGroup: GroupSelection): void {
        const edge = visctx.graphObject as GraphEdge;
        const context = visctx.context as SchemaEdgeVisualContext;

        const startNode = visctx.getNode(edge.startNodeId) as GraphNode<unknown>;
        const endNode = visctx.getNode(edge.endNodeId) as GraphNode<unknown>;

        const startPort = startNode.getPort(edge.startPortId) as NodePort;
        const endPort = endNode.getPort(edge.endPortId) as NodePort;

        const startPoint = startPort.position as Vector;
        const endPoint = endPort.position as Vector;

        if (context.edgeElement === undefined) {
            context.edgeElement = layerGroup.append("line").attr("id", edge.id).attr("stroke", "black");
        }

        context.edgeElement
            .attr("x1", startPoint.x)
            .attr("y1", startPoint.y)
            .attr("x2", endPoint.x)
            .attr("y2", endPoint.y);
    }
}
