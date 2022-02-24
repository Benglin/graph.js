import { v4 as uuidv4 } from "uuid";

export class GraphObject {
    private readonly _id: string;
    private readonly _objectType: string;

    constructor(idPrefix: string, objectType: string) {
        this._id = `${idPrefix}-${uuidv4()}`;
        this._objectType = objectType;
    }

    public get id(): string {
        return this._id;
    }

    public get objectType(): string {
        return this._objectType;
    }
}

export interface GraphObjectIdMap {
    [objectId: string]: GraphObject;
}
