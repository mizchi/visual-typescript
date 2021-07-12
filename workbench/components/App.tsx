import { Box, Flex, Textarea, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
  BlockSourceList,
  EditableVisualTree,
} from "@visual-typescript/renderer";
import { useSyncedSource } from "@visual-typescript/transformer";
import React from "react";

const BlockListHeight = "25vh";

export function App(props: { initialCode: string }) {
  const { source, setSource, code, setCode } = useSyncedSource(
    props.initialCode
  );
  if (source == null) {
    return <>...</>;
  }
  return (
    <Root>
      <HeaderContainer>...</HeaderContainer>
      <ContentContainer>
        <Box w="100%" h="100%" d="flex" flexDirection="row">
          <Flex flex={1} maxW="100%" height="100%" flexDir="column">
            <Flex
              h={`calc(100% - ${BlockListHeight})`}
              w="100%"
              position="relative"
            >
              <Box position="absolute" left="0" top="0" bottom="0" right="0">
                <Box
                  overflowY="auto"
                  overflowX="auto"
                  height="100%"
                  whiteSpace="nowrap"
                >
                  <Box padding={3}>
                    <EditableVisualTree source={source} onUpdate={setSource} />
                  </Box>
                </Box>
              </Box>
            </Flex>
            <Box h={BlockListHeight} p={4}>
              <BlockSourceList />
            </Box>
          </Flex>
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

const Root = styled.div`
  width: 100%;
  height: 100%;
  color: #eee;
  background: #222;
  display: grid;
  grid-template-rows: 32px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "content";
`;

const HeaderContainer = styled.div`
  grid-area: header;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
`;

const ContentContainer = styled.div`
  grid-area: content;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
`;
