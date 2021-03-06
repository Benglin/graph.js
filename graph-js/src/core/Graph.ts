import { GraphObjects } from "./GraphObject";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { GraphLayer, GraphLayers } from "./GraphLayer";
import { IGraphObjectFactory } from "./GraphObjectFactory";
import { GraphSerializer, GraphSpecs } from "../data/GraphSerializer";

type Listener = EventListenerOrEventListenerObject | null;
type Listeners = { [type: string]: Listener[] };

export class Graph implements EventTarget {
    private readonly _container: HTMLElement;
    private readonly _factory: IGraphObjectFactory;

    private readonly _nodes: GraphObjects = {};
    private readonly _edges: GraphObjects = {};
    private readonly _layers: GraphLayers = {};

    private readonly _listeners: Listeners = {};

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
        const serializable = GraphSerializer.toSerializable(this);
        return JSON.stringify(serializable, undefined, 4);
    }

    public deserializeFromJson(graphSpecs: GraphSpecs): void {
        const factory = this.graphObjectFactory;
        const results = GraphSerializer.fromSerializable(factory, graphSpecs);

        this.addNodes(results.nodes);
        this.addEdges(results.edges);
        this.centerNodesOnView();
    }

    public addNodes<NDT>(nodes: GraphNode<NDT>[]): void {
        // Remove nodes that are already in the graph.
        nodes = nodes.filter((n) => !this._nodes[n.id]);
        nodes.forEach((n) => (this._nodes[n.id] = n));

        const defaultLayer = this._layers[this._defaultLayerId] as GraphLayer;
        nodes.forEach((n) => defaultLayer.addNodes([n]));
    }

    public addEdges<EDT>(newEdges: GraphEdge<EDT>[]): string[] {
        // Remove edges that are already in the graph.
        newEdges = newEdges.filter((e) => !this._edges[e.id]);
        newEdges = this.filterInvalidEdges<EDT>(newEdges);
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

    public centerNodesOnView(): void {
        // this._container
        const nodes = Object.values(this._nodes) as GraphNode<unknown>[];
        const xs = nodes.map((n) => n.position.x);
        const ys = nodes.map((n) => n.position.y);

        const minx = Math.min(...xs);
        const maxx = Math.max(...xs);
        const miny = Math.min(...ys);
        const maxy = Math.max(...ys);

        const midx = (minx + maxx) / 2;
        const midy = (miny + maxy) / 2;

        const svgx = this._container.clientWidth / 2;
        const svgy = this._container.clientHeight / 2;

        nodes.forEach((n) => {
            n.position.x = n.position.x - midx + svgx;
            n.position.y = n.position.y - midy + svgy;
        });
    }

    public invalidate(): void {
        const layers = Object.values(this._layers) as GraphLayer[];
        layers.forEach((l) => l.invalidate());
    }

    public beginLayout(done: Function): void {
        const layer = this._layers[this._defaultLayerId] as GraphLayer;
        layer.beginLayout().then(() => done());
    }

    public addEventListener(type: string, callback: Listener, options?: boolean | AddEventListenerOptions): void {
        if (this._listeners[type]) {
            if (!this._listeners[type].includes(callback)) {
                this._listeners[type].push(callback);
            }
        } else {
            this._listeners[type] = [];
            this._listeners[type].push(callback);
        }
    }

    public dispatchEvent(event: Event): boolean {
        let dispatched = false;

        const listeners = this._listeners[event.type];
        if (listeners && listeners.length > 0) {
            listeners.forEach((listener) => {
                if (listener) {
                    dispatched = true;
                    if ("handleEvent" in listener) {
                        listener.handleEvent(event);
                    } else {
                        listener(event);
                    }
                }
            });
        }

        return dispatched;
    }

    public removeEventListener(type: string, callback: Listener, options?: boolean | EventListenerOptions): void {
        const listeners = this._listeners[type];
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
        }
    }

    public get container(): HTMLElement {
        return this._container;
    }

    public get graphObjectFactory(): IGraphObjectFactory {
        return this._factory;
    }

    private filterInvalidEdges<EDT>(newEdges: GraphEdge<EDT>[]): GraphEdge<EDT>[] {
        const validEdges: GraphEdge<EDT>[] = [];

        newEdges.forEach((edge) => {
            const startNodeId = edge.startNodeId;
            const endNodeId = edge.endNodeId;
            if (this._nodes[startNodeId] && this._nodes[endNodeId]) {
                validEdges.push(edge);
            }
        });

        return validEdges;
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
