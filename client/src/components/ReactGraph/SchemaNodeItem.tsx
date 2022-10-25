import React from "react";

export type NodeItemType = "primary" | "secondary" | "regular";

export interface NodeItem {
    label: string;
    itemType: NodeItemType;
    version?: string;
    dataType?: string;
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
        if (item.itemType === "primary") {
            extraClasses = "primary-header";
        } else if (item.itemType === "secondary") {
            extraClasses = "secondary-header";
        }

        return (
            <>
                <div
                    id={item.label}
                    key={item.label}
                    className={`item-row ${extraClasses}`}
                    onClick={() => setCollapsed((c) => !c)}
                >
                    <span>{item.label}</span>
                    {item.version && <span className="item-badge">{item.version}</span>}
                    <span className="full-width" />
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
            <div id={item.label} key={item.label} className="item-row">
                <span className="full-width">{item.label}</span>
                {item.dataType && <span className="full-width" />}
                {item.dataType && <span className="item-data-type">{item.dataType}</span>}
            </div>
        );
    }

    if (props.items && props.items.length > 0) {
        return renderHeaderItem(props);
    }

    return renderRegularItem(props);
}
