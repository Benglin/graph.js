import { drag } from "d3-drag";
import { select, Selection } from "d3-selection";
import { GraphLayer } from "../core/GraphLayer";

export enum DragEventName {
    Start = "start",
    Drag = "drag",
    End = "end",
}

export interface DragEvent {
    name: DragEventName;
    nodeId: string;
    x: number;
    y: number;
}

export class DragHandler<T extends Element> {
    private readonly _graphLayer: GraphLayer;
    private readonly _nodeId: string;

    private _deltaX: number = 0;
    private _deltaY: number = 0;

    constructor(graphLayer: GraphLayer, nodeId: string) {
        this._graphLayer = graphLayer;
        this._nodeId = nodeId;
    }

    public createDragHandler(selection: Selection<T, unknown, null, undefined>): void {
        const thisObject = this;

        const dragHandler = drag<T, unknown>()
            .on(DragEventName.Start, function (this: Element, event: any) {
                const current = select(this);
                const coords = DragHandler.stringToValues(current.attr("transform"));
                thisObject._deltaX = coords.x - event.x;
                thisObject._deltaY = coords.y - event.y;
                thisObject.raiseDragEvent(DragEventName.Start, coords.x, coords.y);
            })
            .on(DragEventName.Drag, function (this: Element, event: any) {
                const x = event.x + thisObject._deltaX;
                const y = event.y + thisObject._deltaY;
                select(this).attr("transform", `translate(${x}, ${y})`);
                thisObject.raiseDragEvent(DragEventName.Drag, x, y);
            })
            .on(DragEventName.End, function (this: Element, event: any) {
                const x = event.x + thisObject._deltaX;
                const y = event.y + thisObject._deltaY;
                select(this).attr("transform", `translate(${x}, ${y})`);
                thisObject.raiseDragEvent(DragEventName.End, x, y);
            });

        dragHandler(selection);
    }

    private raiseDragEvent(name: DragEventName, x: number, y: number): void {
        this._graphLayer.handleDragEvent({ name, nodeId: this._nodeId, x, y });
    }

    private static stringToValues(trans: string): { x: number; y: number } {
        const regExp = /\(([^)]+)\)/;
        const matches = regExp.exec(trans) as RegExpExecArray;
        const coords = matches[1].split(",");
        return { x: parseInt(coords[0]), y: parseInt(coords[1]) };
    }
}
