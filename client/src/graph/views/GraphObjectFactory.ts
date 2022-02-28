import { GraphObject, IGraphObjectFactory, IGraphObjectVisual } from "graph-js";
import { SchemaNodeVisual } from "./SchemaNodeVisual";
import { SchemaEdgeVisual } from "./SchemaEdgeVisual";
import { SchemaNode } from "../nodes/SchemaNode";

export class GraphObjectFactory implements IGraphObjectFactory {
    createGraphObject(objectType: string, data: any): GraphObject {
        switch (objectType) {
            case "simple-node":
                return SchemaNode.fromData(data);
            case "simple-edge":
                break;
        }

        throw new Error("Handle this");
    }

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
