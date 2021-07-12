import React from "react";
import ts from "typescript";
import { Arguments, IndentBlock, Literal, TypeArguments } from "../misc";
import { ArrowFunctionExpressionRenderer } from "./function";
import { IdentifierRenderer } from "./IdentifierRenderer";
import { ExpressionOverlay } from "../overlays";
import { Box } from "@chakra-ui/react";
import { useRenderer } from "../contexts";

export function isExpression(node: ts.Node): node is ts.Expression {
  return (
    ts.isLiteralExpression(node) ||
    ts.isBinaryExpression(node) ||
    ts.isCallExpression(node) ||
    ts.isPropertyAccessExpression(node) ||
    ts.isParenthesizedExpression(node) ||
    ts.isIdentifier(node) ||
    ts.isArrowFunction(node) ||
    ts.isStringLiteral(node) ||
    ts.isNumericLiteral(node) ||
    ts.isArrayLiteralExpression(node) ||
    ts.isObjectLiteralExpression(node)
  );
}

export function ExpressionRenderer({ node }: { node: ts.Expression }) {
  return (
    <ExpressionOverlay node={node}>
      <_ExpressionRendererImpl node={node} />
    </ExpressionOverlay>
  );
}

function _ExpressionRendererImpl({ node }: { node: ts.Expression }) {
  const Renderer = useRenderer();

  if (ts.isBinaryExpression(node)) {
    return (
      <span>
        <Renderer node={node.left} />
        &nbsp;
        <Renderer node={node.operatorToken} />
        &nbsp;
        <Renderer node={node.right} />
      </span>
    );
  }

  if (ts.isIdentifier(node)) {
    return <IdentifierRenderer node={node} />;
  }

  if (ts.isCallExpression(node)) {
    return (
      <span>
        <Renderer node={node.expression} />(
        {node.arguments.length > 0 && (
          <IndentBlock>
            <Arguments arguments={node.arguments} />
          </IndentBlock>
        )}
        )
        {node.typeArguments && (
          <>
            <TypeArguments typeArguments={node.typeArguments} />
          </>
        )}
      </span>
    );
  }

  if (ts.isParenthesizedTypeNode(node)) {
    return (
      <>
        (<ExpressionRenderer node={node} />)
      </>
    );
  }
  if (ts.isPropertyAccessExpression(node)) {
    return (
      <Box display="inline-flex" alignItems="flex-end">
        <Renderer node={node.expression} />
        {node.questionDotToken ? "?." : "."}
        <Renderer node={node.name} />
      </Box>
    );
  }
  if (ts.isArrowFunction(node)) {
    return <ArrowFunctionExpressionRenderer node={node} />;
  }
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
              <Renderer node={e} key={idx} />
              {!isLastArg && ", "}
            </span>
          );
        })}
        {" ]"}
      </span>
    );
  }
  if (ts.isObjectLiteralExpression(node)) {
    return <ObjectLiteralExpressionRenderer node={node} />;
  }
  return <>[[literal]]</>;
}

function ObjectLiteralExpressionRenderer({
  node,
}: {
  node: ts.ObjectLiteralExpression;
}) {
  const Renderer = useRenderer();
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
                <Renderer node={p.name} />
                :&nbsp;
                <Renderer node={p.initializer} />
                {!isLast && ", "}
              </div>
            );
          } else if (p.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
            return (
              <div key={idx}>
                <Renderer node={p.name!} />
                {!isLast && ", "}
              </div>
            );
          } else if (p.kind === ts.SyntaxKind.MethodDeclaration) {
            const m = p as ts.MethodDeclaration;
            return (
              <div key={idx}>
                <Renderer node={m} />
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
