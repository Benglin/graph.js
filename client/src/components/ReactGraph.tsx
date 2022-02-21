import React, { useEffect, useRef } from "react";
import { createGraph, Graph } from "graph-js";
import { GraphObjectFactory } from "../graph/views/GraphObjectFactory";
import { SchemaNode } from "../graph/nodes/SchemaNode";

export interface ReactGraphProps {}

export function ReactGraph(props: ReactGraphProps): JSX.Element {
    const graphRef = useRef<Graph>();

    useEffect(() => {
        if (!graphRef.current) {
            graphRef.current = createGraph("graph-container", new GraphObjectFactory());
            graphRef.current.addNodes([new SchemaNode()]);
            graphRef.current.invalidate();
        }
    }, []);

    return <div style={{ width: "100%", height: "100%" }} id="graph-container"></div>;
}
