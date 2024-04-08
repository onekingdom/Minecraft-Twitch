import { ID, Query } from "node-appwrite";
import { database } from "../lib/appwrite";
import { Command, CommandStorage } from "../types/database";

class commandDatabase  {
  databaseID: string;
  collectionID: string;

  constructor() {
    this.databaseID = "65afdd18a67ce0ea7b96";
    this.collectionID = "661272a0002b71377a7a";
  }

  async addCommand(command: Command) {
    try {
      const res = await database.createDocument<CommandStorage>(this.databaseID, this.collectionID, ID.unique(), command);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  // find command
  async findCommand(command: string, channelID: number) {
    const res = await database.listDocuments<CommandStorage>(this.databaseID, this.collectionID, [
      Query.equal("command", command),
      Query.equal("channelID", channelID),
    ]);
    if (res.documents.length > 0) {
      return res.documents[0];
    }
    return;
  }
}

export const CommandDatabase = new commandDatabase();
