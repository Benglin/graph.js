import { GraphObject } from "./GraphObject";

export interface IVisualContext {
    readonly created: boolean;
}

export class VisualContext<ContextType> implements IVisualContext {
    private readonly _graphObject: GraphObject;
    private _context: ContextType | undefined;

    constructor(graphObject: GraphObject) {
        this._graphObject = graphObject;
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
