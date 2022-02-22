export class GraphObject {
    private readonly _id: string;

    constructor(idPrefix: string) {
        const id = Math.random().toString().substring(2);
        this._id = `${idPrefix}-${id}`;
    }

    public get id(): string {
        return this._id;
    }
}

export interface GraphObjectIdMap {
    [objectId: string]: GraphObject;
}
