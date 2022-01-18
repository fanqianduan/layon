/**
 * 侧边栏
 */

import { FC } from "react";

/**
 * 容器
 */
export const Container: FC = () => {
    return (
        <div className="bg-zinc-50 h-full py-6">
            <div className="mx-6">组件</div>
            <div className="m-6 h-20 flex items-center justify-center cursor-pointer bg-white border">
                按钮
            </div>
        </div>
    );
};
