import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";

import { Graph, GraphSerializer } from "graph-js";
import { ReactGraph } from "./components/ReactGraph";
import { SchemaEdge } from "./graph/SchemaEdge";
import { SchemaNode } from "./graph/SchemaNode";
import { GraphNodesManager } from "./graph/GraphNodesManager";

import graphJson from "./components/pim-graph.json";
import "./GraphClientApp.css";

function GraphClientApp() {
    const graphRef = useRef<Graph>();
    const nodesManagerRef = useRef<GraphNodesManager>();
    const [layoutInProgress, setLayoutInProgress] = useState<boolean>(false);

    function handleGraphCreated(graph: Graph): void {
        graphRef.current = graph;
        graphRef.current.addEventListener("toggle-expansion", handleExpansion);

        const factory = graphRef.current.graphObjectFactory;
        const results = GraphSerializer.fromSerializable(factory, graphJson);

        nodesManagerRef.current = new GraphNodesManager(results.nodes as SchemaNode[], results.edges as SchemaEdge[]);

        const ids = [
            "simple-node-1084ccc7-a76c-4c26-994f-08f0125cc544", // Product
            "simple-node-a2042e41-53f8-415c-be70-a1371328f84c", // Design
            "simple-node-074ee35b-b547-43e8-8bcb-fedca74c7b80", // Model
        ];

        graphRef.current.addNodes(results.nodes.filter((n) => ids.includes(n.id)));
        graphRef.current.addEdges(results.edges);
        graphRef.current.centerNodesOnView();
        graphRef.current.invalidate();
    }

    function handleLayoutClick(): void {
        if (!layoutInProgress && graphRef.current) {
            setLayoutInProgress(true);
            graphRef.current.beginLayout(() => setLayoutInProgress(false));
        }
    }

    function handleExpandDesign(): void {
        if (graphRef.current && nodesManagerRef.current) {
            const mgr = nodesManagerRef.current;
            const nodes = mgr.getImmediateNodes("simple-node-a2042e41-53f8-415c-be70-a1371328f84c");
            graphRef.current.addNodes(nodes);
            graphRef.current.addEdges(mgr.getAllEdges());

            graphRef.current.invalidate();
            setLayoutInProgress(true);
            graphRef.current.beginLayout(() => setLayoutInProgress(false));
        }
    }

    function handleExpansion(event: Event): void {
        // When it gets here, these two are definitely valid.
        const graph = graphRef.current as Graph;
        const manager = nodesManagerRef.current as GraphNodesManager;

        if (event.type === "toggle-expansion") {
            const { nodeId, expand } = (event as CustomEvent).detail;
            console.log(nodeId);

            if (expand) {
                const nodes = manager.getImmediateNodes(nodeId);
                graph.addNodes(nodes);
                graph.addEdges(manager.getAllEdges());
                graph.invalidate();
            }

            setLayoutInProgress(true);
            graph.beginLayout(() => setLayoutInProgress(false));
        }
    }

    return (
        <div className="outer-container">
            <div className="button-host">
                <Button
                    sx={{ mb: 1 }}
                    onClick={handleLayoutClick}
                    disabled={layoutInProgress}
                    variant="contained"
                    fullWidth
                >
                    Layout
                </Button>
                <Button
                    sx={{ mb: 1 }}
                    onClick={handleExpandDesign}
                    disabled={layoutInProgress}
                    variant="contained"
                    fullWidth
                >
                    Expand 'Design'
                </Button>
            </div>
            <div className="content-host">
                <ReactGraph onGraphCreated={handleGraphCreated} />
            </div>
        </div>
    );
}

export default GraphClientApp;
