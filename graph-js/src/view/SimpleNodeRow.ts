import { EnterElement, Selection } from "d3-selection";
import { GroupSelection } from "../core/TypeDefinitions";

// TODO: Remove this temporary definition.
export interface NodeItem {
    type: "title" | "sub-title" | "category-heading" | "typed-item";
    primary: string;
    secondary: string;
}


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

export class SimpleNodeRows {
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

    public render(nodeGroup: GroupSelection): void {
        nodeGroup
            .selectAll<SVGGElement, NodeItemRow>("g")
            .data(this._rows)
            .join<SVGGElement>(SimpleNodeRows._generateRow)
            .attr("transform", (d, i) => `translate(0, ${d.offset})`)
            .each(SimpleNodeRows._augmentElement);
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
