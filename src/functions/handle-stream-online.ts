import { supabase } from "@/lib/supabase";
import { startCheckingCurrentSong } from "./actions/spotify/handle_song_request_queue";
import { database_integrations } from "@/classes/database-integrations";

export default async function handle_stream_online(stream: any) {
  console.log(`Stream is online! ${stream.broadcaster_user_name} is now live!`);

  // set the stream to live in the database
  await database_integrations.update_twitch_integration(stream.broadcaster_user_id, {
    is_live: true,
  });

  // get the integrations for the user
  const integrations = await database_integrations.get_user_interactions(stream.broadcaster_user_id);

  // check if the user has spotify integration
  if (integrations && integrations.spotify) {
    // start checking the current song
    startCheckingCurrentSong(+stream.broadcaster_user_id);
  }
}
