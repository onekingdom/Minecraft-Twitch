import { spotifyAPI } from "../classes/spotify";
import { TrackObjectFull } from "../types/spotify-web-api";
import handle_song_request from "./actions/spotify/handle_song_request";
export default async function handle_action(action: string, args: string[], channelID: number, chatter_name: string): Promise<string | undefined> {
  const action_array = action.split(".");

  const catagory = action_array[0];
  const _action = action_array[1];

  console.log(catagory, _action);

  switch (catagory) {
    case "spotify":
      switch (_action) {
        case "song_request":
          const res = await handle_song_request(action, args, channelID, chatter_name);
          return res;

          break;

          break;
        default:
          break;
      }

      return;
  }
}
