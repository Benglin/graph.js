import { IGraphObjectFactory, IGraphObjectVisual } from "graph-js";
import { SchemaNodeVisual } from "./SchemaNodeVisual";
import { SchemaEdgeVisual } from "./SchemaEdgeVisual";

export class GraphObjectFactory implements IGraphObjectFactory {
    createObjectVisual(objectType: string): IGraphObjectVisual {
        switch (objectType) {
            case "simple-node":
                return new SchemaNodeVisual();
            case "simple-edge":
                return new SchemaEdgeVisual();
        }

        throw new Error(`Unknown object type: ${objectType}`);
    }
}
