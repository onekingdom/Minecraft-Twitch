import { ID, Query } from "node-appwrite";
import { database } from "../lib/appwrite";
import type { ChatMessage, Tokens, channelPointsStorage, trackChannels } from "../types/appwrite";

export class appwrite {
  databaseID: string;
  collectionID: string;

  constructor() {
    this.databaseID = "660fedf911b53888e212";
    this.collectionID = "660fee01e3adfcd98c41";
  }

  async addMessage(message: ChatMessage) {
    await database.createDocument(this.databaseID, this.collectionID, ID.unique(), message);
  }

  // create channel points reward
  async createChannelPointsReward(reward: { rewardID: string; function: string; category: string; channelID: number }) {
    try {
      const res = await database.createDocument("65e363d2265b5ae24298", "65e363dbd731733903bd", ID.unique(), reward);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  //check for channel points reward
  async checkForChannelPointsReward(rewardId: string) {
    const rewards = await database.listDocuments<any>("65e363d2265b5ae24298", "65e363dbd731733903bd", [Query.equal("rewardID", rewardId)]);

    if (rewards.documents.length > 0) {
      return rewards.documents;
    }
    3;

    return false;
  }

  //get all rewards ID based of category
  async getRewardsBasedOfCategory(category: string, channelID: number) {
    const res = await database.listDocuments<channelPointsStorage>("65e363d2265b5ae24298", "65e363dbd731733903bd", [
      Query.equal("category", category),
      Query.equal("channelID", channelID),
      Query.limit(50),
    ]);
    return res.documents;
  }

  //delete reward
  async deleteReward(rewardID: string) {
    const res = await database.deleteDocument("65e363d2265b5ae24298", "65e363dbd731733903bd", rewardID);
    return res;
  }

  // get Tokens
  async getTokens(channelID: number) {
    try {
      const Tokens = await database.listDocuments<Tokens>("65afdd18a67ce0ea7b96", "65afdd31d1222a19ecfc", [
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

  //update tokens
  async updateTokens(channelID: number, tokens: any) {
    const user = await database.listDocuments<Tokens>("65afdd18a67ce0ea7b96", "65afdd31d1222a19ecfc", [
      Query.equal("channelID", channelID),
    ]);

    const $id = user.documents[0].$id;

    try {
      await database.updateDocument("65afdd18a67ce0ea7b96", "65afdd31d1222a19ecfc", $id, {
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
        const res = await database.createDocument<trackChannels>(
          "65afdd18a67ce0ea7b96",
          "65ef32db5e0a80bbeb9b",
          channelID.toString(),
          data
        );
        return res;
      }
    }
  }

  // get track channels
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

export const appwriteAPI = new appwrite();
