import WebSocket from "ws";
import { CloseMessagePayload, WebSocketMessage } from "../types/eventsub";
import { EventsubAPI } from "../classes/twitch-eventsub";

export function createWebSocket(url: string): WebSocket {
  const ws = new WebSocket(url);

  ws.on("open", () => {
    console.log("WebSocket connection opened");
  });

  ws.on("close", (data: CloseMessagePayload) => {
    console.log(data.reason);
  });

  return ws;
}

// Example usage:
