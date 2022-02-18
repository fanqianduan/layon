/**
 * 渲染器
 */

import { FC } from "react";

/**
 * 按钮
 */
export const Button: FC<{
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
