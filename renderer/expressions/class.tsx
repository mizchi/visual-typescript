import React from "react";
import ts from "typescript";
import { useRenderer } from "../contexts";
import { IndentBlock, Keyword, Parameters, TypeParameters } from "../misc";
import { BlockRenderer } from "../statements/BlockRenderer";
import { IdentifierRenderer } from "./IdentifierRenderer";

export function ClassDeclarationRenderer({
  node,
}: {
  node: ts.ClassDeclaration;
}) {
  const Renderer = useRenderer();
  return (
    <div>
      <Keyword>class</Keyword>
      {node.name && (
        <>
          &nbsp;
          {node.name && <IdentifierRenderer node={node.name} />}
          &nbsp;
          {node.typeParameters && (
            <TypeParameters typeParameters={node.typeParameters} />
          )}
        </>
      )}
      {node.heritageClauses && (
        <>
          {node.heritageClauses.map((h, idx) => {
            return (
              <span key={idx}>
                <HeritageClauseRenderer node={h} />
              </span>
            );
          })}
          &nbsp;
        </>
      )}
      {"{"}
      <IndentBlock>
        {node.members?.map((member, idx) => {
          if (ts.isConstructorDeclaration(member)) {
            return <ConstructorDeclarationRenderer key={idx} node={member} />;
          }
          return (
            <div key={idx}>
              <Renderer node={member} />
            </div>
          );
        })}
      </IndentBlock>
      {"}"}
    </div>
  );
}

function HeritageClauseRenderer({ node }: { node: ts.HeritageClause }) {
  const Renderer = useRenderer();
  return (
    <>
      &nbsp;
      {node.token === ts.SyntaxKind.ExtendsKeyword && (
        <Keyword>extends</Keyword>
      )}
      {node.token === ts.SyntaxKind.ImplementsKeyword && (
        <Keyword>implements</Keyword>
      )}
      &nbsp;
      {node.types.map((tt, idx) => {
        const last = idx === node.types!.length - 1;
        return (
          <span key={idx}>
            <Renderer node={tt} />
            {!last && <>, </>}
          </span>
        );
      })}
    </>
  );
}

// if (ts.isConstructorDeclaration(node)) {
function ConstructorDeclarationRenderer({
  node,
}: {
  node: ts.ConstructorDeclaration;
}) {
  return (
    <>
      <Keyword>constructor</Keyword>
      {`(`}
      <IndentBlock>
        <Parameters parameters={node.parameters} />
      </IndentBlock>
      {`) {`}
      {node.body && (
        <IndentBlock>
          <BlockRenderer node={node.body} />
        </IndentBlock>
      )}
      {"}"}
    </>
  );
}
