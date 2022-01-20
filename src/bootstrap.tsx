/**
 * 引导程序
 */

import { Container, render } from "react-dom";
import * as App from "./components/app";
import * as Aside from "./components/aside";
import { getState, Node, Page, subscribe } from "./redux";

/**
 * 挂载视图
 */
export const mountApp = (target: "root" | ({} & string) | Container) => {
    const container =
        typeof target === "string" ? document.getElementById(target) : target;

    if (!container) return; // 挂载 dom 节点为空

    render(
        <App.Provider>
            <App.Layout aside={<Aside.Container />}>
                <App.Content />
            </App.Layout>
        </App.Provider>,
        container
    );
};

/**
 * 同步预览
 */
export const syncPreview = () => {
    delete sessionStorage.preview;

    subscribe(() => {
        const { nodes, pages, session } = getState();

        const { pageId } = session;

        if (pageId) {
            const page = pages[pageId];

            if (page) {
                const getSchema = (target: Page | Node): unknown => {
                    const { children } = target;

                    const schema = {
                        type: "object",
                        properties: Object.fromEntries(
                            children.map((id) => {
                                return [id, getSchema(nodes[id])];
                            })
                        ),
                    };

                    const properties = Reflect.get(
                        target,
                        "properties"
                    ) as Node["properties"];

                    if (properties) {
                        Reflect.set(schema, "x-component", properties.schema);
                        Reflect.set(
                            schema,
                            "x-component-props",
                            properties.value
                        );
                    }

                    return schema;
                };

                const iframe = document.createElement("iframe");
                iframe.hidden = true;
                document.body.appendChild(iframe);

                const { sessionStorage } = iframe.contentWindow!;
                sessionStorage.preview = JSON.stringify(getSchema(page));
                document.body.removeChild(iframe);

                return;
            }
        }

        delete sessionStorage.preview;
    });
};
