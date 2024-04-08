import { ChannelPointsDatabase } from "../classes/database-channelpoints";
import { TwitchDatabase } from "../classes/database-twitch";
import { ChannelPointsAPI } from "../classes/twitch-channelpoints";
import { twitchChat } from "../classes/twitch-chat";
import { rewards } from "../lib/conts";
import { ChannelUpdateEvent } from "../types/twitchAPI";

export default async function handleChannelUpdate(event: ChannelUpdateEvent) {
  console.log(`[${event.broadcaster_user_name}] updated their channel`);

  //get the previous channel data
  const previousChannelData = await TwitchDatabase.gettrackChannels(+event.broadcaster_user_id);

  if (previousChannelData) {
    //check if the category has changed
    if (previousChannelData.categoryID !== event.category_id) {
      if (previousChannelData.categoryID.toString() === "27471") {
        //delete all rewards
        await DeleteAllRewards(+event.broadcaster_user_id);
        await twitchChat.sendChatAnnouncement(event.broadcaster_user_id, {
          message: "Minecraft ChannelPoints are now disabled!",
          color: "primary",
        });
      }

      if (event.category_id.toString() === "27471") {
        //create rewards
        await createCustomReward(+event.broadcaster_user_id);
        await twitchChat.sendChatAnnouncement(event.broadcaster_user_id, {
          message: "Minecraft ChannelPoints are now enabled!",
          color: "primary",
        });
      }
    }
  }

  const DBResponse = await TwitchDatabase.UpdatetrackChannels(+event.broadcaster_user_id, {
    categoryID: event.category_id,
    title: event.title,
    channelID: +event.broadcaster_user_id,
    username: event.broadcaster_user_name,
    categoryName: event.category_name,
  } as any);

  if (DBResponse) {
    console.log("Channel updated");
  }
}

async function DeleteAllRewards(channelID: number) {
  // twitchAPI.RefreshToken("116728530");

  const documents = await ChannelPointsDatabase.getRewardsBasedOfCategory("minecraft", channelID);

  if (documents) {
    documents.forEach(async (reward) => {
      try {
        const x = await ChannelPointsAPI.deleteCustomReward(channelID, reward.rewardID);
        await ChannelPointsDatabase.deleteReward(reward.$id);
        console.log(x);
      } catch (error) {
        console.log(error);
      }
    });
  }
}

async function createCustomReward(channelID: number) {
  rewards.forEach(async (reward) => {
    try {
      const res = await ChannelPointsAPI.createCustomReward(channelID, reward);

      if (res) {
        const { id } = res.data[0];

        await ChannelPointsDatabase.createChannelPointsReward({
          category: "minecraft",
          function: reward.function,
          rewardID: id,
          channelID: channelID,
        });
      }
      //create little delay
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.log(error);
    }
  });
}
