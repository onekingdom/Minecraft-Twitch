export interface stream_online {
  broadcaster_user_id: string;
}

export interface stream_offline {
  broadcaster_user_id: string;
}

export interface channel_update {
  broadcaster_user_id: string;
}

export interface channel_chat_message {
  broadcaster_user_id: string;
  user_id: string;
}

export interface channel_points_custom_reward_redemption_add {
  broadcaster_user_id: string;
  reward_id?: string;
}

export interface channel_follow {
  broadcaster_user_id: string;
  moderator_user_id: string;
}

export interface channel_subscribe {
  broadcaster_user_id: string;
}

export interface channel_subscription_gift {
  broadcaster_user_id: string;  
}

export interface channel_subscription_message {
  broadcaster_user_id: string;
}

export interface channel_shoutout_receive {
  broadcaster_user_id: string;
  moderator_user_id: string;
}