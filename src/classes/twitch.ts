import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import { TwitchAPI } from "../axios/twitchAPI";
import { appwriteAPI } from "./appwrite";
import { CustomRewardRequest, CustomRewardResponse, EventSubTopics } from "../types/twitchAPI";
dotenv.config();

class twitch {
  //Assigning transports to conduits
  async createTransport(session_id: string) {
    try {
      const res = await axios.patch(
        "https://api.twitch.tv/helix/eventsub/conduits/shards",
        {
          conduit_id: "69737826-a086-4f3f-b2e7-f78fe3ab126c",
          shards: [
            {
              id: "0",
              transport: {
                method: "websocket",
                session_id: session_id,
              },
            },
          ],
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

  //subscribe to events
  async subscribeToEvents(channelID: number, event: EventSubTopics) {
    try {
      const res = await axios.post(
        "https://api.twitch.tv/helix/eventsub/subscriptions",
        {
          type: event,
          version: "1",
          condition: {
            broadcaster_user_id: channelID.toString(),
            user_id: "900954624",
          },
          transport: {
            method: "conduit",
            conduit_id: "69737826-a086-4f3f-b2e7-f78fe3ab126c",
          },
        },
        {
          headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  //get all subscriptions
  protected async getSubscriptions() {
    try {
      const res = await axios.get("https://api.twitch.tv/helix/eventsub/subscriptions", {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
        },
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //delete a subscription
  private async deleteSubscription(id: string) {
    try {
      const res = await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`, {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  //refresh token
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
  async SendMessage(channelID: number, message: string, reply_parent_message_id?: string) {
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

  async SendAnouncement(channelID: number, message: string) {
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
  async UpdateChannelInfo(channelID: number, gameID?: string, title?: string) {

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
      return game
    } catch (error: any) {
      console.log(error.response.data);
    }
  }

  async SearchCategories(query: string){
    try {
      const res = await TwitchAPI.get(`/search/categories?query=${query}`, {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
        },
      });
      return res.data.data[0]
    } catch (error) {
      console.log(error);
    }
  }


  //make mod
  async MakeMod(channelID: number, userID: string) {
    try {
      const res = await TwitchAPI.post(
        `/moderation/moderators?broadcaster_id=${channelID}&user_id=${userID}`,
        {},
        await this.Config(channelID)
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }



  //create stream marker
  async CreateStreamMarker(channelID: number, description: string) {
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

  async getChannelInfo(channelID: number) {
    try {
      const res = await TwitchAPI.get(`/channels?broadcaster_id=${channelID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //get channel followers
  async getChannelFollowers(channelID: number) {
    try {
      const res = await TwitchAPI.get(`/channels/followers?broadcaster_id=${channelID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //get channel points
  async getChannelPoints(channelID: number) {
    try {
      const res = await TwitchAPI.get(`/channel_points/custom_rewards?broadcaster_id=${channelID}`, await this.Config(channelID));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

const twitchAPI = new twitch();

export default twitchAPI;

class consducts extends twitch {
  //get all conduits
  async getConducts() {
    try {
      const res = await axios.get("https://api.twitch.tv/helix/eventsub/conduits", {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //delete a conduit
  async deleteConduit(id: string) {
    try {
      const res = await axios.delete(`https://api.twitch.tv/helix/eventsub/conduits?id=${id}`, {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  //create
  async createConduct() {
    try {
      const res = await axios.post(
        "https://api.twitch.tv/helix/eventsub/conduits",
        {
          shard_count: 1,
        },
        {
          headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  //get shards
  async getShards() {
    try {
      const x = await axios.get("https://api.twitch.tv/helix/eventsub/conduits/shards?conduit_id=07da1c15-5193-4b83-93e1-2cf67236ea9a", {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
        },
      });
      console.log(x.data);
    } catch (error) {
      console.log(error);
    }
  }
}

export const ConductAPI = new consducts();

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
