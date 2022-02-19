import { Size } from "./Size";
import { Vector } from "./Vector";

export class Rect {
    private readonly _position;
    private readonly _size;

    constructor(position: Vector, size: Size) {
        this._position = position;
        this._size = size;
    }

    get position(): Vector {
        return this._position;
    }

    get size(): Size {
        return this._size;
    }
}
