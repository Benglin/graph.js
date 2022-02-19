import { GroupSelection } from "../core/Graph";
import { GraphNode } from "../core/GraphNode";

export interface NodeView {
    render(node: GraphNode, layerGroup: GroupSelection): void;
}

export abstract class ViewObject implements NodeView {
    private readonly _id: string;

    constructor(idPrefix: string) {
        const id = Math.random().toString().substring(2);
        this._id = `${idPrefix}-id`;
    }

    public get id(): string {
        return this._id;
    }

    public abstract render(node: GraphNode, layerGroup: GroupSelection): void;
}

export interface ViewObjectIdMap {
    [objectId: string]: ViewObject;
}
