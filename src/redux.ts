/**
 * 数据仓库
 */

import { applyPatches, enablePatches, Patch, produce } from "immer";
import {
    applyMiddleware,
    compose,
    createStore,
    Dispatch,
    Middleware,
} from "redux";

//#region schema

export type UUID = string;

export type Node = {
    id: UUID;
    content: Array<Node["id"]>;
    element: {
        type: string;
        props: {
            [key: string]: any;
        };
    };
};

export type Page = {
    id: UUID;
    content: Array<Node["id"]>;
};

export type Session = {
    pageId?: Page["id"];
    nodeId?: Node["id"];
};

type Store = {
    nodes: Record<UUID, Node>;
    pages: Record<UUID, Page>;
    session: Session;
};

declare module "react-redux" {
    interface DefaultRootState extends Store {}
}

//#endregion

//#region store

/**
 * 操作数仓
 */
export const mutation = {
    setup(): Middleware {
        enablePatches();

        type Commit = {
            options: any;
            redos: Patch[];
            undos: Patch[];
        };

        const history = {
            redos: [] as Commit[],
            undos: [] as Commit[],
        };

        const handlers = {
            "mutation/commit"(next: Dispatch, payload: any) {
                const { patches, options } = payload;

                const commit: Commit = {
                    options,
                    redos: [],
                    undos: [],
                };

                let state = getState();
                for (const patch of patches) {
                    state = produce(state, patch, (redo, undo) => {
                        commit.redos.push(...redo);
                        commit.undos.push(...undo);
                    });
                }

                next({
                    type: "mutation/commit",
                    payload: state,
                });

                history.undos.push(commit);
            },

            "mutation/redo"(next: Dispatch) {
                const commit = history.redos.pop();
                if (!commit) return;

                next({
                    type: "mutation/patch",
                    payload: commit.redos,
                });

                history.undos.push(commit);
            },

            "mutation/undo"(next: Dispatch) {
                const commit = history.undos.pop();
                if (!commit) return;

                next({
                    type: "mutation/patch",
                    payload: commit.undos,
                });

                history.redos.push(commit);
            },
        };

        return () => (next) => (action) => {
            const handler = Reflect.get(handlers, action.type);

            if (handler) {
                return handler(next, action.payload);
            }

            next(action);
        };
    },

    commit(patches: Array<(store: Store) => void>, options?: any) {
        dispatch({
            type: "mutation/commit",
            payload: { patches, options },
        });
    },

    redo() {
        dispatch({
            type: "mutation/redo",
        });
    },

    undo() {
        dispatch({
            type: "mutation/undo",
        });
    },
};

/**
 * 数仓实例
 */
export const store = createStore(
    (state: Store = {} as any, action) => {
        if (action.type === "mutation/commit") {
            return Reflect.get(action, "payload");
        }

        if (action.type === "mutation/patch") {
            return applyPatches(state, Reflect.get(action, "payload"));
        }

        return state;
    },

    {
        nodes: {},
        pages: {},
        session: {},
    },

    (Reflect.get(window, "__REDUX_DEVTOOLS_EXTENSION_COMPOSE__") || compose)(
        applyMiddleware(mutation.setup())
    )
);

/**
 * 导出成员
 */
export const { dispatch, getState, subscribe } = store;

//#endregion
