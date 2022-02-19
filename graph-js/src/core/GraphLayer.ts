import { select } from "d3-selection";

import { Graph, GroupSelection } from "./Graph";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { GraphObject, GraphObjectIdMap } from "./GraphObject";

export enum LayerName {
    Default = "Default",
    Interactive = "Interactive",
}

export class GraphLayer extends GraphObject {
    private readonly _graph: Graph;
    private readonly _graphNodes: GraphObjectIdMap = {};
    private readonly _graphEdges: GraphObjectIdMap = {};

    // D3.js related data members
    private _svgGroup: GroupSelection | undefined;
    private _nodeGroup: GroupSelection | undefined;
    private _edgeGroup: GroupSelection | undefined;

    constructor(graph: Graph, layerName: LayerName) {
        super(`layer-${layerName}`);

        this._graph = graph;
    }

    public handleContainerResized(width: number, height: number): void {
        width;
        height;
    }

    public invalidate(): void {
        const nodes = Object.values(this._graphNodes) as GraphNode[];
        if (nodes.length > 0) {
            this._ensureNodeGroupCreated();
            nodes.forEach((node) => {
                const view = this._graph.getNodeView(node.nodeType);
                view?.render(node, this._nodeGroup as GroupSelection);
            });
        }
    }

    public addNodes(graphNodes: GraphNode[]): void {
        graphNodes.forEach((gn) => (this._graphNodes[gn.id] = gn));
    }

    public removeNodes(nodeIds: string[]): void {
        nodeIds.forEach((id) => delete this._graphNodes[id]);
    }

    public addEdges(graphEdges: GraphEdge[]): void {
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
