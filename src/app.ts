import { EventsubAPI } from "./classes/twitch-eventsub";
import { database } from "./lib/appwrite";

// async function Main(channelID: string) {
//   const res = await EventsubAPI.createEventSubSubscription({
//     type: "channel.channel_points_custom_reward_redemption.add",
//     version: "1",
//     condition: {
//       broadcaster_user_id: channelID.toString(),
//       user_id: channelID.toString(),
//     },
//     transport: {
//       method: "conduit",
//       conduit_id: "6086cbaa-0bc0-4564-8d01-6bb898269e2c",
//     },
//   });




// }


async function test(){
  const res = await database.listDocuments("65afdd18a67ce0ea7b96", "66119dc7682517d5dd59")
  console.log(res)
}

test()

// Main("122604941")