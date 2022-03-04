import { Graph } from "./../core/Graph";
import { GraphEdge } from "./../core/GraphEdge";
import { GraphNode } from "./../core/GraphNode";
import { EdgeDescriptor, NodeDescriptor } from "..";

export interface GraphSpecs {
    nodes: Record<string, any>;
    edges: Record<string, any>;
}

export class GraphSerializer {
    private readonly _graph: Graph;

    constructor(graph: Graph) {
        this._graph = graph;
    }

    public toSerializable(): Record<string, any> {
        const graphSpecs: GraphSpecs = {
            nodes: {},
            edges: {},
        };

        const nodes = this._graph.getNodes();
        nodes.forEach((node) => (graphSpecs.nodes[node.id] = node.toSerializable()));

        const edges = this._graph.getEdges();
        edges.forEach((edge) => (graphSpecs.edges[edge.id] = edge.toSerializable()));

        return graphSpecs;
    }

    public fromSerializable(graphSpecs: GraphSpecs): void {
        const factory = this._graph.graphObjectFactory;

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

        this._graph.addNodes(graphNodes);
        this._graph.addEdges(graphEdges);
    }
}
