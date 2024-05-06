import { EventsubAPI } from "../classes/twitch-eventsub";
import type { WebSocketMessage } from "../types/eventsub";
import { HandleEvent } from "./handleEvent";

const socket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

// message is received
socket.addEventListener("message", async (event) => {
  const message = JSON.parse(event.data.toString());
  // console.log(message);

  await handleWebSocketMessage(message);
});

// socket opened
socket.addEventListener("open", (event) => {
  console.log("Connected to EventSub");
});

// socket closed
socket.addEventListener("close", (event) => {
  console.log("Disconnected from EventSub");
  // console.log(event);
});

// error handler 
socket.addEventListener("error", (event) => {
  console.error(event);
});

const handleWebSocketMessage = async (message: WebSocketMessage) => {
  switch (message.metadata.message_type) {
    case "session_welcome":
      // get the conduct id
      const id = await EventsubAPI.getConducts();

      console.log("Received session welcome message");
      console.log(message.payload);

      if ("session" in message.payload) {
        //  handle condicts
        const res = await EventsubAPI.updateConduitShards({
          conduit_id: id.data[0].id,
          shards: [
            {
              id: "0",
              transport: {
                method: "websocket",
                session_id: message.payload.session.id,
              },
            },
          ],
        });
      }

      break;
    case "session_keepalive":
      // Handle keepalive message
      break;
    case "notification":
      // Handle notification message
      HandleEvent(message as any);

      break;
    case "session_reconnect":
      // Handle reconnect message
      console.log("Received session reconnect message");

      // Extract the new connection URL from the message
      // @ts-ignore
      const newConnectionUrl = message.payload.session.reconnect_url;

      // Open a new WebSocket connection to the provided URL
      const newSocket = new WebSocket(newConnectionUrl);

      // Handle events on the new connection (similar to existing logic)
      newSocket.addEventListener("message", async (event) => {
        const newMessage = JSON.parse(event.data.toString());
        await handleWebSocketMessage(newMessage);
      });

      newSocket.addEventListener("open", (event) => {
        console.log("Connected to new EventSub server");
        // Close the old connection after receiving Welcome message
        socket.close();
      });

      newSocket.addEventListener("close", (event) => {
        console.log("Disconnected from old EventSub server");
      });

      newSocket.addEventListener("error", (event) => {
        console.error("Error on new EventSub connection", event);
      });

      break;
    case "revocation":
      // Handle revocation message
      console.log("Received revocation message");
      break;
    default:
      // Handle other message types or unknown types
      console.log("Received unknown message type");
      break;
  }
};
