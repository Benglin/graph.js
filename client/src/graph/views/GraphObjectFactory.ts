import { IGraphObjectFactory, INodeVisual } from "graph-js";
import { SchemaNodeVisual } from "./SchemaNodeVisual";

export class GraphObjectFactory implements IGraphObjectFactory {
    createNodeVisual(nodeType: string): INodeVisual {
        return new SchemaNodeVisual();
    }
}
