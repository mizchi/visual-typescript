import { Box, Flex, Icon } from "@chakra-ui/react";
import React from "react";
import ts from "typescript";
import { Tooltip } from "@chakra-ui/react";
import { RiDragMoveLine } from "react-icons/ri";
import { useTransformer } from "../transformer";

export function ExpressionOverlay({
  node,
  children,
  showDetail = true,
}: {
  node: ts.Expression;
  children: React.ReactNode;
  showDetail?: boolean;
}) {
  const label = ts.SyntaxKind[node.kind];
  const { root } = useTransformer();
  const ranges = ts.getLeadingCommentRanges(
    root.getFullText(),
    node.getFullStart()
  );
  let comment = "";
  ranges?.map((t) => {
    const c = root.getFullText().slice(t.pos, t.end);
    comment = comment + c;
  });

  return (
    <Tooltip
      label={label + " " + comment}
      aria-label="A tooltip"
      colorScheme="green"
    >
      <Flex d="inline-flex" flexDir="column" draggable>
        {showDetail && <NodeDetail node={node} />}
        <Box
          d="inline-grid"
          placeItems="center"
          padding="0.1rem"
          // borderRadius="0px 6px 6px 6px"
          background="rgba(128,255,255,0.08)"
        >
          {children}
        </Box>
      </Flex>
    </Tooltip>
  );
}

export function StatementOverlay(props: {
  node: ts.Statement;
  children: React.ReactNode;
  index?: number;
  showDetail?: boolean;
}) {
  const showDetail = props.showDetail ?? true;
  return (
    <Flex
      w="100%"
      borderRadius="6px"
      padding="0.3rem 0.5rem"
      // background="rgba(255,200,255,0.08)"
      draggable
    >
      <Flex flexDir="column" draggable w="100%">
        {showDetail && <NodeDetail node={props.node} />}
        <Box
          d="inline-grid"
          padding="0.1rem"
          background="rgba(128,255,255,0.08)"
        >
          {props.children}
        </Box>
      </Flex>

      {/* <Box
        padding="3px"
        w="3rem"
        onDragStart={(ev) => {
          ev.dataTransfer.setData("text/plain", `${props.index}`);
          const canvas = document.createElement("canvas");
          canvas.getContext("2d");
          ev.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(ev) => {
          ev.preventDefault();
        }}
        onDrop={(ev) => {}}
      >
        <Icon as={RiDragMoveLine} cursor="grab" />
      </Box>
      <Box flex={1}>{props.children}</Box> */}
    </Flex>
  );
}

function NodeDetail({ node }: { node: ts.Node }) {
  const label = ts.SyntaxKind[node.kind];
  // const range = ts.getSourceMapRange(node);
  // const { root } = useRendererContext();
  // const start = ts.getLineAndCharacterOfPosition(root, range.pos);
  // const end = ts.getLineAndCharacterOfPosition(root, range.end);

  return (
    <Flex w="100%" h="18px" bg="blue.900" borderRadius={1} cursor="grab">
      <Icon h="18px" as={RiDragMoveLine} cursor="grab" />
      <Box
        paddingLeft="3px"
        d="inline-flex"
        fontSize="0.6rem"
        display="grid"
        placeItems="center"
      >
        {label}
        {/* [{start.line}:{start.character}~{end.line}:{end.character}] */}
      </Box>
    </Flex>
  );
}
