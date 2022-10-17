import React from "react";
import { NodeProps } from "reactflow";
import "./SchemaGraphNode.css";

export type NodeItemType = "primary" | "secondary" | "regular";

export interface NodeItem {
    label: string;
    type: NodeItemType;
}

export type NodeData = NodeItem[];

export default function SchemaGraphNode(props: NodeProps<NodeData>): JSX.Element {
    function renderHeaderItem(item: NodeItem): JSX.Element {
        let extraClasses = "";
        if (item.type === "primary") {
            extraClasses = "primary-header";
        } else if (item.type === "secondary") {
            extraClasses = "secondary-header";
        }

        return (
            <div key={item.label} className={`item-row ${extraClasses}`}>
                {item.label}
            </div>
        );
    }

    function renderRegularItem(item: NodeItem): JSX.Element {
        return (
            <div key={item.label} className="item-row">
                {item.label}
            </div>
        );
    }

    function renderNodeItems(nodeItems: NodeItem[]): JSX.Element[] {
        return nodeItems.map((nodeItem) => {
            switch (nodeItem.type) {
                case "primary":
                case "secondary":
                    return renderHeaderItem(nodeItem);

                case "regular":
                    return renderRegularItem(nodeItem);
            }
        });
    }

    return <div className="schema-node-container">{renderNodeItems(props.data)}</div>;
}
