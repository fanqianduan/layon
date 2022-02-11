/**
 * 应用骨架
 */

import { FC, StrictMode } from "react";
import { Provider as Redux } from "react-redux";
import { Builder } from "../pages/builder";
import { store } from "../redux";

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
export const Layout: FC = (props) => {
    const { children } = props;

    const { APP_NAME } = import.meta.env;

    return (
        <div className="h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <footer className="h-12 bg-zinc-700 text-white flex flex-row items-center">
                <div className="flex-1 ml-4">{APP_NAME}</div>
                <div className="mr-4">更新时间: 2022-02-07</div>
            </footer>
        </div>
    );
};

/**
 * 应用内容
 */
export const Content: FC = () => {
    return <Builder />;
};
