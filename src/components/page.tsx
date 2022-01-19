/**
 * 页面
 */

import { ChangeEventHandler, FC } from "react";
import { useSelector } from "react-redux";
import { mutation, Page, UUID } from "../redux";
import { randomUUID } from "../utils";
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
                        {pageId.slice(-10)}
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

    if (NodeRenderer) {
        return (
            <NodeRenderer nodeId={nodeId} {...value}>
                {node.children.map((nodeId) => {
                    return <Node key={nodeId} nodeId={nodeId} />;
                })}
            </NodeRenderer>
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
                        value: {
                            text: "hello",
                        },
                    },
                };
            },
            ({ pages }) => {
                pages[pageId].children.push(nodeId);
            },
        ]);
    };

    return <button onClick={onClick}>添加组件</button>;
};
