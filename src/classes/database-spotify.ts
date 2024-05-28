import { supabase } from "@/lib/supabase";
import { InserSpotifyBannedChatterTable, InsertSpotifyBannedSongsTable, SpotifyBannedChatterTable, SpotifyBannedSongsTable, SpotifySettingsTable, UpdateSpotifyBannedChatterTable } from "@/types/database";

class spotify_database {
  // get the spotify settings
  async get_spotify_settings(broadcaster_id: string): Promise<SpotifySettingsTable | null> {
    try {
      const { data } = await supabase.from("spotify_settings").select("*").eq("broadcaster_id", broadcaster_id).single();

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async add_banned_song(banned_song: InsertSpotifyBannedSongsTable) {
    try {
      const { data } = await supabase.from("spotify_banned_songs").insert([banned_song]);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove_banned_song({ broadcaster_id, song_id }: { broadcaster_id: string; song_id: string }) {
    try {
      const { data } = await supabase.from("spotify_banned_songs").delete().eq("broadcaster_id", broadcaster_id).eq("song_id", song_id);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async get_banned_songs(broadcaster_id: string) {
    try {
      const { data } = await supabase.from("spotify_banned_songs").select().eq("broadcaster_id", broadcaster_id);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // check if a song is baned based of song_id
  async check_song_banned(broadcaster_id: string, song_id: string): Promise<SpotifyBannedSongsTable | null> {
    try {
      const { data } = await supabase.from("spotify_banned_songs").select("*").eq("broadcaster_id", broadcaster_id).eq("song_id", song_id).single();

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // check if a chatter is banned based of chatter_id
  async check_chatter_banned(broadcaster_id: string, chatter_id: string): Promise<SpotifyBannedChatterTable | null> {
    try {
      const { data } = await supabase.from("spotify_banned_chatters").select("*").eq("broadcaster_id", broadcaster_id).eq("chatter_id", chatter_id).single();

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // add a chatter to the banned list
  async add_banned_chatter(banned_chatter: InserSpotifyBannedChatterTable) {
    try {
      const { data, error } = await supabase.from("spotify_banned_chatters").insert(banned_chatter)

      if(error) {
        console.log(error);
        throw error;
      }

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // remove a chatter from the banned list
  async remove_banned_chatter({ broadcaster_id, chatter_id }: { broadcaster_id: string; chatter_id: string }) {
    try {
      const { data } = await supabase.from("spotify_banned_chatters").delete().eq("broadcaster_id", broadcaster_id).eq("chatter_id", chatter_id);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get all banned chatters
  async get_banned_chatters(broadcaster_id: string) {
    try {
      const { data } = await supabase.from("spotify_banned_chatters").select().eq("broadcaster_id", broadcaster_id);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get all banned chatters based on chatter_id
  async get_banned_chatter(broadcaster_id: string, chatter_id: string) {
    try {
      const { data } = await supabase.from("spotify_banned_chatters").select().eq("broadcaster_id", broadcaster_id).eq("chatter_id", chatter_id);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  





}

export const spotifyDB = new spotify_database();
