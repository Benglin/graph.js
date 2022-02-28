import { GraphNode } from "graph-js";

export interface NodeItem {
    type: "title" | "sub-title" | "category-heading" | "typed-item";
    primary: string;
    secondary: string;
}

export class SchemaNodeData {
    private readonly _nodeItems: NodeItem[];

    constructor(title: string) {
        this._nodeItems = [{ type: "title", primary: title, secondary: "" }];
    }

    public get nodeItems(): NodeItem[] {
        return this._nodeItems;
    }
}

export class SchemaNode extends GraphNode<SchemaNodeData> {
    constructor(data: SchemaNodeData) {
        super("simple-node", data);
    }

    public static fromData(data: any): SchemaNode {
        const snd = new SchemaNodeData(data.nodeItems[0].primary);
        return new SchemaNode(snd);
    }
}
