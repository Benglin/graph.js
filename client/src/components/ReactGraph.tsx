import React, { useEffect, useRef } from "react";
import { createGraph, Graph, GraphSerializer } from "graph-js";
import { GraphObjectFactory } from "../graph/GraphObjectFactory";
import graphJson from "./pim-graph.json";

import "./SimpleNode.css";

export interface ReactGraphProps {
    onGraphCreated(graph: Graph): void;
}

export function ReactGraph(props: ReactGraphProps): JSX.Element {
    const graphRef = useRef<Graph>();

    useEffect(() => {
        if (!graphRef.current) {
            graphRef.current = createGraph("graph-container", new GraphObjectFactory());

            const factory = graphRef.current.graphObjectFactory;
            const results = GraphSerializer.fromSerializable(factory, graphJson);

            graphRef.current.addNodes(results.nodes);
            graphRef.current.addEdges(results.edges);
            graphRef.current.centerNodesOnView();

            graphRef.current.invalidate();
            props.onGraphCreated(graphRef.current);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <div style={{ width: "100%", height: "100%" }} id="graph-container"></div>;
}
