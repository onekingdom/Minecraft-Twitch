import { minecraftAPI } from "../classes/Minecraft";
import { appwriteAPI } from "../classes/appwrite";
import twitchAPI from "../classes/twitch";
import { ChannelPointsCustomRewardRedemptionAddEvent } from "../types/eventsub";

export async function HandleChannelPointsRewardRedemptionAdd(event: ChannelPointsCustomRewardRedemptionAddEvent) {
  console.log(`[${event.broadcaster_user_name}] ${event.user_name} redeemed ${event.reward.id} for ${event.reward.cost} points`);

  // check DB
  const DBResponse = await appwriteAPI.checkForChannelPointsReward(event.reward.id);

  const minecraftUUID: { username: string; UUID: string; broadcasterID: string }[] = [
    {
      broadcasterID: "116728530",
      username: "Mo_de_olie_sjeik",
      UUID: "b0634646-d441-42ef-87f6-e4e548028293",
    },
    {
      broadcasterID: "122604941",
      username: "Jochemwite",
      UUID: "82e95e4f-1bb4-4d84-93be-c94d73151661",
    },
    {
      broadcasterID: "458505769",
      username: "ron0x",
      UUID: "cb8c98a2-c027-40bb-81ba-6a736b461645",
    },
  ];

  const player = minecraftUUID.find((player) => player.broadcasterID === event.broadcaster_user_id);

  // create random number between 1 and 1000
  const random = Math.floor(Math.random() * 1000) + 1;

  if (DBResponse) {
    switch (DBResponse[0].function as string) {
      case "minecraft:spawn_random":
        await minecraftAPI.randomMob(player?.UUID as string);
        break;
      case "minecraft:spawn_dolphin":
        await minecraftAPI.spawnMob("dolphin", random, player?.UUID as string);
        break;
      case "minecraft:spawn_cow":
        await minecraftAPI.spawnMob("cow", random, player?.UUID as string);
        break;
      case "minecraft:spawn_bee":
        await minecraftAPI.spawnMob("bee", random, player?.UUID as string);
        break;
      case "minecraft:spawn_chicken":
        await minecraftAPI.spawnMob("chicken", random, player?.UUID as string);
        break;
      case "minecraft:spawn_zombie":
        await minecraftAPI.spawnMob("zombie", random, player?.UUID as string);
        break;
      case "minecraft:spawn_skeleton":
        await minecraftAPI.spawnMob("skeleton", random, player?.UUID as string);
        break;
      case "minecraft:spawn_creeper":
        await minecraftAPI.spawnMob("creeper", random, player?.UUID as string);
        break;
      case "minecraft:spawn_vindicator":
        await minecraftAPI.spawnMob("vindicator", random, player?.UUID as string);
        break;
      case "jumpscare_crazy":
        await minecraftAPI.jumpscare_crazy_guy();
        break;
      case "jumpscare_turn":
        await minecraftAPI.jumpscare_dont_turn_around();
        break;
      case "jumpscare_skull":
        await minecraftAPI.jumpscare_burning_skull();
        break;
      case "jumpscare_damage":
        await minecraftAPI.jumpscare_fake_damage();
        break;
      case "jumpscare_fireworks":
        await minecraftAPI.jumpscare_firework();
        break;
      case "jumpscare_door":
        await minecraftAPI.something_inside();
        break;
      case "jumpscare_spinningmob":
        await minecraftAPI.jumpscare_spinning_mobs();
        break;
      case "jumpscare_spinningplayer":
        await minecraftAPI.jumpscare_spinning_player();
        break;
      case "jumpscare_trapmob":
        await minecraftAPI.jumpscare_trap_mob();
        break;
      case "jumpscare_watching":
        await minecraftAPI.jumpscare_watching_mobs();
        break;
      case "jumpscare_assassin":
        await minecraftAPI.jumpscare_weeping_angel();
        break;
      case "jumpscare_surprise":
        await minecraftAPI.jumpscare_welcome_home();
        break;
      case "jumpscare_ender":
        await minecraftAPI.jumpscare_look_at_ender();
        break;
      case "minecraft:random_item":
        await minecraftAPI.randomItem(64, player?.username as string);
        break;
      case "minecraft:tornado":
        await minecraftAPI.torando();
        break;
      case "minecraft:supernova1":
        await minecraftAPI.supernova("1", player?.username as string);
        break;
      case "minecraft:supernova4":
        await minecraftAPI.supernova("4", player?.username as string);
        break;
      case "minecraft:wind":
        await minecraftAPI.wind(player?.username as string);
        break;
      case "minecraft:random_kill":
        await minecraftAPI.killPlayer();
        break;
      case "minecraft:random_50_50":
        await minecraftAPI.fiftyFifty(player?.username as string, event.user_name);
        break;
      default:
        // Handle default case
        break;
    }


  }
}
