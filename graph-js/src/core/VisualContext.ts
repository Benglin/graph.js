import { GraphNode } from "./GraphNode";

export interface IVisualContext {}

export class VisualContext<DataType, ContextType> {
    private readonly _node: GraphNode<DataType>;
    private _context: ContextType | undefined;

    constructor(node: GraphNode<DataType>) {
        this._node = node;
    }

    public get node(): GraphNode<DataType> {
        return this._node;
    }

    public get context(): ContextType | undefined {
        return this._context;
    }

    public set context(value: ContextType | undefined) {
        this._context = value;
    }
}

export interface NodeVisualContextMap {
    [nodeId: string]: IVisualContext;
}
