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

import assetsModelData from "../../data/assets.model-2.1.0.json";
import assetsTableViewData from "../../data/assets.tableView-1.0.0.json";

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
        data: assetsModelData as NodeData,
        position: { x: 100, y: 100 },
    },
    {
        id: "schema-node-1",
        type: "schemaGraphNode",
        data: assetsTableViewData as NodeData,
        position: { x: 450, y: 100 },
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
