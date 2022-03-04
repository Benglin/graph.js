import { NodeDescriptor } from "../data/ObjectDescriptor";
import { Size } from "../data/Size";
import { Vector } from "../data/Vector";
import { GraphObject } from "./GraphObject";
import { NodePort } from "./NodePort";

export abstract class GraphNode<CustomDataType> extends GraphObject<CustomDataType> {
    constructor(descriptor: NodeDescriptor<CustomDataType>) {
        super(descriptor);
    }

    public get position(): Vector {
        return this.getDescriptor().position;
    }

    public get dimension(): Size {
        return this.getDescriptor().dimension;
    }

    public get ports(): NodePort[] {
        return Object.values(this.getDescriptor().ports);
    }

    public getPort(portId: string): NodePort | undefined {
        return this.getDescriptor().ports[portId];
    }

    public setPosition(x: number, y: number): void {
        this.getDescriptor().setPosition(x, y);
    }

    public setDimension(width: number, height: number): void {
        this.getDescriptor().setDimension(width, height);
    }

    public toGraphCoords(position: Vector): Vector {
        const pos = this.getDescriptor().position;
        const x = position.x + pos.x;
        const y = position.y + pos.y;
        return new Vector(x, y);
    }

    private getDescriptor(): NodeDescriptor<CustomDataType> {
        return this.descriptor as NodeDescriptor<CustomDataType>;
    }
}
