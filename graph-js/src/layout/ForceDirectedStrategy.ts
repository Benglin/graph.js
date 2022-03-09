import { Simulation, forceSimulation, forceLink, forceManyBody, forceX, forceY } from "d3-force";
import { Graph } from "../core/Graph";
import { LayoutStrategy } from "./LayoutStrategy";

interface ForceNode {
    id: string;
    group: number;
    x: number;
    y: number;
}

interface ForceLink {
    id: string;
    target: ForceNode;
    source: ForceNode;
    strength: number;
}

export class ForceDirectedStrategy extends LayoutStrategy {
    private readonly _nodes: { [id: string]: ForceNode } = {};
    private readonly _links: { [id: string]: ForceLink } = {};

    private _simulation: Simulation<ForceNode, ForceLink> | undefined;

    constructor(graph: Graph) {
        super(graph);

        this._buildRelationships();
    }

    protected beginLayoutCore(): void {
        this._setupSimulation();
        this._simulation?.restart();
    }

    private _buildRelationships(): void {
        const graphNodes = this.graph.getNodes();
        const graphEdges = this.graph.getEdges();

        graphNodes.forEach((gn) => {
            this._nodes[gn.id] = {
                id: gn.id,
                group: 0,
                x: gn.position.x,
                y: gn.position.y,
            };
        });

        graphEdges.forEach((ge) => {
            const id = `${ge.startNodeId}-${ge.endNodeId}`;
            if (!this._links[id]) {
                this._links[id] = {
                    id: id,
                    source: this._nodes[ge.startNodeId],
                    target: this._nodes[ge.endNodeId],
                    strength: 1,
                };
            } else {
                this._links[id].strength++;
            }
        });

        const links = Object.values(this._links);
        const maxStrength = Math.max(...links.map((l) => l.strength));
        links.forEach((l) => l.strength / maxStrength);
    }

    private _setupSimulation(): void {
        const width = this.graph.container.clientWidth;
        const height = this.graph.container.clientHeight;

        const linkForce = forceLink<ForceNode, ForceLink>()
            .id((link) => link.id)
            .strength((link) => link.strength);

        this._simulation = forceSimulation<ForceNode, ForceLink>();
        this._simulation.stop();

        this._simulation.nodes(Object.values(this._nodes));
        this._simulation
            .force("link", linkForce)
            .force("charge", forceManyBody().strength(-1000))
            .force("forceX", forceX(width / 2).strength(0.05))
            .force("forceY", forceY(height / 2).strength(0.05));

        const thisObject = this;
        this._simulation
            .on("tick", () => {
                thisObject._notifyListener("tick");
            })
            .on("end", () => {
                thisObject._notifyListener("end");
            });
    }

    private _notifyListener(type: "tick" | "end"): void {
        const callback = this.callback;
        callback(type, Object.values(this._nodes));
    }
}
