import { Rect } from "../data/Rect";
import { Size } from "../data/Size";
import { Vector } from "../data/Vector";
import { GraphObject } from "./GraphObject";

export enum NodeType {
    Basic = "Basic",
}

export interface GraphNodeOptions {
    nodeType: NodeType | string | undefined;
}

export class GraphNode<DataType> extends GraphObject {
    private readonly _nodeType: string;
    private readonly _rect: Rect;
    private readonly _data: DataType;

    constructor(data: DataType, options?: GraphNodeOptions) {
        super("node");

        this._nodeType = options?.nodeType ?? NodeType.Basic;
        this._rect = new Rect(new Vector(10, 10), new Size(320, 96));
        this._data = data;
    }

    public get nodeType(): string {
        return this._nodeType;
    }

    public get rect(): Rect {
        return this._rect;
    }

    public get data(): DataType {
        return this._data;
    }
}
