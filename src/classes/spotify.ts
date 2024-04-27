import axios, { AxiosError } from "axios";
import { SpotifyAPI } from "../axios/spotifyAPI";
import { supabase } from "../lib/supabase";
import { RefreshAccessToken, SearchResponse, TrackObjectFull } from "../types/spotify-web-api";

class spotify_api {
  private client_id: string;
  private client_secret: string;

  constructor() {
    this.client_id = process.env.SPOTIFY_CLIENT_ID!;
    this.client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
  }

  // refresh token
  async refresh_token(refresh_token: string) {
    try {
      const authOptions = {
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.client_id}:${this.client_secret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        },
      };

      const response = await axios<RefreshAccessToken>(authOptions);

      if (response.status === 200) {
        const { access_token } = response.data;

        console.log("New access token:", access_token);
        console.log("New refresh token:", refresh_token);

        const { error } = await supabase.from("spotify_integrations").update({ access_token }).eq("refresh_token", refresh_token);

        if (error) {
          console.log("Failed to update access token in database");
          throw new Error("Failed to update access token");
        }

        return { access_token, refresh_token };
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error fetching new access token:", error);
      throw new Error("Internal server error"); // Re-throw for handling in main function
    }
  }

  // search spotify
  async search_spotify(query: string, channel_id: number) {
    try {
      const response = await SpotifyAPI.get<SearchResponse>(`/search?q=${query}&type=track&limit=1`, { broadcasterID: channel_id });
      

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to search Spotify");
      }
    } catch (error: any) {
      console.log("Error searching Spotify:");
      console.log(error.response.data);
    }
  }

  // get song data based of uri
  async get_song_data(uri: string, channel_id: number) {
    console.log(uri);
    try {
      const response = await SpotifyAPI.get<TrackObjectFull>(`/tracks/${uri}`, { broadcasterID: channel_id });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to get song data");
      }
    } catch (error: any) {
      console.log("Error getting song data:");
      console.log(error.response.data);
    }
  }


  // add song to queue
  async add_song_to_queue<UsersQueueResponse>(uri: string, channel_id: number) {
    try {
      const response = await SpotifyAPI.post(`/me/player/queue?uri=${uri}`, {}, { broadcasterID: channel_id });

      if (response.status === 204) {
        return true;
      } else {
        throw new Error("Failed to add song to queue");
      }
    } catch (error: any) {
      console.log("Error adding song to queue:");
     
    }
  }
}

export const spotifyAPI = new spotify_api();
