import { GraphObject } from "./GraphObject";

export interface EdgeDescriptor<DataType> {
    startNodeId: string;
    startPortId: string;
    endNodeId: string;
    endPortId: string;
    edgeType: string;
    edgeData: DataType;
}

export class GraphEdge<EdgeDataType> extends GraphObject {
    private readonly _descriptor: EdgeDescriptor<EdgeDataType>;

    constructor(descriptor: EdgeDescriptor<EdgeDataType>) {
        super(descriptor.edgeType);
        this._descriptor = descriptor;
    }

    public get startNodeId(): string {
        return this.descriptor.startNodeId;
    }

    public get startPortId(): string {
        return this.descriptor.startPortId;
    }

    public get endNodeId(): string {
        return this.descriptor.endNodeId;
    }

    public get endPortId(): string {
        return this.descriptor.endPortId;
    }

    public get descriptor(): EdgeDescriptor<EdgeDataType> {
        return this._descriptor;
    }
}
