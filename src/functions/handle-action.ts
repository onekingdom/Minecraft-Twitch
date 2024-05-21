import { spotifyAPI } from "@/classes/spotify";
import handle_banned_chatter_add from "./actions/spotify/handle_banned_chatter_add";
import handle_banned_chatter_remove from "./actions/spotify/handle_banned_chatter_remove";
import handle_banned_song_add from "./actions/spotify/handle_banned_song_add";
import handle_banned_song_remove from "./actions/spotify/handle_banned_song_remove";
import handle_song_request from "./actions/spotify/handle_song_request";
import handleSongVariable from "./actions/spotify/handle_song_variable";
import checkvariable from "./check-variable";
import { database_integrations } from "@/classes/database-integrations";

interface chat_object {
  action: string;
  args?: string[];
  broadcaster_id: number;
  broadcaster_name: string;
  user_id: string;
  chatter_id: string;
  chatter_name: string;
  return_message?: string;
}
export default async function handle_action({
  action,
  args,
  broadcaster_id,
  broadcaster_name,
  user_id,
  chatter_id,
  chatter_name,
  return_message,
}: chat_object): Promise<string | undefined> {
  const action_array = action.split(".");

  const catagory = action_array[0];
  const _action = action_array[1];

  

  switch (catagory) {
    case "spotify":
      // check for spotify integration
      const spotify_integration = await database_integrations.get_user_interactions(broadcaster_id);

      

      if (!spotify_integration || !spotify_integration.spotify) {
        console.log("No spotify integration");
        return "You need to connect your spotify account to use this feature";
      }


      switch (_action) {
        case "song_request":
          if(!args) return "no user input provided";
        
        let song;


          try {
            song = await handle_song_request({
              args,
              broadcaster_id: broadcaster_id,
              broadcaster_name: broadcaster_name,
              chatter_id: chatter_id.toString(),
              chatter_name: chatter_name,
            });
          } catch (error: any) {
            console.log(error);
            return error;
          }

          if(!return_message) return 

          const varableCheck = checkvariable(return_message);

          const newArray = await Promise.all(
            varableCheck.map(async (variableObject) => {
              if (variableObject.variable) {
                const variable = handleSongVariable(song, variableObject.word);

                return variable;
              }

              return variableObject.word;
            })
          );

          return newArray.join(" ");

        case "add_banned_song":
          if(!args) return "no user input provided";
          try {
            let banned = await handle_banned_song_add({
              broadcaster_id: broadcaster_id,
              broadcaster_name: broadcaster_name,
              chatter_id: chatter_id,
              chatter_name: chatter_name,
              song: args.join(" "),
            });
            return banned;
          } catch (error: any) {
            return error;
          }

        case "remove_banned_song":
          if(!args) return "no user input provided";
          try {
            let remove_ban = await handle_banned_song_remove({
              broadcaster_id: broadcaster_id,
              song: args.join(" "),
              broadcaster_name: broadcaster_name,
              chatter_id: chatter_id,
              chatter_name: chatter_name,
            });
            return remove_ban;
          } catch (error: any) {
            return error;
          }

        case "add_banned_chatter":
          if(!args) return "no user input provided";
          try {
            let banned = await handle_banned_chatter_add({
              args,
              broadcaster_id: broadcaster_id,
              broadcaster_name: broadcaster_name,
              chatter_id: chatter_id,
              chatter_name: chatter_name,
            });
            return banned;
          } catch (error: any) {
            console.log(error);
            return error;
          }

        case "remove_banned_chatter":
          if(!args) return "no user input provided";
          try {
            let banned = await handle_banned_chatter_remove({
              args,
              broadcaster_id: broadcaster_id,
              broadcaster_name: broadcaster_name,
              chatter_id: chatter_id,
              chatter_name: chatter_name,
            });
            return banned;
          } catch (error: any) {
            console.log(error);
            return error;
          }
        case "skip":
          try {
            await spotifyAPI.skip_song(broadcaster_id);
            return "Song skipped";
          } catch (error: any) {
            console.log(error);
            return `Failed to skip song`;
          }

        default:
          break;
      }

      return;
  }
}
