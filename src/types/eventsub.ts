export type ChatMessageEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  chatter_user_id: string;
  chatter_user_login: string;
  chatter_user_name: string;
  message_id: string;
  message: {
      text: string;
      fragments: {
          type: string;
          text: string;
          cheermote: null | any; // Type of cheermote can be defined further
          emote: null | any; // Type of emote can be defined further
          mention: null | any; // Type of mention can be defined further
      }[];
  };
  color: string;
  badges: {
      set_id: string;
      id: string;
      info: string;
  }[];
  message_type: string;
  cheer: null | any; // Type of cheer can be defined further
  reply: null | any; // Type of reply can be defined further
  channel_points_custom_reward_id: null | any; // Type of channel_points_custom_reward_id can be defined further
};