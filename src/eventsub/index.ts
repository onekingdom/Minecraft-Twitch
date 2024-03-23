import ws from "ws";
import { EventsubAPI } from "../classes/twitch-eventsub";
import { EventSubNotification } from "../types/eventsub";
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

 
  if (event.metadata.message_type === "session_welcome") {    
    const session_id = event.payload.session.id;

    await EventsubAPI.updateConduitShards({
      conduit_id: "6bc745d6-faa6-4a85-bb87-907bcfd7e39b",
      shards: [
        {
          id: "0",
          transport: {
            method: "websocket",
            session_id: session_id,
          },
        },
      ],
    });
  }

  //handle subscription topics
  if (event.metadata.message_type === "notification") {
    const notification: EventSubNotification = event;

    HandleEvent(notification);
  }
});
