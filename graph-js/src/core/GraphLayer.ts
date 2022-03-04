import { v4 as uuidv4 } from "uuid";
import { select } from "d3-selection";

import { Graph } from "./Graph";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { GraphObjects } from "./GraphObject";
import { SvgSelection, GroupSelection } from "./TypeDefinitions";
import { DragEvent } from "../utils/DragHandler";
import { DragSet } from "../utils/DragSet";
import { DragEventName } from "../utils/DragHandler";

export class GraphLayer {
    private readonly _id: string;
    private readonly _graph: Graph;
    private readonly _graphNodes: GraphObjects = {};
    private readonly _graphEdges: GraphObjects = {};

    // D3.js related data members
    private _layerSvg: SvgSelection | undefined;
    private _layerGroup: GroupSelection | undefined;
    private _nodesGroup: GroupSelection | undefined;
    private _edgeGroup: GroupSelection | undefined;
    private _annoGroup: GroupSelection | undefined;

    // Runtime data members
    private _dragSet: DragSet | undefined;

    constructor(graph: Graph) {
        this._graph = graph;
        this._id = `layer-${uuidv4()}`;
    }

    public get id(): string {
        return this._id;
    }

    public get annotationGroup(): GroupSelection {
        this._ensureAnnoGroupCreated();
        return this._annoGroup as GroupSelection;
    }

    public handleContainerResized(width: number, height: number): void {
        this._layerSvg?.attr("width", width).attr("height", height);
    }

    public invalidate(): void {
        const nodes = Object.values(this._graphNodes) as GraphNode<unknown>[];
        this._invalidateNodes(nodes);

        const edges = Object.values(this._graphEdges) as GraphEdge<unknown>[];
        this._invalidateEdges(edges);
    }

    public invalidateSubset(nodes: GraphNode<unknown>[], edges: GraphEdge<unknown>[]) {
        this._invalidateNodes(nodes);
        this._invalidateEdges(edges);
    }

    public addNodes(graphNodes: GraphNode<unknown>[]): void {
        graphNodes.forEach((gn) => {
            gn.graphLayer = this;
            this._graphNodes[gn.id] = gn;
        });
    }

    public getNode(nodeId: string): GraphNode<unknown> | undefined {
        return this._graphNodes[nodeId] as GraphNode<unknown>;
    }

    public removeNodes(nodeIds: string[]): void {
        nodeIds.forEach((id) => {
            const node = this._graphNodes[id] as GraphNode<unknown>;
            if (node) {
                node.graphLayer = undefined;
                delete this._graphNodes[id];
            }
        });
    }

    public addEdges(graphEdges: GraphEdge<unknown>[]): void {
        graphEdges.forEach((ge) => {
            ge.graphLayer = this;
            this._graphEdges[ge.id] = ge;
        });
    }

    public getEdges(): GraphEdge<unknown>[] {
        return Object.values(this._graphEdges) as GraphEdge<unknown>[];
    }

    public removeEdges(edgeIds: string[]): void {
        edgeIds.forEach((id) => {
            const edge = this._graphEdges[id];
            if (edge) {
                edge.graphLayer = undefined;
                delete this._graphEdges[id];
            }
        });
    }

    public handleDragEvent(dragEvent: DragEvent): void {
        switch (dragEvent.name) {
            case DragEventName.Start:
                this._dragSet = new DragSet(this);
                this._dragSet.start([dragEvent.nodeId]);
                break;

            case DragEventName.Drag:
                this._dragSet?.drag();
                break;

            case DragEventName.End:
                this._dragSet?.end();
                this._dragSet = undefined;
                break;
        }

        const node = this._graph.getNode(dragEvent.nodeId) as GraphNode<unknown>;
        node.setPosition(dragEvent.x, dragEvent.y);
    }

    private _ensureSvgCreated(): void {
        if (!this._layerGroup) {
            const container = this._graph.container;
            const width = container.clientWidth;
            const height = container.clientHeight;

            this._layerSvg = select(`#${container.id}`)
                .append("svg")
                .attr("id", this._id)
                .attr("width", width)
                .attr("height", height);

            this._layerGroup = this._layerSvg.append("g").attr("name", "layer-transform");
        }
    }

    private _ensureNodeGroupCreated(): void {
        this._ensureSvgCreated();

        if (this._layerGroup && !this._nodesGroup) {
            this._nodesGroup = this._layerGroup.append("g").attr("name", "nodes");
        }
    }

    private _ensureEdgeGroupCreated(): void {
        this._ensureSvgCreated();

        if (this._layerGroup && !this._edgeGroup) {
            // Lower the 'edge' group in z-order so nodes always shown above edges.
            this._edgeGroup = this._layerGroup.append("g").attr("name", "edges").lower();
        }
    }

    private _ensureAnnoGroupCreated(): void {
        this._ensureSvgCreated();
        if (this._layerGroup && !this._annoGroup) {
            // Annotation goes above all the other elements in the graph.
            this._annoGroup = this._layerGroup.append("g").attr("name", "annotation").raise();
        }
    }

    private _invalidateNodes(nodes: GraphNode<unknown>[]): void {
        if (nodes.length > 0) {
            this._ensureNodeGroupCreated();
            const nodeGroup = this._nodesGroup as GroupSelection;
            nodes.forEach((node) => node.render(nodeGroup));
        }
    }

    private _invalidateEdges(edges: GraphEdge<unknown>[]): void {
        if (edges.length > 0) {
            this._ensureEdgeGroupCreated();
            const edgeGroup = this._edgeGroup as GroupSelection;
            edges.forEach((edge) => edge.render(edgeGroup));
        }
    }
}

export interface GraphLayers {
    [layerId: string]: GraphLayer;
}
