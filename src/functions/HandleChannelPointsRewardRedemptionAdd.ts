import { minecraftAPI } from "../classes/Minecraft";
import { appwriteAPI } from "../classes/appwrite";
import { ChannelPointsCustomRewardRedemptionAddEvent } from "../types/eventsub";

export async function HandleChannelPointsRewardRedemptionAdd(event: ChannelPointsCustomRewardRedemptionAddEvent) {

  console.log(`[${event.broadcaster_user_name}] ${event.user_name} redeemed ${event.reward.id} for ${event.reward.cost} points`);


  // check DB 
  const DBResponse = await appwriteAPI.checkForChannelPointsReward(event.reward.id);

  console.log(DBResponse);


  if(DBResponse) {
    switch(DBResponse[0].function as any) {
      case "minecraft.spawnmob":
        minecraftAPI.randomMob();
        break;


    }
  }
  







}