import { BaseType, EnterElement, Selection } from "d3-selection";

import { GroupSelection } from "../core/Graph";
import { GraphNode } from "../core/GraphNode";
import { ViewObject } from "./ViewObject";

import "./styles/SimpleNode.css";

// TODO: Remove this temporary definition.
interface NodeItem {
    type: "title" | "sub-title" | "category-heading" | "typed-item";
    primary: string;
    secondary: string;
}

export type EnterSelection = Selection<EnterElement, NodeItem, HTMLElement, any>;
export type NodeElementType = BaseType | SVGRectElement;

export class SimpleNode extends ViewObject {
    private readonly _items: NodeItem[] = [];
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

        const itemHeights = this._items.map((item) => heights[item.type]);

        const itemOffsets: number[] = [];
        itemHeights.reduce((accumHeight, currHeight, index) => {
            itemOffsets[index] = accumHeight;
            return accumHeight + currHeight;
        }, 0);

        this._nodeGroup
            .selectAll("rect")
            .data(this._items)
            .join((e) => e.append("rect"))
            .attr("height", (d, i) => itemHeights[i])
            .attr("y", (d, i) => itemOffsets[i])
            .each(SimpleNode._augmentElement);
    }

    private _ensureGroupCreated(layerGroup: GroupSelection): void {
        if (!this._nodeGroup) {
            this._nodeGroup = layerGroup
                .append("g")
                .attr("id", `${this.id}`)
                .attr("transform", "translate(10, 10)")
                .classed("simple-node", true);
        }
    }

    // 'this' refers to the Element that this function is called for.
    private static _augmentElement(
        this: NodeElementType,
        datum: NodeItem,
        index: number,
        groups: NodeElementType[] | ArrayLike<NodeElementType>
    ): void {
        const element = this as Element;
        element.classList.add(datum.type);

        // Position the current element based on height of the previous one.
        if (index === 2) {
            const e = groups[index - 1] as Element;
            console.log(`Previous height: ${e.clientHeight}`);
        }
    }
}
