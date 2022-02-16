import React from "react";
import "./GraphClientApp.css";
import { ReactGraph } from "./components/ReactGraph";

function GraphClientApp() {
    return (
        <div>
            <div className="overlay-back">
                <ReactGraph />
            </div>
            <div className="overlay-front"></div>
        </div>
    );
}

export default GraphClientApp;
