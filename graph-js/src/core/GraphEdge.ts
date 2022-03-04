import { GraphObject } from "./GraphObject";
import { EdgeDescriptor } from "../data/ObjectDescriptor";
import { GroupSelection } from "./TypeDefinitions";

export abstract class GraphEdge<CustomDataType> extends GraphObject<CustomDataType> {
    constructor(descriptor: EdgeDescriptor<CustomDataType>) {
        super(descriptor);
    }

    public get startNodeId(): string {
        return this._getDescriptor().startNodeId;
    }

    public get startPortId(): string {
        return this._getDescriptor().startPortId;
    }

    public get endNodeId(): string {
        return this._getDescriptor().endNodeId;
    }

    public get endPortId(): string {
        return this._getDescriptor().endPortId;
    }

    public render(edgesGroup: GroupSelection): void {
        this.renderCore(edgesGroup);
    }

    private _getDescriptor(): EdgeDescriptor<CustomDataType> {
        return this.descriptor as EdgeDescriptor<CustomDataType>;
    }

    protected abstract renderCore(edgesGroup: GroupSelection): void;
}
