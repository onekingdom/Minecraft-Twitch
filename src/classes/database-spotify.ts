import { supabase } from "@/lib/supabase";
import { BannedSong, SpotifySettings } from "@/types/database";

class spotify_database {
  // get the spotify settings
  async get_spotify_settings(broadcaster_id: string): Promise<SpotifySettings> {
    try {
      const { data } = await supabase.from("spotify_settings").select("*").eq("broadcaster_id", broadcaster_id).single();

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async add_banned_song(banned_song: BannedSong) {
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
  async check_song_banned(broadcaster_id: string, song_id: string): Promise<BannedSong | null> {
    try {
      const { data } = await supabase.from("spotify_banned_songs").select("*").eq("broadcaster_id", broadcaster_id).eq("song_id", song_id).single();

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const spotifyDB = new spotify_database();
