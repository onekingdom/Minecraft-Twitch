import { CommandDatabase } from "../classes/database-commands";
import { twitchChat } from "../classes/twitch-chat";
import type { ChatMessageEvent } from "../types/eventsub";
import checkCommandPermission from "./check-command-permission";
import checkvariable from "./check-variable";
import handle_action from "./handle-action";
import { handleVariable } from "./handle-variable";

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
    // console.log(foundCommand);

    if (!foundCommand.status) {
      return;
    }

    let messageToSend: string = foundCommand.message;

    // check user permission
    const hasPermission = await checkCommandPermission({
      broadcaster_id: +broadcaster_user_id,
      userlevel: foundCommand.userlevel,
      chatter_id: +chatter_user_id,
    });

    // if the user does not have permission to use the command
    if (!hasPermission) {
      messageToSend = `@${chatter_user_login} you do not have permission to use this command.`;
    }

    // check if the command has an action
    if (foundCommand.action && foundCommand.action !== "" && foundCommand.action !== "null" && hasPermission) {
      const responseMessage = await handle_action({
        action: foundCommand.action,
        args,
        broadcaster_id: +broadcaster_user_id,
        broadcaster_name: broadcaster_user_name,
        chatter_id: chatter_user_id,
        chatter_name: chatter_user_name,
        return_message: messageToSend,
        user_id: foundCommand.user_id,
      });

      if (responseMessage) messageToSend = responseMessage;
    }

    // check if the command has variables
    let variableObjectArray = checkvariable(messageToSend);


    // handle the variables
    const newArray = await Promise.all(
      variableObjectArray.map(async (variableObject) => {
        if (variableObject.variable) {
          const variable = await handleVariable({
            varable: variableObject.word,
            channel: broadcaster_user_name,
            channelID: +broadcaster_user_id,
            chatter_id: chatter_user_id,
            chatter_name: chatter_user_name,
          });

          return variable;
        }

        return variableObject.word;
      })
    );

    messageToSend = newArray.join(" ");

    if(messageToSend === "") return;

    // send the message
    await twitchChat.sendMessage({
      broadcaster_id: broadcaster_user_id,
      message: messageToSend,
      reply_parent_message_id: message_id,
      sender_id: broadcaster_user_id,
    });
  }
}
