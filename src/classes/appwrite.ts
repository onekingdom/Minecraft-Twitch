import { ID, Query } from "node-appwrite";
import { OneKingdomDatabase, database } from "../lib/appwrite";
import { ChatMessage, Tokens, channelPointsStorage } from "../types/appwrite";

class appwrite {
  databaseID: string;
  collectionID: string;

  constructor() {
    this.databaseID = "65e1fd541cfb5f12b0e1";
    this.collectionID = "65e1fdcf49c656cf833b";
  }

  async addMessage(message: ChatMessage) {
    await database.createDocument(this.databaseID, this.collectionID, ID.unique(), message);
  }

  // create channel points reward
  async createChannelPointsReward(reward: { rewardID: string; function: string; category: string, channelID: number}) {
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

  // get Tokens
  async getTokens(channelID: number) {
    try {
      const Tokens = await OneKingdomDatabase.listDocuments<Tokens>("65afdd18a67ce0ea7b96", "65afdd31d1222a19ecfc", [
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
    console.log(tokens);

    const user = await OneKingdomDatabase.listDocuments<Tokens>("65afdd18a67ce0ea7b96", "65afdd31d1222a19ecfc", [
      Query.equal("channelID", channelID),
    ]);

    const $id = user.documents[0].$id;

    try {
      await OneKingdomDatabase.updateDocument("65afdd18a67ce0ea7b96", "65afdd31d1222a19ecfc", $id, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } catch (error) {
      console.log(error);
      console.log("error updating tokens");
    }
  }
}

export const appwriteAPI = new appwrite();
