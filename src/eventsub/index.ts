import { EventsubAPI } from "../classes/twitch-eventsub";
import type { WebSocketMessage } from "../types/eventsub";
import { HandleEvent } from "./handleEvent";

const socket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

// message is received
socket.addEventListener  ("message", async (event) => {
  const message = JSON.parse(event.data.toString());
  // console.log(message);

  await handleWebSocketMessage(message);


});

// socket opened
socket.addEventListener("open", (event) => {
  console.log("Connected to EventSub");
  // console.log(event.target)
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
  // console.log(message);


  switch (message.metadata.message_type) {
    case "session_welcome":
      // get the conduct id
      const id = await EventsubAPI.getConducts(); 

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

        if (res.data[0].status === "enabled") {
          // const res = await  EventsubAPI.createEventSubSubscription<ChannelUpdateCondition>({
          //   type: "channel.update",
          //   version: "1",
          //   condition: {
          //     broadcaster_user_id: "122604941",
          //   },
          //   transport: {
          //     method: "conduit",
          //     conduit_id: conduct_id,
          //   },
          // })
        }
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

      if ("session" in message.payload) {
        // Reconnect to the WebSocket server
        // socket = createWebSocket(message.payload.session.reconnect_url);
      }
      break;
    case "revocation":
      // Handle revocation message
      console.log("Received revocation message");
      break;
    default:
      // Handle other message types or unknown types
      console.log("Received unknown message type");

      console.log(message.metadata.message_type);

      break;
  }
};
