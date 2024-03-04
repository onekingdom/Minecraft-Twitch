import { Client, Databases } from "node-appwrite";
import dotenv from "dotenv";
dotenv.config();

const client = new Client();

client.setEndpoint(process.env.APPWRITE_ENDPOINT!).setProject(process.env.APPWRITE_PROJECT_ID!).setKey(process.env.APPWRITE_API_KEY!);

const database = new Databases(client);

export { client, database };

const OneKingdomAPI = new Client();

OneKingdomAPI.setEndpoint(process.env.APPWRITE_ENDPOINT!).setProject(process.env.ONEKINGDOM_PROJECT_ID!).setKey(process.env.ONEKINGDOM_API_KEY!);

export const OneKingdomDatabase = new Databases(OneKingdomAPI);
