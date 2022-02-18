import { GraphNode, NodeType } from "./GraphNode";
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
    private readonly _nodeTypeViewMap: ViewObjectIdMap = {};

    constructor(parentId: string) {
        this._parentElement = document.getElementById(parentId) as HTMLElement;
        this.createLayer(LayerName.Default);

        const thisObject = this;
        window.addEventListener("resize", (ev: UIEvent) => {
            const e = thisObject._parentElement;
            thisObject.handleContainerResized(e.clientWidth, e.clientHeight);
            thisObject.invalidate();
        });
    }

    public addNodes(nodes: GraphNode[]): void {
        nodes.forEach((n) => (this._nodes[n.id] = n));
        nodes.forEach((n) => this.createNodeView(n));

        const defaultLayer = this._layers[LayerName.Default] as GraphLayer;
        nodes.forEach((n) => defaultLayer.addNodes([n]));
    }

    public addEdges(edges: GraphEdge[]): void {
        edges.forEach((e) => (this._edges[e.id] = e));

        const defaultLayer = this._layers[LayerName.Default] as GraphLayer;
        edges.forEach((e) => defaultLayer.addEdges([e]));
    }

    public getNodeView(nodeType: NodeType | string): NodeView | undefined {
        return this._nodeTypeViewMap[nodeType];
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
        if (!this._nodeTypeViewMap[node.nodeType]) {
            const nodeView = new SimpleNode();
            this._nodeTypeViewMap[node.nodeType] = nodeView;
        }
    }

    private handleContainerResized(width: number, height: number): void {
        Object.values(this._layers).forEach((go) => {
            const layer = go as GraphLayer;
            layer.handleContainerResized(width, height);
        });
    }
}

export function createGraph(parentId: string): Graph {
    return new Graph(parentId);
}
