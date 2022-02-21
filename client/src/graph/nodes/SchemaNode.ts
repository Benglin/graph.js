import { GraphNode } from "graph-js";

export interface NodeItem {
    type: "title" | "sub-title" | "category-heading" | "typed-item";
    primary: string;
    secondary: string;
}

export interface SchemaData {
    nodeItems: NodeItem[];
}

export class SchemaNode extends GraphNode<SchemaData> {
    constructor() {
        const items: NodeItem[] = [
            { type: "title", primary: "release", secondary: "2.0.1" },
            { type: "typed-item", primary: "releaseFlcItemUrn", secondary: "String" },
            { type: "category-heading", primary: "release", secondary: "2.0.0" },
            { type: "typed-item", primary: "releaseDate", secondary: "String" },
            { type: "typed-item", primary: "approvedBy", secondary: "String" },
            { type: "typed-item", primary: "approvers", secondary: "String" },
            { type: "typed-item", primary: "owner", secondary: "String" },
            { type: "category-heading", primary: "modelInfo", secondary: "1.0.0" },
            { type: "typed-item", primary: "urn", secondary: "String" },
            { type: "typed-item", primary: "descriptor", secondary: "String" },
            { type: "typed-item", primary: "revision", secondary: "String" },
            { type: "typed-item", primary: "lifecycle", secondary: "String" },
            { type: "typed-item", primary: "isLocked", secondary: "Bool" },
            { type: "typed-item", primary: "isWorking", secondary: "Bool" },
            { type: "category-heading", primary: "eco", secondary: "1.0.0" },
            { type: "typed-item", primary: "urn", secondary: "String" },
            { type: "typed-item", primary: "affectedBy", secondary: "String" },
        ];

        const schemaData: SchemaData = { nodeItems: [] };
        items.forEach((i) => schemaData.nodeItems.push(i));
        super(schemaData);
    }
}
