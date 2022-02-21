import { Selection } from "d3-selection";

export type SvgSelection = Selection<SVGSVGElement, unknown, HTMLElement, any>;
export type GroupSelection = Selection<SVGGElement, unknown, HTMLElement, any>;
export type ArrayOfType<T> = T[] | ArrayLike<T>;
