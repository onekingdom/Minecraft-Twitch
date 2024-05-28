import { EventsubAPI } from "@/classes/twitch-eventsub";
import { HandleEvent } from "@/eventsub/handleEvent";
import { WebSocketMessage } from "@/types/eventsub";
import * as Sentry from "@sentry/bun";

export default async function EventSubListener(URL: string, ){
  const socket = new WebSocket(URL);


  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data.toString());
    // console.log(message);
  
    await handleWebSocketMessage(message);
  });

  socket.addEventListener("open", (event) => {
    console.log("Connected to EventSub");
  });

  socket.addEventListener("close", (event) => {
    console.log("Connection closed");
    console.log(event.reason);

  });

  socket.addEventListener("error", (event) => {
    console.error(event);
  });


}

const handleWebSocketMessage = async (message: WebSocketMessage) => {
  switch (message.metadata.message_type) {
    case "session_welcome":
      // get the conduct id
      const id = await EventsubAPI.getConducts();

      if (id.data.length === 0) {
        throw new Error("No conduits found");
      }

      console.log("Received session welcome message");
      // console.log(message.payload);

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

      // Reconnect to the new connection URL
      EventSubListener(newConnectionUrl);
      

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
