import type { CreateEventSubSubscriptionRequest, EventSubTopics } from "../types/twitchAPI";

export const ActiveEventSubSubscriptions: EventSubTopics[] = [
  "channel.update",
  "channel.chat.message",
  "channel.channel_points_custom_reward_redemption.add",
  "stream.online",
  "stream.online",
  "channel.follow",
  "channel.subscribe",
  "channel.subscription.gift",
  "channel.subscription.message",
  "channel.shoutout.receive",  
];
