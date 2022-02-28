import { EdgeDescriptor, GraphEdge } from "graph-js";

export enum SchemaEdgeType {
    Contains = "Contains",
    ConfigRef = "ConfigRef",
}

export interface SchemaEdgeData {
    type: SchemaEdgeType;
}

export class SchemaEdge extends GraphEdge<SchemaEdgeData> {
    public static fromData(data: EdgeDescriptor<SchemaEdgeData>): SchemaEdge {
        return new SchemaEdge(data);
    }
}
