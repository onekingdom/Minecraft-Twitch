// import "./eventsub/index";
import dotenv from "dotenv";

import { CustomRewardRequest } from "./types/twitchAPI";
import { twitchChat } from "./classes/twitch-chat";
import { EventsubAPI } from "./classes/twitch-eventsub";
import { createWebSocket } from "./eventsub";
import { EventSubNotification, WebSocketMessage } from "./types/eventsub";
import { ChannelChatMessageCondition } from "./types/eventsubSubscribeConditions";
import { HandleEvent } from "./eventsub/handleEvent";
dotenv.config();

async function main() {
  // check if we have a conduit

  let conduct_id: string;

  const checkconduct = await EventsubAPI.getConducts();
  if (checkconduct.data.length === 0) {
    const newConduct = await EventsubAPI.createConduct({ shard_count: 1 });
    conduct_id = newConduct.data[0].id;
  } else {
    conduct_id = checkconduct.data[0].id;
  }

  let socket = createWebSocket(`wss://eventsub.wss.twitch.tv/ws`);

  socket.on("message", (data) => {
    const message = JSON.parse(data.toString());
    handleWebSocketMessage(message, conduct_id);
  });

  const handleWebSocketMessage = async (message: WebSocketMessage, conduct_id: string) => {
    switch (message.metadata.message_type) {
      case "session_welcome":
        // Handle welcome message
        // set type to welcome

        if ("session" in message.payload) {
          //  handle condicts

          const res = await EventsubAPI.updateConduitShards({
            conduit_id: conduct_id,
            shards: [
              {
                id: "0",
                transport: {
                  method: "websocket",
                  session_id: message.payload.session.id,
                },
              },
            ],
          });

          if (res.data[0].status === "enabled") {
            console.log("Conduct is enabled");
          }
        }

        break;
      case "session_keepalive":
        // Handle keepalive message
        break;
      case "notification":
        // Handle notification message
        HandleEvent(message as any);

        break;
      case "session_reconnect":
        // Handle reconnect message
        console.log("Received session reconnect message");

        if ("session" in message.payload) {
          // Reconnect to the WebSocket server
          socket = createWebSocket(message.payload.session.reconnect_url);
        }
        break;
      case "revocation":
        // Handle revocation message
        console.log("Received revocation message");
        break;
      default:
        // Handle other message types or unknown types
        console.log("Received unknown message type");

        console.log(message.metadata.message_type);

        break;
    }
  };
}

main();

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
