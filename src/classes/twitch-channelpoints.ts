import { TwitchAPI } from "../axios/twitchAPI";
import type { CustomRewardRequest, CustomRewardResponse } from "../types/twitchAPI";
import { twitch } from "./twitch";

class channelPointsAPI extends twitch {
  constructor() {
    super();
  }

  //create custom reward
  async createCustomReward(channelID: number, data: CustomRewardRequest) {
    try {
      const res = await TwitchAPI.post<CustomRewardResponse>(`/channel_points/custom_rewards?broadcaster_id=${channelID}`, data, {
        broadcasterID: channelID,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //delete custom reward
  async deleteCustomReward(channelID: number, rewardID: string) {
    try {
      const res = await TwitchAPI.delete(`/channel_points/custom_rewards?broadcaster_id=${channelID}&id=${rewardID}`, {
        broadcasterID: channelID,
      });
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
        {
          broadcasterID: channelID,
        }
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
       {
        broadcasterID: channelID,
       }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //get custom rewards
  async getCustomRewards(channelID: number) {
    try {
      const res = await TwitchAPI.get(`channel_points/custom_rewards?broadcaster_id=${channelID}`,{
        broadcasterID: channelID,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //create anouncement
}

export const ChannelPointsAPI = new channelPointsAPI();
