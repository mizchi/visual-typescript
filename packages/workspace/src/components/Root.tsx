import React from "react";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "../stores/configureStore";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

export function Root() {
  return (
    <>
      <ColorModeScript initialColorMode="dark" />
      <ChakraProvider resetCSS={false}>
        <Provider store={store}>
          <App />
        </Provider>
      </ChakraProvider>
    </>
  );
}
