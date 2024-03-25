import { TwitchAPP } from "../axios/twitchApp";
import { SearchCategoriesResponse } from "../types/twitchAPI";
import { twitch } from "./twitch";

class twitch_search extends twitch {
  constructor() {
    super();
  }

  async searchCategories(query: string, first?: number, after?: string) {
    try {
      const res = await TwitchAPP.get<SearchCategoriesResponse>(`/search/categories`, {
        params: {
          query,
          first,
          after,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}


export const TwitchSearch = new twitch_search();