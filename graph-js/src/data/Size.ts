export class Size {
    private _width: number;
    private _height: number;

    constructor(width: number, height: number) {
        this._width = width | 0;
        this._height = height | 0;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public set width(value: number) {
        this._width = value;
    }

    public set height(value: number) {
        this._height = value;
    }
}
