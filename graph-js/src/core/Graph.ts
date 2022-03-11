import { GraphObjects } from "./GraphObject";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { GraphLayer, GraphLayers } from "./GraphLayer";
import { IGraphObjectFactory } from "./GraphObjectFactory";
import { GraphSerializer, GraphSpecs } from "../data/GraphSerializer";

export class Graph {
    private readonly _container: HTMLElement;
    private readonly _factory: IGraphObjectFactory;

    private readonly _nodes: GraphObjects = {};
    private readonly _edges: GraphObjects = {};
    private readonly _layers: GraphLayers = {};

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

    public serializeAsJson(): string {
        const serializer = new GraphSerializer(this);
        const serializable = serializer.toSerializable();
        return JSON.stringify(serializable, undefined, 4);
    }

    public deserializeFromJson(graphSpecs: GraphSpecs): void {
        const serializer = new GraphSerializer(this);
        serializer.fromSerializable(graphSpecs);
    }

    public addNodes<NDT>(nodes: GraphNode<NDT>[]): void {
        nodes.forEach((n) => (this._nodes[n.id] = n));

        const defaultLayer = this._layers[this._defaultLayerId] as GraphLayer;
        nodes.forEach((n) => defaultLayer.addNodes([n]));
    }

    public addEdges<EDT>(newEdges: GraphEdge<EDT>[]): string[] {
        newEdges.forEach((e) => (this._edges[e.id] = e));

        const defaultLayer = this._layers[this._defaultLayerId] as GraphLayer;
        newEdges.forEach((e) => defaultLayer.addEdges([e]));

        return newEdges.map((edge) => edge.id);
    }

    public getNode(nodeId: string): GraphNode<unknown> | undefined {
        return this._nodes[nodeId] as GraphNode<unknown>;
    }

    public getEdge(ddgeId: string): GraphEdge<unknown> | undefined {
        return this._edges[ddgeId] as GraphEdge<unknown>;
    }

    public getNodes(): GraphNode<unknown>[] {
        return Object.values(this._nodes) as GraphNode<unknown>[];
    }

    public getEdges(): GraphEdge<unknown>[] {
        return Object.values(this._edges) as GraphEdge<unknown>[];
    }

    public removeNodes(nodeIds: string[]): void {
        const edgeIds: string[] = [];

        Object.entries(this._edges).forEach(([edgeId, edge]) => {
            const e = edge as GraphEdge<unknown>;

            // Gather a list of edges that connect to out-going nodes.
            if (nodeIds.indexOf(e.startNodeId) >= 0) {
                edgeIds.push(edgeId);
            } else if (nodeIds.indexOf(e.endNodeId) >= 0) {
                edgeIds.push(edgeId);
            }
        });

        // First removal the edges.
        this.removeEdges(edgeIds);

        // Then remove the nodes.
        const defaultLayer = this._layers[this._defaultLayerId] as GraphLayer;
        defaultLayer.removeNodes(nodeIds);
        nodeIds.forEach((nodeId) => delete this._nodes[nodeId]);
    }

    public removeEdges(edgeIds: string[]): void {
        const defaultLayer = this._layers[this._defaultLayerId] as GraphLayer;
        defaultLayer.removeEdges(edgeIds);
        edgeIds.forEach((edgeId) => delete this._edges[edgeId]);
    }

    public invalidate(): void {
        const layers = Object.values(this._layers) as GraphLayer[];
        layers.forEach((l) => l.invalidate());
    }

    public beginLayout(done: Function): void {
        const layer = this._layers[this._defaultLayerId] as GraphLayer;
        layer.beginLayout().then(() => done());
    }

    public get container(): HTMLElement {
        return this._container;
    }

    public get graphObjectFactory(): IGraphObjectFactory {
        return this._factory;
    }

    private createLayer(): GraphLayer {
        const layer = new GraphLayer(this);
        this._layers[layer.id] = layer;
        return layer;
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
