import { GraphNode, Vector } from "graph-js";

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
    constructor(x: number, y: number, data: SchemaNodeData) {
        super(data, "simple-node", { position: new Vector(x, y) });
    }
}
