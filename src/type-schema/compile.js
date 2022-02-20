import { writeFile } from "fs/promises";
import TS from "typescript";

const input = {
    renderer: "src/taro-renderer/renderer.tsx",
};

const output = {};

const util = {
    /**
     * @param {TS.Node} node
     */
    hasExportKeyword(node) {
        const modifiers = node.modifiers ?? [];

        const index = modifiers.findIndex(
            (modifier) => modifier.kind === TS.SyntaxKind.ExportKeyword
        );

        return index === -1 ? false : true;
    },
};

const program = TS.createProgram(Object.values(input), {});

TS.forEachChild(program.getSourceFile(input.renderer), (node) => {
    if (util.hasExportKeyword(node)) {
        const {
            declarationList: {
                declarations: [
                    {
                        name,
                        type: {
                            typeName,
                            typeArguments: [{ members }],
                        },
                    },
                ],
            },
            jsDoc: [{ comment }],
        } = node;

        Reflect.set(output, name.escapedText, {
            title: comment,
            type: "object",
            properties: Object.fromEntries(
                members.map((member) => {
                    return [
                        member.name.escapedText,
                        {
                            title: member.jsDoc[0].comment,
                            type:
                                member.type.kind === TS.SyntaxKind.StringKeyword
                                    ? "string"
                                    : undefined,
                        },
                    ];
                })
            ),
        });
    }
});

writeFile("src/taro-renderer/schema.json", JSON.stringify(output));
