export enum SchemaEdgeType {
    Contains = "Contains",
    ConfigRef = "ConfigRef",
}

export interface SchemaEdgeData {
    type: SchemaEdgeType;
}
