import React, { useEffect, useRef } from "react";
import { createGraph, Graph } from "graph-js";
import { GraphObjectFactory } from "../graph/views/GraphObjectFactory";
import { SchemaNode } from "../graph/nodes/SchemaNode";

export interface ReactGraphProps {}

export function ReactGraph(props: ReactGraphProps): JSX.Element {
    const graphRef = useRef<Graph>();

    function generateNodes(): SchemaNode[] {
        const nodeCount = 50;
        const columns = 10;

        const nodes: SchemaNode[] = [];
        for (let index = 0; index < nodeCount; index++) {
            const x = (index % columns) * 160 + 10;
            const y = ((index / columns) | 0) * 400 + 10;
            nodes.push(new SchemaNode(x, y));
        }

        return nodes;
    }

    useEffect(() => {
        if (!graphRef.current) {
            graphRef.current = createGraph("graph-container", new GraphObjectFactory());
            graphRef.current.addNodes(generateNodes());
            graphRef.current.invalidate();
        }
    }, []);

    return <div style={{ width: "100%", height: "100%" }} id="graph-container"></div>;
}
