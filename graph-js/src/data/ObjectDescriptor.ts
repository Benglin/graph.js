import { NodePort, NodePorts } from "../core/NodePort";
import { Size } from "./Size";
import { Vector } from "./Vector";

export enum ObjectType {
    Node = "node",
    Edge = "edge",
}

export class ObjectDescriptor<CustomDataType> {
    private readonly _id: string;
    private readonly _objectType: ObjectType;
    private readonly _objectSubType: string;

    private _customData: CustomDataType | undefined;

    constructor(id: string, objectType: ObjectType, objectSubType: string) {
        this._id = id;
        this._objectType = objectType;
        this._objectSubType = objectSubType;
    }

    public get id(): string {
        return this._id;
    }

    public get objectType(): ObjectType {
        return this._objectType;
    }

    public get objectSubType(): string {
        return this._objectSubType;
    }

    public get customData(): CustomDataType | undefined {
        return this._customData;
    }

    public set customData(value: CustomDataType | undefined) {
        this._customData = value;
    }

    public toSerializable(): Object {
        const serializable = {
            id: this._id,
            objectType: this._objectType,
            objectSubType: this._objectSubType,
        };

        if (this._customData) {
            const data = JSON.parse(JSON.stringify(this._customData));
            Object.assign(serializable, { customData: data });
        }

        return serializable;
    }
}

export class NodeDescriptor<CustomDataType> extends ObjectDescriptor<CustomDataType> {
    private readonly _ports: NodePorts = {};

    private _position: Vector = new Vector(0, 0);
    private _dimension: Size = new Size(0, 0);

    constructor(id: string, objectSubType: string) {
        super(id, ObjectType.Node, objectSubType);
    }

    public get position(): Vector {
        return this._position;
    }

    public get dimension(): Size {
        return this._dimension;
    }

    public get ports(): NodePorts {
        return this._ports;
    }

    public setPosition(x: number, y: number): void {
        this._position.x = x;
        this._position.y = y;
    }

    public setDimension(width: number, height: number): void {
        this._dimension.width = width;
        this._dimension.height = height;
    }

    public addPort(port: NodePort): void {
        this._ports[port.id] = { ...port };
    }

    public toSerializable(): Object {
        const serializable = super.toSerializable();

        const ports: NodePorts = {};
        Object.entries(this._ports).forEach(([portId, port]) => {
            ports[portId] = { ...port };
        });

        Object.assign(serializable, {
            position: { x: this._position.x, y: this._position.y },
            dimension: { width: this._dimension.width, height: this._dimension.height },
            ports: ports,
        });

        return serializable;
    }

    public fromSerializable(serializable: { [key: string]: any }): NodeDescriptor<unknown> {
        const id = serializable["id"];
        const objectSubType = serializable["objectSubType"];

        const desc = new NodeDescriptor(id, objectSubType);
        desc.customData = serializable["customData"];
        desc.setPosition(serializable["position"].x, serializable["position"].y);
        desc.setDimension(serializable["dimension"].width, serializable["dimension"].height);

        if (serializable["ports"]) {
            const ports = Object.values(serializable["ports"]) as NodePort[];
            ports.forEach((port: NodePort) => desc.addPort(port));
        }

        return desc;
    }
}

export class EdgeDescriptor<CustomDataType> extends ObjectDescriptor<CustomDataType> {
    private _startNodeId: string = "";
    private _startPortId: string = "";
    private _endNodeId: string = "";
    private _endPortId: string = "";

    constructor(id: string, objectSubType: string) {
        super(id, ObjectType.Edge, objectSubType);
    }

    public get startNodeId(): string {
        return this._startNodeId;
    }

    public get startPortId(): string {
        return this._startPortId;
    }

    public get endNodeId(): string {
        return this._endNodeId;
    }

    public get endPortId(): string {
        return this._endPortId;
    }

    public set startNodeId(value: string) {
        this._startNodeId = value;
    }

    public set startPortId(value: string) {
        this._startPortId = value;
    }

    public set endNodeId(value: string) {
        this._endNodeId = value;
    }

    public set endPortId(value: string) {
        this._endPortId = value;
    }

    public toSerializable(): Object {
        const serializable = super.toSerializable();

        Object.assign(serializable, {
            startNodeId: this._startNodeId,
            startPortId: this._startPortId,
            endNodeId: this._endNodeId,
            endPortId: this._endPortId,
        });

        return serializable;
    }

    public fromSerializable(serializable: { [key: string]: any }): EdgeDescriptor<unknown> {
        const id = serializable["id"];
        const objectSubType = serializable["objectSubType"];

        const desc = new EdgeDescriptor(id, objectSubType);
        desc.customData = serializable["customData"];
        desc.startNodeId = serializable["startNodeId"];
        desc.startPortId = serializable["startPortId"];
        desc.endNodeId = serializable["endNodeId"];
        desc.endPortId = serializable["endPortId"];

        return desc;
    }
}
