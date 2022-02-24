import { EnterElement, Selection } from "d3-selection";
import { Size } from "graph-js";
import { GroupSelection } from "graph-js/src/core/TypeDefinitions";
import { NodeItem } from "../nodes/SchemaNode";

interface NodeItemRow {
    item: NodeItem;
    height: number;
    offset: number;
}

const heights = {
    title: 32.0,
    "sub-title": 24.0,
    "category-heading": 32.0,
    "typed-item": 24.0,
};

export class SchemaNodeRows {
    private readonly _rows: NodeItemRow[] = [];

    constructor(items: NodeItem[]) {
        let offset = 0;
        items.forEach((item) => {
            const row: NodeItemRow = {
                item: item,
                height: heights[item.type],
                offset: offset,
            };

            this._rows.push(row);
            offset += row.height;
        });
    }

    public calcNodeSize(): Size {
        const width = 250; // Matches 'simple-node' style
        const height = this._rows.reduce((prev, curr) => prev + curr.height, 0);
        return { width, height };
    }

    public render(nodeGroup: GroupSelection): void {
        nodeGroup
            .selectAll<SVGGElement, NodeItemRow>("g")
            .data<NodeItemRow>(this._rows, (d) => `${d.item.type}-${d.item.primary}`)
            .join<SVGGElement>(SchemaNodeRows._generateRow)
            .attr("transform", (d, i) => `translate(0, ${d.offset})`)
            .each(SchemaNodeRows._augmentElement);
    }

    private static _generateRow(e: Selection<EnterElement, NodeItemRow, SVGGElement, any>) {
        const rowGroup = e.append("g");

        rowGroup.append("rect").attr("height", (d, i) => d.height);

        rowGroup
            .append("text")
            .attr("x", 10)
            .attr("y", (d, i) => d.height * 0.5)
            .text((d, i) => d.item.primary);

        return rowGroup;
    }

    // 'this' refers to the Element that this function is called for.
    private static _augmentElement(this: SVGGElement, datum: NodeItemRow): void {
        const element = this as Element;
        element.classList.add(datum.item.type);
    }
}
