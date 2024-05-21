
export enum UserLevel {
  everyone = "everyone",
  follower = "follower",
  vip = "vip",
  subscriber = "subscriber",
  moderator = "moderator",
  supermoderator = "super_moderator",
  broadcaster = "broadcaster",
}

export interface Command {
  command: string;
  message: string;
  cooldown: number;
  enabled: boolean;
  channelID: number;
  userlevel: UserLevel;
  action: string | null;
  description: string;
  created_by: string;
}

export interface SpotifySettings {
  id: string;
  created_at: Date;
  broadcaster_id: number;
  user_id: string;
  global_queue_limit: number;
  chatter_queue_limit: boolean;
}

export interface BannedSong {
  broadcaster_id: number;
  broadcaster_name: string;
  song_id: string;
  song_name: string;
  artists: string;
  settings_id: string;
  user_id: string;
}

export interface BannedChatter {
  broadcaster_id: number;
  broadcaster_name: string;
  chatter_id: string;
  chatter_name: string;
  moderator_id: string;
  moderator_name: string;
  settings_id: string;
  user_id: string;
  created_at: Date;
}

