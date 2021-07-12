import type { Message } from "../types";

type AcquiredVsCodeApi<State, Message> = {
  postMessage(payload: Message): void;
  getState(): State;
  setState(s: State): void;
};

declare function acquireVsCodeApi(): AcquiredVsCodeApi<{}, Message>;
const vscode = acquireVsCodeApi();

export function send(message: Message) {
  vscode.postMessage(message);
}

let _listeners: Array<(mes: Message) => void> = [];
export function onMessage(listener: (message: Message) => void) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((f) => f !== listener);
  };
}

let _started = false;
export function start() {
  if (_started) {
    return;
  }
  _started = true;
  window.addEventListener("message", (event) => {
    _listeners.forEach((listener) => {
      listener(event.data as Message);
    });
  });
}
