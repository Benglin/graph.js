import React from "react";

export type NodeItemType = "primary" | "secondary" | "regular";

export interface NodeItem {
    label: string;
    type: NodeItemType;
    items?: NodeItem[];
}

export default function SchemaNodeItem(props: NodeItem): JSX.Element {
    const [collapsed, setCollapsed] = React.useState<boolean>(false);

    function renderHeaderItem(item: NodeItem): JSX.Element {
        const children: JSX.Element[] = [];

        if (!collapsed) {
            item.items?.forEach((item) => {
                children.push(renderRegularItem(item));
            });
        }

        let extraClasses = "";
        if (item.type === "primary") {
            extraClasses = "primary-header";
        } else if (item.type === "secondary") {
            extraClasses = "secondary-header";
        }

        return (
            <>
                <div
                    key={item.label}
                    className={`item-row ${extraClasses}`}
                    onClick={() => setCollapsed((c) => !c)}
                >
                    <span>{item.label}</span>
                    {collapsed ? (
                        <i className="fa-solid fa-caret-up" />
                    ) : (
                        <i className="fa-solid fa-caret-down" />
                    )}
                </div>
                {children}
            </>
        );
    }

    function renderRegularItem(item: NodeItem): JSX.Element {
        return (
            <div key={item.label} className="item-row">
                {item.label}
            </div>
        );
    }

    if (props.items && props.items.length > 0) {
        return renderHeaderItem(props);
    }

    return renderRegularItem(props);
}
