// import "./eventsub/index";
import dotenv from "dotenv";

import { EventsubAPI } from "./classes/twitch-eventsub";
import { createWebSocket } from "./eventsub";
import { HandleEvent } from "./eventsub/handleEvent";
import { WebSocketMessage } from "./types/eventsub";
import { ChannelChatMessageCondition, ChannelPointsCustomRewardRedemptionAddCondition } from "./types/eventsubSubscribeConditions";
dotenv.config();

async function main() {
  // check if we have a conduit

  let conduct_id: string;

  const checkconduct = await EventsubAPI.getConducts();
  if (checkconduct.data.length === 0) {
    const newConduct = await EventsubAPI.createConduct({ shard_count: 1 });
    conduct_id = newConduct.data[0].id;
  } else {
    conduct_id = checkconduct.data[0].id;
  }

  console.log(conduct_id);

  let socket = createWebSocket(`wss://eventsub.wss.twitch.tv/ws`);

  socket.on("message", (data) => {
    const message = JSON.parse(data.toString());
    handleWebSocketMessage(message, conduct_id);
  });

  const handleWebSocketMessage = async (message: WebSocketMessage, conduct_id: string) => {
    switch (message.metadata.message_type) {
      case "session_welcome":
        // Handle welcome message
        // set type to welcome

        if ("session" in message.payload) {
          //  handle condicts

          const res = await EventsubAPI.updateConduitShards({
            conduit_id: conduct_id,
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
}

// main();

// create custom rewards for minecraft server



async function subscribeToEvents(channelID: number) {
  const res = await EventsubAPI.createEventSubSubscription<ChannelChatMessageCondition>({
    type: "channel.chat.message",
    version: "1",
    condition: {
      broadcaster_user_id: channelID.toString(),
      user_id: process.env.TWITCH_BOT_ID!,
    },
    transport: {
      method: "conduit",
      conduit_id: "6bc745d6-faa6-4a85-bb87-907bcfd7e39b",
    },
  });

  const res2 = await EventsubAPI.createEventSubSubscription<ChannelPointsCustomRewardRedemptionAddCondition>({
    type: "channel.channel_points_custom_reward_redemption.add",
    version: "1",
    condition: {
      broadcaster_user_id: channelID.toString(),
    },
    transport: {
      method: "conduit",
      conduit_id: "6bc745d6-faa6-4a85-bb87-907bcfd7e39b",
    },
  });

  console.log(res);

}

// subscribeToEvents(116728530)
main();