import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { createGraph, EdgeDescriptor, Graph, PortAttachment } from "graph-js";
import { GraphObjectFactory } from "../graph/views/GraphObjectFactory";
import { SchemaNode, SchemaNodeData } from "../graph/nodes/SchemaNode";
import { SchemaEdgeData, SchemaEdgeType } from "../graph/edges/SchemaEdge";

export interface ReactGraphProps {}

interface SampleNodeData {
    nodeId: string;
    x: number;
    y: number;
    ports: { id: string; attachment: PortAttachment }[];
}

interface SampleEdgeData {
    startNodeName: string;
    startPortIndex: number;
    endNodeName: string;
    endPortIndex: number;
    edgeData: SchemaEdgeData;
}

const sampleNodes: { [nodeName: string]: SampleNodeData } = {
    "assets.configuration-1.0.0-alpha": {
        nodeId: "",
        x: 20,
        y: 20,
        ports: [
            { id: `port-${uuidv4()}`, attachment: PortAttachment.West },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.West },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.South },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.South },
        ],
    },
    "assets.configurationTable-1.0.0-alpha": {
        nodeId: "",
        x: 20,
        y: 150,
        ports: [
            { id: `port-${uuidv4()}`, attachment: PortAttachment.North },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.North },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.South },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.South },
        ],
    },
};

const sampleEdges: SampleEdgeData[] = [
    {
        startNodeName: "assets.configuration-1.0.0-alpha",
        startPortIndex: 2,
        endNodeName: "assets.configurationTable-1.0.0-alpha",
        endPortIndex: 0,
        edgeData: { type: SchemaEdgeType.ConfigRef },
    },
    {
        startNodeName: "assets.configuration-1.0.0-alpha",
        startPortIndex: 3,
        endNodeName: "assets.configurationTable-1.0.0-alpha",
        endPortIndex: 1,
        edgeData: { type: SchemaEdgeType.Contains },
    },
];

export function ReactGraph(props: ReactGraphProps): JSX.Element {
    const graphRef = useRef<Graph>();

    function generateNodes(): SchemaNode[] {
        const nodes: SchemaNode[] = [];

        Object.entries(sampleNodes).forEach(([title, data], index) => {
            const schemaData = new SchemaNodeData(title);
            data.ports.forEach((port) => schemaData.addPort(port));
            const node = new SchemaNode(data.x, data.y, schemaData);
            nodes.push(node);
            data.nodeId = node.id;
        });

        return nodes;
    }

    function generateEdges(): EdgeDescriptor<SchemaEdgeData>[] {
        const descriptors: EdgeDescriptor<SchemaEdgeData>[] = [];

        sampleEdges.forEach((edge) => {
            const startNode = sampleNodes[edge.startNodeName];
            const endNode = sampleNodes[edge.endNodeName];

            descriptors.push({
                edgeType: "simple-edge",
                startNodeId: startNode.nodeId,
                startPortId: startNode.ports[edge.startPortIndex].id,
                endNodeId: endNode.nodeId,
                endPortId: endNode.ports[edge.endPortIndex].id,
                edgeData: edge.edgeData,
            });
        });

        return descriptors;
    }

    useEffect(() => {
        if (!graphRef.current) {
            graphRef.current = createGraph("graph-container", new GraphObjectFactory());
            graphRef.current.addNodes(generateNodes());
            graphRef.current.addEdges(generateEdges());
            graphRef.current.invalidate();
        }
    }, []);

    return <div style={{ width: "100%", height: "100%" }} id="graph-container"></div>;
}
