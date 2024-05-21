import { spotifyAPI } from "../../../classes/spotify";
import { supabase } from "../../../lib/supabase";
import { TrackObjectFull } from "../../../types/spotify-web-api";
import get_song_id from "./get_song_id";
import { isCheckingCurrentSong, startCheckingCurrentSong } from "./handle_song_request_queue";

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


  

  // check if the search query is a spotify uri
  const id = get_song_id(searchQuery);

  if (id) {
    song_data = await spotifyAPI.get_song_data(id, broadcaster_id);
  } else {
    const search = await spotifyAPI.search_spotify(searchQuery, broadcaster_id);
    song_data = search?.tracks?.items[0];
  }

  // check if the song was found
  if (!song_data) {
    throw "Song not found";
  }

  // get the spotify settings
  const { data: spotify_settings } = await supabase
    .from("spotify_settings")
    .select("*, spotify_banned_chatters(chatter_id), spotify_banned_songs(song_id)")
    .eq("broadcaster_id", broadcaster_id)
    .eq("spotify_banned_chatters.chatter_id", chatter_id)
    .single();

  if (!spotify_settings) {
    throw "Spotify settings not found in the database";
  }

  
  if (spotify_settings.spotify_banned_chatters && spotify_settings.spotify_banned_chatters.length > 0) {
    throw "You are banned from requesting songs";
  }

  //check if the song is banned
  if (spotify_settings.spotify_banned_songs && spotify_settings.spotify_banned_songs.length > 0) {
    const song_banned = spotify_settings.spotify_banned_songs.find((song: { song_id: string }) => song.song_id === song_data.id);

    if (song_banned) {
      throw `Sorry, the song ${song_data.name} is banned from being requested`;
    }
  }

  // check if the song is already in the queue
  const { data: queue } = await supabase.from("spotify_queue").select("song_id, chatter_id").eq("broadcaster_id", broadcaster_id.toString());

  // check if the song is already in the queue
  if (queue && queue.length > 0) {
    const song_in_queue = queue.find((song) => song.song_id === song_data.id);

    if (song_in_queue) {
      throw "Song is already in the queue";
    }

    // check if the queue is full
    if (queue.length >= spotify_settings.global_queue_limit) {
      throw "Queue is full";
    }

    // find all the songs that the chatter has requested
    const songs_requested = queue.filter((song) => song.chatter_id === chatter_id);

    // check if the chatter has requested more than 2 songs
    if (songs_requested.length >= spotify_settings.chatter_queue_limit) {
      throw `You can only request ${spotify_settings.chatter_queue_limit} songs at a time`;
    }
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
    throw "Failed to add song to spotify queue";
  }

  // add the song to the queue
  const { data: added_song, error } = await supabase.from("spotify_queue").insert([queue_obj]);


  if (error) {    
    throw "Failed to add song to database queue";
  }

  return song_data;
}
