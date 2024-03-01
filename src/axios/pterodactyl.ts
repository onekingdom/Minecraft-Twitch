import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";

const pterodactylAPI = axios.create({
  baseURL: "https://panel.amrio.nl/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer ptlc_SLpPoygvtUV1rSKMGEAZHYjtp5YLD1Qm8n1ga4zi5RQ",
  },
});

pterodactylAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  //handle response error
  async function (error) {
    //originalRequest
    const originalRequest = error.config;

    console.log(error.response.data);
  }
);

export { pterodactylAPI };