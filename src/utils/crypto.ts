/**
 * 加密
 */

import { UUID } from "../redux";

declare global {
    interface Crypto {
        randomUUID?: () => UUID;
    }
}

export const randomUUID = (): UUID => {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    const url = URL.createObjectURL(new Blob());
    URL.revokeObjectURL(url);
    return url.slice(-36);
};
