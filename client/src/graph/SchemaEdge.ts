import { Selection } from "d3-selection";
import { EdgeDescriptor, GraphEdge, GraphLayer, GraphNode, GroupSelection, NodePort, Vector } from "graph-js";

export enum SimpleEdgeType {
    Contains = "Contains",
    ConfigRef = "ConfigRef",
    RowRef = "RowRef",
    TableRef = "TableRef",
    MemberRef = "MemberRef",
    AssemblyRef = "AssemblyRef",
    Use = "Use",
    Describe = "Describe",
    Derive = "Derive",
}

const classes: Record<string, string> = {};
classes[SimpleEdgeType.Contains] = "contains";
classes[SimpleEdgeType.ConfigRef] = "config-ref";
classes[SimpleEdgeType.RowRef] = "row-ref";
classes[SimpleEdgeType.TableRef] = "table-ref";
classes[SimpleEdgeType.MemberRef] = "member-ref";
classes[SimpleEdgeType.AssemblyRef] = "assembly-ref";
classes[SimpleEdgeType.Use] = "use";
classes[SimpleEdgeType.Describe] = "describe";
classes[SimpleEdgeType.Derive] = "derive";

export interface SimpleEdgeData {
    type: SimpleEdgeType;
}

type SvgPathSelection = Selection<SVGPathElement, unknown, HTMLElement, any>;
type SvgGroupSelection = Selection<SVGGElement, unknown, HTMLElement, any>;

export class SchemaEdge extends GraphEdge<SimpleEdgeData> {
    private _midPoint = new Vector(0, 0);
    private _path: SvgPathSelection | undefined;
    private _annoGroup: SvgGroupSelection | undefined;

    protected renderCore(edgesGroup: GroupSelection): void {
        const layer = this.graphLayer as GraphLayer;

        const startNode = layer.getNode(this.startNodeId) as GraphNode<unknown>;
        const endNode = layer.getNode(this.endNodeId) as GraphNode<unknown>;

        const startPort = startNode.getPort(this.startPortId) as NodePort;
        const endPort = endNode.getPort(this.endPortId) as NodePort;

        const sp = startNode.toGraphCoords(startPort.position as Vector);
        const ep = endNode.toGraphCoords(endPort.position as Vector);

        if (this._path === undefined) {
            this._path = edgesGroup
                .append("path")
                .attr("id", this.id)
                .attr("stroke", "black")
                .attr("fill", "none")
                .classed("simple-edge", true)
                .classed(classes[this.data!.type], true)
                .on("mouseover", () => this._handleMouseEnter())
                .on("mouseleave", () => this._handleMouseLeave());
        }

        const dx = Math.abs(sp.x - ep.x);
        const dy = Math.abs(sp.y - ep.y);
        let delta = Math.sqrt(dx * dx + dy * dy) * 0.3;
        delta = Math.max(10.0, delta);
        const x0 = sp.x + startPort.normal!.x * delta;
        const y0 = sp.y + startPort.normal!.y * delta;
        const x1 = ep.x + endPort.normal!.x * delta;
        const y1 = ep.y + endPort.normal!.y * delta;

        const p = `M ${sp.x} ${sp.y} C ${x0} ${y0}, ${x1} ${y1}, ${ep.x} ${ep.y}`;
        this._path.attr("d", p);

        this._midPoint.x = (x1 + x0) / 2;
        this._midPoint.y = (y1 + y0) / 2;
    }

    public static fromDescriptor(desc: EdgeDescriptor<SimpleEdgeData>): SchemaEdge {
        return new SchemaEdge(desc);
    }

    private _handleMouseEnter(): void {
        if (!this._annoGroup) {
            const layer = this.graphLayer as GraphLayer;

            this._annoGroup = layer.annotationGroup.append("g").classed("annotation", true);
            const rect = this._annoGroup.append("rect").attr("height", 16).attr("rx", 4).attr("ry", 4);

            const n = this._annoGroup
                .append("text")
                .attr("x", 10)
                .attr("y", 2.5)
                .text(this.data!.type)
                .node() as SVGTextElement;

            const width = n.clientWidth * window.devicePixelRatio;
            const height = n.clientHeight * window.devicePixelRatio;
            rect.attr("width", width + 20);

            const x = this._midPoint!.x - width / 2;
            const y = this._midPoint!.y - height / 2;

            this._annoGroup.attr("transform", `translate(${x}, ${y})`);
        }
    }

    private _handleMouseLeave(): void {
        if (this._annoGroup) {
            this._annoGroup.remove();
            this._annoGroup = undefined;
        }
    }
}
