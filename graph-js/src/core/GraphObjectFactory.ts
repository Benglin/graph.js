import { ObjectDescriptor } from "..";
import { GraphObject } from "./GraphObject";

export interface IGraphObjectFactory {
    createGraphObject(descriptor: ObjectDescriptor<unknown>): GraphObject<unknown>;
}
