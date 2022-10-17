import React from "react";
import { NodeProps } from "reactflow";
import SchemaNodeItem, { NodeItem } from "./SchemaNodeItem";
import "./SchemaGraphNode.css";

export type NodeData = NodeItem[];

export default function SchemaGraphNode(props: NodeProps<NodeData>): JSX.Element {
    function renderNodeItems(nodeItems: NodeItem[]): JSX.Element[] {
        return nodeItems.map((nodeItem) => <SchemaNodeItem {...nodeItem} />);
    }

    return <div className="schema-node-container">{renderNodeItems(props.data)}</div>;
}
