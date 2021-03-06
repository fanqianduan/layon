/**
 * 引导程序
 */

import { Container, render } from "react-dom";
import * as App from "./components/app";

/**
 * 挂载视图
 */
export const mountApp = (target: "root" | ({} & string) | Container) => {
    const container =
        typeof target === "string" ? document.getElementById(target) : target;

    if (!container) return; // 挂载 dom 节点为空

    render(
        <App.Provider>
            <App.Layout>
                <App.Content />
            </App.Layout>
        </App.Provider>,
        container
    );
};
