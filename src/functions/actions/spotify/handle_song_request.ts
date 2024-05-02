import { spotifyAPI } from "../../../classes/spotify";
import { TrackObjectFull } from "../../../types/spotify-web-api";
import { supabase } from "../../../lib/supabase";
import { isCheckingCurrentSong, startCheckingCurrentSong, stopCheckingCurrentSong } from "./handle_song_request_queue";

interface SpotifySettings {
  broadcaster_id: number;
  broadcaster_name: string;
  chatter_id: string;
  chatter_name: string;
  args: string[];
}

export default async function ({ args, broadcaster_id, broadcaster_name, chatter_id, chatter_name }: SpotifySettings): Promise<TrackObjectFull> {
  const searchQuery = args.join(" ");
  let song_data: TrackObjectFull | undefined;




  // check if the serach query is a URL
  if (searchQuery.includes("https://open.spotify.com/")) {
    const url = new URL(searchQuery);
    const pathParts = url.pathname.split("/");

    if (pathParts.length !== 3 || pathParts[0] !== "") {
      throw new Error("Invalid URL");
    }

    const song_data_res = await spotifyAPI.get_song_data(pathParts[2], broadcaster_id);

    song_data = song_data_res;
  }

  // check if the search query is a spotify uri
  else if (searchQuery.includes("spotify:track:")) {
    const id = searchQuery.split(":")[2];
    const song_data_res = await Promise.all([spotifyAPI.get_song_data(id, broadcaster_id)]);
    song_data = song_data_res[0];
  }
  // search spotify for the song
  else {
    const searchResult = await spotifyAPI.search_spotify(searchQuery, broadcaster_id);
    if (!searchResult || !searchResult.tracks) {
      throw new Error("Failed to search spotify");
    }

    song_data = searchResult.tracks.items[0];
  }

  if (!song_data) {
    throw new Error("Song not found");
  }

  const { data: spotify_settings } = await supabase.from("spotify_settings").select("*, spotify_banned_songs(*)").eq("broadcaster_id", broadcaster_id).eq("spotify_banned_songs.song_id", song_data.id);

  console.log(spotify_settings);

  if (!spotify_settings) {
    throw new Error("Spotify settings not found in the database");
  }




  // check if the song is already in the queue
  const { data: queue } = await supabase
    .from("spotify_queue")
    .select("*")
    .eq("broadcaster_id", broadcaster_id.toString())
    .eq("song_id", song_data.id);

  if (queue && queue.length > 0) {
    throw new Error("Song is already in the queue");
  }

  const queue_obj = {
    song_name: song_data.name,
    song_id: song_data.id,
    artists: song_data.artists.map((artist) => artist.name).join(", "),
    chatter_id: chatter_id,
    chatter_name: chatter_name,
    broadcaster_id: broadcaster_id,
    broadcaster_name: broadcaster_name,
  };

  const added = await spotifyAPI.add_song_to_queue(song_data.uri, broadcaster_id);

  if (!added) {
    throw new Error("Failed to add song to spotify queue");
  }

  // add the song to the queue
  const { data: added_song, error } = await supabase.from("spotify_queue").insert([queue_obj]);

  // check if we are updating the queue
  if (!isCheckingCurrentSong(broadcaster_id)) {
    startCheckingCurrentSong(broadcaster_id);
  }

  if (error) {
    console.log(error);
    throw new Error("Failed to add song to database queue");
  }

  return song_data;
}
