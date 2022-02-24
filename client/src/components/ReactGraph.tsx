import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { createGraph, EdgeDescriptor, Graph, PortAttachment } from "graph-js";
import { GraphObjectFactory } from "../graph/views/GraphObjectFactory";
import { SchemaNode, SchemaNodeData } from "../graph/nodes/SchemaNode";

export interface ReactGraphProps {}

interface SampleNodeData {
    nodeId: string;
    ports: { id: string; attachment: PortAttachment }[];
}

interface SampleEdgeData {
    startNodeName: string;
    startPortIndex: number;
    endNodeName: string;
    endPortIndex: number;
}

const sampleNodes: { [nodeName: string]: SampleNodeData } = {
    "assets.configuration-1.0.0-alpha": {
        nodeId: "",
        ports: [
            { id: `port-${uuidv4()}`, attachment: PortAttachment.West },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.West },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.South },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.South },
        ],
    },
    "assets.configurationTable-1.0.0-alpha": {
        nodeId: "",
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
    },
    {
        startNodeName: "assets.configuration-1.0.0-alpha",
        startPortIndex: 3,
        endNodeName: "assets.configurationTable-1.0.0-alpha",
        endPortIndex: 1,
    },
];

export function ReactGraph(props: ReactGraphProps): JSX.Element {
    const graphRef = useRef<Graph>();

    function generateNodes(): SchemaNode[] {
        const columns = 10;
        const nodes: SchemaNode[] = [];

        Object.entries(sampleNodes).forEach(([title, data], index) => {
            const x = (index % columns) * 300 + 20;
            const y = ((index / columns) | 0) * 500 + 20;

            const schemaData = new SchemaNodeData(title);
            data.ports.forEach((port) => schemaData.addPort(port));
            const node = new SchemaNode(x, y, schemaData);
            nodes.push(node);
            data.nodeId = node.id;
        });

        return nodes;
    }

    function generateEdges(): EdgeDescriptor[] {
        const descriptors: EdgeDescriptor[] = [];

        sampleEdges.forEach((edge) => {
            const startNode = sampleNodes[edge.startNodeName];
            const endNode = sampleNodes[edge.endNodeName];

            descriptors.push({
                edgeType: "simple-edge",
                startNodeId: startNode.nodeId,
                startPortId: startNode.ports[edge.startPortIndex].id,
                endNodeId: endNode.nodeId,
                endPortId: endNode.ports[edge.endPortIndex].id,
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
