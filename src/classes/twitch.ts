import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class twitch {
  //Assigning transports to conduits
  async createTransport(session_id: string) {
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
  async subscribeToEvents() {
    try {
      const res = await axios.post(
        "https://api.twitch.tv/helix/eventsub/subscriptions",
        {
          type: "channel.channel_points_custom_reward_redemption.add",
          version: "1",
          condition: {
            broadcaster_user_id: "116728530",
           
           
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
  async getSubscriptions() {
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
  async deleteSubscription(id: string) {
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
