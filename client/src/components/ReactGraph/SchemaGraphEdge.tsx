import React from "react";
import { BezierEdge, EdgeProps } from "react-flow-renderer";

export interface EdgeData {
    radius: number;
    color: string;
    width: number;
}

export default function SelfReferencingEdge(props: EdgeProps<EdgeData>): JSX.Element {
    if (props.source !== props.target) {
        return <BezierEdge {...props} />; // Default when connecting different nodes.
    }

    const color = props.data?.color ?? "#000";
    const width = props.data?.width ?? 1;

    const { sourceX, sourceY, targetX, targetY, id, markerEnd } = props;
    const radius = props.data?.radius as number;
    const edgePath = `M ${sourceX - 4} ${sourceY} A ${radius} ${radius} 0 1 1 ${targetX} ${
        targetY - 4
    } `;

    return (
        <path
            id={id}
            d={edgePath}
            markerEnd={markerEnd}
            fill="none"
            stroke={color}
            strokeWidth={width}
        />
    );
}
