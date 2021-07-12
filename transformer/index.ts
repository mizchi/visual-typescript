import ts from "typescript";

export { useSyncedSource, TransformerProvider, useTransformer } from "./react";

export function parse(value: string) {
  console.time("parse");
  const ret = ts.createSourceFile(
    "file:///index.ts",
    value,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TSX
  );
  console.timeEnd("parse");
  return ret;
}

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false,
});

export function print(source: ts.SourceFile) {
  return printer.printFile(source);
}

export function replaceNode(
  source: ts.SourceFile,
  prev: ts.Node,
  next: ts.Node
) {
  function rewriter(): ts.TransformerFactory<ts.Node> {
    return (context) => {
      const visit: ts.Visitor = (node) => {
        if (prev === node) return next;
        return ts.visitEachChild(node, (child) => visit(child), context);
      };
      return (node) => ts.visitNode(node, visit);
    };
  }
  const result = ts.transform(source, [rewriter()]);
  const newAst = result.transformed[0] as ts.SourceFile;
  return newAst;
}
