/**
 * 渲染器
 */

import { FC } from "react";
import { UUID } from "../redux";

/**
 * 按钮
 */
export const Button: FC<{ nodeId: UUID }> = (props) => {
    const { nodeId } = props;

    return (
        <div>
            <button className="px-4 py-2 border" title={nodeId}>
                按钮
            </button>
        </div>
    );
};
