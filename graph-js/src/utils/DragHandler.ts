import { drag } from "d3-drag";
import { select, Selection } from "d3-selection";

export class DragHandler<T extends Element> {
    private _deltaX: number = 0;
    private _deltaY: number = 0;

    constructor(selection: Selection<T, unknown, HTMLElement, any>) {
        const thisObject = this;

        const dragHandler = drag<T, unknown>()
            .on("start", function (this: Element, event: any) {
                const current = select(this);
                const coords = DragHandler.stringToValues(current.attr("transform"));
                thisObject._deltaX = coords.x - event.x;
                thisObject._deltaY = coords.y - event.y;
            })
            .on("drag", function (this: Element, event: any) {
                const x = event.x + thisObject._deltaX;
                const y = event.y + thisObject._deltaY;
                select(this).attr("transform", `translate(${x}, ${y})`);
            });

        dragHandler(selection);
    }

    private static stringToValues(trans: string): { x: number; y: number } {
        const regExp = /\(([^)]+)\)/;
        const matches = regExp.exec(trans) as RegExpExecArray;
        const coords = matches[1].split(",");
        return { x: parseInt(coords[0]), y: parseInt(coords[1]) };
    }
}
