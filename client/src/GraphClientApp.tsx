import React from "react";
import Button from "@mui/material/Button";
import "./GraphClientApp.css";
import { ReactGraph } from "./components/ReactGraph";

function GraphClientApp() {
    return (
        <div className="outer-container">
            <div className="button-host">
                <Button>Layout</Button>
            </div>
            <div className="content-host">
                <ReactGraph />
            </div>
        </div>
    );
}

export default GraphClientApp;
