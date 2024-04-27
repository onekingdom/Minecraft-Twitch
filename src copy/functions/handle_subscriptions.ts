import type { EventSubTopics } from "../types/twitchAPI";
import { EventSubscribe } from "../classes/twitch-eventsub-subcriptions";

export default async function handleSubscriptions(broadcaster_id: string, type: EventSubTopics) {
  switch (type) {
    case "stream.online":
      await EventSubscribe.stream_online(broadcaster_id);
      break;

    case "stream.offline":
      await EventSubscribe.stream_offline(broadcaster_id);
      break;

    case "channel.update":
      await EventSubscribe.channel_update(broadcaster_id);
      break;

    case "channel.chat.message":
      await EventSubscribe.channel_chat_message(broadcaster_id);
      break;

    case "channel.channel_points_custom_reward_redemption.add":
      await EventSubscribe.channel_points_custom_reward_redemption_add(broadcaster_id);
      break;

    case "channel.follow":
      await EventSubscribe.channel_follow(broadcaster_id);
      break;

    case "channel.subscribe":
      await EventSubscribe.channel_subscribe(broadcaster_id);
      break;

    case "channel.subscription.gift":
      await EventSubscribe.channel_subscription_gift(broadcaster_id);
      break;

    case "channel.subscription.message":
      await EventSubscribe.channel_subscription_message(broadcaster_id);
      break;

    case "channel.shoutout.receive":
      await EventSubscribe.channel_shoutout_receive(broadcaster_id);
      break;

    default:
      console.log(`Invalid subscription type provided. cannot subscribe to this event. ${type}`);
      break;
  }
}
