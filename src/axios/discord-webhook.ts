import axios from "axios";

const DiscordWebhook = axios.create({
  headers: {
    Accept: "application/json",
  },
});


export default DiscordWebhook;