/**
 * 渲染器
 */

import { FC } from "react";
import { UUID } from "../redux";

/**
 * 按钮
 */
export const Button: FC<{
    nodeId: UUID;

    /**
     * 文字
     *
     * @placeholder 请输入文字
     */
    text: string;
}> = (props) => {
    const { nodeId, text } = props;

    return (
        <button className="px-4 py-2 border" title={nodeId}>
            {text ?? "按钮"}
        </button>
    );
};
