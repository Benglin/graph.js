import { NodePort } from "./NodePort";
import { GraphObject } from "./GraphObject";

export class GraphEdge extends GraphObject {
    private readonly _startPort: NodePort;
    private readonly _endPort: NodePort;

    constructor(startPort: NodePort, endPort: NodePort) {
        super(`edge`);
        this._startPort = startPort;
        this._endPort = endPort;
    }

    public get startPort(): NodePort {
        return this._startPort;
    }

    public get endPort(): NodePort {
        return this._endPort;
    }
}
