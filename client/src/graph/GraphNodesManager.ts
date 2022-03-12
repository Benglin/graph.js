import { SchemaNode } from "./SchemaNode";
import { SchemaEdge } from "./SchemaEdge";

interface FilterFunc {
    (nodeId: string): boolean;
}

export class GraphNodesManager {
    private readonly _nodes: { [id: string]: SchemaNode } = {};
    private readonly _edges: { [id: string]: SchemaEdge } = {};

    constructor(nodes: SchemaNode[], edges: SchemaEdge[]) {
        nodes.forEach((n) => (this._nodes[n.id] = n));
        edges.forEach((e) => (this._edges[e.id] = e));
    }

    public getImmediateNodes(nodeId: string): SchemaNode[] {
        if (!this._nodes[nodeId]) {
            return [];
        }

        const currLevel = this._nodes[nodeId].data!.level;
        const nextLevel = currLevel + 1;

        const thisObject = this;
        function filter(nodeId: string): boolean {
            const node = thisObject._nodes[nodeId];
            return node.data!.level === nextLevel;
        }

        const collected: string[] = [];
        this.traverseFrom(nodeId, collected, filter);
        return collected.map((nid) => this._nodes[nid]);
    }

    public getDownstreamNodes(nodeId: string): SchemaNode[] {
        if (!this._nodes[nodeId]) {
            return [];
        }

        const currLevel = this._nodes[nodeId].data!.level;

        const thisObject = this;
        function filter(nodeId: string): boolean {
            const node = thisObject._nodes[nodeId];
            return node.data!.level > currLevel;
        }

        const collected: string[] = [];
        this.traverseFrom(nodeId, collected, filter);
        return collected.map((nid) => this._nodes[nid]);
    }

    public getAllEdges(): SchemaEdge[] {
        return Object.values(this._edges);
    }

    private traverseFrom(nodeId: string, collected: string[], filter: FilterFunc): void {
        const adjacentNodes = this.getAdjacentNodes(nodeId);
        const accepted = adjacentNodes.filter((nodeId) => filter(nodeId));
        const unique = accepted.filter((nid) => collected.indexOf(nid) === -1);

        collected.push(...unique);
        unique.forEach((nodeId) => this.traverseFrom(nodeId, collected, filter));
    }

    private getAdjacentNodes(nodeId: string): string[] {
        const adjacentNodes: { [nodeId: string]: boolean } = {};

        const edges = this.getAllEdges();
        edges.forEach((edge) => {
            if (edge.startNodeId === nodeId) {
                adjacentNodes[edge.endNodeId] = true;
            } else if (edge.endNodeId === nodeId) {
                adjacentNodes[edge.startNodeId] = true;
            }
        });

        return Object.keys(adjacentNodes);
    }
}
