import { Graph } from "../core/Graph";

export interface NodePosition {
    id: string;
    x: number;
    y: number;
}

export interface LayoutCallback {
    (type: "tick" | "end", positions: NodePosition[]): void;
}

export abstract class LayoutStrategy {
    private readonly _graph: Graph;
    private _callback: LayoutCallback | undefined;

    constructor(graph: Graph) {
        this._graph = graph;
    }

    protected get graph(): Graph {
        return this._graph;
    }

    protected get callback(): LayoutCallback {
        return this._callback as LayoutCallback;
    }

    public beginLayout(callback: LayoutCallback): void {
        this._callback = callback;
        this.beginLayoutCore();
    }

    protected abstract beginLayoutCore(): void;
}
