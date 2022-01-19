/**
 * 属性配置
 */

import { ChangeEventHandler, FC } from "react";
import { useSelector } from "react-redux";
import { mutation, UUID } from "../redux";
import * as Schema from "../schema.json";

/**
 * 字符串类型
 */
export const String: FC<{ target: [UUID, string] }> = (props) => {
    const [nodeId, key] = props.target;

    const node = useSelector(({ nodes }) => nodes[nodeId]);

    const { schema, value } = node.properties;

    const Component = Schema[schema as keyof typeof Schema];

    const property = Component.properties.find((p) => p.key === key);

    if (property) {
        const { title, placeholder } = property;

        const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
            mutation.commit([
                ({ nodes }) => {
                    nodes[nodeId].properties.value[key] = event.target.value;
                },
            ]);
        };

        return (
            <div>
                <div>{title}</div>
                <input
                    placeholder={placeholder}
                    defaultValue={value[key]}
                    onChange={onChange}
                />
            </div>
        );
    }

    return <>no property</>;
};
