import { useEffect, useRef } from "react";
import { createGraph, Graph } from "graph-js";
import { GraphObjectFactory } from "../graph/GraphObjectFactory";

import "./SimpleNode.css";

export interface ReactGraphProps {
    onGraphCreated(graph: Graph): void;
}

export function ReactGraph(props: ReactGraphProps): JSX.Element {
    const graphRef = useRef<Graph>();

    useEffect(() => {
        if (!graphRef.current) {
            graphRef.current = createGraph("graph-container", new GraphObjectFactory());
            props.onGraphCreated(graphRef.current);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <div style={{ width: "100%", height: "100%" }} id="graph-container"></div>;
}
