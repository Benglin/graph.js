import { IGraphObjectVisual } from "./GraphObjectVisual";

export interface IGraphObjectFactory {
    createObjectVisual(objectType: string): IGraphObjectVisual;
}
