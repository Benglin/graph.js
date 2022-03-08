import { Selection, EnterElement } from "d3-selection";

import { NodeDescriptor } from "../data/ObjectDescriptor";
import { Size } from "../data/Size";
import { Vector } from "../data/Vector";
import { DragHandler } from "../utils/DragHandler";
import { GraphObject } from "./GraphObject";
import { NodePort, positionNodePorts } from "./NodePort";
import { GroupSelection } from "./TypeDefinitions";

export abstract class GraphNode<CustomDataType> extends GraphObject<CustomDataType> {
    private _nodeGroup: GroupSelection | undefined;

    constructor(descriptor: NodeDescriptor<CustomDataType>) {
        super(descriptor);
    }

    public get position(): Vector {
        return this._getDescriptor().position;
    }

    public get dimension(): Size {
        return this._getDescriptor().dimension;
    }

    public get ports(): NodePort[] {
        return Object.values(this._getDescriptor().ports);
    }

    public getPort(portId: string): NodePort | undefined {
        return this._getDescriptor().ports[portId];
    }

    public setPosition(x: number, y: number): void {
        this._getDescriptor().setPosition(x, y);
        if (this._nodeGroup) {
            this._nodeGroup.attr("transform", `translate(${x}, ${y})`);
        }
    }

    public setDimension(width: number, height: number): void {
        this._getDescriptor().setDimension(width, height);
    }

    public toGraphCoords(position: Vector): Vector {
        const pos = this._getDescriptor().position;
        const x = position.x + pos.x;
        const y = position.y + pos.y;
        return new Vector(x, y);
    }

    public render(nodesGroup: GroupSelection): void {
        if (!this._nodeGroup) {
            const pos = this.position;
            this._nodeGroup = nodesGroup
                .append("g")
                .attr("id", `${this.id}`)
                .attr("transform", `translate(${pos.x}, ${pos.y})`)
                .classed("graph-node", true);

            if (this.graphLayer) {
                const dragHandler = new DragHandler<SVGGElement>(this.graphLayer, this.id);
                dragHandler.createDragHandler(this._nodeGroup);
            }
        }

        // Calculate port positions before drawing them.
        positionNodePorts(this.ports, this.dimension);

        this._nodeGroup
            .selectChildren<SVGCircleElement, NodePort>("circle")
            .data<NodePort>(this.ports, (d) => d.id)
            .join(GraphNode._createPorts);

        this.renderCore(this._nodeGroup);
    }

    private _getDescriptor(): NodeDescriptor<CustomDataType> {
        return this.descriptor as NodeDescriptor<CustomDataType>;
    }

    private static _createPorts(
        elem: Selection<EnterElement, NodePort, SVGGElement, unknown>
    ): Selection<SVGCircleElement, NodePort, SVGGElement, unknown> {
        return elem
            .append("circle")
            .attr("r", "3.5")
            .attr("cx", (d) => d.position?.x || "0.0")
            .attr("cy", (d) => d.position?.y || "0.0");
    }

    protected abstract renderCore(nodeGroup: GroupSelection): void;
}
