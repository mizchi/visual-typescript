import React, { useCallback, useState } from "react";
import ts from "typescript";
import { sourceToCode } from "../worker/typescript.worker";
import { format } from "../worker/prettier.worker";
import { Scrollable, HeaderContainer, Root, ContentContainer } from "./layout";
import { TEMPLATES } from "../data";
import { parseCode, replaceNode, updateSource } from "vistree";
import { BlockTree } from "./BlockRenderer";
import { Box } from "@chakra-ui/react";
import { BlockSourceList } from "./BlockSourceList";

// @ts-ignore
const initialCode = TEMPLATES[Object.keys(TEMPLATES)[0]];
const initialAst = parseCode(initialCode);

export function App() {
  const [code, setCode] = useState<string>(initialCode);
  const [ast, setAst] = useState<ts.SourceFile>(initialAst);
  const onUpdateSource = useCallback(
    async (newStatements: ts.Statement[]) => {
      const newAst = updateSource(ast, newStatements);
      setAst(newAst);

      const newCode = await printCodeWithFormat(newAst);
      setCode(newCode);
    },
    [ast]
  );

  const onChangeNode = useCallback(
    async (prev: ts.Node, next: ts.Node) => {
      const newAst = replaceNode(ast, prev, next);
      setAst(newAst);
      const newCode = await printCodeWithFormat(newAst);
      setCode(newCode);
      console.log(newCode);
    },
    [ast]
  );

  return (
    <Root>
      <ContentContainer>
        <Box w="100%" h="100%" d="flex" flexDirection="row">
          <Box w="200px" maxW="100%" height="100%" position="relative">
            <BlockSourceList />
          </Box>
          <Box flex={1} maxWidth="100%" height="100%" position="relative">
            <Scrollable>
              <Box padding={3}>
                {/* <VisualTree ast={ast} /> */}
                {/* <EditableTree
                  ast={ast}
                  onChangeNode={onChangeNode}
                  onUpdateSource={onUpdateSource}
                /> */}
                <BlockTree
                  ast={ast}
                  onChangeNode={onChangeNode}
                  onUpdateSource={onUpdateSource}
                />
              </Box>
            </Scrollable>
          </Box>
        </Box>
      </ContentContainer>
    </Root>
  );
}

async function printCodeWithFormat(ast: ts.SourceFile) {
  const newCode = await sourceToCode(ast);
  const newCodeFormatted = await format(newCode);
  return newCodeFormatted;
}
