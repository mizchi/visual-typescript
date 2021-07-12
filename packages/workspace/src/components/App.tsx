import React, { useCallback, useEffect, useState } from "react";
import ts from "typescript";
import { sourceToCode } from "../worker/typescript.worker";
import { format } from "../worker/prettier.worker";
import { Scrollable, Root, ContentContainer } from "./layout";
import { parseCode, replaceNode } from "vistree";
import { EditableVisualTree } from "./VisualTree/VisualTree";
import { Box, Textarea, VStack, Text } from "@chakra-ui/react";
import { BlockSourceList } from "./BlockSourceList";

function useReceivableValue(
  initialValue: string
): [
  temp: string,
  checkpoint: string,
  setTemp: (v: string) => void,
  setCheckpoint: (v: string) => void,
  hasDiff: boolean
] {
  const [temp, setTemp] = useState<string>(initialValue);
  const [lastReceived, setLastReceived] = useState<string>(initialValue);

  // to receive outer changes
  const [checkpoint, setCheckpoint] = useState<string>(initialValue);

  // detect initialCode changes
  useEffect(() => {
    if (initialValue !== lastReceived) {
      setTemp(initialValue);
      setLastReceived(initialValue);
    }
  }, [lastReceived, initialValue, setTemp]);

  const setCheckpointWithTemp = useCallback(
    (value: string) => {
      setTemp(value);
      setCheckpoint(value);
    },
    [setTemp]
  );
  const hasDiff = temp !== checkpoint;
  return [temp, checkpoint, setTemp, setCheckpointWithTemp, hasDiff];
}

export function App(props: { initialCode: string }) {
  const [
    editingCode,
    checkpointCode,
    setEditingCode,
    setCheckpointCode,
    hasDiff,
  ] = useReceivableValue(props.initialCode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [source, setSource] = useState<ts.SourceFile | null>(null);

  // code => ast
  useEffect(() => {
    try {
      const newSource = parseCode(editingCode);
      setSource(newSource);
      setCheckpointCode(editingCode);
    } catch (e) {
      setEditingCode(editingCode);
      setErrorMessage(e?.message);
    }
  }, [editingCode]);

  // update code
  const onUpdateCode = useCallback(
    async (newCode: string) => {
      setEditingCode(newCode);
    },
    [setEditingCode]
  );

  // update ast and code
  const onUpdateNode = useCallback(
    async (prev: ts.Node, next: ts.Node) => {
      const newAst = replaceNode(source!, prev, next);
      setSource(newAst);
      const newCode = await printCodeWithFormat(newAst);
      setCheckpointCode(newCode);
    },
    [source]
  );

  if (source == null) {
    return <>...</>;
  }

  return (
    <Root>
      <ContentContainer>
        <Box w="100%" h="100%" d="flex" flexDirection="row">
          <Box
            w="80px"
            maxW="100%"
            height="100%"
            position="relative"
            paddingLeft="10"
          >
            <BlockSourceList />
          </Box>
          <Box flex={1} maxWidth="100%" height="100%" position="relative">
            <Scrollable>
              <Box padding={3}>
                <EditableVisualTree
                  source={source}
                  onUpdateNode={onUpdateNode}
                  // onUpdateSource={onUpdateSource}
                />
              </Box>
            </Scrollable>
          </Box>
          <VStack
            flex={1}
            maxWidth="100%"
            height="100%"
            position="relative"
            overflow="hidden"
          >
            <Textarea
              w="100%"
              color="white"
              value={editingCode}
              height="100%"
              onInput={(ev) => {
                console.log("onupdate");
                // @ts-ignore
                onUpdateCode(ev.target.value);
              }}
            />
            <Box height="100px">
              {errorMessage && <Text>{errorMessage}</Text>}
            </Box>
          </VStack>
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
