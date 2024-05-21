import DiscordWebhook from "./axios/discord-webhook";
import { EventsubAPI } from "./classes/twitch-eventsub";
import { HandleEvent } from "./eventsub/handleEvent";
import { WebSocketMessage } from "./types/eventsub";

const socket = new WebSocket(process.env.EVENTSUB_URL!);


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
  DiscordWebhook.post(
    process.env.DISCORD_WEBHOOK_URL!,
    {
      content: event.reason,
    },
    {}
  );
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

      DiscordWebhook.post(
        process.env.DISCORD_WEBHOOK_URL!,
        {
          content: "Received session reconnect message",
        },
        {}
      );

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
        DiscordWebhook.post(
          process.env.DISCORD_WEBHOOK_URL!,
          {
            content: event.reason,
          },
          {}
        );
      });

      newSocket.addEventListener("error", (event) => {
        console.error("Error on new EventSub connection", event);

        DiscordWebhook.post(
          process.env.DISCORD_WEBHOOK_URL!,
          {

            content: JSON.stringify(event),
          },
          {}
        );
      });

      break;
    case "revocation":
      // Handle revocation message
      console.log("Received revocation message");
      break;
    default:
      // Handle other message types or unknown types
      console.log("Received unknown message type");
      DiscordWebhook.post(
        process.env.DISCORD_WEBHOOK_URL!,
        {
          content: message,
        },
        {}
      );
      break;
  }
};
