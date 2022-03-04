import { v4 as uuidv4 } from "uuid";
import { select } from "d3-selection";

import { Graph } from "./Graph";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { GraphObjects } from "./GraphObject";
import { positionNodePorts } from "./NodePort";
import { SvgSelection, GroupSelection } from "./TypeDefinitions";
import { VisualContext } from "./VisualContext";
import { DragEvent, DragHandler } from "../utils/DragHandler";
import { DragSet } from "../utils/DragSet";
import { DragEventName } from "../utils/DragHandler";

export class GraphLayer {
    private readonly _graph: Graph;
    private readonly _graphNodes: GraphObjects = {};
    private readonly _graphEdges: GraphObjects = {};

    // D3.js related data members
    private _layerSvg: SvgSelection | undefined;
    private _layerGroup: GroupSelection | undefined;
    private _nodeGroup: GroupSelection | undefined;
    private _edgeGroup: GroupSelection | undefined;

    // Runtime data members
    private _dragSet: DragSet | undefined;

    constructor(graph: Graph) {
        this._graph = graph;
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

    public addNodes<NDT>(graphNodes: GraphNode<NDT>[]): void {
        graphNodes.forEach((gn) => (this._graphNodes[gn.id] = gn));
    }

    public getNode(nodeId: string): GraphNode<unknown> | undefined {
        return this._graphNodes[nodeId] as GraphNode<unknown>;
    }

    public removeNodes(nodeIds: string[]): void {
        nodeIds.forEach((id) => delete this._graphNodes[id]);
    }

    public addEdges<EDT>(graphEdges: GraphEdge<EDT>[]): void {
        graphEdges.forEach((ge) => (this._graphEdges[ge.id] = ge));
    }

    public getEdges(): GraphEdge<unknown>[] {
        return Object.values(this._graphEdges) as GraphEdge<unknown>[];
    }

    public removeEdges(edgeIds: string[]): void {
        edgeIds.forEach((id) => delete this._graphEdges[id]);
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
                .attr("id", `layer-${uuidv4()}`)
                .attr("width", width)
                .attr("height", height);

            this._layerGroup = this._layerSvg.append("g").attr("name", "layer-transform");
        }
    }

    private _ensureNodeGroupCreated(): void {
        this._ensureSvgCreated();

        if (this._layerGroup && !this._nodeGroup) {
            this._nodeGroup = this._layerGroup.append("g").attr("name", "nodes");
        }
    }

    private _ensureEdgeGroupCreated(): void {
        this._ensureSvgCreated();

        if (this._layerGroup && !this._edgeGroup) {
            // Lower the 'edge' group in z-order so nodes always shown above edges.
            this._edgeGroup = this._layerGroup.append("g").attr("name", "edges").lower();
        }
    }

    private _invalidateNodes(nodes: GraphNode<unknown>[]): void {
        if (nodes.length <= 0) {
            return;
        }

        this._ensureNodeGroupCreated();
        nodes.forEach((node) => {
            const view = this._graph.getObjectVisual(node.objectType);
            if (view) {
                const visctx = this._graph.getVisualContext(node);
                const context = visctx as VisualContext<unknown>;
                if (!context.created) {
                    view.createVisualContext(context);
                }

                const nodeSize = view.calculateSize(context);
                positionNodePorts(node.ports, nodeSize);

                const oldElement = context.element;
                view.render(context, this._nodeGroup as GroupSelection);

                // If, as part of the node rendering, a new Element was created,
                // then this new Element needs to have a drag handler attached to it.
                if (oldElement != context.element && !!context.element) {
                    const dragHandler = new DragHandler(this, node.id);
                    dragHandler.createDragHandler(select(context.element));
                }
            }
        });
    }

    private _invalidateEdges(edges: GraphEdge<unknown>[]): void {
        if (edges.length <= 0) {
            return;
        }

        this._ensureEdgeGroupCreated();
        edges.forEach((edge) => {
            const view = this._graph.getObjectVisual(edge.objectType);
            if (view) {
                const visctx = this._graph.getVisualContext(edge);
                if (!visctx.created) {
                    view.createVisualContext(visctx);
                }

                view.render(visctx, this._edgeGroup as GroupSelection);
            }
        });
    }
}

export interface GraphLayers {
    [layerId: string]: GraphLayer;
}
