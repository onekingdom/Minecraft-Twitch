import { StreamOfflineEvent } from "../../src copy/types/eventsub";
import { stopCheckingCurrentSong } from "./actions/spotify/handle_song_request_queue";

export default function handle_stream_offline(stream: StreamOfflineEvent): void {
  console.log(`Stream is offline ${stream.broadcaster_user_name} `);

  stopCheckingCurrentSong(+stream.broadcaster_user_id);
}
