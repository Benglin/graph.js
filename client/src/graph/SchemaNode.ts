import { Selection } from "d3-selection";
import { GraphNode, GroupSelection, NodeDescriptor } from "graph-js";

export interface SimpleNodeData {
    primary: string;
    secondary: string;
    level: number;
}

type SvgRectSelection = Selection<SVGRectElement, unknown, HTMLElement, any>;

export class SchemaNode extends GraphNode<SimpleNodeData> {
    private _nodeRect: SvgRectSelection | undefined;

    protected destroyCore(nodeGroup: GroupSelection): void {
        this._nodeRect = undefined; // Will be removed in base class.
    }

    protected renderCore(nodeGroup: GroupSelection): void {
        if (!this._nodeRect) {
            const nodeHeight = 32;
            this._nodeRect = nodeGroup.append("rect").attr("height", nodeHeight);

            const totalTextHeight = 12 + 8;
            const margin = (nodeHeight - totalTextHeight) / 2 - 1;

            const primaryTextElement = nodeGroup
                .append("text")
                .attr("x", 10)
                .attr("y", nodeHeight - margin - 12 / 2)
                .text(this.data!.primary)
                .classed("primary", true)
                .node();

            const secondaryTextElement = nodeGroup
                .append("text")
                .attr("x", 10)
                .attr("y", margin + 8 / 2)
                .text(this.data!.secondary)
                .classed("secondary", true)
                .node();

            const primaryLength = primaryTextElement?.getComputedTextLength() ?? 0.0;
            const secondaryLength = secondaryTextElement?.getComputedTextLength() ?? 0.0;
            let totalTextWidth = Math.max(primaryLength, secondaryLength);
            totalTextWidth += 5.0 * window.devicePixelRatio;
            totalTextWidth = ((totalTextWidth | 0) + 1) & ~0x1; // Always an even number.

            nodeGroup
                .append("rect")
                .attr("height", 16)
                .attr("rx", 8)
                .attr("ry", 8)
                .attr("y", 8)
                .attr("x", totalTextWidth + 20)
                .style("width", 34) // 'style' has higher precedence over 'attr'
                .classed("version-rect", true);

            nodeGroup
                .append("text")
                .text("2.0.1")
                .attr("x", totalTextWidth + 27)
                .attr("y", nodeHeight / 2)
                .classed("version-text", true);
        }
    }

    public static fromDescriptor(desc: NodeDescriptor<SimpleNodeData>): SchemaNode {
        return new SchemaNode(desc);
    }
}
