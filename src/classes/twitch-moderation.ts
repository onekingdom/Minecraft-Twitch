import { TwitchAPI } from "../axios/twitchAPI";
import { GetModeratorsResponse } from "../types/twitchAPI";
import { twitch } from "./twitch";

class twitch_moderation extends twitch {
  constructor() {
    super();
  }

  async getModerators(broadcaster_id: string, userid: string[], first?: string, after?: string): Promise<GetModeratorsResponse> {
    try {
      const res = await TwitchAPI.get(`/moderation/moderators`, {
        params: {
          broadcaster_id,
          user_id: userid.join(","),
          first,
          after,
        },
        broadcasterID: +broadcaster_id,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      // return error;
      throw error;
    }
  }
}


export const TwitchModeration = new twitch_moderation();