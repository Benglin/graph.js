import { EdgeDescriptor, GraphEdge } from "graph-js";

export enum SchemaEdgeType {
    Contains = "Contains",
    ConfigRef = "ConfigRef",
    RowRef = "RowRef",
    TableRef = "TableRef",
    MemberRef = "MemberRef",
    AssemblyRef = "AssemblyRef",
    Use = "Use",
    Describe = "Describe",
    Derive = "Derive",
}

export interface SchemaEdgeData {
    type: SchemaEdgeType;
}

export class SchemaEdge extends GraphEdge<SchemaEdgeData> {
    public static fromData(data: any): SchemaEdge {
        const descriptor: EdgeDescriptor<SchemaEdgeData> = {
            startNodeId: "",
            startPortId: "",
            endNodeId: "",
            endPortId: "",
            edgeType: "",
            edgeData: data,
        };

        return new SchemaEdge(descriptor);
    }
}
