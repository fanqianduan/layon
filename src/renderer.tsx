/**
 * 渲染器
 */

import type { JSONSchema4 } from "json-schema";
import { FC } from "react";

//#region Schema

type Renderer<P = {}> = FC<P> & {
    typeSchema: JSONSchema4;
};

//#endregion

//#region Button

/**
 * 按钮
 */
export const Button: Renderer<{
    /**
     * 文字
     */
    text: string;
}> = (props) => {
    const { text } = props;

    const handleClick = () => {
        alert(text ?? "按钮");
    };

    return (
        <button className="px-4 py-2 border" onClick={handleClick}>
            {text ?? "按钮"}
        </button>
    );
};

Button.typeSchema = {
    title: "按钮",
    type: "object",
    properties: {
        text: {
            title: "按钮文字",
            type: "string",
        },
    },
};

//#endregion
