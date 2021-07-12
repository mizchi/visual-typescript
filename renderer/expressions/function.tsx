import React from "react";
import ts from "typescript";
import { useRenderer } from "../contexts";
import { IndentBlock, Keyword, Modifiers, Parameters } from "../misc";

export function ArrowFunctionExpressionRenderer({
  node,
}: {
  node: ts.ArrowFunction;
}) {
  const Renderer = useRenderer();
  return (
    <span>
      {node.modifiers && <Modifiers modifiers={node.modifiers} />}
      {`(`}
      {<Parameters parameters={node.parameters} />}
      {`)`}&nbsp;{"=> "}
      {ts.isBlock(node.body) ? (
        <>
          {"{"}
          <IndentBlock>
            <Renderer node={node.body} />
          </IndentBlock>
          {"}"}
        </>
      ) : (
        <IndentBlock>
          <Renderer node={node.body} />
        </IndentBlock>
      )}
    </span>
  );
}
