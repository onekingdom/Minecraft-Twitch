import { ID, Permission, Query, Role } from "node-appwrite";
import { database } from "../lib/appwrite";
import type { Command, CommandStorage } from "../types/database";
import { appwriteAPI } from "./appwrite";
import { supabase } from "../lib/supabase";

class commandDatabase {
  databaseID: string;

  constructor() {
    this.databaseID = "6613a4934f497ba10dcb";
  }

  async addCommand(command: Command) {
    try {
      const res = await database.createDocument<CommandStorage>(this.databaseID, command.channelID.toString(), ID.unique(), command);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async editCommand(command_id: string, message: string, channelID: number) {
    try {
      const res = await database.updateDocument<CommandStorage>(this.databaseID, channelID.toString(), command_id, {
        message,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCommand(commandID: string, channelID: number) {
    try {
      const res = await database.deleteDocument(this.databaseID, channelID.toString(), commandID);
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // find command
  async findCommand(command: string, channelID: number) {
    const { data, error, count } = await supabase.from("commands").select("*").eq("command", command).eq("broadcaster_id", channelID);

    if (error) {
      console.log(error);
      return;
    }

    if (count === 0 || data.length === 0) {
      return;
    }

    return data[0];

    return;
  }

  async createCollections(channelID: number, channelName: string) {
    const user = await appwriteAPI.getTokens(channelID);

    if (!user) return;
    console.log(user);

    // create collection
    const res = await database.createCollection(
      this.databaseID,
      channelID.toString(),
      channelName,
      [Permission.read(Role.user(user.userid)), Permission.write(Role.user(user.userid))],
      true
    );

    if (!res) return;

    // create attributes
    await this.createCommandAttributes(channelID);

    await this.createCommandIndexs(channelID);

    return true;
  }

  private async createCommandAttributes(channelID: number) {
    await database.createStringAttribute(this.databaseID, channelID.toString(), "command", 100, true),
      await database.createStringAttribute(this.databaseID, channelID.toString(), "message", 500, true),
      await database.createIntegerAttribute(this.databaseID, channelID.toString(), "cooldown", false, 5),
      await database.createBooleanAttribute(this.databaseID, channelID.toString(), "enabled", false, true),
      await database.createIntegerAttribute(this.databaseID, channelID.toString(), "channelID", true),
      await database.createEnumAttribute(
        this.databaseID,
        channelID.toString(),
        "userlevel",
        ["everyone", "follower", "vip", "subscriber", "moderator", "editor", "super_moderator", "broadcaster"],
        false,
        "everyone"
      ),
      await database.createStringAttribute(this.databaseID, channelID.toString(), "action", 500, false),
      await database.createStringAttribute(this.databaseID, channelID.toString(), "description", 10000, false),
      await database.createStringAttribute(this.databaseID, channelID.toString(), "created_by", 25, true);
  }

  private async createCommandIndexs(channelID: number) {
    await database.createIndex(
      this.databaseID,
      channelID.toString(),
      "search",
      "key",
      ["command", "message", "cooldown", "enabled"],
      ["asc", "asc", "asc", "asc"]
    );

    await database.createIndex(this.databaseID, channelID.toString(), "unique", "unique", ["command"], ["asc"]);
  }
}

export const CommandDatabase = new commandDatabase();
