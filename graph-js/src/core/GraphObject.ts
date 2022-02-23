import { v4 as uuidv4 } from "uuid";

export class GraphObject {
    private readonly _id: string;

    constructor(idPrefix: string) {
        this._id = `${idPrefix}-${uuidv4()}`;
    }

    public get id(): string {
        return this._id;
    }
}

export interface GraphObjectIdMap {
    [objectId: string]: GraphObject;
}
