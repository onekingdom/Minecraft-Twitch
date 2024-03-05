import { Models } from "node-appwrite";

export type ChatMessage = {
  broadcaster_name: string;
  broadcaster_id: number;
  chatter_name: string;
  chatter_id: number;
  message: string;
  color: string;
};

export interface ChatMessageStorage extends Models.Document {}



export interface Tokens extends Models.Document {
  refreshToken: string;
  channelID: number;
  accessToken: string;
}

export interface channelPointsStorage extends Models.Document {
  rewardID: string;
  function: string;
  category: string;
  channelID: number;
}