export enum PortType {
    Input = "Input",
    Output = "Output",
}

export interface NodePort {
    nodeId: string;
    portId: string;
    portType: PortType;
}

export interface NodePorts {
    [portId: string]: NodePort;
}
