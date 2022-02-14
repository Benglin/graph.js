import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { GraphLayer, LayerName } from "./GraphLayer";
import { GraphObjectIdMap } from "./GraphObject";
import { NodeView, ViewObjectIdMap } from "../view/ViewObject";
import { SimpleNode } from "../view/SimpleNode";

export class Graph {
    private readonly _parentElement: HTMLElement;

    private readonly _nodes: GraphObjectIdMap = {};
    private readonly _edges: GraphObjectIdMap = {};
    private readonly _layers: GraphObjectIdMap = {};
    private readonly _views: ViewObjectIdMap = {};

    // TODO: Cache this view.
    private _nodeView = new SimpleNode();

    constructor(parentId: string) {
        this._parentElement = document.getElementById(parentId) as HTMLElement;
        this.createLayer(LayerName.Default);
    }

    public addNodes(nodes: GraphNode[]): void {
        nodes.forEach((n) => (this._nodes[n.id] = n));
        nodes.forEach((n) => this.createNodeView(n));

        const defaultLayer = this._layers[LayerName.Default] as GraphLayer;
        nodes.forEach((n) => defaultLayer.addObjects([n]));
    }

    public addEdges(edges: GraphEdge[]): void {
        edges.forEach((e) => (this._edges[e.id] = e));

        const defaultLayer = this._layers[LayerName.Default] as GraphLayer;
        edges.forEach((e) => defaultLayer.addObjects([e]));
    }

    public getObjectView(objectId: string): NodeView | undefined {
        return this._views[objectId];
    }

    public invalidate(): void {
        const layers = Object.values(this._layers) as GraphLayer[];
        layers.forEach((l) => l.invalidate());
    }

    public get parentElement(): HTMLElement {
        return this._parentElement;
    }

    private createLayer(layerName: LayerName): GraphLayer {
        const layer = new GraphLayer(this, layerName);
        this._layers[layerName] = layer;
        return layer;
    }

    private createNodeView(node: GraphNode): void {
        this._views[node.id] = this._nodeView;
    }
}

export function createGraph(parentId: string): Graph {
    return new Graph(parentId);
}
