import twitchAPI from "../classes/twitch";
import { TwitchChannel } from "../classes/twitch-channel";

export async function handleVariable(varable: string, channel: string, channelID: number, user: string) {
  const intergartion = varable.split(".");

  switch (intergartion[0]) {
    case "user":
      switch (intergartion[1]) {
        case "name":
          return user;
        case "id":
      }

    case "channel":
      switch (intergartion[1]) {
        case "name":
          return channel;
        case "id":
          return channelID;
        case "subscribers":
          const subsribers = await TwitchChannel.getSubsribers(channelID.toString());

          return subsribers.total;
      }
  }
}
