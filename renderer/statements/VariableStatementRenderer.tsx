import { Box } from "@chakra-ui/react";
import React from "react";
import ts from "typescript";
import { useRenderer } from "../contexts";
import { Keyword, Modifiers } from "../misc";
import { VariableDeclarationListRenderer } from "./declaration";

export function VariableStatementRenderer({
  node,
}: {
  node: ts.VariableStatement;
}) {
  const Renderer = useRenderer();
  return (
    <Box display="flex" alignItems="flex-end">
      {node.modifiers && <Modifiers modifiers={node.modifiers} />}
      <VariableDeclarationListRenderer node={node.declarationList} />
      {node.decorators && (
        <div>
          {node.decorators.map((t, idx) => {
            return (
              <div key={idx}>
                <Renderer node={t.expression} />
              </div>
            );
          })}
        </div>
      )}
      ;
    </Box>
  );
}
