import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import ts from "typescript";
import { useRendererContext } from "../contexts";
import { Keyword } from "../misc";

export function ImportDeclarationRenderer({
  node,
}: {
  node: ts.ImportDeclaration;
}) {
  const { Renderer } = useRendererContext();
  return (
    <Flex alignItems="flex-end">
      <Keyword>import</Keyword>
      {node.importClause && (
        <>
          &nbsp;
          <ImportClauseRenderer node={node.importClause} />
          &nbsp;
          <Keyword>from</Keyword>
        </>
      )}
      &nbsp;
      <Renderer node={node.moduleSpecifier} />
    </Flex>
  );
}

function ImportClauseRenderer({ node }: { node: ts.ImportClause }) {
  const { Renderer } = useRendererContext();
  return (
    <>
      {node.isTypeOnly && (
        <>
          <Keyword>type</Keyword>&nbsp;
        </>
      )}
      {node.name && <Renderer node={node.name} />}
      {node.namedBindings && ts.isNamespaceImport(node.namedBindings) && (
        <>
          <Keyword>{"*"}</Keyword>
          {node.namedBindings.name && (
            <>
              &nbsp;
              <Keyword>as</Keyword>
              &nbsp;
              <Renderer node={node.namedBindings.name} />
            </>
          )}
        </>
      )}
      {node.namedBindings && ts.isNamedImports(node.namedBindings) && (
        <>
          {"{ "}
          {node.namedBindings.elements.map((bind, idx) => {
            const last =
              idx ===
              (node.namedBindings as ts.NamedImports).elements.length - 1;
            return (
              <span key={idx}>
                <ImportSpecifierRenderer node={bind} />
                {!last && <>, </>}
              </span>
            );
          })}
          {" }"}
        </>
      )}
    </>
  );
}

function ImportSpecifierRenderer({ node }: { node: ts.ImportSpecifier }) {
  const { Renderer } = useRendererContext();
  return (
    <>
      {node.propertyName ? (
        <>
          <Renderer node={node.propertyName} />
          &nbsp;
          <Keyword>as</Keyword>
          &nbsp;
          <Renderer node={node.name} />
        </>
      ) : (
        <Renderer node={node.name} />
      )}
    </>
  );
}
