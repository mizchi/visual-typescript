import React, { useEffect } from "react";
import ts from "typescript";
import { Keyword, IndentBlock } from "../misc";
import { Box } from "@chakra-ui/react";
import { useRenderer } from "../contexts";

export function IfStatementRenderer({ node }: { node: ts.IfStatement }) {
  const Renderer = useRenderer();
  return (
    <Box>
      <Keyword>if</Keyword> (
      <Renderer node={node.expression} />) {"{"}
      <IndentBlock>
        <Renderer node={node.thenStatement} />
      </IndentBlock>
      {node.elseStatement ? (
        <div>
          {"}"}&nbsp;
          <Keyword>else</Keyword>
          &nbsp;
          {node.elseStatement.kind === ts.SyntaxKind.IfStatement ? (
            <Renderer node={node.elseStatement} />
          ) : (
            <>
              {"{"}
              <IndentBlock>
                <Renderer node={node.elseStatement} />
              </IndentBlock>
              {"}"}
            </>
          )}
        </div>
      ) : (
        <>{"}"}</>
      )}
    </Box>
  );
}

export function SwitchStatementRenderer({
  node,
}: {
  node: ts.SwitchStatement;
}) {
  const Renderer = useRenderer();
  return (
    <div>
      <Keyword>switch</Keyword> (
      <Renderer node={node.expression} />) {"{"}
      {node.caseBlock.clauses.map((clause, idx) => {
        if (clause.kind === ts.SyntaxKind.DefaultClause) {
          const c = clause as ts.DefaultClause;
          // console.log(c);
          return (
            <div key={idx}>
              <Keyword>default</Keyword>:
              <>
                {"{"}
                <IndentBlock>
                  {c.statements.map((stmt, idx) => {
                    return <Renderer node={stmt} key={idx} />;
                  })}
                </IndentBlock>
                {"}"}
              </>
            </div>
          );
        } else {
          const c = clause as ts.CaseClause;
          const isBlock = c.statements[0]?.kind === ts.SyntaxKind.Block;
          return (
            <IndentBlock key={idx}>
              <Keyword>case</Keyword>
              &nbsp;
              <Renderer node={c.expression} />
              {":"}
              {c.statements.length > 0 && (
                <>
                  {isBlock ? (
                    <>
                      &nbsp;{"{"}
                      <IndentBlock>
                        {c.statements.map((stmt, idx) => {
                          return <Renderer node={stmt} key={idx} />;
                        })}
                      </IndentBlock>
                      {"}"}
                    </>
                  ) : (
                    <>
                      <IndentBlock>
                        {c.statements.map((stmt, idx) => {
                          return <Renderer node={stmt} key={idx} />;
                        })}
                      </IndentBlock>
                    </>
                  )}
                </>
              )}
            </IndentBlock>
          );
        }
      })}
      {"}"}
    </div>
  );
}
