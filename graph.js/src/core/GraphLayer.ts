import { Graph } from "./Graph";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { GraphObject, GraphObjectIdMap } from "./GraphObject";
import { select, Selection } from "d3-selection";

export enum LayerName {
    Default = "Default",
    Interactive = "Interactive",
}

export class GraphLayer extends GraphObject {
    private readonly _graph: Graph;
    private readonly _graphNodes: GraphObjectIdMap = {};
    private readonly _graphEdges: GraphObjectIdMap = {};

    // D3.js related data members
    private _svgGroup: Selection<SVGGElement, unknown, HTMLElement, any> | undefined;
    private _nodeGroup: Selection<SVGGElement, unknown, HTMLElement, any> | undefined;
    private _edgeGroup: Selection<SVGGElement, unknown, HTMLElement, any> | undefined;

    constructor(graph: Graph, layerName: LayerName) {
        super(`layer-${layerName}`);

        this._graph = graph;
    }

    public handleContainerResized(width: number, height: number): void {
        width;
        height;
    }

    public invalidate(): void {}

    public addNodes(graphNodes: GraphNode[]): void {
        this._ensureNodeGroupCreated();
        graphNodes.forEach((gn) => (this._graphNodes[gn.id] = gn));
    }

    public removeNodes(nodeIds: string[]): void {
        nodeIds.forEach((id) => delete this._graphNodes[id]);
    }

    public addEdges(graphEdges: GraphEdge[]): void {
        this._ensureEdgeGroupCreated();
        graphEdges.forEach((ge) => (this._graphEdges[ge.id] = ge));
    }

    public removeEdges(edgeIds: string[]): void {
        edgeIds.forEach((id) => delete this._graphEdges[id]);
    }

    private _ensureSvgCreated(): void {
        if (!this._svgGroup) {
            const container = this._graph.container;
            const width = container.clientWidth;
            const height = container.clientHeight;

            this._svgGroup = select(`#${container.id}`).append("svg").append("g");
            this._svgGroup.attr("width", width).attr("height", height);
        }
    }

    private _ensureNodeGroupCreated(): void {
        this._ensureSvgCreated();

        if (this._svgGroup && !this._nodeGroup) {
            this._nodeGroup = this._svgGroup.append("g");
        }
    }

    private _ensureEdgeGroupCreated(): void {
        this._ensureSvgCreated();

        if (this._svgGroup && !this._edgeGroup) {
            this._edgeGroup = this._svgGroup.append("g");
        }
    }
}
