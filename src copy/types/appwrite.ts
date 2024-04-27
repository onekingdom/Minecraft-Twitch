import type { Models } from "node-appwrite";

export type ChatMessage = {
  broadcaster_name: string;
  broadcaster_id: number;
  chatter_name: string;
  chatter_id: number;
  message: string;
  color: string;
};

export interface ChatMessageStorage extends Models.Document {}

export type TwitchUser = {
  username: string;
  channelID: number;
  accessToken: string;
  refreshToken: string;
  email: string;
  broadcasterType: string;
  profileImage: string;
  offlineImage: string;
  userid: string;
  IRC: boolean;
  betaAccess?: boolean;
  isLive: boolean
}


export interface TwitchUserStorage extends Models.Document, TwitchUser {}
 

export interface channelPointsStorage extends Models.Document {
  rewardID: string;
  function: string;
  category: string;
  channelID: number;
}


export interface trackChannels extends Models.Document {
  channelID: number;
  username: string;
  title: string;
  categoryName: string;
  categoryID: string;



}