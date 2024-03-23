export type CustomRewardRequest = {
  title: string; // The custom reward’s title. The title may contain a maximum of 45 characters and it must be unique amongst all of the broadcaster’s custom rewards.
  cost: number; // The cost of the reward, in Channel Points. The minimum is 1 point.
  prompt?: string; // The prompt shown to the viewer when they redeem the reward. Specify a prompt if is_user_input_required is true. The prompt is limited to a maximum of 200 characters.
  is_enabled?: boolean; // A Boolean value that determines whether the reward is enabled. Viewers see only enabled rewards. The default is true.
  background_color?: string; // The background color to use for the reward. Specify the color using Hex format (for example, #9147FF).
  is_user_input_required?: boolean; // A Boolean value that determines whether the user needs to enter information when redeeming the reward. See the prompt field. The default is false.
  is_max_per_stream_enabled?: boolean; // A Boolean value that determines whether to limit the maximum number of redemptions allowed per live stream (see the max_per_stream field). The default is false.
  max_per_stream?: number; // The maximum number of redemptions allowed per live stream. Applied only if is_max_per_stream_enabled is true. The minimum value is 1.
  is_max_per_user_per_stream_enabled?: boolean; // A Boolean value that determines whether to limit the maximum number of redemptions allowed per user per stream (see the max_per_user_per_stream field). The default is false.
  max_per_user_per_stream?: number; // The maximum number of redemptions allowed per user per stream. Applied only if is_max_per_user_per_stream_enabled is true. The minimum value is 1.
  is_global_cooldown_enabled?: boolean; // A Boolean value that determines whether to apply a cooldown period between redemptions (see the global_cooldown_seconds field for the duration of the cooldown period). The default is false.
  global_cooldown_seconds?: number; // The cooldown period, in seconds. Applied only if the is_global_cooldown_enabled field is true. The minimum value is 1; however, the minimum value is 60 for it to be shown in the Twitch UX.
  should_redemptions_skip_request_queue?: boolean; // A Boolean value that determines whether redemptions should be set to FULFILLED status immediately when a reward is redeemed. If false, status is set to UNFULFILLED and follows the normal request queue process. The default is false.
  function: string; // The function to be called when the reward is redeemed. This is a string that will be parsed as a function. It is limited to 400 characters.
};

export type CustomRewardResponse = {
  data: {
    broadcaster_name: string;
    broadcaster_login: string;
    broadcaster_id: string;
    id: string;
    image: {
      url_1x: string;
      url_2x: string;
      url_4x: string;
    } | null;
    background_color: string;
    is_enabled: boolean;
    cost: number;
    title: string;
    prompt: string;
    is_user_input_required: boolean;
    max_per_stream_setting: {
      is_enabled: boolean;
      max_per_stream: number;
    };
    max_per_user_per_stream_setting: {
      is_enabled: boolean;
      max_per_user_per_stream: number;
    };
    global_cooldown_setting: {
      is_enabled: boolean;
      global_cooldown_seconds: number;
    };
    is_paused: boolean;
    is_in_stock: boolean;
    default_image: {
      url_1x: string;
      url_2x: string;
      url_4x: string;
    };
    should_redemptions_skip_request_queue: boolean;
    redemptions_redeemed_current_stream: number | null;
    cooldown_expires_at: string | null;
  }[];
};

interface Pagination {
  cursor?: string; // Optional, as it may not exist if there are no more pages
}
export type EventSubTopics =
  | "automod.message.hold"
  | "automod.message.update"
  | "automod.settings.update"
  | "automod.terms.update"
  | "channel.update"
  | "channel.follow"
  | "channel.ad_break.begin"
  | "channel.chat.clear"
  | "channel.chat.clear_user_messages"
  | "channel.chat.message"
  | "channel.chat.message_delete"
  | "channel.chat.notification"
  | "channel.chat_settings.update"
  | "channel.chat.user_message_hold"
  | "channel.chat.user_message_update"
  | "channel.subscribe"
  | "channel.subscription.end"
  | "channel.subscription.gift"
  | "channel.subscription.message"
  | "channel.cheer"
  | "channel.raid"
  | "channel.ban"
  | "channel.unban"
  | "channel.unban_request.create"
  | "channel.unban_request.resolve"
  | "channel.moderator.add"
  | "channel.moderator.remove"
  | "channel.guest_star_session.begin"
  | "channel.guest_star_session.end"
  | "channel.guest_star_guest.update"
  | "channel.guest_star_settings.update"
  | "channel.channel_points_custom_reward.add"
  | "channel.channel_points_custom_reward.update"
  | "channel.channel_points_custom_reward.remove"
  | "channel.channel_points_custom_reward_redemption.add"
  | "channel.channel_points_custom_reward_redemption.update"
  | "channel.poll.begin"
  | "channel.poll.progress"
  | "channel.poll.end"
  | "channel.prediction.begin"
  | "channel.prediction.progress"
  | "channel.prediction.lock"
  | "channel.prediction.end"
  | "channel.charity_campaign.donate"
  | "channel.charity_campaign.start"
  | "channel.charity_campaign.progress"
  | "channel.charity_campaign.stop"
  | "conduit.shard.disabled"
  | "drop.entitlement.grant"
  | "extension.bits_transaction.create"
  | "channel.goal.begin"
  | "channel.goal.progress"
  | "channel.goal.end"
  | "channel.hype_train.begin"
  | "channel.hype_train.progress"
  | "channel.hype_train.end"
  | "channel.shield_mode.begin"
  | "channel.shield_mode.end"
  | "channel.shoutout.create"
  | "channel.shoutout.receive"
  | "stream.online"
  | "stream.offline"
  | "user.authorization.grant"
  | "user.authorization.revoke"
  | "user.update";

export type ChannelUpdateEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  language: string;
  category_id: string;
  category_name: string;
  content_classification_labels: string[];
};

export type ChannelFollowEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  followed_at: string;
};

export interface ClipResponse {
  data: {
    id: string;
    edit_url: string;
  }[];
}

// EventSub API

type SubscriptionStatus =
  | "enabled"
  | "webhook_callback_verification_pending"
  | "webhook_callback_verification_failed"
  | "notification_failures_exceeded"
  | "authorization_revoked"
  | "moderator_removed"
  | "user_removed"
  | "version_removed"
  | "beta_maintenance"
  | "websocket_disconnected"
  | "websocket_failed_ping_pong"
  | "websocket_received_inbound_traffic"
  | "websocket_connection_unused"
  | "websocket_internal_error"
  | "websocket_network_timeout"
  | "websocket_network_error";

type ShardStatus =
  | "enabled"
  | "webhook_callback_verification_pending"
  | "webhook_callback_verification_failed"
  | "notification_failures_exceeded"
  | "websocket_disconnected"
  | "websocket_failed_ping_pong"
  | "websocket_received_inbound_traffic"
  | "websocket_internal_error"
  | "websocket_network_timeout"
  | "websocket_network_error";

type TransportMethod = "webhook" | "websocket";

interface Transport {
  method: TransportMethod;
  callback?: string;
  session_id?: string;
  connected_at?: string;
  disconnected_at?: string;
}

export interface GetEventSubSubscriptionsRequest {
  status?: SubscriptionStatus;
  type?: EventSubTopics;
  user_id?: string;
  after?: string;
}

export interface GetEventSubSubscriptionsResponse {
  id: string;
  status: SubscriptionStatus;
  type: string;
  version: string;
  condition: object; // This could be further detailed if the structure of condition objects is known.
  created_at: string;
  transport: Transport;
  cost: number;
}

interface Shard {
  id: String;
  // status: ShardStatus;
  transport: Transport;
}

export interface getConduitShardsRequest {
  conduit_id: string;
  status: string;
  after: string;
}

interface ConduitInfo {
  id: string;
  shard_count: number;
}
export interface getConduitShardsResponse {
  data: Shard[];
  pagination: Pagination;
}

export interface createConduitRequest {
  shard_count: number;
}

export interface createConduitResponse {
  data: ConduitInfo[];
}

export interface getConduitsResponse {
  data: ConduitInfo[];
}

export interface deleteConduitRequest {
  id: string;
}

export interface UpdateConduitRequest {
  id: string;
  shard_count: number;
}

export interface UpdateConduitResponse {
  data: ConduitInfo[];
}

export interface UpdateConduitShardsRequest {
  conduit_id: string;
  shards: Shard[];
}

export interface SuccessfulShardUpdate {
  id: string;
  status: ShardStatus;
  transport: Transport;
}

export interface UpdateShardResponse {
  data: SuccessfulShardUpdate[];
}

export interface CreateEventSubSubscriptionRequest {
  type: string;
  version: string;
  condition: object;
  transport: Transport;
}

export interface CreateEventSubSubscriptionResponse {
  data: Subscription[];
  total: number;
  total_cost: number;
  max_total_cost: number;
}

interface Subscription {
  id: string;
  status: SubscriptionStatus;
  type: string;
  version: string;
  condition: object;
  created_at: string;
  transport: Transport;
  cost: number;
}

export interface getChattersRequest {
  broadcaster_id: string;
  moderator_id: string;
  first?: number;
  after?: number;
}

interface chatUser {
  user_id: string;
  user_login: string;
  user_name: string;
}
export interface getChattersResponse {
  data: chatUser[];
  pagination: Pagination;
  total: number;
}

interface ImageUrls {
  url_1x: string;
  url_2x: string;
  url_4x: string;
}

interface Emote {
  id: string;
  name: string;
  images: ImageUrls;
  tier: string;
  emote_type: "bitstier" | "follower" | "subscriptions";
  emote_set_id: string;
  format: ("animated" | "static")[];
  scale: ("1.0" | "2.0" | "3.0")[];
  theme_mode: ("dark" | "light")[];
  template: string;
}

export interface getChanneleEmotes {
  data: Emote[];
}

interface BadgeVersion {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  title: string;
  description: string;
  click_action: string | null;
  click_url: string | null;
}

interface BadgeSet {
  set_id: string;
  versions: BadgeVersion[];
}

export interface ChannelBadgeResponse {
  data: BadgeSet[];
}

interface ChatSettings {
  broadcaster_id: string;
  emote_mode: boolean;
  follower_mode: boolean;
  follower_mode_duration: number | null;
  moderator_id?: string;
  non_moderator_chat_delay?: boolean;
  non_moderator_chat_delay_duration?: number | null;
  slow_mode: boolean;
  slow_mode_wait_time: number | null;
  subscriber_mode: boolean;
  unique_chat_mode: boolean;
}

export interface ChatSettingsResponse {
  data: ChatSettings[];
}



interface updateChatSettingsRequest {
  emote_mode?: boolean;
  follower_mode?: boolean;
  follower_mode_duration?: number;
  non_moderator_chat_delay?: boolean;
  non_moderator_chat_delay_duration?: number;
  slow_mode?: boolean;
  slow_mode_wait_time?: number;
  subscriber_mode?: boolean;
  unique_chat_mode?: boolean;
}