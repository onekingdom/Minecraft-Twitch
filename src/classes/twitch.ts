import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import { TwitchAPI } from "../axios/twitchAPI";
import { appwriteAPI } from "./appwrite";
import { ClipResponse, CustomRewardRequest, CustomRewardResponse, EventSubTopics, getChattersRequest, getChattersResponse } from "../types/twitchAPI";
dotenv.config();

export class twitch {
  protected clientID = process.env.TWITCH_CLIENT_ID;
  protected clientSecret = process.env.TWITCH_CLIENT_SECRET;
  protected broadcasterID?: number;

  constructor() {}



  async getChatters({ broadcaster_id, moderator_id, after, first }: getChattersRequest): Promise<getChattersResponse> {
    try {
      const res = await TwitchAPI.get<getChattersResponse>(`/chat/chatters`, {
        params: {
          broadcaster_id,
          moderator_id,
          after,
          first,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async Config(channelID: number) {
    const tokens = await appwriteAPI.getTokens(channelID);

    if (tokens) {
      const config: AxiosRequestConfig = {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        broadcasterID: +channelID,
      };
      return config;
    }

    return;
  }

  async RefreshToken(refreshToken: string, channelID: number) {
    try {
      const res = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`
      );

      await appwriteAPI.updateTokens(channelID, res.data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

const twitchAPI = new twitch();

export default twitchAPI;
