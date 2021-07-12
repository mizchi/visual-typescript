import ts from "typescript";

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

const printer = ts.createPrinter();
export async function print(source: ts.SourceFile) {
  return printer.printFile(source);
}
