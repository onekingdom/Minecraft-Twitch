import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import { TwitchAPI } from "../axios/twitchAPI";
import { appwriteAPI } from "./appwrite";
dotenv.config();

class twitch {
  //Assigning transports to conduits
  private async createTransport(session_id: string) {
    try {
      const res = await axios.patch(
        "https://api.twitch.tv/helix/eventsub/conduits/shards",
        {
          conduit_id: "b10ca1c5-cdaa-4e5f-b1dd-5740d6e306ac",
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
  private async subscribeToEvents() {
    try {
      const res = await axios.post(
        "https://api.twitch.tv/helix/eventsub/subscriptions",
        {
          type: "channel.chat.message",
          version: "1",
          condition: {
            broadcaster_user_id: "116728530",
            user_id: "900954624",
          },
          transport: {
            method: "conduit",
            conduit_id: "b10ca1c5-cdaa-4e5f-b1dd-5740d6e306ac",
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
  async RefreshToken(refreshToken: string) {
    console.log("refreshing token");

    try {
      const res = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`
      );

      await appwriteAPI.updateTokens(116728530, res.data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  protected async Config(channelID: number) {
    const tokens = await appwriteAPI.getTokens(channelID);

    //if tokens are found

    console.log(channelID);

    if (tokens) {
      const config: AxiosRequestConfig = {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        broadcasterID: channelID,
      };
      return config;
    }

    return;
  }

  //

  //send message to chat
  async SendMessage(channelID: number, message: string) {
    try {
      const res = await TwitchAPI.post(
        `/chat/messages`,
        {
          broadcaster_id: channelID.toString(),
          sender_id: "900954624",
          message: message,
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
      console.log(res.data);
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
  async createCustomReward(channelID: number, title: string, cost: number) {
    try {
      const res = await TwitchAPI.post(
        `/channel_points/custom_rewards`,
        {
          broadcaster_id: channelID.toString(),
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

  //get custom rewards
  async getCustomRewards(channelID: number) {
    try {
      const res = await TwitchAPI.get(`channel_points/custom_rewards?broadcaster_id=${channelID}`, await this.Config(channelID));


      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const ChannelPointsAPI = new channelPointsAPI();
