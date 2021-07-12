import React from "react";
import { App } from "./App";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { TEMPLATES } from "../data";

// @ts-ignore
const initialCode = TEMPLATES[Object.keys(TEMPLATES)[0]];

export function Root() {
  return (
    <>
      <ColorModeScript initialColorMode="dark" />
      <ChakraProvider resetCSS={false}>
        <App initialCode={initialCode} />
      </ChakraProvider>
    </>
  );
}
