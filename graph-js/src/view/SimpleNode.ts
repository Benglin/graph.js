import { EnterElement, Selection } from "d3-selection";

import { GroupSelection } from "../core/Graph";
import { GraphNode } from "../core/GraphNode";
import { ViewObject } from "./ViewObject";

// TODO: Remove this temporary definition.
interface NodeItems {
    type: "title" | "sub-title" | "category-heading" | "typed-item";
    primary: string;
    secondary: string;
}

export type EnterSelection = Selection<EnterElement, NodeItems, HTMLElement, any>;

export class SimpleNode extends ViewObject {
    private readonly _items: NodeItems[] = [];
    private _nodeGroup: GroupSelection | undefined;

    constructor() {
        super("simple-node");

        const items: NodeItems[] = [
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
    }

    render(node: GraphNode, layerGroup: GroupSelection): void {
        this._ensureGroupCreated(layerGroup);

        if (!this._nodeGroup) {
            return;
        }

        this._nodeGroup
            .data(this._items)
            .join(SimpleNode._enter)
            .attr("x", 10)
            .attr("y", (d, i) => `${10 + i * 16.0}`)
            .style("fill", "orange");
    }

    private _ensureGroupCreated(layerGroup: GroupSelection): void {
        if (!this._nodeGroup) {
            this._nodeGroup = layerGroup.append("g");
        }
    }

    private static _enter(enter: EnterSelection) {
        return enter.append("rect");
    }
}
