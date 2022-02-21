import { GraphNode, NodeType } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { GraphLayer, LayerName } from "./GraphLayer";
import { GraphObjectIdMap } from "./GraphObject";
import { INodeVisual, ViewObjectIdMap } from "./NodeVisual";
import { IVisualContext, NodeVisualContextMap, VisualContext } from "./VisualContext";

export class Graph {
    private readonly _container: HTMLElement;

    private readonly _nodes: GraphObjectIdMap = {};
    private readonly _edges: GraphObjectIdMap = {};
    private readonly _layers: GraphObjectIdMap = {};
    private readonly _nodeTypeViewMap: ViewObjectIdMap = {};
    private readonly _nodeVisualContexts: NodeVisualContextMap = {};

    constructor(containerId: string) {
        this._container = document.getElementById(containerId) as HTMLElement;
        this.createLayer(LayerName.Default);

        const thisObject = this;
        window.addEventListener("resize", (ev: UIEvent) => {
            const e = thisObject._container;
            thisObject.handleContainerResized(e.clientWidth, e.clientHeight);
            thisObject.invalidate();
        });
    }

    public addNodes<DataType>(nodes: GraphNode<DataType>[]): void {
        nodes.forEach((n) => (this._nodes[n.id] = n));
        nodes.forEach((n) => this.createNodeView<DataType>(n));

        const defaultLayer = this._layers[LayerName.Default] as GraphLayer;
        nodes.forEach((n) => defaultLayer.addNodes([n]));
    }

    public addEdges(edges: GraphEdge[]): void {
        edges.forEach((e) => (this._edges[e.id] = e));

        const defaultLayer = this._layers[LayerName.Default] as GraphLayer;
        edges.forEach((e) => defaultLayer.addEdges([e]));
    }

    public getNodeView(nodeType: NodeType | string): INodeVisual | undefined {
        return this._nodeTypeViewMap[nodeType];
    }

    public getVisualContext(nodeId: string): IVisualContext {
        if (!this._nodeVisualContexts[nodeId]) {
            const node = this._nodes[nodeId] as GraphNode<unknown>;
            this._nodeVisualContexts[nodeId] = new VisualContext(node);
        }

        return this._nodeVisualContexts[nodeId];
    }

    public invalidate(): void {
        const layers = Object.values(this._layers) as GraphLayer[];
        layers.forEach((l) => l.invalidate());
    }

    public get container(): HTMLElement {
        return this._container;
    }

    private createLayer(layerName: LayerName): GraphLayer {
        const layer = new GraphLayer(this, layerName);
        this._layers[layerName] = layer;
        return layer;
    }

    private createNodeView<DataType>(node: GraphNode<DataType>): void {
        if (!this._nodeTypeViewMap[node.nodeType]) {
            // const nodeView = new SimpleVisual();
            // this._nodeTypeViewMap[node.nodeType] = nodeView;
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
