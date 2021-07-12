import React from "react";
import ts from "typescript";
import { useRendererContext } from "../contexts";
import { EmptyStatementRenderer } from "./EmptyStatementRenderer";
import { IfStatementRenderer, SwitchStatementRenderer } from "./logics";
import { ImportDeclarationRenderer } from "./ImportDeclarationRenderer";
import { VariableStatementRenderer } from "./VariableStatementRenderer";
import { Keyword } from "../misc";
import { FunctionDeclarationRenderer } from "./FunctionDeclarationRenderer";
import { ClassDeclarationRenderer } from "../expressions/class";

export function isStatement(node: ts.Node): node is ts.Statement {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isEmptyStatement(node) ||
    ts.isIfStatement(node) ||
    ts.isSwitchStatement(node) ||
    ts.isReturnStatement(node) ||
    ts.isVariableDeclaration(node) ||
    ts.isImportDeclaration(node) ||
    ts.isExpressionStatement(node)
  );
}

export function StatementRenderer({ node }: { node: ts.Statement }) {
  const { Renderer, root } = useRendererContext();

  if (ts.isExpressionStatement(node)) {
    return (
      <div>
        <Renderer node={node.expression} />;
      </div>
    );
  }
  if (ts.isFunctionDeclaration(node)) {
    return <FunctionDeclarationRenderer node={node} />;
  }

  if (ts.isClassDeclaration(node)) {
    return <ClassDeclarationRenderer node={node} />;
  }

  if (ts.isEmptyStatement(node)) {
    return <EmptyStatementRenderer node={node} />;
  }
  if (ts.isIfStatement(node)) {
    return <IfStatementRenderer node={node} />;
  }
  if (ts.isSwitchStatement(node)) {
    return <SwitchStatementRenderer node={node} />;
  }
  if (ts.isImportDeclaration(node)) {
    return <ImportDeclarationRenderer node={node} />;
  }
  if (ts.isVariableStatement(node)) {
    return <VariableStatementRenderer node={node} />;
  }
  if (ts.isReturnStatement(node)) {
    return (
      <div>
        <Keyword>return</Keyword>
        {node.expression && (
          <>
            &nbsp;
            {"("}
            <Renderer node={node.expression} />
            {")"}
          </>
        )}
        ;
      </div>
    );
  }

  const code = node.getFullText(root);
  return <>Unknown Statement: {code.slice(0, 10) + "..."}</>;
}
