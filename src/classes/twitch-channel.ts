import { TwitchAPI } from "../axios/twitchAPI";
import { ModifyChannelInformationRequest } from "../types/twitchAPI";
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
}

export const TwitchChannel = new twitchChannel();
