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

export default async function handle_banned_song_remove({broadcaster_id, broadcaster_name, chatter_id, chatter_name, song}: BannedSong) {
  // check if song is a spotify uri
  const id = get_song_id(song);

  if (!id) {
    throw "Please provide a valid spotify URL or URI for better accuracy";
  }

  // check if the song is banned
  const is_banned = await spotifyDB.check_song_banned(broadcaster_id.toString(), id);

  const song_data = await spotifyAPI.get_song_data(id, broadcaster_id);

  if (!song_data) {
    throw "Song not found";
  }

  if (!is_banned) {
    throw `The song ${song_data.name} is not banned`;
  }

  // remove the song from the banned list
  await spotifyDB.remove_banned_song({
    broadcaster_id: broadcaster_id.toString(),
    song_id: id,
  });

  return `The song ${song_data.name} has been removed from the banned list`;
}