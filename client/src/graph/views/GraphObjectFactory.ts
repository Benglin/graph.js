import { EdgeDescriptor, GraphObject, IGraphObjectFactory, NodeDescriptor, ObjectDescriptor } from "graph-js";
import { SchemaNode, SimpleNodeData } from "../nodes/SchemaNode";
import { SchemaEdge, SimpleEdgeData } from "../edges/SchemaEdge";

export class GraphObjectFactory implements IGraphObjectFactory {
    createGraphObject(desc: ObjectDescriptor<unknown>): GraphObject<unknown> {
        switch (desc.objectSubType) {
            case "simple-node":
                return SchemaNode.fromDescriptor(desc as NodeDescriptor<SimpleNodeData>);
            case "simple-edge":
                return SchemaEdge.fromDescriptor(desc as EdgeDescriptor<SimpleEdgeData>);
        }

        throw new Error(`Unhandled object type: ${desc.objectSubType}`);
    }
}
