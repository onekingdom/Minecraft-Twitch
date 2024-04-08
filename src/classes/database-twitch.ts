import { Query } from "node-appwrite";
import { database } from "../lib/appwrite";
import { Tokens, trackChannels } from "../types/appwrite";

class twitch_database {
  databaseID: string;
  collectionID: string;

  constructor() {
    this.databaseID = "65afdd18a67ce0ea7b96";
    this.collectionID = "Users";
  }

  async getTokens(channelID: number) {
    try {
      const Tokens = await database.listDocuments<Tokens>(this.databaseID, this.collectionID, [Query.equal("channelID", +channelID)]);

      if (Tokens.documents.length > 0) {
        return Tokens.documents[0];
      }

      return undefined;
    } catch (error) {
      console.log("error getting tokens");
      console.log(error);
    }
  }

  //update tokens
  async updateTokens(channelID: number, tokens: any) {
    const user = await database.listDocuments<Tokens>(this.databaseID, this.collectionID, [Query.equal("channelID", channelID)]);

    const $id = user.documents[0].$id;

    try {
      await database.updateDocument(this.databaseID, this.collectionID, $id, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } catch (error) {
      console.log(error);
      console.log("error updating tokens");
    }
  }

  //async track channels
  async UpdatetrackChannels(channelID: number, data: trackChannels) {
    try {
      const res = await database.updateDocument<trackChannels>("65afdd18a67ce0ea7b96", "65ef32db5e0a80bbeb9b", channelID.toString(), data);
      return res;
    } catch (error: any) {
      if (error.code === 404 && error.type === "document_not_found") {
        console.log("Document not found creating new one");
        const res = await database.createDocument<trackChannels>("65afdd18a67ce0ea7b96", "65ef32db5e0a80bbeb9b", channelID.toString(), data);
        return res;
      }
    }
  }

  async gettrackChannels(channelID: number) {
    try {
      const res = await database.getDocument<trackChannels>("65afdd18a67ce0ea7b96", "65ef32db5e0a80bbeb9b", channelID.toString());
      return res;
    } catch (error: any) {
      if (error.code === 404 && error.type === "document_not_found") {
        return undefined;
      }
    }
  }
}

const TwitchDatabase = new twitch_database();

export { TwitchDatabase };
