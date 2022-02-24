import { v4 as uuidv4 } from "uuid";
import { GraphNode, NodePort, PortAttachment, Vector } from "graph-js";

export interface NodeItem {
    type: "title" | "sub-title" | "category-heading" | "typed-item";
    primary: string;
    secondary: string;
}

export interface SchemaData {
    nodeItems: NodeItem[];
}

const possibleNames = [
    "releaseDate",
    "approvedBy",
    "approvers",
    "owner",
    "urn",
    "descriptor",
    "revision",
    "lifecycle",
    "isLocked",
    "isWorking",
    "urn",
    "affectedBy",
];

function shuffle(list: string[]): void {
    for (let index = 0; index < list.length; index++) {
        const next = (Math.random() * list.length) | 0;
        const temp = list[next];
        list[next] = list[index];
        list[index] = temp;
    }
}

export class SchemaNode extends GraphNode<SchemaData> {
    constructor(x: number, y: number) {
        const categorizedItems: { [key: string]: string[] } = {};
        const categories = ["item", "release", "modelInfo", "eco"];

        categories.forEach((category) => {
            const count = (Math.random() * 6.0) | 0;
            if (count > 0) {
                shuffle(possibleNames);
                categorizedItems[category] = [];
                categorizedItems[category].push(...possibleNames.slice(0, count));
            }
        });

        const items: NodeItem[] = [
            { type: "title", primary: "release", secondary: "2.0.1" },
            { type: "sub-title", primary: "releaseFlcItemUrn", secondary: "String" },
        ];

        const cats = Object.entries(categorizedItems);
        cats.forEach(([catName, itemNames]) => {
            items.push({ type: "category-heading", primary: catName, secondary: "" });
            itemNames.forEach((i) => items.push({ type: "typed-item", primary: i, secondary: "" }));
        });

        const schemaData: SchemaData = { nodeItems: [] };
        items.forEach((i) => schemaData.nodeItems.push(i));
        super(schemaData, "simple-node", { position: new Vector(x, y) });
    }

    protected getNodePorts(): NodePort[] {
        return [
            { id: `port-${uuidv4()}`, attachment: PortAttachment.West },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.West },
            { id: `port-${uuidv4()}`, attachment: PortAttachment.East },
        ];
    }
}
