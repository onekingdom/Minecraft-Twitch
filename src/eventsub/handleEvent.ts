import { HandleChannelPointsRewardRedemptionAdd } from "../functions/HandleChannelPointsRewardRedemptionAdd";
import { HandleChatMessage } from "../functions/handleChat";
import { ChatMessageEvent, EventSubNotification } from "../types/eventsub";


export async function HandleEvent(event: EventSubNotification) {

  switch (event.payload.subscription.type) {
    case "channel.chat.message":
      HandleChatMessage(event.payload.event as ChatMessageEvent)
      break;





    case "channel.channel_points_custom_reward_redemption.add":
      HandleChannelPointsRewardRedemptionAdd(event.payload.event as any)
      break;
    case "channel.cheer":
      console.log("channel.cheer")
      break;
    case "channel.follow":
      console.log("channel.follow")
      break;
    case "channel.poll.begin":
      console.log("channel.poll.begin")
      break;
    case "channel.poll.progress":
      console.log("channel.poll.progress")
      break;
    case "channel.poll.end":
      console.log("channel.poll.end")
      break;
    case "channel.prediction.begin":
      console.log("channel.prediction.begin")
      break;
    case "channel.prediction.progress":
      console.log("channel.prediction.progress")
      break;
    case "channel.prediction.lock":
      console.log("channel.prediction.lock")
      break;
    case "channel.prediction.end":
      console.log("channel.prediction.end")
  }


  
}