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

    return (
        <div className="outer-container">
            <div className="button-host">
                <Button onClick={handleLayoutClick} disabled={layoutInProgress} variant="contained">
                    Layout
                </Button>
            </div>
            <div className="content-host">
                <ReactGraph onGraphCreated={handleGraphCreated} />
            </div>
        </div>
    );
}

export default GraphClientApp;
