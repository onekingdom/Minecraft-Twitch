import { channelpointsDB } from "@/classes/database-channelpoints";
import { twitchChat } from "@/classes/twitch-chat";
import type { ChannelPointsCustomRewardRedemptionAddEvent } from "../types/eventsub";
import handle_action from "./handle-action";

export async function HandleChannelPointsRewardRedemptionAdd(event: ChannelPointsCustomRewardRedemptionAddEvent) {
  console.log(`[${event.broadcaster_user_name}] ${event.user_name} redeemed ${event.reward.title} for ${event.reward.cost} points`);

  // check if the reward ID is in the channelpoint database
  const res = await channelpointsDB.checkRewardID(event.reward.id, event.broadcaster_user_id);

  // if the reward ID is not in the database, return
  if (!res) {
    return;
  }

  // check if we have a action
  if (!res.action) {
    return;
  }


  // handle the action and get the message
  const message = await handle_action({
    action: res.action,
    broadcaster_id: +event.broadcaster_user_id,
    broadcaster_name: event.broadcaster_user_name,
    chatter_id: event.user_id,
    chatter_name: event.user_name,
    user_id: res.user_id,
    return_message: "",
    args: event.user_input ? event.user_input.split(" ") : undefined,
  });


  // send the message to chat if there is one
  if (message) {
    await twitchChat.sendMessage({
      broadcaster_id: event.broadcaster_user_id,
      message,
      sender_id: event.broadcaster_user_id,
    });
  }
}
