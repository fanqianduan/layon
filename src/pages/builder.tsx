/**
 * 可视化搭建
 */

import { get, set } from "lodash-es";
import {
    ChangeEventHandler,
    FC,
    Fragment,
    MouseEventHandler,
    ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { getState, Node, Page, mutation } from "../redux";
import * as Renderer from "../renderer";
import { randomUUID } from "../utils";

export const Builder: FC = () => {
    /** 物料区 */
    let slotComponentLibrary: ReactNode;
    {
        /** 渲染器列表 */
        const slotRendererList = Object.entries(Renderer).map(
            ([key, value]) => {
                /** 添加节点 */
                const handleAppend = () => {
                    const { session, pages } = getState();

                    const page = session.pageId
                        ? pages[session.pageId]
                        : undefined;

                    if (!page) {
                        return alert("请先添加页面");
                    }

                    const nodeId = randomUUID();
                    mutation.commit([
                        ({ nodes }) => {
                            nodes[nodeId] = {
                                id: nodeId,
                                content: [],
                                element: {
                                    type: key,
                                    props: {},
                                },
                            };
                        },
                        ({ pages }) => {
                            pages[page.id].content.push(nodeId);
                        },
                    ]);
                };

                /** 渲染器标题 */
                const { title } = value.typeSchema;

                return (
                    <div key={key} onClick={handleAppend}>
                        {title}
                    </div>
                );
            }
        );

        slotComponentLibrary = (
            <div className="w-60 bg-zinc-100">
                <h2>物料区</h2>
                <div>点击添加到当前页面</div>
                {slotRendererList}
            </div>
        );
    }

    /** 编辑区 */
    let slotPageEditor: ReactNode;
    {
        /** 添加页面 */
        let slotAdd: ReactNode;
        {
            /** 添加页面 */
            const handleAddPage = () => {
                const pageId = randomUUID();

                mutation.commit([
                    ({ pages }) => {
                        pages[pageId] = {
                            id: pageId,
                            content: [],
                        };
                    },
                    ({ session }) => {
                        session.pageId = pageId;
                    },
                ]);
            };

            slotAdd = <button onClick={handleAddPage}>添加页面</button>;
        }

        /** 切换页面 */
        let slotChange: ReactNode;
        {
            /** 页面列表 */
            let slotPageOptionList: ReactNode;
            {
                /** 从数仓取页面标识列表 */
                const pages = useSelector(({ pages }) => Object.keys(pages));

                slotPageOptionList = pages.map((pageId) => {
                    return (
                        <option key={pageId} value={pageId}>
                            {pageId.slice(-12)}
                        </option>
                    );
                });
            }

            /** 切换选中页面 */
            const handleChangePage: ChangeEventHandler<HTMLSelectElement> = (
                event
            ) => {
                const { value } = event.target;

                mutation.commit([
                    ({ session }) => {
                        session.pageId = value;
                    },
                ]);
            };

            /** 当前选中页面标识 */
            const pageId = useSelector(({ session }) => session.pageId);

            slotChange = (
                <select value={pageId} onChange={handleChangePage}>
                    {slotPageOptionList}
                </select>
            );
        }

        /** 页面内容 */
        let slotPageContent: ReactNode;
        {
            /** 渲染页面节点 */
            const NodeRenderer: FC<{ nodeId: string }> = (props) => {
                const { nodeId } = props;

                /** 选中节点 */
                const handleSelectNode: MouseEventHandler = (event) => {
                    event.stopPropagation();

                    mutation.commit([
                        ({ session }) => {
                            session.nodeId = nodeId;
                        },
                    ]);
                };

                /** 从数仓取目标节点数据 */
                const node = useSelector(({ nodes }) => nodes[nodeId]);
                if (!node) {
                    return <>未找到节点数据</>;
                }

                /** 节点对应渲染器 */
                const TargetRenderer = Reflect.get(Renderer, node.element.type);

                return (
                    <span onClickCapture={handleSelectNode}>
                        <TargetRenderer {...node.element.props}>
                            {node.content.map((nodeId) => {
                                return (
                                    <NodeRenderer
                                        key={nodeId}
                                        nodeId={nodeId}
                                    />
                                );
                            })}
                        </TargetRenderer>
                    </span>
                );
            };

            /** 从数仓取当前选中页面数据 */
            const page = useSelector(({ session, pages }) =>
                session.pageId ? pages[session.pageId] : undefined
            );

            slotPageContent = page?.content.map((nodeId) => {
                return <NodeRenderer key={nodeId} nodeId={nodeId} />;
            });
        }

        slotPageEditor = (
            <div>
                <h2>编辑区</h2>
                <div className="inline-grid grid-flow-col gap-2">
                    <button onClick={mutation.undo}>撤销</button>
                    <button onClick={mutation.redo}>重做</button>
                    {slotAdd}
                    {slotChange}
                </div>
                <div className="w-[375px] h-[812px] border box-content">
                    {slotPageContent}
                </div>
            </div>
        );
    }

    /** 配置区 */
    let slotPropertyPanel: ReactNode;
    {
        /** 从数仓取当前选中节点数据 */
        const node = useSelector(({ session, nodes }) =>
            session.nodeId ? nodes[session.nodeId] : undefined
        );

        /** 面包屑 */
        const slotBreadcrumb = node
            ? "当前选中节点: " + node.id.slice(-12)
            : "选择节点并进行配置";

        /** 属性配置列表 */
        let slotSchemaList: ReactNode;
        {
            /** 递归生成属性面板 */
            const walkSchema = (
                valuePath: string[],
                schemaPath: string[]
            ): ReactNode => {
                if (!node) return;

                const value = get(node, valuePath);

                const schema = get(Renderer, [
                    node.element.type,
                    "typeSchema",
                    ...schemaPath,
                ]);

                if (schema.type === "string") {
                    const placeholder =
                        schema.placeholder ?? `请填写${schema.title}`;

                    const handleChange: ChangeEventHandler<HTMLInputElement> = (
                        event
                    ) => {
                        mutation.commit([
                            ({ nodes }) => {
                                set(
                                    nodes,
                                    [node.id, ...valuePath],
                                    event.target.value
                                );
                            },
                        ]);
                    };

                    return (
                        <div key={node.id}>
                            <div>{schema.title}</div>
                            <input
                                placeholder={placeholder}
                                defaultValue={value}
                                onChange={handleChange}
                            />
                        </div>
                    );
                }

                if (schema.type === "object") {
                    return Object.keys(schema.properties).map((key) => {
                        return walkSchema(
                            [...valuePath, key],
                            [...schemaPath, "properties", key]
                        );
                    });
                }
            };

            slotSchemaList = walkSchema(["element", "props"], []);
        }

        slotPropertyPanel = (
            <div className="flex-1">
                <h2>配置区</h2>
                <div>{slotBreadcrumb}</div>
                {slotSchemaList}
            </div>
        );
    }

    /** 预览区 */
    let slotInstantPreview: ReactNode;
    {
        /** 生成 formily schema */
        const schema = useSelector(({ session, nodes, pages }) => {
            const { pageId } = session;
            if (!pageId) return;

            const walkNode = (nodeId: string): any => {
                const node = nodeId === pageId ? pages[pageId] : nodes[nodeId];
                if (!node) return;

                const { content, element } = node as Node;

                return {
                    type: "object",
                    properties: Object.fromEntries(
                        content.map((id) => {
                            return [id, walkNode(id)];
                        })
                    ),
                    "x-component": element?.type,
                    "x-component-props": element?.props,
                };
            };

            return walkNode(pageId);
        });

        /** 真机渲染 */
        let slotPagePreview: ReactNode;
        {
            const walkSchema = (schema: any) => {
                if (!schema) return;

                const {
                    "x-component": componentName,
                    "x-component-props": componentProps,
                    properties,
                } = schema;

                const TargetRenderer =
                    Reflect.get(Renderer, componentName) ??
                    ((props: any) => <div>{props.children}</div>);

                return (
                    <TargetRenderer {...componentProps}>
                        {Object.entries(properties).map(([key, value]) => {
                            return (
                                <Fragment key={key}>
                                    {walkSchema(value)}
                                </Fragment>
                            );
                        })}
                    </TargetRenderer>
                );
            };

            slotPagePreview = walkSchema(schema);
        }

        slotInstantPreview = (
            <div className="flex-1 bg-zinc-400">
                <h2>预览区</h2>
                <div>查看真机渲染效果</div>
                <div className="w-[375px] h-[812px] border box-content bg-white mx-auto">
                    {slotPagePreview}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-row">
            {slotComponentLibrary}
            <div className="w-[720px] flex flex-row">
                {slotPageEditor}
                {slotPropertyPanel}
            </div>
            {slotInstantPreview}
        </div>
    );
};
