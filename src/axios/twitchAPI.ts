import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import twitchAPI from "../classes/twitch";
import { TwitchDatabase } from "../classes/database-twitch";

const TwitchAPI = axios.create({
  baseURL: "https://api.twitch.tv/helix",
  headers: {
    Accept: "application/json",
    "Client-ID": process.env.TWITCH_CLIENT_ID,
  },
});

TwitchAPI.interceptors.request.use(
  async (config) => {
    // Assuming you have a method to get the current token...
    const tokens = await TwitchDatabase.getTokens(config.broadcasterID!)
    if (tokens) {
      config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//twitch response interceptor
TwitchAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  //handle response error
  async function (error) {
    //originalRequest
    const originalRequest = error.config;

    //if the error status = 401 we update the token and retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      //get the channel from the request
      const channelID = error.response?.config.broadcasterID;

      const tokens = await TwitchDatabase.getTokens(channelID);


      if (!tokens) {
        console.log("Tokens not found");
        return;
      }

      //fetch the new accessToken and update the tokens
      const newToken = await twitchAPI.RefreshToken(tokens.refreshToken, channelID);

      //update the headers for the new request
      originalRequest.headers["Authorization"] = "Bearer " + newToken.access_token;

      //make the new request
      const res = TwitchAPI(originalRequest);

      return res;
    }
    return Promise.reject(error);
  }
);

export { TwitchAPI };
