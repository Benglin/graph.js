import { GraphObject, GraphObjectIdMap } from "./GraphObject";
import { GraphNode } from "./GraphNode";
import { GraphEdge, EdgeDescriptor } from "./GraphEdge";
import { GraphLayer } from "./GraphLayer";
import { IGraphObjectFactory } from "./GraphObjectFactory";
import { IGraphObjectVisual, ObjectVisualMap } from "./GraphObjectVisual";
import { IVisualContext, VisualContextMap, VisualContext } from "./VisualContext";

export class Graph {
    private readonly _container: HTMLElement;
    private readonly _factory: IGraphObjectFactory;

    private readonly _nodes: GraphObjectIdMap = {};
    private readonly _edges: GraphObjectIdMap = {};
    private readonly _layers: GraphObjectIdMap = {};
    private readonly _objectVisualMap: ObjectVisualMap = {};
    private readonly _visualContexts: VisualContextMap = {};

    private readonly _defaultLayerId: string;

    constructor(containerId: string, factory: IGraphObjectFactory) {
        this._factory = factory;
        this._container = document.getElementById(containerId) as HTMLElement;
        this._defaultLayerId = this.createLayer().id;

        const thisObject = this;
        window.addEventListener("resize", (ev: UIEvent) => {
            const e = thisObject._container;
            thisObject.handleContainerResized(e.clientWidth, e.clientHeight);
            thisObject.invalidate();
        });
    }

    public addNodes<DataType>(nodes: GraphNode<DataType>[]): void {
        nodes.forEach((n) => (this._nodes[n.id] = n));
        nodes.forEach((n) => this.createObjectVisual(n));

        const defaultLayer = this._layers[this._defaultLayerId] as GraphLayer;
        nodes.forEach((n) => defaultLayer.addNodes([n]));
    }

    public addEdges(descriptors: EdgeDescriptor[]): string[] {
        const newEdges = descriptors.map((d) => new GraphEdge(d));
        newEdges.forEach((e) => (this._edges[e.id] = e));
        newEdges.forEach((e) => this.createObjectVisual(e));

        const defaultLayer = this._layers[this._defaultLayerId] as GraphLayer;
        newEdges.forEach((e) => defaultLayer.addEdges([e]));

        return newEdges.map((edge) => edge.id);
    }

    public getObjectVisual(objectType: string): IGraphObjectVisual | undefined {
        return this._objectVisualMap[objectType];
    }

    public getVisualContext(graphObject: GraphObject): IVisualContext {
        const objectId = graphObject.id;
        if (!this._visualContexts[objectId]) {
            this._visualContexts[objectId] = new VisualContext(graphObject);
        }

        return this._visualContexts[objectId];
    }

    public invalidate(): void {
        const layers = Object.values(this._layers) as GraphLayer[];
        layers.forEach((l) => l.invalidate());
    }

    public get container(): HTMLElement {
        return this._container;
    }

    private createLayer(): GraphLayer {
        const layer = new GraphLayer(this);
        this._layers[layer.id] = layer;
        return layer;
    }

    private createObjectVisual(graphObject: GraphObject): void {
        const objectType = graphObject.objectType;
        if (!this._objectVisualMap[objectType]) {
            const visual = this._factory.createObjectVisual(objectType);
            this._objectVisualMap[objectType] = visual;
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
