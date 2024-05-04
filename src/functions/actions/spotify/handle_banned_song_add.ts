import { spotifyDB } from "@/classes/database-spotify";
import get_song_id from "./get_song_id";
import { spotifyAPI } from "@/classes/spotify";

interface BannedSong {
  song: string;
  broadcaster_id: number;
  broadcaster_name: string;
  chatter_id: string;
  chatter_name: string;
}

export default async function handle_banned_song_add({broadcaster_id, broadcaster_name, chatter_id, chatter_name, song}: BannedSong) {
  // check if song is a spotify uri
  const id = get_song_id(song);

  if (!id) {
    throw "Please provide a valid spotify URL or URI for better accuracy";
  }

  // check if the song is already banned
  const is_banned = await spotifyDB.check_song_banned(broadcaster_id.toString(), id);

  if (is_banned) {
    throw `The song ${is_banned.song_name} is already banned`;
  }

  const song_data = await spotifyAPI.get_song_data(id, broadcaster_id);

  if (!song_data) {
    throw "Song not found";
  }

  // get the spotify settings
  const spotify_settings = await spotifyDB.get_spotify_settings(broadcaster_id.toString());

  // add the song to the banned list
  await spotifyDB.add_banned_song({
    broadcaster_id: broadcaster_id,
    song_id: id,
    song_name: song_data?.name,
    artists: song_data?.artists.map((artist) => artist.name).join(", "),
    broadcaster_name: broadcaster_name,
    settings_id: spotify_settings.id,
    user_id: spotify_settings.user_id,
  });

  return `The song ${song_data.name} has been banned from being requested`;
}
