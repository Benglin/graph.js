import { Graph } from "./Graph";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { GraphObject, GraphObjectIdMap } from "./GraphObject";

export enum LayerName {
    Default = "Default",
    Interactive = "Interactive",
}

export class GraphLayer extends GraphObject {
    private readonly _graph: Graph;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    private readonly _graphNodes: GraphObjectIdMap = {};
    private readonly _graphEdges: GraphObjectIdMap = {};

    constructor(graph: Graph, layerName: LayerName) {
        super(`layer-${layerName}`);

        this._graph = graph;
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d") as CanvasRenderingContext2D;

        const parentElement = graph.parentElement;
        parentElement.appendChild(this._canvas);
    }

    public handleContainerResized(width: number, height: number): void {
        this._canvas.width = width;
        this._canvas.height = height;
    }

    public invalidate(): void {
        const w = this._canvas.clientWidth - 20;
        const h = this._canvas.clientHeight - 20;
        this._context.fillStyle = "green";
        this._context.fillRect(10, 10, w, h);

        const nodes = Object.values(this._graphNodes);
        nodes.forEach((gn) => {
            const node = gn as GraphNode;
            const view = this._graph.getNodeView(node.nodeType);
            view?.render(node, this._context);
        });
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
}
