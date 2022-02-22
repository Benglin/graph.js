import { Vector } from "../data/Vector";

enum PortAttachment {
    None = 0,
    North = 1,
    East = 2,
    South = 3,
    West = 4,
    Free = 5,
}

interface NodePort {
    id: string;
    attachment: PortAttachment;
    offset: number | string;
    position: Vector;
    normal: Vector;
}

export interface NodePorts {
    [portId: string]: NodePort;
}
