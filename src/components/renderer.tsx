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

    const onClick = () => {
        alert(text ?? "按钮");
    };

    return (
        <button className="px-4 py-2 border" onClick={onClick}>
            {text ?? "按钮"}
        </button>
    );
};

/**
 * 轮播图
 */
export const Swiper: FC<{
    /**
     * 轮播项
     */
    items: Array<{
        /**
         * 封面
         */
        cover: string;
        /**
         * 链接
         */
        href: string;
    }>;
}> = (props) => {
    const { items } = props;

    return (
        <div className="snap-x snap-mandatory w-full h-40 overflow-x-auto whitespace-nowrap">
            {items.map((item, index) => {
                const { cover, href } = item;

                const onClick = () => {
                    window.open(href, "_blank");
                };

                return (
                    <div
                        key={index}
                        className="snap-center w-full h-full inline-block align-middle"
                        onClick={onClick}
                    >
                        <img
                            className="w-full h-full object-contain"
                            src={cover}
                        />
                    </div>
                );
            })}
        </div>
    );
};
