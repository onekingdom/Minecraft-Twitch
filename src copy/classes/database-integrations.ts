import { Query, ID, Permission, Role } from "node-appwrite";
import { database } from "../lib/appwrite";
import type { TwitchUser, TwitchUserStorage } from "../types/appwrite";

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

  async getUser(channelID: number) {
    try {
      const user = await database.listDocuments<TwitchUserStorage>(this.database_id, this.collection_id, [
        Query.equal("channelID", channelID),
      ]);

      if (user.documents.length > 0) {
        return user.documents[0];
      }
      

      return undefined;
    } catch (error) {
      console.log(error)
      console.log("error getting tokens");
    }
  }

  async createUser(user: TwitchUser) {
    try {
      const res = await database.createDocument<TwitchUserStorage>(this.database_id, this.collection_id, ID.unique(), user, [
        Permission.read(Role.user(user.userid))
      ]);
      return res;
    } catch (error) {
      console.log("error creating user");
    }
  }

  // update user
  async updateUser(user: TwitchUser, document_id: string) {
    try {
      const res = await database.updateDocument<TwitchUserStorage>(this.database_id, this.collection_id, document_id, user, [
        Permission.read(Role.user(user.userid))
      ]);
      return res;
    } catch (error) {
      console.log(error);
      console.log("error updating user");
    }
  }



}


export const TwitchUsersDatabase = new twitch_user_integration();