import React from "react";
import ts from "typescript";
import { useRenderer } from "../contexts";
import { IndentBlock, Keyword } from "../misc";
import { VariableDeclarationListRenderer } from "./declaration";

export function ForOfStatementRenderer({ node }: { node: ts.ForOfStatement }) {
  const Renderer = useRenderer();
  return (
    <div>
      <Keyword>for</Keyword>&nbsp;(
      <ForInitializerRenderer node={node.initializer} />
      &nbsp;of&nbsp;
      <Renderer node={node.expression} />
      )&nbsp;{"{"}
      <IndentBlock>
        <Renderer node={node.statement} />
      </IndentBlock>
      {"}"}
    </div>
  );
}
// TODO
export function ForInStatementRenderer({ node }: { node: ts.ForInStatement }) {
  const Renderer = useRenderer();
  return <div>{"// (empty)"}</div>;
}

export function ForInitializerRenderer({ node }: { node: ts.ForInitializer }) {
  const Renderer = useRenderer();
  if (ts.isVariableDeclarationList(node)) {
    return <VariableDeclarationListRenderer node={node} />;
  }
  return <Renderer node={node} />;
}
