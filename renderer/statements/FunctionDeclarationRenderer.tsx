import React from "react";
import ts from "typescript";
import { IndentBlock, Keyword, Parameters } from "../misc";
import { IdentifierRenderer } from "../expressions/IdentifierRenderer";
import { useRenderer } from "../contexts";

export function FunctionDeclarationRenderer({
  node,
}: {
  node: ts.FunctionDeclaration;
}) {
  const Renderer = useRenderer();
  return (
    <div>
      {node.modifiers &&
        node.modifiers.map((mod, idx) => {
          return (
            <span key={idx}>
              <Renderer node={mod} />
              &nbsp;
            </span>
          );
        })}
      <Keyword>function</Keyword>&nbsp;
      {node.name && <IdentifierRenderer node={node.name} />}(
      <IndentBlock>
        <Parameters parameters={node.parameters} />
      </IndentBlock>
      ) {"{"}
      {node.body && (
        <IndentBlock>
          <Renderer node={node.body} />
        </IndentBlock>
      )}
      {"}"}
    </div>
  );
}
