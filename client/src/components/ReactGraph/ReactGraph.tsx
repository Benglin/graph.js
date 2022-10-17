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

const initialNodes: Node<NodeData>[] = [
    {
        id: "schema-node-0",
        type: "schemaGraphNode",
        data: [
            {
                label: "model",
                type: "primary",
                items: [
                    {
                        label: "wipLineageUrn",
                        type: "regular",
                    },
                    {
                        label: "dmLineageId",
                        type: "regular",
                    },
                    {
                        label: "f3dComponentId",
                        type: "regular",
                    },
                ],
            },
            {
                label: "tableViewData",
                type: "secondary",
                items: [
                    {
                        label: "default",
                        type: "regular",
                    },
                    {
                        label: "targetComponent",
                        type: "regular",
                    },
                ],
            },
            {
                label: "modelInfo",
                type: "secondary",
                items: [
                    {
                        label: "role",
                        type: "regular",
                    },
                    {
                        label: "mimeType",
                        type: "regular",
                    },
                ],
            },
        ],
        position: { x: 100, y: 200 },
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
