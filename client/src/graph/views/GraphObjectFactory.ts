import { IGraphObjectFactory, INodeVisual } from "graph-js";
import { SchemaVisual } from "./SchemaNodeVisual";

export class GraphObjectFactory implements IGraphObjectFactory {
    createNodeVisual(nodeType: string): INodeVisual {
        return new SchemaVisual();
    }
}
