import { GraphNode } from "../core/GraphNode";
import { GraphEdge } from "../core/GraphEdge";
import { GraphLayer } from "../core/GraphLayer";

export class DragSet {
    private readonly _graphLayer: GraphLayer;
    private readonly _draggedNodes: GraphNode<unknown>[] = [];
    private readonly _draggedEdges: GraphEdge[] = [];

    constructor(graphLayer: GraphLayer) {
        this._graphLayer = graphLayer;
    }

    public start(nodeIds: string[]) {
        const nodes = nodeIds.map((id) => this._graphLayer.getNode(id));
        nodes.forEach((node) => this._draggedNodes.push(node as GraphNode<unknown>));

        const edges = this._graphLayer.getEdges();
        edges.forEach((edge) => {
            if (nodeIds.includes(edge.startNodeId) || nodeIds.includes(edge.endNodeId)) {
                this._draggedEdges.push(edge);
            }
        });
    }

    public drag() {
        const nodes = this._draggedNodes;
        const edges = this._draggedEdges;
        this._graphLayer.invalidateSubset(nodes, edges);
    }

    public end() {}
}
