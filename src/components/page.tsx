/**
 * 页面
 */

import { ChangeEventHandler, FC, MouseEventHandler } from "react";
import { useSelector } from "react-redux";
import { mutation, Page, UUID } from "../redux";
import * as Schema from "../schema.json";
import { randomUUID } from "../utils";
import * as Property from "./property";
import * as Renderer from "./renderer";

/**
 * 容器
 */
export const Container: FC = (props) => {
    const { children } = props;

    return (
        <div className="w-[375px] h-[812px] mt-2 border overflow-y-auto">
            {children}
        </div>
    );
};

/**
 * 切换页面
 */
export const Switcher: FC = () => {
    const pages = useSelector(({ pages }) => Object.keys(pages));

    const pageId = useSelector(({ session }) => session.pageId);

    const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        mutation.commit([
            ({ session }) => {
                session.pageId = event.target.value;
            },
        ]);
    };

    return (
        <select onChange={onChange} value={pageId}>
            {pages.map((pageId) => {
                return (
                    <option key={pageId} value={pageId}>
                        {pageId.slice(-12)}
                    </option>
                );
            })}
        </select>
    );
};

/**
 * 新建页面
 */
export const Create: FC = () => {
    const onClick = () => {
        const pageId = randomUUID();

        mutation.commit([
            ({ pages }) => {
                pages[pageId] = {
                    id: pageId,
                    children: [],
                };
            },
            ({ session }) => {
                session.pageId = pageId;
            },
        ]);
    };

    return (
        <button className="border px-1 mr-2" onClick={onClick}>
            添加
        </button>
    );
};

/**
 * 节点
 */
export const Node: FC<{ nodeId: UUID }> = (props) => {
    const { nodeId } = props;

    const node = useSelector(({ nodes }) => nodes[nodeId]);

    const { schema, value } = node.properties;

    const NodeRenderer = Reflect.get(Renderer, schema);

    const onClick: MouseEventHandler = (event) => {
        event.stopPropagation();

        mutation.commit([
            ({ session }) => {
                session.nodeId = nodeId;
            },
        ]);
    };

    if (NodeRenderer) {
        return (
            <span onClickCapture={onClick}>
                <NodeRenderer {...value}>
                    {node.children.map((nodeId) => {
                        return <Node key={nodeId} nodeId={nodeId} />;
                    })}
                </NodeRenderer>
            </span>
        );
    }

    return <>not support</>;
};

/**
 * 添加组件
 */
export const AddComponent: FC<{ pageId: Page["id"] }> = (props) => {
    const { pageId } = props;

    const onClick = () => {
        if (!pageId) {
            alert("请先添加页面");
            return;
        }

        const nodeId = randomUUID();

        mutation.commit([
            ({ nodes }) => {
                nodes[nodeId] = {
                    id: nodeId,
                    children: [],
                    properties: {
                        schema: "Button",
                        value: {},
                    },
                };
            },
            ({ pages }) => {
                pages[pageId].children.push(nodeId);
            },
        ]);
    };

    return (
        <button className="border px-1 ml-2" onClick={onClick}>
            + 组件
        </button>
    );
};

/**
 * 配置面板
 */
export const Panel: FC = () => {
    const nodeId = useSelector(({ session }) => session.nodeId);

    const node = useSelector(({ nodes }) => nodeId && nodes[nodeId]);

    if (node) {
        const { schema } = node.properties;

        const Component = Schema[schema as keyof typeof Schema];

        return (
            <>
                <div>{node.id.slice(-12)}</div>
                {Component.properties.map((property) => {
                    const { key, type } = property;

                    if (type === "string") {
                        return (
                            <Property.String
                                key={node.id + key}
                                target={[node.id, key]}
                            />
                        );
                    }

                    return <>not support</>;
                })}
            </>
        );
    }

    return <>no target</>;
};
