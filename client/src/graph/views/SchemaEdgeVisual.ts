import { GraphObjectVisual, GroupSelection, IVisualContext, Size } from "graph-js";

export class SchemaEdgeVisual extends GraphObjectVisual {
    constructor() {
        super("schema-edge");
    }

    createVisualContext(visctx: IVisualContext): void {}

    calculateSize(visctx: IVisualContext): Size {
        return { width: 0, height: 0 }; // Not used for edges.
    }

    render(visctx: IVisualContext, layerGroup: GroupSelection): void {}
}
