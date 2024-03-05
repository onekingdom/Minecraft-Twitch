import axios from "axios";
import "./eventsub/index";
import dotenv from "dotenv";
import twitchAPI from "./classes/twitch";
import { ChannelPointsAPI } from "./classes/twitch";
// import { channel } from "diagnostics_channel";
import { CustomRewardRequest } from "./types/twitchAPI";
import { appwriteAPI } from "./classes/appwrite";
import { TwitchAPI } from "./axios/twitchAPI";
dotenv.config();

async function main() {
  const x = await twitchAPI.subscribeToEvents(458505769, "channel.chat.message");

  console.log(x);
}

// main();

// create custom rewards for minecraft server

const rewards: CustomRewardRequest[] = [
  {
    title: "Spawn A Random Mob",
    cost: 500,
    function: "minecraft:spawn_random",
    prompt: "Spawn a random mob at the player's location",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Spawn Dolphins",
    cost: 300,
    prompt: "Spawn a random amount of dolphins at the player's location",
    function: "minecraft:spawn_dolphin",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Spawn Cows",
    cost: 300,
    prompt: "Spawn a random amount of cows at the player's location",
    function: "minecraft:spawn_cow",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Spawn Bees",
    cost: 300,
    prompt: "Spawn a random amount of bees at the player's location",
    function: "minecraft:spawn_bee",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Spawn Chickens",
    cost: 300,
    prompt: "Spawn a random amount of chickens at the player's location",
    function: "minecraft:spawn_chicken",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Spawn Zombie",
    cost: 1000,
    prompt: "Spawn a zombie at the player's location",
    function: "minecraft:spawn_zombie",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Spawn Skeleton",
    cost: 1000,
    prompt: "Spawn a skeleton at the player's location",
    function: "minecraft:spawn_skeleton",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Spawn Creeper",
    cost: 4000,
    prompt: "Spawn a creeper at the player's location",
    function: "minecraft:spawn_creeper",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Spawn Vindicator",
    cost: 2000,
    prompt: "Spawn a vindicator at the player's location",
    function: "minecraft:spawn_vindicator",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },

  // jump scares
  {
    title: "Crazy Guy Jump Scare",
    function: "jumpscare_crazy",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Don't Turn Around Jump Scare",
    function: "jumpscare_turn",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Burning Skull Jump Scare",
    function: "jumpscare_skull",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Fake Damage Jump Scare",
    function: "jumpscare_damage",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 600,
  },

  {
    title: "Something Inside Jump Scare",
    function: "jumpscare_door",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Spinning Mobs Jump Scare",
    function: "jumpscare_spinningmob",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "Spinning Player Jump Scare",
    function: "jumpscare_spinningplayer",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  // {
  //   title: "Trap Mob Jump Scare",
  //   function: "jumpscare_trapmob",
  //   cost: 200,
  //   is_global_cooldown_enabled: true,
  //   global_cooldown_seconds: 120,
  // },
  // {
  //   title: "Watching Mobs Jump Scare",
  //   function: "jumpscare_watching",
  //   cost: 200,
  //   is_global_cooldown_enabled: true,
  //   global_cooldown_seconds: 120,
  // },
  // {
  //   title: "Weeping Angel Jump Scare",
  //   function: "jumpscare_assassin",
  //   cost: 200,
  //   is_global_cooldown_enabled: true,
  //   global_cooldown_seconds: 120,
  // },
  {
    title: "Welcome Home Jump Scare",
    function: "jumpscare_surprise",
    cost: 200,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  {
    title: "EnderMan Jump Scare",
    function: "jumpscare_ender",
    cost: 2000,
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  // items
  {
    title: "Give A Random Item",
    cost: 500,
    prompt: "Give the players a random item",
    function: "minecraft:random_item",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 600,
  },

  // disasters
  {
    title: "Tornado",
    cost: 1500,
    function: "minecraft:tornado",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Super Nova Level 1",
    cost: 10000,
    function: "minecraft:supernova1",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Super Nova Level 4",
    cost: 20000,
    function: "minecraft:supernova4",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 1800,
  },
  {
    title: "Heavy Wind",
    cost: 500,
    function: "minecraft:wind",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
  // {
  //   title: "Kill A Random Player",
  //   cost: 10000,
  //   function: "minecraft:random_kill",
  //   is_global_cooldown_enabled: true,
  //   global_cooldown_seconds: 600,
  // },

  // random
  {
    title: "50/50 Chance",
    cost: 750,
    function: "minecraft:random_50_50",
    is_global_cooldown_enabled: true,
    global_cooldown_seconds: 900,
  },
];

async function createCustomReward(channelID: number) {
  rewards.forEach(async (reward) => {
    try {
      const res = await ChannelPointsAPI.createCustomReward(channelID, reward);

      if (res) {
        const { id } = res.data[0];

        await appwriteAPI.createChannelPointsReward({
          category: "minecraft",
          function: reward.function,
          rewardID: id,
          channelID: channelID,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}

async function DeleteAllRewards(channelID: number) {
  // twitchAPI.RefreshToken("116728530");


  const documents = await appwriteAPI.getRewardsBasedOfCategory("minecraft", channelID);

  documents.forEach(async (reward) => {
    try {
      const x = await ChannelPointsAPI.DisableReward(reward.rewardID, channelID);
      console.log(x);
    } catch (error) {
      console.log(error);
    }
  });
 
}

// createCustomReward(116728530);

DeleteAllRewards(458505769);
