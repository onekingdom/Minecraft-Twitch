import { TwitchChannel } from "../classes/twitch-channel";
import { twitchChat } from "../classes/twitch-chat";
import { TwitchModeration } from "../classes/twitch-moderation";
import { TwitchSearch } from "../classes/twitch-search";
import { ChatMessageEvent } from "../types/eventsub";

export async function HandleChatMessage(chatMessage: ChatMessageEvent) {
  const { chatter_user_name, broadcaster_user_name, message, message_id, broadcaster_user_id, chatter_user_id } = chatMessage;

  console.log(`[${broadcaster_user_name}] ${chatter_user_name}: ${message.text}`);

  // parse the message
  const parsedMessage: string[] = message.text.split(" ");
  const command = parsedMessage[0].toLowerCase();
  const args = parsedMessage.slice(1);

  if (command === "!setgame") {
    // check if the user is a moderator
    const isModerator = await TwitchModeration.getModerators(broadcaster_user_id, [chatter_user_id]);
    if (isModerator.data.length > 0 || chatter_user_id === broadcaster_user_id) {
      // get the game ID based of the game name
      const category = args.join(" ");
      const category_id = await TwitchSearch.searchCategories(category);

      if (category_id.data.length === 0) {
        await twitchChat.sendMessage({
          broadcaster_id: broadcaster_user_id,
          message: `Category ${category} not found!`,
        });

        return;
      }

      // update the channel category
      const res = await TwitchChannel.modifyChannelInformation(broadcaster_user_id, {
        game_id: category_id.data[0].id,
      });

      if (res) {
        await twitchChat.sendMessage({
          broadcaster_id: broadcaster_user_id,
          message: `Category has been updated to ${category}`,
        });
      }

      return;
    }

    await twitchChat.sendMessage({
      broadcaster_id: broadcaster_user_id,
      message: `${chatter_user_name} you are not a moderator!`,
    });
  }
}
