import { useState, useCallback } from "react";

import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    addEdge,
    Connection,
} from "reactflow";

import "reactflow/dist/style.css";
import "./style.css";

import SchemaGraphNode, { NodeData } from "./SchemaGraphNode";
const nodeTypes = { "schemaGraphNode": SchemaGraphNode };

export interface ReactGraphProps {}

interface EdgeData {
    id: string;
    source: string;
    target: string;
    label: string;
    type: string;
}

const nodeData: NodeData = [
    {
        label: "model",
        type: "primary",
        version: "2.0.1",
        items: [
            {
                label: "wipLineageUrn",
                type: "regular",
                dataType: "String",
            },
            {
                label: "dmLineageId",
                type: "regular",
                dataType: "String",
            },
            {
                label: "f3dComponentId",
                type: "regular",
                dataType: "String",
            },
        ],
    },
    {
        label: "tableViewData",
        type: "secondary",
        version: "2.0.0",
        items: [
            {
                label: "default",
                type: "regular",
                dataType: "Bool",
            },
            {
                label: "targetComponent",
                type: "regular",
                dataType: "String",
            },
        ],
    },
    {
        label: "modelInfo",
        type: "secondary",
        version: "1.0.0",
        items: [
            {
                label: "role",
                type: "regular",
                dataType: "Enum",
            },
            {
                label: "mimeType",
                type: "regular",
                dataType: "String",
            },
        ],
    },
];

const initialNodes: Node<NodeData>[] = [
    {
        id: "schema-node-0",
        type: "schemaGraphNode",
        data: nodeData,
        position: { x: 100, y: 100 },
    },
    {
        id: "schema-node-1",
        type: "schemaGraphNode",
        data: nodeData,
        position: { x: 320, y: 100 },
    },
    {
        id: "schema-node-2",
        type: "schemaGraphNode",
        data: nodeData,
        position: { x: 320, y: 320 },
    },
];

const initialEdges: EdgeData[] = [
    // {
    //     id: "1-2",
    //     source: "1",
    //     target: "2",
    //     label: "to the",
    //     type: "step",
    // },
];

export default function ReactGraph(props: ReactGraphProps): JSX.Element {
    const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
    const [edges, setEdges] = useState<Edge<EdgeData>[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    return (
        <div className="react-graph-container">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}
