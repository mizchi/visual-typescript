import ts from "typescript";

export async function sourceToCode(source: ts.SourceFile) {
  const printer = ts.createPrinter();
  return printer.printFile(source);
}
