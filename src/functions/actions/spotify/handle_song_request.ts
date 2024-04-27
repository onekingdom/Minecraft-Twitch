import { spotifyAPI } from "../../../classes/spotify";
import { TrackObjectFull } from "../../../types/spotify-web-api";

export default async function (action: string, args: string[], channelID: number, chatter_name: string): Promise<string | undefined> {
  const searchQuery = args.join(" ");
  let song_data: TrackObjectFull;

  // check if the serach query is a URL
  if (searchQuery.includes("https://open.spotify.com/")) {
    const url = new URL(searchQuery);
    const pathParts = url.pathname.split("/");

    if (pathParts.length !== 3 || pathParts[0] !== "") {
      return "Invalid Spotify URL";
    }

    const uri = `spotify:track:${pathParts[2]}`;

    const added = await spotifyAPI.add_song_to_queue(uri, channelID);

    if (!added) {
      return "Failed to add song to queue";
    }

    const song_data_res = await spotifyAPI.get_song_data(pathParts[2], channelID);

    if (!song_data_res) {
      return "Failed to get song data but the song was added to queue";
    }

    song_data = song_data_res;
  }

  // check if the search query is a spotify uri
  else if (searchQuery.includes("spotify:track:")) {
    const uri = searchQuery;
    const id = searchQuery.split(":")[2];

    const added = await spotifyAPI.add_song_to_queue(uri, channelID);

    if (!added) {
      return "Failed to add song to queue";
    }

    if (!added) {
      return "Failed to add song to queue";
    }

    const song_data_res = await spotifyAPI.get_song_data(id, channelID);

    if (!song_data_res) {
      return "Failed to get song data but the song was added to queue";
    }

    song_data = song_data_res;
  }
  // search spotify for the song
  else {
    const searchResult = await spotifyAPI.search_spotify(searchQuery, channelID);

    if (!searchResult || !searchResult.tracks) {
      return "No song found";
    }

    song_data = searchResult.tracks.items[0];

    const added = await spotifyAPI.add_song_to_queue(song_data.uri, channelID);

    if (!added) {
      return "Failed to add song to queue";
    }
  }

  const { name: song, artists } = song_data;

  return `Song request for ${song} by ${artists.map((artist) => artist.name).join(", ")}`;

  return;
}
