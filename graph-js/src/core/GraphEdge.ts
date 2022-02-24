import { NodePort } from "./NodePort";
import { GraphObject } from "./GraphObject";

export interface EdgeDescriptor {
    startNodeId: string;
    startPortId: string;
    endNodeId: string;
    endPortId: string;
    edgeType?: string;
}

export class GraphEdge extends GraphObject {
    private readonly _descriptor: EdgeDescriptor;

    constructor(descriptor: EdgeDescriptor) {
        super(descriptor.edgeType ?? "edge");
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

    public get descriptor(): EdgeDescriptor {
        return this._descriptor;
    }
}
