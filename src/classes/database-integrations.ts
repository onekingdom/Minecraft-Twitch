import { Query } from "node-appwrite";
import { database } from "../lib/appwrite";
import { Tokens } from "../types/appwrite";

class integrations_database {
  protected database_id: string;

  constructor() {
    this.database_id = "65afdd18a67ce0ea7b96";
  }
}

class twitch_user_integration extends integrations_database {
  private collection_id: string;
  constructor() {
    super();
    this.collection_id = "65afdd31d1222a19ecfc";
  }

  async getTokens(channelID: number) {
    try {
      const Tokens = await database.listDocuments<Tokens>(this.database_id, this.collection_id, [
        Query.equal("channelID", channelID),
      ]);

      if (Tokens.documents.length > 0) {
        return Tokens.documents[0];
      }

      return undefined;
    } catch (error) {
      console.log("error getting tokens");
      console.log(error);
    }
  }
}


export const TwitchUsersDatabase = new twitch_user_integration();