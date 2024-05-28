import axios from "axios";
import { supabase } from "../lib/supabase";
import { spotifyAPI } from "../classes/spotify";

export const SpotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    
  },
});

//spotify request interceptor
SpotifyAPI.interceptors.request.use(
  async (request) => {
    if (request.user_id === undefined) {
      throw new Error("User ID is missing");
    }

    const { data, error } = await supabase
      .from("spotify_integrations")
      .select("access_token")
      .eq("user_id", request.user_id)
      .single();

    if (error) {
      console.log(error);
      throw error;
    }

    request.headers["Authorization"] = `Bearer ${data.access_token}`;

    return request;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

//spotify response interceptor
SpotifyAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  //handle response error
  async function (response_error) {
    //originalRequest
    const originalRequest = response_error.config;

    //if the error status = 401 we update the token and retry
    if (response_error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      //get the channel from the request
      const user_id = response_error.response?.config.user_id;

      if(!user_id) {
        console.log("User ID not found");
        return Promise.reject("User ID not found");
      }

      const { data, error } = await supabase.from("spotify_integrations").select("refresh_token").eq("user_id", user_id).single();

      if (!data || error) {
        console.log("Error refreshing token");
        return;
      }

      const { access_token } = await spotifyAPI.refresh_token(data.refresh_token);


      //update the headers for the new request
      originalRequest.headers["Authorization"] = "Bearer " + access_token;

      //make the new request
      const res = SpotifyAPI(originalRequest);

      return res;
    }
    return Promise.reject(response_error);
  }
);
