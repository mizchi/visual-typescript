import React from "react";
import ts from "typescript";
import { Keyword, IndentBlock } from "../renderer_misc";
import { useRendererContext } from "../renderer_contexts";

export function IfStatementRenderer({ node }: { node: ts.IfStatement }) {
  const { Renderer: Renderer } = useRendererContext();
  return (
    <div style={{ display: true ? "inline" : "block" }}>
      <Keyword>if</Keyword> (
      <Renderer tree={node.expression} />) {"{"}
      <IndentBlock>
        <Renderer tree={node.thenStatement} />
      </IndentBlock>
      {node.elseStatement ? (
        <div>
          {"}"}&nbsp;
          <Keyword>else</Keyword>
          &nbsp;
          {node.elseStatement.kind === ts.SyntaxKind.IfStatement ? (
            <Renderer tree={node.elseStatement} />
          ) : (
            <>
              {"{"}
              <IndentBlock>
                <Renderer tree={node.elseStatement} />
              </IndentBlock>
              {"}"}
            </>
          )}
        </div>
      ) : (
        <>{"}"}</>
      )}
    </div>
  );
}
