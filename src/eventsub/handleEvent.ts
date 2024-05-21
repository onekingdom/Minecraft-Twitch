import { HandleChannelPointsRewardRedemptionAdd } from "../functions/HandleChannelPointsRewardRedemptionAdd";
import handleChannelUpdate from "../functions/handleChannelUpdate";
import { HandleChatMessage } from "../functions/handle-chat";
import type { ChatMessageEvent, EventSubNotification } from "../types/eventsub";
import type { EventSubTopics } from "../types/twitchAPI";
import handle_stream_online from "@/functions/handle-stream-online";
import handle_stream_offline from "@/functions/handle-stream-offline";

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

    case "stream.online":
      handle_stream_online(event.payload.event as any);
      break;

    case "stream.offline":
      handle_stream_offline(event.payload.event as any);
      break;

    default:
      console.log("Unhandled event", event.payload.subscription.type);
  }
}
