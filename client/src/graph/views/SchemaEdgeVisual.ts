import { select } from "d3-selection";
import { SchemaEdgeData, SchemaEdgeType } from "../edges/SchemaEdge";

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

interface SchemaEdgeVisualContext {}

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
        const edge = visctx.graphObject as GraphEdge<SchemaEdgeData>;

        const startNode = visctx.getNode(edge.startNodeId) as GraphNode<unknown>;
        const endNode = visctx.getNode(edge.endNodeId) as GraphNode<unknown>;

        const startPort = startNode.getPort(edge.startPortId) as NodePort;
        const endPort = endNode.getPort(edge.endPortId) as NodePort;

        const startPoint = startNode.toGraphCoords(startPort.position as Vector);
        const endPoint = endNode.toGraphCoords(endPort.position as Vector);

        if (visctx.element === undefined) {
            const element = layerGroup.append("line").attr("id", edge.id).attr("stroke", "black");
            visctx.element = element.node() as Element;

            const classes = SchemaEdgeVisual._getClassNames(edge.descriptor.edgeData);
            classes.forEach((className) => element.classed(className, true));
        }

        select(visctx.element)
            .attr("x1", startPoint.x)
            .attr("y1", startPoint.y)
            .attr("x2", endPoint.x)
            .attr("y2", endPoint.y);
    }

    private static _getClassNames(edgeData: SchemaEdgeData): string[] {
        const classes = ["simple-edge"];

        switch (edgeData.type) {
            case SchemaEdgeType.Contains:
                classes.push("contains");
                break;

            case SchemaEdgeType.ConfigRef:
                classes.push("config-ref");
                break;
        }

        return classes;
    }
}
