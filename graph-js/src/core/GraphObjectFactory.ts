import { INodeVisual } from "./NodeVisual";

export interface IGraphObjectFactory {
    createNodeVisual(nodeType: string): INodeVisual;
}
