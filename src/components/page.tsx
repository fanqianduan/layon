/**
 * 页面
 */

import { ChangeEventHandler, FC } from "react";
import { useSelector } from "react-redux";
import { mutation, UUID } from "../redux";
import { randomUUID } from "../utils";

/**
 * 容器
 */
export const Container: FC = (props) => {
    const { children } = props;

    return <div className="w-[375px] h-[812px] mt-2 border">{children}</div>;
};

/**
 * 切换页面
 */
export const Switcher: FC = () => {
    const pages = useSelector(({ pages }) => Object.keys(pages));

    const pageId = useSelector(({ session }) => session.pageId);

    const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        mutation.commit([
            ({ session }) => {
                session.pageId = event.target.value;
            },
        ]);
    };

    return (
        <select onChange={onChange} value={pageId}>
            {pages.map((pageId) => {
                return (
                    <option key={pageId} value={pageId}>
                        {pageId.slice(-10)}
                    </option>
                );
            })}
        </select>
    );
};

/**
 * 新建页面
 */
export const Create: FC = () => {
    const onClick = () => {
        const pageId = randomUUID();

        mutation.commit([
            ({ session }) => {
                session.pageId = pageId;
            },
            ({ pages }) => {
                pages[pageId] = {
                    id: pageId,
                    children: [],
                };
            },
        ]);
    };

    return (
        <button className="border px-1 mr-2" onClick={onClick}>
            添加
        </button>
    );
};

/**
 * 节点
 */
export const Node: FC<{ nodeId: UUID }> = (props) => {
    const { nodeId } = props;

    return <>{nodeId}</>;
};
