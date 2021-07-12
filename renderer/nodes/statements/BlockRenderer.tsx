import React from "react";
import ts from "typescript";
import { Box, Flex } from "@chakra-ui/react";
import { StatementRenderer } from "./StatementRenderer";
import { StatementOverlay } from "../overlays";

export function BlockRenderer({ node }: { node: ts.Block | ts.SourceFile }) {
  return (
    <Flex flexDir="column" w="100%" style={{ gap: "0px",  }}>
      {node.statements.map((stmt, idx) => (
        <StatementOverlay node={stmt} index={idx} key={idx}>
          <StatementRenderer node={stmt} />
        </StatementOverlay>
      ))}
      {/* <Box></Box> */}
    </Flex>
  );
}
