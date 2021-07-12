import resolve from "@rollup/plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";

export default {
  input: "src/extension.ts",
  output: {
    format: "cjs",
    file: "out/extension.js",
  },
  external: ["vscode"],
  plugins: [
    resolve(),
    ts({
      module: "commonjs",
    }),
  ],
};
