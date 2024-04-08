import { TwitchChannel } from "../classes/twitch-channel";
import { TwitchModeration } from "../classes/twitch-moderation";
import { UserLevel } from "../types/database";

export default async function checkCommandPermission({
  broadcaster_id,
  userlevel,
  chatter_id,
}: {
  broadcaster_id: number;
  userlevel: UserLevel;
  chatter_id: number;
}): Promise<boolean> {
  if (broadcaster_id === chatter_id) return true;

  switch (userlevel) {
    case UserLevel.everyone:
      return true;
    case UserLevel.follower:
      const follower = await TwitchChannel.getFollowers(broadcaster_id.toString(), chatter_id.toString());

      if (follower.data.length > 0) {
        return true;
      }

      return false;

    case UserLevel.vip:
      const vip = await TwitchChannel.getVip(broadcaster_id.toString(), chatter_id.toString());

      if (vip.data.length > 0) {
        return true;
      }
      return false;
    case UserLevel.subscriber:
      return false;
    case UserLevel.moderator:
      const moderator = await TwitchModeration.getModerators(broadcaster_id.toString(), [chatter_id.toString()]);

      if (moderator.data.length > 0) {
        return true;
      }

      return false;
    case UserLevel.supermoderator:
      return false;
    case UserLevel.broadcaster:
      return false;
  }
}
