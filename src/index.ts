import axios from "axios";
// import "./eventsub/index"
import dotenv from "dotenv";
import twitchAPI from "./classes/twitch";
import { ChannelPointsAPI } from "./classes/twitch";
import { channel } from "diagnostics_channel";
dotenv.config();

async function main() {
  const x = await ChannelPointsAPI.getCustomRewards(122604941);

  

  
}

main();
