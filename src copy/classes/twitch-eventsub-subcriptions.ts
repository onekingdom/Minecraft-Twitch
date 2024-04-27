import { TwitchAPP } from "../axios/twitchApp";
import type { ChannelUpdateEvent, CreateEventSubSubscriptionRequest } from "../types/twitchAPI";
import type * as EventSubtype from "../types/eventsub_conditions";
import { EventsubAPI } from "./twitch-eventsub";

class eventsub_subscriptions {
  private conduit_id: string;
  private bot_id: string;

  constructor(conduit_id: string) {
    this.conduit_id = conduit_id;
    this.bot_id = process.env.TWITCH_BOT_ID;
  }

  async stream_online(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "stream.online",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.stream_online>);
  }

  async stream_offline(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "stream.offline",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.stream_offline>);
  }

  async channel_update(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.update",
      version: "2",
      condition: {
        broadcaster_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_update>);
  }

  async channel_chat_message(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.chat.message",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
        user_id: this.bot_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_chat_message>);
  }

  async channel_points_custom_reward_redemption_add(broadcaster_id: string, reward_id?: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.channel_points_custom_reward_redemption.add",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
        reward_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_points_custom_reward_redemption_add>);
  }

  async channel_follow(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.follow",
      version: "2",
      condition: {
        broadcaster_user_id: broadcaster_id,
        moderator_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_follow>);
  }

  async channel_subscribe(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.subscribe",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_subscribe>);
  }

  async channel_subscription_gift(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.subscription.gift",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_subscription_gift>);
  }

  async channel_subscription_message(broadcaster_id: string) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.subscription.message",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_subscription_message>);
  }


  async channel_shoutout_receive(broadcaster_id: string,) {
    const res = await TwitchAPP.post("/eventsub/subscriptions", {
      type: "channel.shoutout.receive",
      version: "1",
      condition: {
        broadcaster_user_id: broadcaster_id,
        moderator_user_id: broadcaster_id,
      },
      transport: {
        method: "conduit",
        conduit_id: this.conduit_id,
      },
    } as CreateEventSubSubscriptionRequest<EventSubtype.channel_shoutout_receive>);
  }



}

const conduit_id = async () => {
  try {
    const res = await EventsubAPI.getConducts();
    return res.data[0].id;
  } catch (error) {
    console.log(error);

    throw error;
  }
};


export const EventSubscribe = new eventsub_subscriptions(await conduit_id());
