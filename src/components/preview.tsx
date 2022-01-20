/**
 * 应用预览
 */

import { FC, useEffect } from "react";

export const Container: FC = () => {
    useEffect(() => {
        const listener = () => {
            if (localStorage.preview) {
                const schema = JSON.parse(localStorage.preview);

                console.log("schema", schema);
            }
        };

        window.addEventListener("storage", listener);

        return () => {
            window.removeEventListener("storage", listener);
        };
    }, []);

    return <>preview</>;
};
