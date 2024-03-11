import { HandleChannelPointsRewardRedemptionAdd } from "../functions/HandleChannelPointsRewardRedemptionAdd";
import handleChannelUpdate from "../functions/handleChannelUpdate";
import { HandleChatMessage } from "../functions/handleChat";
import { ChatMessageEvent, EventSubNotification } from "../types/eventsub";
import { EventSubTopics } from "../types/twitchAPI";

export async function HandleEvent(event: EventSubNotification) {
  switch (event.payload.subscription.type as EventSubTopics) {
    case "channel.chat.message":
      HandleChatMessage(event.payload.event as ChatMessageEvent);
      break;

    case "channel.channel_points_custom_reward_redemption.add":
      HandleChannelPointsRewardRedemptionAdd(event.payload.event as any);
      break;

    case "channel.update":
      handleChannelUpdate(event.payload.event as any);
      break;
  }
}
