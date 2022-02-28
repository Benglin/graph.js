import { NodePort } from "../core/NodePort";
import { Rect } from "./../data/Rect";
import { Vector } from "./../data/Vector";
import { Size } from "./../data/Size";
import { Graph } from "./../core/Graph";
import { GraphEdge } from "./../core/GraphEdge";
import { GraphNode } from "./../core/GraphNode";

export interface NodePortSpecs {}

export interface GraphNodeSpecs {
    id: string;
    objectType: string;
    rect: {
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
    };
    ports: {
        [portId: string]: NodePort;
    };
    data: any;
}

export interface GraphEdgeSpecs {
    id: string;
    objectType: string;
    descriptor: {
        startNodeId: string;
        startPortId: string;
        endNodeId: string;
        endPortId: string;
        edgeType: string;
        edgeData: any;
    };
}

export interface GraphSpecs {
    nodes: {
        [nodeId: string]: GraphNodeSpecs;
    };
    edges: {
        [edgeId: string]: GraphEdgeSpecs;
    };
}

export class GraphSerializer {
    private readonly _graph: Graph;

    constructor(graph: Graph) {
        this._graph = graph;
    }

    public toJson(): string {
        const graphSpecs: GraphSpecs = {
            nodes: {},
            edges: {},
        };

        const nodeSpecs = GraphSerializer._getGraphNodeSpecs(this._graph.getNodes());
        nodeSpecs.forEach((ns) => (graphSpecs.nodes[ns.id] = ns));

        const edgeSpecs = GraphSerializer._getGraphEdgeSpecs(this._graph.getEdges());
        edgeSpecs.forEach((es) => (graphSpecs.edges[es.id] = es));

        return JSON.stringify(graphSpecs);
    }

    public fromJson(graphSpecs: GraphSpecs): void {
        const factory = this._graph.graphObjectFactory;

        const nodeSpecs = Object.values(graphSpecs.nodes);
        const graphNodes = nodeSpecs.map((ns) => {
            const graphObject = factory.createGraphObject(ns.objectType, ns.data);
            const go = graphObject as any;

            // Restore private data members: GraphObject
            go._id = ns.id;
            go._objectType = ns.objectType;

            // Restore private data members: GraphNode
            go._rect = new Rect(
                new Vector(ns.rect.position.x, ns.rect.position.y),
                new Size(ns.rect.size.width, ns.rect.size.height)
            );

            go._ports = {};
            Object.values(ns.ports).forEach((np) => {
                go._ports[np.id] = {
                    id: np.id,
                    attachment: np.attachment,
                    offset: np.offset,
                    position: new Vector(np.position!.x, np.position!.y),
                    normal: new Vector(np.normal!.x, np.normal!.y),
                };
            });

            return graphObject as GraphNode<unknown>;
        });

        const edgeSpecs = Object.values(graphSpecs.edges);
        const graphEdges = edgeSpecs.map((es) => {
            const graphObject = factory.createGraphObject(es.objectType, es.descriptor.edgeData);
            const go = graphObject as any;

            // Restore private data members: GraphObject
            go._id = es.id;
            go._objectType = es.objectType;

            // Restore private data members: GraphEdge
            go._descriptor.startNodeId = es.descriptor.startNodeId;
            go._descriptor.startPortId = es.descriptor.startPortId;
            go._descriptor.endNodeId = es.descriptor.endNodeId;
            go._descriptor.endPortId = es.descriptor.endPortId;
            go._descriptor.edgeType = es.descriptor.edgeType;

            return graphObject as GraphEdge<unknown>;
        });

        this._graph.addNodes(graphNodes);
        this._graph.addEdges(graphEdges);
    }

    private static _getGraphNodeSpecs(nodes: GraphNode<unknown>[]): GraphNodeSpecs[] {
        return nodes.map((node) => {
            const sanitized = GraphSerializer._sanitizeObjectKeys(node);
            return sanitized as GraphNodeSpecs;
        });
    }

    private static _getGraphEdgeSpecs(edges: GraphEdge<unknown>[]): GraphEdgeSpecs[] {
        return edges.map((edge) => {
            const sanitized = this._sanitizeObjectKeys(edge);
            return sanitized as GraphEdgeSpecs;
        });
    }

    private static _sanitizeObjectKeys(data: any): any {
        const jsonString = JSON.stringify(data);
        const intermediary = JSON.parse(jsonString);
        return GraphSerializer._sanitizeObject(intermediary);
    }

    private static _sanitizeObject(obj: any): any {
        if (typeof obj !== "object") {
            return obj;
        }

        const result: { [key: string]: any } = {};
        Object.entries(obj).forEach(([key, value]) => {
            const k = key.startsWith("_") ? key.substring(1) : key;
            result[k] = this._sanitizeObject(value);
        });

        return result;
    }
}
