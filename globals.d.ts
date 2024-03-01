declare namespace NodeJS {
  export interface ProcessEnv {
    TWITCH_CLIENT_ID: string;
    TWITCH_CLIENT_SECRET: string;
    TWITCH_APP_TOKEN: string;

    // appwrite
    APPWRITE_ENDPOINT: string;
    APPWRITE_PROJECT_ID: string;
    APPWRITE_API_KEY: string;
  }
}
