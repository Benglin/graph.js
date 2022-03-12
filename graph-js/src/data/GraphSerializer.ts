import { Graph } from "./../core/Graph";
import { GraphEdge } from "./../core/GraphEdge";
import { GraphNode } from "./../core/GraphNode";
import { EdgeDescriptor, NodeDescriptor } from "..";
import { IGraphObjectFactory } from "../core/GraphObjectFactory";

export interface GraphSpecs {
    nodes: Record<string, any>;
    edges: Record<string, any>;
}

export class GraphSerializer {
    public static toSerializable(graph: Graph): Record<string, any> {
        const graphSpecs: GraphSpecs = {
            nodes: {},
            edges: {},
        };

        const nodes = graph.getNodes();
        nodes.forEach((node) => (graphSpecs.nodes[node.id] = node.toSerializable()));

        const edges = graph.getEdges();
        edges.forEach((edge) => (graphSpecs.edges[edge.id] = edge.toSerializable()));

        return graphSpecs;
    }

    public static fromSerializable(
        factory: IGraphObjectFactory,
        graphSpecs: GraphSpecs
    ): {
        nodes: GraphNode<unknown>[];
        edges: GraphEdge<unknown>[];
    } {
        const nodeSpecs = Object.values(graphSpecs.nodes);
        const graphNodes = nodeSpecs.map((ns) => {
            const descriptor = NodeDescriptor.fromSerializable(ns);
            const graphObject = factory.createGraphObject(descriptor);
            return graphObject as GraphNode<unknown>;
        });

        const edgeSpecs = Object.values(graphSpecs.edges);
        const graphEdges = edgeSpecs.map((es) => {
            const descriptor = EdgeDescriptor.fromSerializable(es);
            const graphObject = factory.createGraphObject(descriptor);
            return graphObject as GraphEdge<unknown>;
        });

        return { nodes: graphNodes, edges: graphEdges };
    }
}
