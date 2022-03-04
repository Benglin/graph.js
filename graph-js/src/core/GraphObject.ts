import { ObjectDescriptor, ObjectType } from "../data/ObjectDescriptor";
import { GraphLayer } from "./GraphLayer";
import { GroupSelection } from "./TypeDefinitions";

export abstract class GraphObject<CustomDataType> {
    private readonly _descriptor: ObjectDescriptor<CustomDataType>;
    private _graphLayer: GraphLayer | undefined;

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

    public get graphLayer(): GraphLayer | undefined {
        return this._graphLayer;
    }

    public set graphLayer(value: GraphLayer | undefined) {
        this._graphLayer = value;
    }

    public toSerializable(): Record<string, any> {
        return this._descriptor.toSerializable();
    }

    public abstract render(svgGroup: GroupSelection): void;

    protected get descriptor(): ObjectDescriptor<CustomDataType> {
        return this._descriptor;
    }
}

export interface GraphObjects {
    [objectId: string]: GraphObject<unknown>;
}
