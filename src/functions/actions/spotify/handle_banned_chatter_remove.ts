import { spotifyDB } from "@/classes/database-spotify";
import { TwitchSearch } from "@/classes/twitch-search";

interface chat_object {
  args: string[];
  broadcaster_id: number;
  broadcaster_name: string;
  chatter_id: string;
  chatter_name: string;
}
export default async function handle_banned_chatter_remove({
  args,
  broadcaster_id,
  broadcaster_name,
  chatter_id,
  chatter_name,
}: chat_object): Promise<string> {
  if (!args[0]) {
    throw "Please provide a chatter to unban.";
  }

  let search_qurey = args[0].trim();

  if (search_qurey.startsWith("@")) {
    search_qurey = search_qurey.slice(1);
  }

  let banned_chatter = await TwitchSearch.getUser({
    login: search_qurey,
  }).then((data) => data[0]);

  if (!banned_chatter) {
    throw "I couldn't find that chatter on Twitch.";
  }

  // check if the chatter is already banned
  const check_banned = await spotifyDB.check_chatter_banned(broadcaster_id.toString(), banned_chatter.id);

  if (!check_banned) {
    throw `${banned_chatter.display_name} is not banned from requesting songs.`;
  }

  await spotifyDB.remove_banned_chatter({
    broadcaster_id: broadcaster_id.toString(),
    chatter_id: banned_chatter.id,
  });

  return `${banned_chatter.display_name} has been unbanned from requesting songs.`;
}
