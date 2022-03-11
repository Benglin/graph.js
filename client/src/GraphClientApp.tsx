import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";

import { Graph } from "graph-js";
import { ReactGraph } from "./components/ReactGraph";

import "./GraphClientApp.css";

function GraphClientApp() {
    const graphRef = useRef<Graph>();
    const [layoutInProgress, setLayoutInProgress] = useState<boolean>(false);

    function handleGraphCreated(graph: Graph): void {
        graphRef.current = graph;
    }

    function handleLayoutClick(): void {
        if (!layoutInProgress && graphRef.current) {
            setLayoutInProgress(true);
            graphRef.current.beginLayout(() => setLayoutInProgress(false));
        }
    }

    function handleRemoveClick(): void {
        if (graphRef.current) {
            graphRef.current.removeNodes([
                "simple-node-d9881c04-2fd6-4f6c-9d30-be3b434d3619",
                "simple-node-7ea797d7-90ad-4fbb-8b94-a74f61e29589",
            ]);
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
                    onClick={handleRemoveClick}
                    disabled={layoutInProgress}
                    variant="contained"
                    fullWidth
                >
                    Remove
                </Button>
            </div>
            <div className="content-host">
                <ReactGraph onGraphCreated={handleGraphCreated} />
            </div>
        </div>
    );
}

export default GraphClientApp;
