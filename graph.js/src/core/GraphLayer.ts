import { Graph } from "./Graph";
import { GraphNode } from "./GraphNode";
import { GraphObject, GraphObjectIdMap } from "./GraphObject";

export enum LayerName {
    Default = "Default",
    Interactive = "Interactive",
}

export class GraphLayer extends GraphObject {
    private readonly _graph: Graph;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    private readonly _graphObjects: GraphObjectIdMap = {};

    constructor(graph: Graph, layerName: LayerName) {
        super(`layer-${layerName}`);

        this._graph = graph;
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d") as CanvasRenderingContext2D;

        const parentElement = graph.parentElement;
        parentElement.appendChild(this._canvas);
    }

    public handleContainerResized(width: number, height: number): void {
        this._canvas.width = width;
        this._canvas.height = height;
    }

    public invalidate(): void {
        const w = this._canvas.clientWidth - 20;
        const h = this._canvas.clientHeight - 20;
        this._context.fillStyle = "green";
        this._context.fillRect(10, 10, w, h);

        const objects = Object.values(this._graphObjects);
        objects.forEach((go) => {
            const view = this._graph.getObjectView(go.id);
            view?.render(go as GraphNode, this._context);
        });
    }

    public addObjects(graphObjects: GraphObject[]): void {
        graphObjects.forEach((go) => (this._graphObjects[go.id] = go));
    }

    public removeObjects(objectIds: string[]): void {
        objectIds.forEach((id) => delete this._graphObjects[id]);
    }
}
