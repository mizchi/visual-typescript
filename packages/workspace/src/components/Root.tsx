import React from "react";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "../stores/configureStore";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { TEMPLATES } from "../data";

// @ts-ignore
const initialCode = TEMPLATES[Object.keys(TEMPLATES)[0]];

export function Root() {
  return (
    <>
      <ColorModeScript initialColorMode="dark" />
      <ChakraProvider resetCSS={false}>
        <Provider store={store}>
          <App initialCode={initialCode} />
        </Provider>
      </ChakraProvider>
    </>
  );
}
