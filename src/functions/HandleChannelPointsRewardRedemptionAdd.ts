import { minecraftAPI } from "../classes/Minecraft";
import { ChannelPointsDatabase } from "../classes/database-channelpoints";
import twitchAPI from "../classes/twitch";
import { twitchChat } from "../classes/twitch-chat";
import { ChannelPointsCustomRewardRedemptionAddEvent } from "../types/eventsub";

export async function HandleChannelPointsRewardRedemptionAdd(event: ChannelPointsCustomRewardRedemptionAddEvent) {
  console.log(`[${event.broadcaster_user_name}] ${event.user_name} redeemed ${event.reward.id} for ${event.reward.cost} points`);

  // check DB
  const DBResponse = await ChannelPointsDatabase.checkForChannelPointsReward(event.reward.id);

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
        const res = await minecraftAPI.randomMob(player?.UUID as string);

        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${res.amount} ${res.mob}!`,
        });

        break
      case "minecraft:spawn_dolphin":
        const dolphin = await minecraftAPI.spawnMob("dolphin", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${dolphin.amount} dolphins!`,
        });
        break;
      case "minecraft:spawn_cow":
        const cow = await minecraftAPI.spawnMob("cow", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${cow.amount} cows!`,
        });
        break;
      case "minecraft:spawn_bee":
        const bee = await minecraftAPI.spawnMob("bee", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${bee.amount} bees!`,
        });
        break;
      case "minecraft:spawn_chicken":
        const chicken = await minecraftAPI.spawnMob("chicken", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${chicken.amount} chickens!`,
        });
        break;
      case "minecraft:spawn_zombie":
        const zombie = await minecraftAPI.spawnMob("zombie", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${zombie.amount} zombies!`,
        });
        break;
      case "minecraft:spawn_skeleton":
        const skeleton = await minecraftAPI.spawnMob("skeleton", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${skeleton.amount} skeletons!`,
        });
        break;
      case "minecraft:spawn_creeper":
        const creeper = await minecraftAPI.spawnMob("creeper", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${creeper.amount} creepers!`,
        });
        break;
      case "minecraft:spawn_vindicator":
        const vindicator = await minecraftAPI.spawnMob("vindicator", random, player?.UUID as string);
        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `@${event.user_name} spawned ${vindicator.amount} vindicators!`,
        });
        break;
      case "jumpscare_crazy":
       const jumpscare_crazy = await minecraftAPI.jumpscare_crazy_guy();
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
        const random_book = await minecraftAPI.fiftyFifty(player?.username as string, event.user_name);

        if(random_book.good) {
          await twitchChat.sendMessage({
            broadcaster_id: event.broadcaster_user_id,
            message: `@${event.user_name} gifted a book with ${random_book.message}!`,
          });
          return
        }

        await twitchChat.sendMessage({
          broadcaster_id: event.broadcaster_user_id,
          message: `Ja hallo, waarom gun je ons geen boekie ${event.user_name}`,
        });

        break;
      default:
        // Handle default case
        break;
    }
  }
}
