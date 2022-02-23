import { v4 as uuidv4 } from "uuid";
import { IVisualContext } from "./VisualContext";
import { GroupSelection } from "./TypeDefinitions";

export interface INodeVisual {
    readonly id: string;
    render(context: IVisualContext, layerGroup: GroupSelection): void;
}

export abstract class NodeVisual implements INodeVisual {
    private readonly _id: string;

    constructor(idPrefix: string) {
        this._id = `${idPrefix}-${uuidv4()}`;
    }

    public get id(): string {
        return this._id;
    }

    public abstract render(context: IVisualContext, layerGroup: GroupSelection): void;
}

export interface ViewObjectIdMap {
    [nodeId: string]: INodeVisual;
}
