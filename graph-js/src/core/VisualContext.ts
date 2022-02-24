import { Graph } from "./Graph";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { GraphObject } from "./GraphObject";

export interface IVisualContext {
    readonly created: boolean;

    getNode(nodeId: string): GraphNode<unknown> | undefined;
    getEdge(edgeId: string): GraphEdge | undefined;
}

export class VisualContext<ContextType> implements IVisualContext {
    private readonly _graph: Graph;
    private readonly _graphObject: GraphObject;
    private _context: ContextType | undefined;

    constructor(graph: Graph, graphObject: GraphObject) {
        this._graph = graph;
        this._graphObject = graphObject;
    }

    getNode(nodeId: string): GraphNode<unknown> | undefined {
        return this._graph.getNode(nodeId);
    }

    getEdge(edgeId: string): GraphEdge | undefined {
        return this._graph.getEdge(edgeId);
    }

    public get created(): boolean {
        return !!this._context;
    }

    public get graphObject(): GraphObject {
        return this._graphObject;
    }

    public get context(): ContextType | undefined {
        return this._context;
    }

    public set context(value: ContextType | undefined) {
        this._context = value;
    }
}

export interface VisualContextMap {
    [objectId: string]: IVisualContext;
}
