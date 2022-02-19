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

        const heights = {
            title: 32.0,
            "sub-title": 24.0,
            "category-heading": 32.0,
            "typed-item": 24.0,
        };

        const colors = {
            title: "#3c3c3c",
            "sub-title": "#eeeeee",
            "category-heading": "#cccccc",
            "typed-item": "#ffffff",
        };

        const itemHeights = this._items.map((item) => heights[item.type]);

        const itemOffsets: number[] = [0];
        for (let index = 1; index < itemHeights.length; index++) {
            const prevHeight = itemHeights[index - 1];
            const prevOffset = itemOffsets[index - 1];
            itemOffsets.push(prevOffset + prevHeight + 1);
        }

        this._nodeGroup
            .selectAll("rect")
            .data(this._items)
            .join((e) => e.append("rect"))
            .attr("width", 200)
            .attr("height", (d, i) => itemHeights[i])
            .attr("x", 10)
            .attr("y", (d, i) => `${10 + itemOffsets[i]}`)
            .style("fill", (d) => colors[d.type]);
    }

    private _ensureGroupCreated(layerGroup: GroupSelection): void {
        if (!this._nodeGroup) {
            this._nodeGroup = layerGroup.append("g").attr("id", `${this.id}`);
        }
    }

    private static _enter(enter: EnterSelection) {
        return enter.append("rect");
    }
}
