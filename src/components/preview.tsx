/**
 * 应用预览
 */

import { FC, useEffect, useState } from "react";
import * as Renderer from "./renderer";

export const Container: FC = () => {
    type Schema = {
        properties: Record<string, Schema>;
        "x-component": string;
        "x-component-props": any;
    };

    const [schema, setSchema] = useState<Schema>();

    useEffect(() => {
        const listener = () => {
            if (sessionStorage.preview) {
                setSchema(JSON.parse(sessionStorage.preview));
            }
        };

        window.addEventListener("storage", listener);

        return () => {
            window.removeEventListener("storage", listener);
        };
    }, []);

    if (schema) {
        const Node: FC<{ schema: Schema }> = (props) => {
            const {
                "x-component": componentName,
                "x-component-props": componentProps,
                properties,
            } = props.schema;

            const NodeRenderer =
                Reflect.get(Renderer, componentName) ??
                ((props: any) => <div>{props.children}</div>);

            return (
                <NodeRenderer {...componentProps}>
                    {Object.entries(properties).map(([key, value]) => {
                        return <Node key={key} schema={value} />;
                    })}
                </NodeRenderer>
            );
        };

        return (
            <>
                <div>preview</div>
                <Node schema={schema} />
            </>
        );
    }

    return <>preview</>;
};
