import { TwitchAPI } from "../axios/twitchAPI";
import { ModifyChannelInformationRequest, getChannelSubscriptionsReponse } from "../types/twitchAPI";
import { twitch } from "./twitch";

class twitchChannel extends twitch {
  constructor() {
    super();
  }

  // Modify Channel Information
  async modifyChannelInformation(broadcaster_id: string, data: ModifyChannelInformationRequest) {
    try {
      const res = await TwitchAPI.patch(`/channels`, data, {
        params: {
          broadcaster_id,
        },
        broadcasterID: +broadcaster_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get channel subscribers
  async getSubsribers(broadcaster_id: string, first?: string, after?: string) {
    try {
      const res = await TwitchAPI.get<getChannelSubscriptionsReponse>(`/subscriptions`, {
        params: {
          broadcaster_id,
          first,
          after,
        },
        broadcasterID: +broadcaster_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  
}

export const TwitchChannel = new twitchChannel();
