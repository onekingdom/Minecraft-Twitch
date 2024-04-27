import type { Request, Response } from "express";
import type { Models } from "node-appwrite";
import { TwitchUsersDatabase } from "../../classes/database-integrations";
import axios from "axios";
import type { GetEventSubSubscriptionsResponse, getUserResponse } from "../../types/twitchAPI";
import type { TwitchUser } from "../../types/appwrite";
import { CommandDatabase } from "../../classes/database-commands";
import { TwitchAPP } from "../../axios/twitchApp";
import { ActiveEventSubSubscriptions } from "../../lib/constants";
import handleSubscriptions from "../../functions/handle_subscriptions";

export default async function appwriteSessions(req: Request, res: Response) {
  const session: Models.Session = req.body;

  // check if the user is already in the Twutch User database
  try {
    const res = await handleTwitchData(session);
    await handleCommandDatabase(session.providerUid, res, session.userId);
    await handleEventSubEvents(session.providerUid, res);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error handling Twitch data");
  }

  return res.status(200).send("User session created");
}

async function handleTwitchData(session: Models.Session) {
  const user = await TwitchUsersDatabase.getUser(+session.providerUid);

  const twitch_user_data = await axios.get<getUserResponse>("https://api.twitch.tv/helix/users", {
    params: {
      id: session.providerUid,
    },
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${session.providerAccessToken}`,
    },
  });

  if (!twitch_user_data) {
    throw new Error("Error getting user data from Twitch");
  }

  const twitch = twitch_user_data.data.data[0];

  const userObject: TwitchUser = {
    accessToken: session.providerAccessToken,
    refreshToken: session.providerRefreshToken,
    broadcasterType: twitch.broadcaster_type,
    channelID: +session.providerUid,
    email: twitch.email!,
    IRC: true,
    isLive: false,
    offlineImage: twitch.offline_image_url,
    profileImage: twitch.profile_image_url,
    userid: session.userId,
    username: twitch.display_name,
    betaAccess: false,
  };

  if (user) {
    // update the user in the database

    await TwitchUsersDatabase.updateUser(userObject, user.$id);
  } else {
    // create the user in the database

    await TwitchUsersDatabase.createUser(userObject);
  }

  return twitch.display_name;
}

async function handleCommandDatabase(broadcaster_id: string, broadcaster_name: string, user_id: string) {
  const hasCollection = await CommandDatabase.findCollection(+broadcaster_id);

  if (hasCollection) {
    return;
  }

  const res = await CommandDatabase.createCollections(+broadcaster_id, broadcaster_name, user_id);

  return;
}

async function handleEventSubEvents(broadcaster_id: string, broadcaster_name: string) {
  // check if the user has eventsub subscriptions
  const subscriptions = await TwitchAPP.get<GetEventSubSubscriptionsResponse>("/eventsub/subscriptions", {
    params: {
      user_id: broadcaster_id,
    },
  });

  if (!subscriptions) {
    throw new Error("Error getting subscriptions");
  }

  const missing = ActiveEventSubSubscriptions.filter((sub) => !subscriptions.data.data.some((s) => s.type === sub));

  missing.forEach(async (type) => {
    await handleSubscriptions(broadcaster_id, type);
  });

  if(missing.length > 0) {
    console.log(`Subscribed to missing subscriptions for ${broadcaster_id}`);
  }

  if(missing.length === 0) {
    console.log(`No missing subscriptions for ${broadcaster_id}`);
  }
}
