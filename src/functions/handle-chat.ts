import { CommandDatabase } from "../classes/database-commands";
import { TwitchChannel } from "../classes/twitch-channel";
import { twitchChat } from "../classes/twitch-chat";
import { TwitchModeration } from "../classes/twitch-moderation";
import { TwitchSearch } from "../classes/twitch-search";
import type { ChatMessageEvent } from "../types/eventsub";
import checkCommandPermission from "./check-command-permission";
import checkvariable from "./check-variable";
import handle_action from "./handle-action";

export async function HandleChatMessage(chatMessage: ChatMessageEvent) {
  const { chatter_user_name, broadcaster_user_name, message, message_id, broadcaster_user_id, chatter_user_id, chatter_user_login } = chatMessage;

  console.log(`[${broadcaster_user_name}] ${chatter_user_name}: ${message.text}`);

  // parse the message
  const parsedMessage: string[] = message.text.split(" ");
  const command = parsedMessage[0].toLowerCase();
  const args = parsedMessage.slice(1);




  // find the command
  const foundCommand = await CommandDatabase.findCommand(command, +broadcaster_user_id);

  if (foundCommand) {
    // check user permission
    const hasPermission = await checkCommandPermission({
      broadcaster_id: +broadcaster_user_id,
      userlevel: foundCommand.userlevel,
      chatter_id: +chatter_user_id,
    });    

    // if the user does not have permission to use the command
    if (!hasPermission) {
      await twitchChat.sendMessage({
        broadcaster_id: broadcaster_user_id,
        message: `@${chatter_user_login} you do not have permission to use this command.`,
        reply_parent_message_id: message_id,
        sender_id: broadcaster_user_id,
      });
      return;
    }

    // check if the command has an action
    if (foundCommand.action && foundCommand.action !== "" && foundCommand.action !== "null") {
      const responseMessage= await handle_action(foundCommand.action, args, +broadcaster_user_id, chatter_user_name);

      if (responseMessage) {
        await twitchChat.sendMessage({
          broadcaster_id: broadcaster_user_id,
          message: responseMessage,
          reply_parent_message_id: message_id,
          sender_id: broadcaster_user_id,
        });
      }

      return;
    }

    // check if the command has variables
    const message = await checkvariable({
      channelID: +broadcaster_user_id,
      channel: broadcaster_user_name,
      message: foundCommand.message,
      chatter_id: chatter_user_id,
      chatter_name: chatter_user_name,
    });

    await twitchChat.sendMessage({
      broadcaster_id: broadcaster_user_id,
      message,
      reply_parent_message_id: message_id,
      sender_id: broadcaster_user_id,
    });
  }
}
