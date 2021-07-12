import ts from "typescript";

export const trueNode = ts.factory.createTrue();
export const falseNode = ts.factory.createFalse();

export const variableStatement = ts.factory.createVariableStatement(
  [],
  ts.factory.createVariableDeclarationList([
    ts.factory.createVariableDeclaration(
      "x",
      undefined,
      undefined,
      ts.factory.createTrue()
    ),
  ])
);
