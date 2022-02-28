import { GraphObject } from "./GraphObject";
import { IGraphObjectVisual } from "./GraphObjectVisual";

export interface IGraphObjectFactory {
    createGraphObject(objectType: string, data: any): GraphObject;
    createObjectVisual(objectType: string): IGraphObjectVisual;
}
