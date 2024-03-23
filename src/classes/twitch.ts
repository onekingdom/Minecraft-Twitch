import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import { TwitchAPI } from "../axios/twitchAPI";
import { appwriteAPI } from "./appwrite";
import { ClipResponse, CustomRewardRequest, CustomRewardResponse, EventSubTopics } from "../types/twitchAPI";
dotenv.config();

export class twitch {
  protected clientID = process.env.TWITCH_CLIENT_ID;
  protected clientSecret = process.env.TWITCH_CLIENT_SECRET;

  constructor() {
    
  }

  



  

  //refresh token
 private async RefreshToken(refreshToken: string, channelID: number) {
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

  protected async Config(channelID: number) {
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

  //

  //send message to chat
 private async SendMessage(channelID: number, message: string, reply_parent_message_id?: string) {
    try {
      const res = await TwitchAPI.post(
        `/chat/messages`,
        {
          broadcaster_id: channelID.toString(),
          sender_id: "900954624",
          message: message,
          reply_parent_message_id: reply_parent_message_id,
        },
        {
          headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

 private async SendAnouncement(channelID: number, message: string) {
    try {
      const res = await TwitchAPI.post(
        `chat/announcements?broadcaster_id=${channelID}&moderator_id=900954624`,
        { message: message, color: "orange" },
        await this.Config(900954624)
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //update channel information
 private  async UpdateChannelInfo(channelID: number, gameID?: string, title?: string) {
    const game = gameID ? await this.SearchCategories(gameID) : undefined;
    const game_id = game ? game.id : undefined;
    try {
      const res = await TwitchAPI.patch(
        `/channels?broadcaster_id=${channelID}`,
        {
          title,
          game_id,
        },
        await this.Config(channelID)
      );
      return game;
    } catch (error: any) {
      console.log(error.response.data);
    }
  }

 private async SearchCategories(query: string) {
    try {
      const res = await TwitchAPI.get(`/search/categories?query=${query}`, {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
        },
      });
      return res.data.data[0];
    } catch (error) {
      console.log(error);
    }
  }

  //make mod
 private async MakeMod(channelID: number, userID: string) {
    try {
      const res = await TwitchAPI.post(`/moderation/moderators?broadcaster_id=${channelID}&user_id=${userID}`, {}, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //create stream marker
 private async CreateStreamMarker(channelID: number, description: string) {
    try {
      const res = await TwitchAPI.post(
        `/streams/markers`,
        {
          user_id: channelID,
          description: description,
        },
        await this.Config(channelID)
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

 private async getChannelInfo(channelID: number) {
    try {
      const res = await TwitchAPI.get(`/channels?broadcaster_id=${channelID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //get channel followers
 private async getChannelFollowers(channelID: number) {
    try {
      const res = await TwitchAPI.get(`/channels/followers?broadcaster_id=${channelID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //get channel points
  private async getChannelPoints(channelID: number) {
    try {
      const res = await TwitchAPI.get(`/channel_points/custom_rewards?broadcaster_id=${channelID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //create clip
  private async createClip(channelID: number) {
    try {
      const res = await TwitchAPI.post<ClipResponse>(`/clips?broadcaster_id=${channelID}`, {}, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //unmod user
  private async UnMod(channelID: number, userID: string) {
    try {
      const res = await TwitchAPI.delete(`/moderation/moderators?broadcaster_id=${channelID}&user_id=${userID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

const twitchAPI = new twitch();

export default twitchAPI;

class channelPointsAPI extends twitch {
  constructor() {
    super();
  }

  //create custom reward
  async createCustomReward(channelID: number, data: CustomRewardRequest) {
    try {
      const res = await TwitchAPI.post<CustomRewardResponse>(
        `/channel_points/custom_rewards?broadcaster_id=${channelID}`,
        data,
        await this.Config(channelID)
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //delete custom reward
  async deleteCustomReward(channelID: number, rewardID: string) {
    try {
      const res = await TwitchAPI.delete(`/channel_points/custom_rewards?broadcaster_id=${channelID}&id=${rewardID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //update custom reward
  async updateCustomReward(channelID: number, rewardID: string, title: string, cost: number) {
    try {
      const res = await TwitchAPI.patch(
        `/channel_points/custom_rewards`,
        {
          broadcaster_id: channelID.toString(),
          id: rewardID,
          title: title,
          cost: cost,
        },
        await this.Config(channelID)
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //disable reward
  async DisableReward(rewardID: string, channelID: number) {
    try {
      const res = await TwitchAPI.patch(
        `/channel_points/custom_rewards?broadcaster_id=${channelID.toString()}&id=${rewardID}`,
        {
          id: rewardID,
          is_enabled: false,
        },
        await this.Config(channelID)
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //get custom rewards
  async getCustomRewards(channelID: number) {
    try {
      const res = await TwitchAPI.get(`channel_points/custom_rewards?broadcaster_id=${channelID}`, await this.Config(channelID));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //create anouncement
}

export const ChannelPointsAPI = new channelPointsAPI();
