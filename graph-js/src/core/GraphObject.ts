import { ObjectDescriptor, ObjectType } from "../data/ObjectDescriptor";

export class GraphObject<CustomDataType> {
    private readonly _descriptor: ObjectDescriptor<CustomDataType>;

    constructor(descriptor: ObjectDescriptor<CustomDataType>) {
        this._descriptor = descriptor;
    }

    public get id(): string {
        return this._descriptor.id;
    }

    public get objectType(): ObjectType {
        return this._descriptor.objectType;
    }

    public get objectSubType(): string {
        return this._descriptor.objectSubType;
    }

    public get data(): CustomDataType | undefined {
        return this._descriptor.customData;
    }

    public toSerializable(): Record<string, any> {
        return this._descriptor.toSerializable();
    }

    protected get descriptor(): ObjectDescriptor<CustomDataType> {
        return this._descriptor;
    }
}

export interface GraphObjects {
    [objectId: string]: GraphObject<unknown>;
}
