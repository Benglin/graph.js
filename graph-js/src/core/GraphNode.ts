import { Rect } from "../data/Rect";
import { Size } from "../data/Size";
import { Vector } from "../data/Vector";
import { GraphObject } from "./GraphObject";
import { NodePort, NodePorts, initializePorts } from "./NodePort";

export enum NodeType {
    Basic = "Basic",
}

export interface GraphNodeOptions {
    nodeType: NodeType | string | undefined;
    position?: Vector;
    dimension?: Size;
}

export abstract class GraphNode<DataType> extends GraphObject {
    private readonly _nodeType: string;
    private readonly _rect: Rect;
    private readonly _data: DataType;
    private readonly _ports: NodePorts = {};

    constructor(data: DataType, options?: GraphNodeOptions) {
        super("node");

        this._nodeType = options?.nodeType ?? NodeType.Basic;

        const pos = options?.position ?? new Vector(10, 10);
        const dim = options?.dimension ?? new Size(320, 96);

        this._rect = new Rect(pos, dim);
        this._data = data;
        this.initialize();
    }

    public get nodeType(): string {
        return this._nodeType;
    }

    public get rect(): Rect {
        return this._rect;
    }

    public get data(): DataType {
        return this._data;
    }

    public getPort(portId: string): NodePort | undefined {
        return this._ports[portId];
    }

    protected abstract getNodePorts(): NodePort[];

    private initialize(): void {
        const incoming = this.getNodePorts();
        initializePorts(incoming);
        incoming.forEach((port) => (this._ports[port.id] = port));
    }
}
