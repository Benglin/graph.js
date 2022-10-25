import React from "react";
import { Handle, HandleType, NodeProps, Position } from "reactflow";
import SchemaNodeItem, { NodeItem } from "./SchemaNodeItem";
import "./SchemaGraphNode.css";

export interface NodePort {
    id: string;
    hostId: string;
    type: HandleType;
    position: Position;
    className?: string;
}

export interface NodeDataSpec {
    items: NodeItem[];
    ports: NodePort[];
}

export default function SchemaGraphNode(props: NodeProps<NodeDataSpec>): JSX.Element {
    function renderNodeItems(nodeItems: NodeItem[]): JSX.Element[] {
        return nodeItems.map((nodeItem) => <SchemaNodeItem {...nodeItem} />);
    }

    function renderNodePorts(ports: NodePort[]): JSX.Element[] {
        return ports.map((port) => {
            return (
                <Handle
                    id={port.id}
                    type={port.type}
                    position={port.position}
                    className={port.className}
                />
            );
        });
    }

    return (
        <div id={props.id} className="schema-node-container">
            {renderNodePorts(props.data.ports)}
            {renderNodeItems(props.data.items)}
        </div>
    );
}
