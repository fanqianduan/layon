/**
 * 应用骨架
 */

import { FC, ReactNode, StrictMode } from "react";
import { Provider as Redux, useSelector } from "react-redux";
import { mutation, store } from "../redux";
import { randomUUID } from "../utils";
import * as Page from "./page";

/**
 * 应用上下文
 */
export const Provider: FC = (props) => {
    const { children } = props;

    return (
        <StrictMode>
            <Redux store={store}>{children}</Redux>
        </StrictMode>
    );
};

/**
 * 应用布局
 */
export const Layout: FC<{ aside?: ReactNode }> = (props) => {
    const { children, aside } = props;

    return (
        <div className="h-screen flex flex-row">
            <aside className="w-60 flex-shrink-0">{aside}</aside>
            <main className="flex-1">{children}</main>
        </div>
    );
};

/**
 * 应用内容
 */
export const Content: FC = () => {
    const pageId = useSelector(({ session }) => session.pageId) ?? "";

    const page = useSelector(({ pages }) => pages[pageId]);

    return (
        <div className="p-6">
            <div>
                <button className="border px-1 mr-2" onClick={mutation.undo}>
                    撤销
                </button>
                <button className="border px-1 mr-2" onClick={mutation.redo}>
                    重做
                </button>
                <Page.Create />
                <Page.Switcher />
            </div>
            <Page.Container>
                {pageId}
                {page?.children.map((nodeId) => {
                    return <Page.Node key={nodeId} nodeId={nodeId} />;
                })}
            </Page.Container>
            <Page.AddComponent pageId={pageId} />
        </div>
    );
};
