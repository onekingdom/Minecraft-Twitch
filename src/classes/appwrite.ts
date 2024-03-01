import { ID } from "node-appwrite";
import { database } from "../lib/appwrite";
import { ChatMessage } from "../types/appwrite";

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



}


export const appwriteAPI = new appwrite();