import { useState, useCallback } from "react";

import ReactFlow, {
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

export interface ReactGraphProps {}

interface NodeData {
    id: string;
    data: { label: string };
    position: { x: number; y: number };
    type?: string;
}

interface EdgeData {
    id: string;
    source: string;
    target: string;
    label: string;
    type: string;
}

const initialNodes: NodeData[] = [
    {
        id: "1",
        data: { label: "Hello" },
        position: { x: 20, y: 20 },
        type: "input",
    },
    {
        id: "2",
        data: { label: "World" },
        position: { x: 100, y: 100 },
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
    const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
    const [edges, setEdges] = useState<EdgeData[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((eds: EdgeData[]) => applyEdgeChanges<EdgeData>(changes, eds) as EdgeData[]),
        []
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds) as EdgeData[]),
        []
    );

    return (
        <div className="react-graph-container">
            <ReactFlow
                nodes={nodes}
                edges={edges}
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
