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
    MarkerType,
    Position,
} from "reactflow";

import "reactflow/dist/style.css";
import "./style.css";

import assetsModelData from "../../data/assets.model-2.1.1.json";
import assetsTableViewData from "../../data/assets.tableView-1.0.0.json";

import SelfReferencingEdge from "./SchemaGraphEdge";
import SchemaGraphNode, { NodeDataSpec } from "./SchemaGraphNode";
import { EdgeData } from "./SchemaGraphEdge";
const nodeTypes = { "schemaGraphNode": SchemaGraphNode };
const edgeTypes = { "circular": SelfReferencingEdge };

export interface ReactGraphProps {}

const initialNodes: Node<NodeDataSpec>[] = [
    {
        id: "schema-node-0",
        type: "schemaGraphNode",
        data: assetsModelData as NodeDataSpec,
        position: { x: 100, y: 100 },
    },
    {
        id: "schema-node-1",
        type: "schemaGraphNode",
        data: assetsTableViewData as NodeDataSpec,
        position: { x: 100, y: 280 },
        targetPosition: Position.Right,
        sourcePosition: Position.Bottom,
    },
];

const initialEdges: Edge<EdgeData>[] = [
    {
        id: "circular-edge-0",
        source: "schema-node-1",
        sourceHandle: "tableViewData-output-0",
        target: "schema-node-1",
        targetHandle: "tableViewData-input-0",
        label: "",
        type: "circular",
        data: { radius: 20, color: "red", width: 1 },
    },
    {
        id: "circular-edge-1",
        source: "schema-node-1",
        sourceHandle: "tableViewData-output-1",
        target: "schema-node-1",
        targetHandle: "tableViewData-input-1",
        label: "",
        type: "circular",
        data: { radius: 30, color: "green", width: 3 },
    },
    {
        id: "circular-edge-2",
        source: "schema-node-1",
        sourceHandle: "tableViewData-output-2",
        target: "schema-node-1",
        targetHandle: "tableViewData-input-2",
        label: "",
        type: "circular",
        data: { radius: 40, color: "blue", width: 2 },
    },
];

export default function ReactGraph(props: ReactGraphProps): JSX.Element {
    const [nodes, setNodes] = useState<Node<NodeDataSpec>[]>(initialNodes);
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
                edgeTypes={edgeTypes}
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
