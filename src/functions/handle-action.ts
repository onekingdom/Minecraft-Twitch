import handle_song_request from "./actions/spotify/handle_song_request";
import handleSongVariable from "./actions/spotify/handle_song_variable";
import checkvariable from "./check-variable";

interface chat_object {
  action: string;
  args: string[];
  broadcaster_id: number;
  chatter_id: string;
  chatter_name: string;
  return_message: string;
}
export default async function handle_action({
  action,
  args,
  broadcaster_id,
  chatter_id,
  chatter_name,
  return_message,
}: chat_object): Promise<string | undefined> {
  const action_array = action.split(".");

  const catagory = action_array[0];
  const _action = action_array[1];

  switch (catagory) {
    case "spotify":
      switch (_action) {
        case "song_request":
          const song = await handle_song_request({
            args,
            broadcaster_id: broadcaster_id,
            broadcaster_name: chatter_name,
            chatter_id: chatter_id.toString(),
            chatter_name: chatter_name,
          });

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

          break;
        default:
          break;
      }

      return;
  }
}
