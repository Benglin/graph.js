import { NodeVisual } from "../core/NodeVisual";
import { NodeItem, SimpleNodeRows } from "./SimpleNodeRow";
import { GroupSelection } from "../core/TypeDefinitions";
import { IVisualContext, VisualContext } from "../core/VisualContext";
import { DragHandler } from "../utils/DragHandler";

import "./styles/SimpleNode.css";

interface SimpleVisualContext {
    nodeGroup: GroupSelection;
}

export class SimpleVisual extends NodeVisual {
    private readonly _items: NodeItem[] = [];
    private readonly _rows: SimpleNodeRows;

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

    render(context: IVisualContext, layerGroup: GroupSelection): void {
        const ctx = context as VisualContext<NodeItem[], SimpleVisualContext>;
        if (!ctx.context) {
            const id = ctx.node.id;
            ctx.context = { nodeGroup: SimpleVisual._createGroup(id, layerGroup) };
        }

        const nodeGroup = ctx.context.nodeGroup;
        this._rows.render(nodeGroup as GroupSelection);
    }

    private static _createGroup(id: string, layerGroup: GroupSelection): GroupSelection {
        const nodeGroup = layerGroup
            .append("g")
            .attr("id", `${id}`)
            .attr("transform", "translate(10, 10)")
            .classed("simple-node", true);

        // Register drag event handler
        new DragHandler<SVGGElement>(nodeGroup);
        return nodeGroup;
    }
}
