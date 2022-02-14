import { Rect } from "../data/Rect";
import { Size } from "../data/Size";
import { Vector } from "../data/Vector";
import { GraphObject } from "./GraphObject";

export class GraphNode extends GraphObject {
    private readonly _rect: Rect;

    constructor() {
        super("node");
        this._rect = new Rect(new Vector(10, 10), new Size(320, 96));
    }

    public get rect(): Rect {
        return this._rect;
    }
}
