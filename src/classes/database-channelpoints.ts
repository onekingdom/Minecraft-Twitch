import { ID, Query } from "node-appwrite";
import { database } from "../lib/appwrite";
import { channelPointsStorage } from "../types/appwrite";

class channelpoints_database {
  databaseID: string;
  collectionID: string;

  constructor() {
    this.databaseID = "65afdd18a67ce0ea7b96";
    this.collectionID = "661276360005c184a7e7";
  }

  // create channel points reward
  async createChannelPointsReward(reward: { rewardID: string; function: string; category: string; channelID: number }) {
    try {
      const res = await database.createDocument(this.databaseID, this.collectionID, ID.unique(), reward);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  // check for channel points reward
  async checkForChannelPointsReward(rewardId: string) {
    const rewards = await database.listDocuments<any>(this.databaseID, this.collectionID, [Query.equal("rewardID", rewardId)]);

    if (rewards.documents.length > 0) {
      return rewards.documents;
    }

    return false;
  }

  //get all rewards ID based of category
  async getRewardsBasedOfCategory(category: string, channelID: number) {
    const res = await database.listDocuments<channelPointsStorage>(this.databaseID, this.collectionID, [
      Query.equal("category", category),
      Query.equal("channelID", channelID),
      Query.limit(50),
    ]);
    return res.documents;
  }

  //delete reward
  async deleteReward(rewardID: string) {
    const res = await database.deleteDocument(this.databaseID, this.collectionID, rewardID);
    return res;
  }
}

const ChannelPointsDatabase = new channelpoints_database();

export { ChannelPointsDatabase };
