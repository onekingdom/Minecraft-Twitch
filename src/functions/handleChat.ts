import { appwriteAPI } from "../classes/appwrite";
import { ChatMessageEvent } from "../types/eventsub";

export async function HandleChatMessage(chatMessage: ChatMessageEvent) {
  const { chatter_user_name, broadcaster_user_name, message } = chatMessage;


  console.log(`[${broadcaster_user_name}] ${chatter_user_name}: ${message.text}`);

  //add message to database
  await appwriteAPI.addMessage({
    broadcaster_id: +chatMessage.broadcaster_user_id,
    broadcaster_name: chatMessage.broadcaster_user_name,
    chatter_id: +chatMessage.chatter_user_id,
    chatter_name: chatMessage.chatter_user_name,
    message: chatMessage.message.text,
    color: chatMessage.color,
  });

  

}
