import { GraphObject } from "./GraphObject";
import { EdgeDescriptor } from "../data/ObjectDescriptor";

export class GraphEdge<CustomDataType> extends GraphObject<CustomDataType> {
    constructor(descriptor: EdgeDescriptor<CustomDataType>) {
        super(descriptor);
    }

    public get startNodeId(): string {
        return this.getDescriptor().startNodeId;
    }

    public get startPortId(): string {
        return this.getDescriptor().startPortId;
    }

    public get endNodeId(): string {
        return this.getDescriptor().endNodeId;
    }

    public get endPortId(): string {
        return this.getDescriptor().endPortId;
    }

    private getDescriptor(): EdgeDescriptor<CustomDataType> {
        return this.descriptor as EdgeDescriptor<CustomDataType>;
    }
}
