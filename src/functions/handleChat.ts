import axios from "axios";
import { appwriteAPI } from "../classes/appwrite";
import twitchAPI from "../classes/twitch";
import { ChatMessageEvent } from "../types/eventsub";
import { ClipResponse } from "../types/twitchAPI";

export async function HandleChatMessage(chatMessage: ChatMessageEvent) {
  const { chatter_user_name, broadcaster_user_name, message, badges, message_id, chatter_user_id } = chatMessage;

  // console.log(`[${broadcaster_user_name}] ${chatter_user_name}: ${message.text}`);

  //add message to database
  await appwriteAPI.addMessage({
    broadcaster_id: +chatMessage.broadcaster_user_id,
    broadcaster_name: chatMessage.broadcaster_user_name,
    chatter_id: +chatMessage.chatter_user_id,
    chatter_name: chatMessage.chatter_user_name,
    message: chatMessage.message.text,
    color: chatMessage.color,
  });

  //parse message for commands
  const parseMessage = message.text.split(" ");

  //check if the user is a mod or broadcaster

  if (parseMessage[0] === "!setgame") {
    if (badges[0].set_id === "broadcaster" || badges[0].set_id === "moderator") {
      if (parseMessage.length < 2)
        return await twitchAPI.SendMessage(+chatMessage.broadcaster_user_id, `@${chatter_user_name} you need to provide a game category`, message_id);

      //the game category is everything after the first word
      const game = parseMessage.slice(1).join(" ").trim();
      console.log(game);

      const res = await twitchAPI.UpdateChannelInfo(+chatMessage.broadcaster_user_id, game);
      if (res) {
        await twitchAPI.SendMessage(
          +chatMessage.broadcaster_user_id,
          `@${chatter_user_name} has updated the game category to ${res.name}`,
          message_id
        );
      } else {
        await twitchAPI.SendMessage(+chatMessage.broadcaster_user_id, `@${chatter_user_name} failed to update the game category`, message_id);
      }
    } else {
      await twitchAPI.SendMessage(
        +chatMessage.broadcaster_user_id,
        `@${chatter_user_name} you do not have permission to use this command`,
        message_id
      );
    }
  }
  if (parseMessage[0] === "!clip") {
    const res = await twitchAPI.createClip(+chatMessage.broadcaster_user_id);
    if (res) {
      await twitchAPI.SendMessage(+chatMessage.broadcaster_user_id, `@${chatter_user_name}  https://clips.twitch.tv/${res.data[0].id}`, message_id);
    } else {
      await twitchAPI.SendMessage(+chatMessage.broadcaster_user_id, `@${chatter_user_name} the stream is not live`, message_id);
    }
  }


  if(parseMessage[0] === "!vod") {
    await twitchAPI.SendMessage(+chatMessage.broadcaster_user_id, `https://www.youtube.com/watch?v=EpUSLje5HCg`, message_id);
  }


    
 
}
