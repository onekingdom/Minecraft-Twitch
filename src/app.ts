import EventSubListener from "./eventsub";
import * as Sentry from "@sentry/bun";


async function main() {
  // Sentry.init({
  //   dsn: "https://7182963d80da5d82b483bdf33a293b4a@o4507334924894208.ingest.de.sentry.io/4507334926794832",
  //   // Performance Monitoring
  //   tracesSampleRate: 1.0, // Capture 100% of the transactions
  // });
  EventSubListener("wss://eventsub.wss.twitch.tv/ws")


}



main()