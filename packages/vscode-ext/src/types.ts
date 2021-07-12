export type Message =
  | {
      type: "ready";
    }
  | {
      type: "set-code";
      value: string;
      uri: string;
    };
