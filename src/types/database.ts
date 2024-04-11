import type { Models } from "node-appwrite";

export enum UserLevel {
  everyone = "everyone",
  follower = "follower",
  vip = "vip",
  subscriber = "subscriber",
  moderator = "moderator",
  supermoderator ="super_moderator",
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

export interface CommandStorage extends Models.Document, Command {}
