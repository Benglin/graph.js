import { EnterElement, Selection } from "d3-selection";
import { Size } from "graph-js";
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
        const width = 200; // Matches 'simple-node' style
        const height = this._rows.reduce((prev, curr) => prev + curr.height, 0);
        return { width, height };
    }

    public render(nodeGroup: Selection<Element, unknown, null, undefined>): void {
        nodeGroup
            .selectAll<SVGGElement, NodeItemRow>("g")
            .data<NodeItemRow>(this._rows, (d) => `${d.item.type}-${d.item.primary}`)
            .join<SVGGElement>(SchemaNodeRows._generateRow)
            .attr("transform", (d, i) => `translate(0, ${d.offset})`)
            .each(SchemaNodeRows._augmentElement);
    }

    private static _generateRow(e: Selection<EnterElement, NodeItemRow, Element, any>) {
        const rowGroup = e.append("g");

        rowGroup.append("rect").attr("height", (d, i) => d.height);

        const nodeHeight = 32;
        const totalTextHeight = 12 + 8;
        const margin = (nodeHeight - totalTextHeight) / 2 - 1;

        const primaryTextElement = rowGroup
            .append("text")
            .attr("x", 10)
            .attr("y", (d) => nodeHeight - margin - 12 / 2)
            .text((d) => d.item.primary)
            .classed("primary", true)
            .node();

        const secondaryTextElement = rowGroup
            .append("text")
            .attr("x", 10)
            .attr("y", margin + 8 / 2)
            .text((d) => d.item.secondary)
            .classed("secondary", true)
            .node();

        const primaryLength = primaryTextElement?.getComputedTextLength() ?? 0.0;
        const secondaryLength = secondaryTextElement?.getComputedTextLength() ?? 0.0;
        let totalTextWidth = Math.max(primaryLength, secondaryLength);
        totalTextWidth += 5.0 * window.devicePixelRatio;
        totalTextWidth = ((totalTextWidth | 0) + 1) & ~0x1; // Always an even number.

        rowGroup
            .append("rect")
            .attr("height", 16)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("y", 8)
            .attr("x", totalTextWidth + 20)
            .style("width", 34) // 'style' has higher precedence over 'attr'
            .classed("version-rect", true);

        rowGroup
            .append("text")
            .text("2.0.1")
            .attr("x", totalTextWidth + 27)
            .attr("y", (d) => d.height / 2)
            .classed("version-text", true);

        return rowGroup;
    }

    // 'this' refers to the Element that this function is called for.
    private static _augmentElement(this: SVGGElement, datum: NodeItemRow): void {
        const element = this as Element;
        element.classList.add(datum.item.type);
    }
}
