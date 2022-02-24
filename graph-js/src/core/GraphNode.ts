import { Rect } from "../data/Rect";
import { Size } from "../data/Size";
import { Vector } from "../data/Vector";
import { GraphObject } from "./GraphObject";
import { NodePort, NodePorts, initializePorts } from "./NodePort";

export interface GraphNodeOptions {
    position?: Vector;
    dimension?: Size;
}

export abstract class GraphNode<DataType> extends GraphObject {
    private readonly _rect: Rect;
    private readonly _data: DataType;
    private readonly _ports: NodePorts = {};

    constructor(data: DataType, objectType: string, options?: GraphNodeOptions) {
        super(objectType);

        const pos = options?.position ?? new Vector(10, 10);
        const dim = options?.dimension ?? new Size(320, 96);

        this._rect = new Rect(pos, dim);
        this._data = data;
        this.initialize();
    }

    public get rect(): Rect {
        return this._rect;
    }

    public get data(): DataType {
        return this._data;
    }

    public get ports(): NodePort[] {
        return Object.values(this._ports);
    }

    public getPort(portId: string): NodePort | undefined {
        return this._ports[portId];
    }

    public setPosition(x: number, y: number): void {
        this._rect.position.x = x;
        this._rect.position.y = y;
    }

    public setDimension(width: number, height: number): void {
        this._rect.size.width = width;
        this._rect.size.height = height;
    }

    public toGraphCoords(position: Vector): Vector {
        const x = position.x + this._rect.position.x;
        const y = position.y + this._rect.position.y;
        return new Vector(x, y);
    }

    protected abstract getNodePorts(): NodePort[];

    private initialize(): void {
        const incoming = this.getNodePorts();
        initializePorts(incoming);
        incoming.forEach((port) => (this._ports[port.id] = port));
    }
}
