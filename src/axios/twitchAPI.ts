import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { appwriteAPI } from "../classes/appwrite";
import twitchAPI from "../classes/twitch";

const TwitchAPI = axios.create({
  baseURL: "https://api.twitch.tv/helix",
  headers: {
    Accept: "application/json",
  },
});

//twitch request interceptor
TwitchAPI.interceptors.request.use(
  (request) => {

    console.log(request.headers);

    return request;
  },
  (error: any) => {
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

      console.log("refreshing token" + channelID);

      const tokens = await appwriteAPI.getTokens(channelID);
      if (!tokens) {
        console.log("Tokens not found");
        return;
      }

      //fetch the new accessToken and update the tokens
      const newToken = await twitchAPI.RefreshToken(tokens.refreshToken);

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
