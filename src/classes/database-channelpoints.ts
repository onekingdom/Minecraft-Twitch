import { supabase } from "@/lib/supabase";

class channelpointsDatabase {
  // check if the reward ID is in the channelpoint database
  async checkRewardID(rewardID: string, broadcaster_id: string) {
    const { data, error, count } = await supabase
      .from("twitch_channelpoints")
      .select("*")
      .eq("channelpoint_id", rewardID)
      .eq("broadcaster_id", broadcaster_id)
      .single();

    if (error) {
      // console.log(error);
      return;
    }

    if (count === 0 || data.length === 0) {
      return;
    }

    return data;
  }
}

export const channelpointsDB = new channelpointsDatabase();