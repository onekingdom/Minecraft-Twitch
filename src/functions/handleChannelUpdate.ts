import type { ChannelUpdateEvent } from "../types/twitchAPI";

export default async function handleChannelUpdate(event: ChannelUpdateEvent) {
  console.log(`[${event.broadcaster_user_name}] updated their channel`);

  
}



