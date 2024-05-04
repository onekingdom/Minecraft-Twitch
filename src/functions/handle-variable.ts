import { spotifyAPI } from "@/classes/spotify";
import twitchAPI from "../classes/twitch";
import { TwitchChannel } from "../classes/twitch-channel";
import { TrackObjectFull } from "@/types/spotify-web-api";
import { supabase } from "@/lib/supabase";
const variableRegex = /\${(.*?)}/g;

interface Props {
  varable: string;
  channel: string;
  channelID: number;
  chatter_name: string;
  chatter_id: string;
}

export async function handleVariable({ channel, channelID, chatter_name, chatter_id, varable }: Props) {
  const intergartion = varable.replace(variableRegex, "$1").split(".");

  let catagory = intergartion[0];
  let _varable = intergartion[1];

  switch (catagory) {
    case "chatter":
      switch (_varable) {
        case "name":
          return chatter_name;
        case "id":
          return chatter_id;
      }

    case "channel":
      switch (_varable) {
        case "name":
          return channel;
        case "id":
          return channelID;
        case "subscribers":
          const subsribers = await TwitchChannel.getSubsribers(channelID.toString());

          return subsribers.total;
      }

    case "spotify":
      const now_playing = await spotifyAPI.get_current_song(channelID);
      const song_data = now_playing?.item as TrackObjectFull;
      const queue = await supabase.from("spotify_queue").select("*").eq("broadcaster_id", channelID);


      

      switch (_varable) {
        case "song":
          return song_data?.name;

        case "artists":
          return song_data?.artists.map((artist) => artist.name).join(", ");

        case "url":
          return song_data?.external_urls.spotify;

        case "queue":
          if(queue.data?.length === 0) {
            return "No songs in the queue";
          }


          return queue.data?.map((song) => `${song.song_name} - ${song.chatter_name}`).join(" | ");
      }

    default:
      return varable;
  }
}
