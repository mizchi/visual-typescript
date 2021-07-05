import React from "react";
import ts from "typescript";
import { useRendererContext } from "./renderer_contexts";
import { IndentBlock, Literal } from "./renderer_misc";

export function LiteralRenderer({ node }: { node: ts.LiteralExpression }) {
  const { Renderer } = useRendererContext();

  if (ts.isStringLiteral(node)) {
    return <Literal>"{node.text}"</Literal>;
  }
  if (ts.isNumericLiteral(node)) {
    return <Literal>{node.text}</Literal>;
  }

  if (ts.isArrayLiteralExpression(node)) {
    return (
      <span>
        {"[ "}
        {node.elements.map((e, idx) => {
          const isLastArg = idx === node.elements.length - 1;
          return (
            <span key={idx}>
              <Renderer tree={e} key={idx} />
              {!isLastArg && ", "}
            </span>
          );
        })}
        {" ]"}
      </span>
    );
  }

  if (ts.isObjectLiteralExpression(node)) {
    return (
      <>
        {"{"}
        <IndentBlock>
          {node.properties.map((p, idx) => {
            // console.log("", p);
            // debugger;
            const isLast = idx === node.properties.length - 1;
            if (p.kind === ts.SyntaxKind.PropertyAssignment) {
              return (
                <div key={idx}>
                  <Renderer tree={p.name} />
                  :&nbsp;
                  <Renderer tree={p.initializer} />
                  {!isLast && ", "}
                </div>
              );
            } else if (p.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
              return (
                <div key={idx}>
                  <Renderer tree={p.name!} />
                  {!isLast && ", "}
                </div>
              );
            } else if (p.kind === ts.SyntaxKind.MethodDeclaration) {
              const m = p as ts.MethodDeclaration;
              return (
                <div key={idx}>
                  <Renderer tree={m} />
                  {!isLast && ", "}
                </div>
              );
            } else {
              return <div key={idx}>wip</div>;
            }
          })}
        </IndentBlock>
        {"}"}
      </>
    );
  }
  return <>[[literal]]</>;
}
