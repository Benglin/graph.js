import { v4 as uuidv4 } from "uuid";
import { IVisualContext } from "./VisualContext";
import { GroupSelection } from "./TypeDefinitions";
import { Size } from "../data/Size";

export interface INodeVisual {
    readonly id: string;
    createVisualContext(visctx: IVisualContext): void;
    calcNodeSize(visctx: IVisualContext): Size;
    render(visctx: IVisualContext, layerGroup: GroupSelection): void;
}

export abstract class NodeVisual implements INodeVisual {
    private readonly _id: string;

    constructor(idPrefix: string) {
        this._id = `${idPrefix}-${uuidv4()}`;
    }

    public get id(): string {
        return this._id;
    }

    public abstract createVisualContext(visctx: IVisualContext): void;
    public abstract calcNodeSize(visctx: IVisualContext): Size;
    public abstract render(visctx: IVisualContext, layerGroup: GroupSelection): void;
}

export interface ViewObjectIdMap {
    [nodeId: string]: INodeVisual;
}
