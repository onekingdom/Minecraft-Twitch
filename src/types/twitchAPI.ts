export type CustomRewardRequest  = {
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
}

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
