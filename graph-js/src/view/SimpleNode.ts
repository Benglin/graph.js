import { GraphNode } from "../core/GraphNode";
import { ViewObject } from "./ViewObject";
import { NodeItem, SimpleNodeRows } from "./SimpleNodeRow";
import { GroupSelection } from "../core/TypeDefinitions";
import { DragHandler } from "../utils/DragHandler";

import "./styles/SimpleNode.css";

export class SimpleNode extends ViewObject {
    private readonly _items: NodeItem[] = [];
    private readonly _rows: SimpleNodeRows;
    private _nodeGroup: GroupSelection | undefined;

    constructor() {
        super("simple-node");

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

        items.forEach((i) => this._items.push(i));
        this._rows = new SimpleNodeRows(items);
    }

    render(node: GraphNode, layerGroup: GroupSelection): void {
        this._ensureGroupCreated(layerGroup);

        if (!this._nodeGroup) {
            return;
        }

        this._rows.render(this._nodeGroup as GroupSelection);
    }

    private _ensureGroupCreated(layerGroup: GroupSelection): void {
        if (!this._nodeGroup) {
            this._nodeGroup = layerGroup
                .append("g")
                .attr("id", `${this.id}`)
                .attr("transform", "translate(10, 10)")
                .classed("simple-node", true);

            // Register drag event handler
            new DragHandler<SVGGElement>(this._nodeGroup);
        }
    }
}
