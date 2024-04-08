import type { Models } from "node-appwrite";

export interface Command {
  command: string;
  message: string;
  cooldown: number;
  enabled: boolean;
  channelID: number;
  userlevel: "everyone" | "moderator" | "subscriber" | "vip";
  function: string;
  description: string;
  created_by: string;
}

export interface CommandStorage extends Models.Document, Command {}
