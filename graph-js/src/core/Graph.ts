import { GraphObject } from "./GraphObject";
import { GraphNode, NodeType } from "./GraphNode";
import { GraphEdge, EdgeDescriptor } from "./GraphEdge";
import { GraphLayer, LayerName } from "./GraphLayer";
import { GraphObjectIdMap } from "./GraphObject";
import { INodeVisual, ViewObjectIdMap } from "./NodeVisual";
import { IVisualContext, VisualContextMap, VisualContext } from "./VisualContext";
import { IGraphObjectFactory } from "./GraphObjectFactory";

export class Graph {
    private readonly _container: HTMLElement;
    private readonly _factory: IGraphObjectFactory;

    private readonly _nodes: GraphObjectIdMap = {};
    private readonly _edges: GraphObjectIdMap = {};
    private readonly _layers: GraphObjectIdMap = {};
    private readonly _nodeTypeViewMap: ViewObjectIdMap = {};
    private readonly _nodeVisualContexts: VisualContextMap = {};

    constructor(containerId: string, factory: IGraphObjectFactory) {
        this._factory = factory;
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

    public addEdges(descriptors: EdgeDescriptor[]): string[] {
        const newEdges = descriptors.map((d) => new GraphEdge(d));
        newEdges.forEach((e) => (this._edges[e.id] = e));

        const defaultLayer = this._layers[LayerName.Default] as GraphLayer;
        newEdges.forEach((e) => defaultLayer.addEdges([e]));

        return newEdges.map((edge) => edge.id);
    }

    public getNodeView(nodeType: NodeType | string): INodeVisual | undefined {
        return this._nodeTypeViewMap[nodeType];
    }

    public getVisualContext(graphObject: GraphObject): IVisualContext {
        const objectId = graphObject.id;
        if (!this._nodeVisualContexts[objectId]) {
            this._nodeVisualContexts[objectId] = new VisualContext(graphObject);
        }

        return this._nodeVisualContexts[objectId];
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
        const nodeType = node.nodeType;
        if (!this._nodeTypeViewMap[nodeType]) {
            const visual = this._factory.createNodeVisual(nodeType);
            this._nodeTypeViewMap[nodeType] = visual;
        }
    }

    private handleContainerResized(width: number, height: number): void {
        Object.values(this._layers).forEach((go) => {
            const layer = go as GraphLayer;
            layer.handleContainerResized(width, height);
        });
    }
}

export function createGraph(containerId: string, factory: IGraphObjectFactory): Graph {
    return new Graph(containerId, factory);
}
