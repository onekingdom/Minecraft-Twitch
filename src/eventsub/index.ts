import ws from "ws";
import twitchAPI from "../classes/twitch";
import { minecraftAPI } from "../classes/Minecraft";
import { appwriteAPI } from "../classes/appwrite";
import { ChatMessageEvent } from "../types/eventsub";

//connect to twitch event sub
const websocket = new ws("wss://eventsub.wss.twitch.tv/ws");

//listen for open connection
websocket.onopen = function (event) {
  console.log("Connected to Twitch EventSub");
};

//listen for messages

websocket.on("message", async function (data) {
  const event = JSON.parse(data.toString());

  if (event.metadata.message_type === "session_welcome") {
    console.log("Received session_welcome event");
    const session_id = event.payload.session.id;

    await twitchAPI.createTransport(session_id);
  }

  if (event.metadata.message_type === "notification") {
    if (event.metadata.subscription_type === "channel.channel_points_custom_reward_redemption.add") {
      if (event.payload.event.reward.id === "0feeb3d9-6a63-4dd3-b04b-e484a6c7bfff") {
        // minecraftAPI.spawnMob("bee", 1000)
      }
    } else if (event.metadata.subscription_type === "channel.chat.message") {
      const message: ChatMessageEvent = event.payload.event;

      console.log(message);

      appwriteAPI.addMessage({
        broadcaster_id: +message.broadcaster_user_id,
        broadcaster_name: message.broadcaster_user_name,
        chatter_id: +message.chatter_user_id,
        chatter_name: message.chatter_user_name,
        color: message.color,
        message: message.message.text,
      });
    }
  }
});
