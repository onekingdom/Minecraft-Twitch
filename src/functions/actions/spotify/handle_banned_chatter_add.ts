import { spotifyDB } from "@/classes/database-spotify";
import { TwitchModeration } from "@/classes/twitch-moderation";
import { TwitchSearch } from "@/classes/twitch-search";
interface chat_object {
  args: string[];
  broadcaster_id: number;
  broadcaster_name: string;
  chatter_id: string;
  chatter_name: string;
}

export default async function handle_banned_chatter_add({
  args,
  broadcaster_id,
  broadcaster_name,
  chatter_id,
  chatter_name,
}: chat_object): Promise<string> {
  // check if the chatter is already banned
  const is_banned = await spotifyDB.check_chatter_banned(chatter_id, broadcaster_id.toString());

  if (is_banned) {
    throw `@${chatter_name} is already banned from requesting songs.`;
  }

  // check if the chatter is a mod or broadcaster
  // const is_modarator = await TwitchModeration.getModerators(broadcaster_id.toString(), [chatter_id]);

  // console.log(is_modarator);

  let search_qurey = args[0].trim();

  if (!search_qurey) {
    throw "Please provide a chatter to ban.";
  }

  if (search_qurey.length > 26) {
    throw "That chatter name is too long.";
  }

  if (search_qurey.startsWith("@")) {
    search_qurey = search_qurey.slice(1);
  }

  let banned_chatter = await TwitchSearch.getUser({
    login: search_qurey,
  }).then((data) => data[0]);

  if (!banned_chatter) {
    throw "I couldn't find that chatter.";
  }

  
// check if the chatter is already banned
  const check_banned = await spotifyDB.check_chatter_banned(broadcaster_id.toString(), banned_chatter.id);

  if (check_banned) {
    throw `${banned_chatter.display_name} is already banned from requesting songs.`;
  }


  // get the spotify settings
  const spotify_settings = await spotifyDB.get_spotify_settings(broadcaster_id.toString());

  if(!spotify_settings) {
    throw "Spotify settings not found.";
  }




  // add the chatter to the banned list
  await spotifyDB.add_banned_chatter({
    broadcaster_id: broadcaster_id,
    chatter_id: banned_chatter.id,
    chatter_name: banned_chatter.login,
    broadcaster_name: broadcaster_name,
    created_at: new Date(),
    moderator_id: chatter_id,
    moderator_name: chatter_name,
    settings_id: spotify_settings.id,
    user_id: spotify_settings.user_id,
  });

  return `chatter ${banned_chatter.display_name} has been banned from requesting songs.`;
}
