import { TwitchAPP } from "../axios/twitchApp";
import { SearchCategoriesResponse, getUserResponse } from "../types/twitchAPI";
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

  // get a user by their login name
  async getUser({ id, login }: { id?: string; login?: string }) {
    if (!id && !login) throw new Error("You must provide either an id or a login name");

    try {
      const res = await TwitchAPP.get<getUserResponse>(`/users`, {
        params: {
          id,
          login,
        },
      });
      return res.data.data
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const TwitchSearch = new twitch_search();
