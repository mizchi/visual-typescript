import React from "react";
import ts from "typescript";
import { useRenderer } from "../contexts";
import { IndentBlock, Keyword, Modifiers, TypeParameters } from "../misc";

export function InnterfaceDeclarationRenderer({
  node,
}: {
  node: ts.InterfaceDeclaration;
}) {
  const Renderer = useRenderer();
  // TODO: extends
  return (
    <div>
      {node.modifiers && <Modifiers modifiers={node.modifiers} />}
      <Keyword>interface</Keyword>
      &nbsp;
      <Renderer node={node.name} />
      {node.typeParameters && (
        <TypeParameters typeParameters={node.typeParameters} />
      )}
      {node.heritageClauses && (
        <>
          {node.heritageClauses.map((h, idx) => {
            const last: boolean = idx === node.heritageClauses!.length - 1;
            return (
              <div key={idx}>
                <Renderer node={h} />
                {!last && <>;</>}
              </div>
            );
          })}
        </>
      )}
      {" {"}
      <IndentBlock>
        {node.members.map((m, idx) => {
          return (
            <div key={idx}>
              <Renderer node={m} />;
            </div>
          );
        })}
      </IndentBlock>
      {"}"}
    </div>
  );
}

// export for forInitializer
export function VariableDeclarationListRenderer({
  node,
}: {
  node: ts.VariableDeclarationList;
}) {
  const Renderer = useRenderer();
  let declType;
  // TODO: Why 10?
  if (node.flags === ts.NodeFlags.Const || (node as any).flags === 10)
    declType = "const";
  else if (node.flags === ts.NodeFlags.Let) declType = "let";
  else declType = "var";

  const children = node.declarations.map((decl, idx) => {
    let initializer;
    if (decl.initializer) {
      initializer = <Renderer node={decl.initializer} />;
    }
    return (
      <span key={idx}>
        <Renderer node={decl.name} />
        {decl.type && (
          <>
            :&nbsp;
            <Renderer node={decl.type} />
          </>
        )}
        {initializer && <>&nbsp;=&nbsp;{initializer}</>}
      </span>
    );
  });
  return (
    <span>
      <Keyword>{declType}</Keyword>
      &nbsp;
      {children}
    </span>
  );
}
