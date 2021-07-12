import React from "react";
import ts from "typescript";
import { useRenderer } from "../contexts";
import { IndentBlock } from "../misc";

export function isJsxRendererNode(node: ts.Node): node is ts.JsxChild {
  return (
    ts.isJsxElement(node) ||
    ts.isJsxFragment(node) ||
    ts.isJsxText(node) ||
    ts.isJsxSelfClosingElement(node) ||
    ts.isJsxExpression(node)
  );
}

export function JsxRenderer({ node }: { node: ts.JsxChild }) {
  if (ts.isJsxElement(node)) {
    return <JsxElementRenderer node={node} />;
  }
  if (ts.isJsxFragment(node)) {
    return <JsxFragmentRenderer node={node} />;
  }
  if (ts.isJsxText(node)) {
    return <JsxTextRenderer node={node} />;
  }
  if (ts.isJsxSelfClosingElement(node)) {
    return <JsxSelfClosingElementRenderer node={node} />;
  }

  if (ts.isJsxExpression(node)) {
    return <JsxExpressionRenderer node={node} />;
  }
  return <>unknown jsx</>;
}

export function JsxElementRenderer({ node }: { node: ts.JsxElement }) {
  return (
    <span>
      <IndentBlock>
        <JsxOpeningElementRenderer node={node.openingElement} />
        <IndentBlock>
          {node.children.map((c, idx) => {
            return (
              <div key={idx}>
                <JsxRenderer node={c} />{" "}
              </div>
            );
          })}
        </IndentBlock>
        <JsxClosingElementRenderer node={node.closingElement} />
      </IndentBlock>
    </span>
  );
}

function JsxExpressionRenderer({ node }: { node: ts.JsxExpression }) {
  const Renderer = useRenderer();
  return (
    <>
      {"{"}
      {node.expression && <Renderer node={node.expression} />}
      {"} "}
    </>
  );
}

function JsxTextRenderer({ node }: { node: ts.JsxText }) {
  const Renderer = useRenderer();
  return <>{node.text}</>;
}

function JsxFragmentRenderer({ node }: { node: ts.JsxFragment }) {
  const Renderer = useRenderer();

  return (
    <>
      {"<>"}
      <IndentBlock>
        {node.children.map((c, idx) => {
          return (
            <div key={idx}>
              <Renderer node={c} />
            </div>
          );
        })}
      </IndentBlock>
      {"</>"}
    </>
  );
}

function JsxAttributesRenderer({ node }: { node: ts.JsxAttributes }) {
  const Renderer = useRenderer();
  return (
    <>
      {node.properties.map((attr, idx) => {
        if (ts.isJsxAttribute(attr)) {
          return (
            <span key={idx}>
              {attr.name && <Renderer node={attr.name} />}
              {attr.initializer && (
                <>
                  =<Renderer node={attr.initializer} />
                </>
              )}
            </span>
          );
        } else {
          const tt = attr as ts.JsxSpreadAttribute;
          return (
            <span key={idx}>
              {"{..."}
              <Renderer node={tt.expression} />
            </span>
          );
        }
      })}
    </>
  );
}

function JsxSelfClosingElementRenderer({
  node,
}: {
  node: ts.JsxSelfClosingElement;
}) {
  return (
    <span>
      {"<"}
      <JsxTagNameRenderer node={node.tagName} />
      &nbsp;
      <JsxAttributesRenderer node={node.attributes} />
      {" />"}
    </span>
  );
}

function JsxOpeningElementRenderer({ node }: { node: ts.JsxOpeningElement }) {
  return (
    <>
      {"<"}
      <JsxTagNameRenderer node={node.tagName} />
      <JsxAttributesRenderer node={node.attributes} />
      {">"}
    </>
  );
}
function JsxClosingElementRenderer({ node }: { node: ts.JsxClosingElement }) {
  return (
    <>
      {"</"}
      <JsxTagNameRenderer node={node.tagName} />
      {">"}
    </>
  );
}
function JsxTagNameRenderer({ node }: { node: ts.JsxTagNameExpression }) {
  const Renderer = useRenderer();
  if (ts.isIdentifier(node)) {
    return <Renderer node={node} />;
  }
  return <>unknown jsx</>;
}
