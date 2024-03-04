import ws from "ws";
import twitchAPI from "../classes/twitch";
import { minecraftAPI } from "../classes/Minecraft";
import { appwriteAPI } from "../classes/appwrite";
import { ChatMessageEvent, EventSubNotification } from "../types/eventsub";
import { HandleEvent } from "./handleEvent";

//connect to twitch event sub
const websocket = new ws("wss://eventsub.wss.twitch.tv/ws");

//listen for open connection
websocket.onopen = function (event) {
  console.log("Connected to Twitch EventSub");
};

//listen for messages

websocket.on("message", async function (data) {
  const event = JSON.parse(data.toString());

  // console.log(event);

  if (event.metadata.message_type === "session_welcome") {
    console.log("Received session_welcome event");
    const session_id = event.payload.session.id;

    await twitchAPI.createTransport(session_id);
  }


  //handle subscription topics
  if (event.metadata.message_type === "notification") {
   const notification: EventSubNotification = event

   HandleEvent(notification)
  }
});
