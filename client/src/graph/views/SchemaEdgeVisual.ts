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

        const sp = startNode.toGraphCoords(startPort.position as Vector);
        const ep = endNode.toGraphCoords(endPort.position as Vector);

        if (visctx.element === undefined) {
            const element = layerGroup
                .append("path")
                .attr("id", edge.id)
                .attr("stroke", "black")
                .attr("fill", "transparent");

            visctx.element = element.node() as Element;
            const classes = SchemaEdgeVisual._getClassNames(edge.descriptor.edgeData);
            classes.forEach((className) => element.classed(className, true));
        }

        let delta = Math.abs(sp.y - ep.y);
        delta = Math.min(50.0, Math.max(10.0, delta));
        const x0 = sp.x + startPort.normal!.x * delta;
        const y0 = sp.y + startPort.normal!.y * delta;
        const x1 = ep.x + endPort.normal!.x * delta;
        const y1 = ep.y + endPort.normal!.y * delta;

        const p = `M ${sp.x} ${sp.y} C ${x0} ${y0}, ${x1} ${y1}, ${ep.x} ${ep.y}`;
        select(visctx.element).attr("d", p);
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
            case SchemaEdgeType.RowRef:
                classes.push("row-ref");
                break;
            case SchemaEdgeType.TableRef:
                classes.push("table-ref");
                break;
            case SchemaEdgeType.MemberRef:
                classes.push("member-ref");
                break;
            case SchemaEdgeType.AssemblyRef:
                classes.push("assembly-ref");
                break;
            case SchemaEdgeType.Use:
                classes.push("use");
                break;
            case SchemaEdgeType.Describe:
                classes.push("describe");
                break;
            case SchemaEdgeType.Derive:
                classes.push("derive");
                break;
        }

        return classes;
    }
}
