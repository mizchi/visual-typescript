import React, { useCallback, useEffect, useState } from "react";
import { Scrollable, Root, ContentContainer } from "./layout";
import {
  EditableVisualTree,
  BlockSourceList,
} from "@visual-typescript/renderer";
import { Box, Textarea, VStack } from "@chakra-ui/react";
import { useSyncedSource } from "@visual-typescript/transformer";

export function App(props: { initialCode: string }) {
  const { source, setSource, code, setCode } = useSyncedSource(
    props.initialCode
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
                <EditableVisualTree source={source} onUpdate={setSource} />
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
              value={code}
              height="100%"
              onInput={(ev) => {
                // @ts-ignore
                const value: string = ev.target.value;
                setCode(value);
              }}
            />
            {/* <Box height="100px">
              {errorMessage && <Text>{errorMessage}</Text>}
            </Box> */}
          </VStack>
        </Box>
      </ContentContainer>
    </Root>
  );
}
