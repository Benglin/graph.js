import React, { useEffect, useRef } from "react";
import { createGraph, Graph, GraphNode } from "graph.js";

export interface ReactGraphProps {}

export function ReactGraph(props: ReactGraphProps): JSX.Element {
    const graphRef = useRef<Graph>();

    useEffect(() => {
        if (!graphRef.current) {
            graphRef.current = createGraph("graph-container");
            graphRef.current.addNodes([new GraphNode()]);
            graphRef.current.invalidate();
        }
    }, []);

    return <div style={{ width: "100%", height: "100%" }} id="graph-container"></div>;
}
