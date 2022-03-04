import { ObjectDescriptor } from "..";
import { GraphObject } from "./GraphObject";
import { IGraphObjectVisual } from "./GraphObjectVisual";

export interface IGraphObjectFactory {
    createGraphObject(descriptor: ObjectDescriptor<unknown>): GraphObject<unknown>;
    createObjectVisual(objectType: string): IGraphObjectVisual;
}
