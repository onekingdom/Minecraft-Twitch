import axios from "axios";

// TODO add the app Token to the database

const TwitchAPP = axios.create({
  baseURL: "https://api.twitch.tv/helix",
  headers: {
    Accept: "application/json",
    "Client-ID": process.env.TWITCH_CLIENT_ID!,
    Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
  },
});

//twitch request interceptor
TwitchAPP.interceptors.request.use(
  (request) => {
    return request;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

//twitch response interceptor
TwitchAPP.interceptors.response.use(
  (response) => {
    return response;
  },
  //handle response error
  async function (error) {
    // TODO handle 401 error

    return Promise.reject(error);
  }
);

export { TwitchAPP };
