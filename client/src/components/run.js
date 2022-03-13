const pg = require("./pim-graph");
const uuid = require("uuid");

const edgeInfo = {
    id: "",
    objectType: "",
    objectSubType: "",
    startNodeId: "",
    startPortId: "",
    endNodeId: "",
    endPortId: "",
    customData: {
        type: "",
    },
};

const nodeNameToId = {};

Object.values(pg.nodes).forEach((nodeInfo) => {
    const name = nodeInfo.customData.primary;
    nodeNameToId[name] = nodeInfo.id;
});

const edgeSpecs = [
    {
        from: "product",
        fromPort: 1,
        to: "configuration",
        toPort: 1,
        type: "Contains",
    },
    {
        from: "configuration",
        fromPort: 0,
        to: "configurationTable",
        toPort: 1,
        type: "Contains",
    },
    {
        from: "configurationTable",
        fromPort: 1,
        to: "configuration",
        toPort: 0,
        type: "ConfigurationRef",
    },
    {
        from: "configuration",
        fromPort: -1,
        to: "model",
        toPort: -1,
        type: "FactoryRef",
    },
    {
        from: "configurationTable",
        fromPort: 1,
        to: "row",
        toPort: 0,
        type: "Contains",
    },
    {
        from: "row",
        fromPort: -1,
        to: "configurationTable",
        toPort: -1,
        type: "RowRef",
    },
    {
        from: "row",
        fromPort: 1,
        to: "product",
        toPort: 1,
        type: "MemberRef",
    },
    {
        from: "product",
        fromPort: -1,
        to: "design",
        toPort: -1,
        type: "Contains",
    },
    {
        from: "tableView",
        fromPort: -1,
        to: "configurationTable",
        toPort: -1,
        type: "TableView",
    },
    {
        from: "documentation",
        fromPort: -1,
        to: "drawing",
        toPort: -1,
        type: "Contains",
    },
    {
        from: "drawing",
        fromPort: -1,
        to: "sheets",
        toPort: -1,
        type: "Contains",
    },
    {
        from: "drawing",
        fromPort: 0,
        to: "lifecycle",
        toPort: 1,
        type: "Contains",
    },
    {
        from: "lifecycle",
        fromPort: 1,
        to: "drawing",
        toPort: 0,
        type: "Use",
    },
    {
        from: "release",
        fromPort: 1,
        to: "drawing",
        toPort: 1,
        type: "Use",
    },
    {
        from: "release",
        fromPort: -1,
        to: "design",
        toPort: -1,
        type: "Use",
    },
    {
        from: "design",
        fromPort: -1,
        to: "model",
        toPort: -1,
        type: "Contains",
    },
    {
        from: "design",
        fromPort: -1,
        to: "lifecycle",
        toPort: -1,
        type: "Contains",
    },
    {
        from: "lifecycle",
        fromPort: 1,
        to: "design",
        toPort: 0,
        type: "Use",
    },
    {
        from: "sheets",
        fromPort: -1,
        to: "model",
        toPort: -1,
        type: "Describes",
    },
];

const edges = Object.values(pg.edges);

function findEdge(startNodeId, endNodeId) {
    return edges.find((e) => {
        return e.startNodeId === startNodeId && e.endNodeId === endNodeId;
    });
}

function getNodePortId(node, index) {
    const ports = node.ports;
    return Object.keys(ports)[index];
}

// Newly created edges.
const newEdges = [];

// Clear existing custom data type.
edges.forEach((edge) => (edge.customData.type = ""));

edgeSpecs.forEach((spec) => {
    const startNodeId = nodeNameToId[spec.from];
    const endNodeId = nodeNameToId[spec.to];

    const edge = findEdge(startNodeId, endNodeId);
    if (edge) {
        edge.customData.type = spec.type;
        if (spec.fromPort >= 0) {
            edge.startPortId = getNodePortId(pg.nodes[startNodeId], spec.fromPort);
        }
        if (spec.toPort >= 0) {
            edge.endPortId = getNodePortId(pg.nodes[endNodeId], spec.toPort);
        }
    } else {
        console.log(`Edge not found: ${spec.from} --> ${spec.to}`);
        newEdges.push({
            id: `simple-edge-${uuid.v4()}`,
            objectType: "edge",
            objectSubType: "simple-edge",
            startNodeId: startNodeId,
            startPortId: getNodePortId(pg.nodes[startNodeId]),
            endNodeId: endNodeId,
            endPortId: getNodePortId(pg.nodes[endNodeId]),
            customData: {
                type: spec.type,
            },
        });
    }
});

// Remove all existing edges that as no associations.
const allEdgeIds = Object.keys(pg.edges);
allEdgeIds.forEach((edgeId) => {
    if (pg.edges[edgeId].customData.type === "") {
        delete pg.edges[edgeId];
        console.log(`Deleting: ${edgeId}`);
    }
});

// Add in new edges.
newEdges.forEach((newEdge) => {
    pg.edges[newEdge.id] = newEdge;
});

console.log(JSON.stringify(pg, undefined, 4));
