import { GraphNode, NodePort, Vector } from "graph-js";

export interface NodeItem {
    type: "title" | "sub-title" | "category-heading" | "typed-item";
    primary: string;
    secondary: string;
}

export class SchemaNodeData {
    private readonly _nodePorts: NodePort[];
    private readonly _nodeItems: NodeItem[];

    constructor(title: string) {
        this._nodePorts = [];
        this._nodeItems = [{ type: "title", primary: title, secondary: "" }];
    }

    public addPort(nodePort: NodePort): void {
        this._nodePorts.push({ id: nodePort.id, attachment: nodePort.attachment });
    }

    public get nodeItems(): NodeItem[] {
        return this._nodeItems;
    }

    public get nodePorts(): NodePort[] {
        return this._nodePorts;
    }
}

export class SchemaNode extends GraphNode<SchemaNodeData> {
    constructor(x: number, y: number, data: SchemaNodeData) {
        super(data, "simple-node", { position: new Vector(x, y) });
    }

    protected getNodePorts(): NodePort[] {
        return this.data.nodePorts;
    }
}
