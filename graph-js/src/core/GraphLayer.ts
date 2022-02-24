import { select } from "d3-selection";

import { Graph } from "./Graph";
import { GraphEdge } from "./GraphEdge";
import { GraphNode } from "./GraphNode";
import { GraphObject, GraphObjectIdMap } from "./GraphObject";
import { positionNodePorts } from "./NodePort";
import { SvgSelection, GroupSelection } from "./TypeDefinitions";
import { VisualContext } from "./VisualContext";
import { DragEvent, DragHandler } from "../utils/DragHandler";

export class GraphLayer extends GraphObject {
    private readonly _graph: Graph;
    private readonly _graphNodes: GraphObjectIdMap = {};
    private readonly _graphEdges: GraphObjectIdMap = {};

    // D3.js related data members
    private _layerSvg: SvgSelection | undefined;
    private _layerGroup: GroupSelection | undefined;
    private _nodeGroup: GroupSelection | undefined;
    private _edgeGroup: GroupSelection | undefined;

    constructor(graph: Graph) {
        super("layer");
        this._graph = graph;
    }

    public handleContainerResized(width: number, height: number): void {
        this._layerSvg?.attr("width", width).attr("height", height);
    }

    public invalidate(): void {
        const nodes = Object.values(this._graphNodes) as GraphNode<unknown>[];
        if (nodes.length > 0) {
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

        const edges = Object.values(this._graphEdges) as GraphEdge[];
        if (edges.length > 0) {
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

    public addNodes<DataType>(graphNodes: GraphNode<DataType>[]): void {
        graphNodes.forEach((gn) => (this._graphNodes[gn.id] = gn));
    }

    public removeNodes(nodeIds: string[]): void {
        nodeIds.forEach((id) => delete this._graphNodes[id]);
    }

    public addEdges(graphEdges: GraphEdge[]): void {
        graphEdges.forEach((ge) => (this._graphEdges[ge.id] = ge));
    }

    public removeEdges(edgeIds: string[]): void {
        edgeIds.forEach((id) => delete this._graphEdges[id]);
    }

    public handleDragEvent(dragEvent: DragEvent): void {
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
                .attr("id", `${this.id}`)
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
            this._edgeGroup = this._layerGroup.append("g").attr("name", "edges");
        }
    }
}
