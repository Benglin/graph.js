import { Rect } from "../data/Rect";
import { Size } from "../data/Size";
import { Vector } from "../data/Vector";
import { GraphObject } from "./GraphObject";
import { NodePort, NodePorts, initializePorts } from "./NodePort";

export abstract class GraphNode<NodeDataType> extends GraphObject {
    private readonly _rect: Rect;
    private readonly _data: NodeDataType;
    private readonly _ports: NodePorts = {};

    constructor(objectType: string, data: NodeDataType) {
        super(objectType);

        const pos = new Vector(10, 10);
        const dim = new Size(320, 96);
        this._rect = new Rect(pos, dim);
        this._data = data;
    }

    public get rect(): Rect {
        return this._rect;
    }

    public get data(): NodeDataType {
        return this._data;
    }

    public get ports(): NodePort[] {
        return Object.values(this._ports);
    }

    public addPorts(nodePorts: NodePort[]): void {
        // Merge new ports with existing ones before positioning all.
        nodePorts.forEach((port) => (this._ports[port.id] = port));
        initializePorts(Object.values(this._ports));
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
}
