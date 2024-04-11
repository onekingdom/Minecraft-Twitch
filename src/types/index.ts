import type { AxiosRequestConfig } from "axios";
declare module "bun" {
  interface Env {
    APPWRITE_ENDPOINT: string;
    APPWRITE_PROJECT_ID: string;
    APPWRITE_API_KEY: string;
    TWITCH_CLIENT_ID: string;
    TWITCH_CLIENT_SECRET: string;
    TWITCH_APP_TOKEN: string;
    TWITCH_BOT_ID: string;
  }
}

declare module "axios" {
  export interface AxiosRequestConfig {
    channelID?: number; // Your custom property
    broadcasterID?: number; // Your custom property
    // Add more custom properties as needed
  }
}
